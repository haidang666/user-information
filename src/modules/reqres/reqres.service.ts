import { Injectable, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { ReqResUserDto } from './reqres-user.dto';

@Injectable()
export class ReqResService {
  private readonly baseURL = 'https://reqres.in/api/users';
  constructor() {}

  async getUser(id: number) {
    const config = {
      method: 'get',
      url: `${this.baseURL}/${id}`,
    };

    try {
      const res = await axios(config);
      return new ReqResUserDto(res.data.data);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
