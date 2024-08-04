export class ReqResUserDto {
  externalId: number;
  lastName: string;
  firstName: string;
  email: string;
  avatar: string;

  constructor(props: any) {
    this.externalId = props.id;
    this.lastName = props.last_name;
    this.firstName = props.first_name;
    this.email = props.email;
    this.avatar = props.avatar;
  }
}
