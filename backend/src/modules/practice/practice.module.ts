import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Practice } from './entities/practice.entity';
import { Dialog } from './entities/dialog.entity';

import { PracticeService } from './practice.service';
import { PracticeController } from './practice.controller';
import { User } from '../../modules/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Practice, Dialog, User])],
  controllers: [PracticeController],
  providers: [PracticeService],
})
export class PracticeModule {}
