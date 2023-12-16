import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { BloodTest } from './users/entities/blood-test.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [UsersModule, 
    ConfigModule.forRoot({
      envFilePath: '.development.env',
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'health_tracker_user',
      database: 'health_tracker_db',
      entities: [User, BloodTest],
      synchronize: true,
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
