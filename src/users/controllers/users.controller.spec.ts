import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../auth/services/auth.service';
import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { TokenValidatorService } from '../../auth/services/token-validator.service';
import { UsernameExistsException } from '@aws-sdk/client-cognito-identity-provider';
import { HttpException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const UsersServiceProvider = {
    provide: UsersService,
    useFactory: () => ({
      create: jest.fn(() => {}),
    }),
  };

  const AuthServiceProvider = {
    provide: AuthService,
    useFactory: () => ({
      registerUser: jest.fn(() => {}),
    }),
  };

  const TokenValidatorServiceProvider = {
    provide: TokenValidatorService,
    useFactory: () => ({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        UsersServiceProvider,
        AuthService,
        AuthServiceProvider,
        TokenValidatorService,
        TokenValidatorServiceProvider,
      ],
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

    it('returns Bad Request when the user exists', async () => {
      let serviceMock = jest
        .spyOn(service, 'create')
        .mockRejectedValue({ code: 'UsernameExistsException' });
      await expect(controller.create(new CreateUserDto())).rejects.toThrow(
        HttpException,
      );
    });

    it('returns Internal Server Error when any error happens', async () => {
      let serviceMock = jest
        .spyOn(service, 'create')
        .mockRejectedValue({ code: 'AnyException' });
      await expect(controller.create(new CreateUserDto())).rejects.toThrow(
        HttpException,
      );
    });
  });
});
