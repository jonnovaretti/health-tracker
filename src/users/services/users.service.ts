import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserParams } from '../utils/types';
import { CreateBloodTestParams } from '../utils/types';
import { BloodTest } from '../entities/blood-test.entity'; 
import { AuthUsersService } from './auth-users.service';

@Injectable()
export class UsersService {
  constructor(
    private authUsersService: AuthUsersService,
    private datasource: DataSource,
    @InjectRepository(BloodTest) private bloodTestRepository: Repository<BloodTest>,
    @InjectRepository(User) private userRepository: Repository<User>) {}

  async create(userDetails: CreateUserParams): Promise<void> {
    let userCreated = await this.userRepository.findOneBy({ email: userDetails.email });

    if (!userCreated) {
      const user = this.userRepository.create({ email: userDetails.email, name: userDetails.name });
      userCreated = await this.userRepository.save(user);
    }

    await this.datasource.transaction(async (manager) => {
      const externalId = await this.authUsersService.registerUser(userDetails);
      await manager.update(User, userCreated.id, { externalId });
    });
  }

  async findById(id: number) {
    return await this.userRepository.findOneBy({ id });
  }

  async createBloodTest(userId: number, bloodTestParams: CreateBloodTestParams): Promise<void> {
    const user = await this.findById(userId);
    const newBloodTest = this.bloodTestRepository.create(bloodTestParams);

    newBloodTest.user = user;
    await this.bloodTestRepository.save(newBloodTest);
  }
}
