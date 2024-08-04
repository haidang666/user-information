import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserAvatarDto } from './dtos/user-avatar.dto';
import { UserDto } from './dtos/user.dto';
import { BaseMailService } from 'src/shared/services/mail/mail.service';
import { ReqResService } from 'src/modules/reqres/reqres.service';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import { ReqResUserDto } from '../reqres/reqres-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private mailService: BaseMailService,
    private reqResService: ReqResService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const foundUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (foundUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = this.usersRepository.create(createUserDto);
    await this.usersRepository.save(user);
    void this.sendCreatedMail(user);
    return new UserDto(user);
  }

  async getUserFromReqRes(id: number) {
    return this.reqResService.getUser(id);
  }

  async findOne(id: number): Promise<UserEntity> {
    return this.usersRepository.findOne({ where: { externalId: id } });
  }

  private sendCreatedMail(user: UserEntity) {
    this.mailService.deliveryMail({
      to: user.email,
      subject: 'User created',
      text: 'User created',
    });
  }

  async getUserAvatar(id: number) {
    const userAvatarCacheKey = `user-avatar-${id}`;
    const value = await this.cacheManager.get(userAvatarCacheKey);
    if (value) {
      return new UserAvatarDto(id, value as string);
    }

    const dbUser = await this.findOne(id);
    if (dbUser && dbUser.avatarPath) {
      return this.cacheThenReturn(dbUser.avatarPath, userAvatarCacheKey, id);
    }

    const user = await this.reqResService.getUser(id);
    const imagePath = await this.downloadImage(user.avatar);
    await this.saveUserAvatar(user, imagePath);

    return this.cacheThenReturn(imagePath, userAvatarCacheKey, id);
  }

  private async cacheThenReturn(imagePath: string, key: string, id: number) {
    const base64Image = await this.readBase64ImageFromPath(imagePath);
    await this.cacheManager.set(key, base64Image, 60000);
    return new UserAvatarDto(id, base64Image);
  }

  private async readBase64ImageFromPath(imagePath: string) {
    try {
      const absolutePath = path.resolve(imagePath);
      const imageBuffer = fs.readFileSync(absolutePath);
      const base64Image = imageBuffer.toString('base64');
      return base64Image;
    } catch (error) {
      console.error('Error reading image file:', error);
      return null;
    }
  }

  private async downloadImage(imageUrl: string): Promise<string> {
    try {
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
      });

      const buffer = Buffer.from(response.data, 'binary');

      const uploadDir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }

      const fileName = path.basename(imageUrl);
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);

      return filePath;
    } catch (error) {
      console.error('Error downloading image:', error);
      throw new Error('Failed to download image');
    }
  }

  private async saveUserAvatar(user: ReqResUserDto, imagePath: string) {
    await this.usersRepository.save({
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      email: user.email,
      externalId: user.externalId,
      avatarPath: imagePath,
    });
  }

  public async deleteUserAvatar(id: number) {
    const user = await this.findOne(id);
    if (!user || !user.avatarPath) {
      return false;
    }

    if (user.avatarPath) {
      try {
        fs.unlinkSync(user.avatarPath);
      } catch (error) {
        console.error('Error deleting image file:', error);
      }
    }

    await this.usersRepository.update({ externalId: id }, { avatarPath: null });
    await this.cacheManager.del(`user-avatar-${id}`);

    return true;
  }
}
