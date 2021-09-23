import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  email: string;
  @Column()
  password: string;

  @AfterInsert()
  logInsert() {}

  @AfterUpdate()
  logUpdate() {}

  @AfterRemove()
  logRemove() {}
}
