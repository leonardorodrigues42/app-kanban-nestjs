import { List } from 'src/list/list.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity()
export class Board {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  backgroundImageUrl: string;

  @ManyToOne(() => User, user => user.boards, { nullable: false, eager: true })
  @JoinColumn({ name: 'ownerId', referencedColumnName: 'id' })
  owner: User;

  @ManyToMany(() => User, user => user.boards, { eager: true })
  @JoinTable()
  users: User[];

  @OneToMany(() => List, list => list.board, { eager: true })
  lists: List[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
