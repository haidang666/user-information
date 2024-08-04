import { UserType } from 'src/core/user/enum/user-type.enum';
import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity({
  name: 'users',
})
@Index(['externalId', 'type'])
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'external_id',
    default: null,
  })
  externalId: number;

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.INTERNAL,
  })
  type: UserType;

  @Column({
    name: 'last_name',
    nullable: false,
  })
  lastName: string;

  @Column({
    name: 'first_name',
    nullable: false,
  })
  firstName: string;

  @Column({
    nullable: false,
  })
  email: string;

  @Column({
    default: null,
  })
  avatar: string;

  @Column({
    default: null,
  })
  avatarPath: string;
}
