import { User } from 'src/users/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
