import { AuthService } from '../../auth/services/auth.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserParams } from '../utils/types';
import { CreateBloodTestParams } from '../utils/types';
import { BloodTest } from '../entities/blood-test.entity'; 
import { FindUserDto } from '../dto/find-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private authService: AuthService,
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
      const externalId = await this.authService.registerUser(userDetails);
      await manager.update(User, userCreated.id, { externalId });
    });
  }

  async findByExternalId(externalId: string): Promise<FindUserDto> {
    return await this.userRepository.findOneBy({ externalId });
  }

  async createBloodTest(externalId: string, bloodTestParams: CreateBloodTestParams): Promise<void> {
    const user = await this.findByExternalId(externalId);
    const newBloodTest = this.bloodTestRepository.create(bloodTestParams);

    newBloodTest.user = user;
    await this.bloodTestRepository.save(newBloodTest);
  }
}
