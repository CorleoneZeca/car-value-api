import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import exp from 'constants';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UserService } from './user.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UserService>;

  beforeEach(async () => {
    const users: User[] = [];
    fakeUserService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email == email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create a instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and password', async () => {
    const user = await service.signup('baba@babe.com', 'fgts');
    expect(user.password).not.toEqual('fgts');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    await service.signup('assa@hjk.com', 'jkhk');
    await expect(service.signup('assa@hjk.com', 'jkhk')).rejects.toThrowError(
      BadRequestException,
    );
  });

  it('throws if signin is called with an unused email', async () => {
    await expect(service.signin('assa@hjk.com', 'jkhk')).rejects.toThrowError(
      NotFoundException,
    );
  });

  it('throws if an invalid password is provided', async () => {
    await service.signup('assa@hjk.com', 'jkhk');
    await expect(service.signin('assa@hjk.com', '8')).rejects.toThrowError(
      BadRequestException,
    );
  });

  it('returns a user if correct password is provided', async () => {
    await service.signup('jlk@jk.com', 'jkl');

    const user = await service.signin('jlk@jk.com', 'jkl');
    expect(user).toBeDefined();
  });
});
