import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';

@Module({
  imports: [UsersModule, 
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'health_tracker_user',
      database: 'health_tracker_db',
      entities: [User],
      synchronize: true,
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
