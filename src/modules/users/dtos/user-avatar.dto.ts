export class UserAvatarDto {
  id: number;
  base64Image: string;

  constructor(userId: number, base64: string) {
    this.id = userId;
    this.base64Image = base64;
  }
}
