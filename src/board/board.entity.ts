import { User } from 'src/users/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity()
export class Board {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  backgroundImageUrl: string;

  @ManyToOne(() => User, user => user.boards, { nullable: false })
  @JoinColumn({ name: 'ownerId', referencedColumnName: 'id' })
  owner: User;

  @ManyToMany(() => User, user => user.boards)
  @JoinTable()
  users: User[];
}
