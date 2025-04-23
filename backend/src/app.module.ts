import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopicsModule } from './modules/topics/topics.module';
import { SpeakingModule } from './modules/speaking/speaking.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT ?? '5432'),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true,
      entities: ['dist/**/*.entity{.ts,.js}'],
    }),
    TopicsModule,
    SpeakingModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
