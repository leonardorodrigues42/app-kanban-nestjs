import { Exclude } from 'class-transformer';

export class UserEntity {
  id: string;
  name: string;
  email: string;
  @Exclude({
    toPlainOnly: true,
  })
  password: string;
}
