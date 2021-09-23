import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { stringify } from 'querystring';
import { UserService } from './user.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}
  async signup(email: string, password: string) {
    // see if the email is used
    const users = await this.userService.find(email);
    if (users.length) {
      throw new BadRequestException('email in use');
    }

    // hash the user password
    // generate a salt
    const salt = randomBytes(8).toString('hex');

    // hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // join the hash and the salt together
    const result = salt + '.' + hash.toString('hex');

    // create a new user and save it

    const user = this.userService.create(email, result);
    // return the user
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.userService.find(email);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('bad password');
    }
    return user;
  }
}
