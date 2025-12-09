import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TopicsModule } from './modules/topics/topics.module';
import { SpeakingModule } from './modules/speaking/speaking.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PracticeModule } from './modules/practice/practice.module';

const isDev = process.env.NODE_ENV !== 'production';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT ?? '5432'),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: false,
      migrationsRun: true,
      migrations:
        process.env.NODE_ENV !== 'production'
          ? ['src/migrations/*.ts']
          : ['dist/migrations/*.js'],
      entities:
        process.env.NODE_ENV !== 'production'
          ? ['src/**/*.entity.ts']
          : ['dist/**/*.entity.js'],
    }),

    TopicsModule,
    SpeakingModule,
    AuthModule,
    UsersModule,
    PracticeModule,
  ],
})
export class AppModule {}
