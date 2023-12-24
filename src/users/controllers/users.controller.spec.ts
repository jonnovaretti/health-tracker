import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../auth/services/auth.service'
import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const authServiceMock: MockType<AuthService> = {
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, AuthService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  describe('create - POST', () => {
    it('calls the create of user service', async () => {
      const createUserDto = new CreateUserDto();
      const create = jest.spyOn(service, 'create');

      await controller.create(createUserDto);

      expect(create).toHaveBeenCalledWith(createUserDto);
    });
  });
});
