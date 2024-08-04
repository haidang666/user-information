export class UserDto {
  id: number;
  externalId: number;
  lastName: string;
  firstName: string;
  email: string;
  avatar: string;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
