import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserParams } from './utils/types';
import { CreateBloodTestParams } from './utils/types';
import { BloodTest } from './entities/blood-test.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(BloodTest) private bloodTestRepository: Repository<BloodTest>) {}

  async create(userDetails: CreateUserParams): Promise<void> {
    const newUser = this.userRepository.create(userDetails);
    await this.userRepository.save(newUser);
  }

  async findOne(id: number) {
    return await this.userRepository.findOneBy({ id });
  }

  async createBloodTest(userId: number, bloodTestParams: CreateBloodTestParams): Promise<void> {
    console.log(userId);
    const user = await this.findOne(userId);
    console.log(user);
    const newBloodTest = this.bloodTestRepository.create(bloodTestParams);

    newBloodTest.user = user;
    await this.bloodTestRepository.save(newBloodTest);
  }
}
