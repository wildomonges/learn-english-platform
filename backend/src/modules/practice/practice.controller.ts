import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Patch,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { PracticeService } from './practice.service';
import { CreatePracticeDto } from './dto/create-practice.dto';
import { Practice } from './entities/practice.entity';
import { UpdateDialogDto } from './dto/update-dialog.dto';
import { Dialog } from './entities/dialog.entity';
import { instanceToPlain } from 'class-transformer';

@Controller('practices')
export class PracticeController {
  constructor(private readonly practiceService: PracticeService) {}

  @Patch(':id/dialogs/:dialogId')
  async updateDialog(
    @Param('id') practiceId: number,
    @Param('dialogId') dialogId: number,
    @Body() updateDto: UpdateDialogDto,
  ): Promise<Dialog> {
    return await this.practiceService.updateDialog(
      +practiceId,
      +dialogId,
      updateDto,
    );
  }

  @Patch(':id/complete')
  async completePractice(@Param('id') practiceId: number) {
    return this.practiceService.markPracticeAsCompleted(+practiceId);
  }

  @Post()
  async create(@Body() createDto: CreatePracticeDto): Promise<any> {
    const practice = await this.practiceService.create(createDto);
    return instanceToPlain(practice);
  }

  // ✅ GET /practices?userId=4
  @Get()
  findAll(@Query('userId') userId?: number): Promise<Practice[]> {
    if (userId) {
      return this.practiceService.findByUserId(userId);
    }
    return this.practiceService.findAll();
  }

  // ✅ GET /practices/:id (práctica específica)
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Practice> {
    return this.practiceService.findOne(id);
  }
  @Get(':id/result')
  async getPracticeResult(@Param('id', ParseIntPipe) id: number) {
    const practice = await this.practiceService.findOne(id);

    if (!practice) {
      throw new NotFoundException('Practice not found');
    }

    return {
      id: practice.id,
      name: practice.name,
      interest: practice.interest,
      totalDialogs: practice.totalDialogs,
      dialogsCompleted: practice.dialogsCompleted,
      completed: practice.completed,
      score:
        practice.score ??
        Math.round((practice.dialogsCompleted / practice.totalDialogs) * 100),
    };
  }
}
