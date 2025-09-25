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
  ) {
    const dialog: Dialog = await this.practiceService.updateDialog(
      +practiceId,
      +dialogId,
      updateDto,
    );
    return instanceToPlain(dialog)
  }

  @Patch(':id/complete')
  async completePractice(@Param('id') practiceId: number) {
    const practice: Practice = await this.practiceService.markPracticeAsCompleted(+practiceId);
    return instanceToPlain(practice);
  }

  @Post()
  async create(@Body() createDto: CreatePracticeDto) {
    const practice: Practice = await this.practiceService.create(createDto);
    return instanceToPlain(practice);
  }

  // ✅ GET /practices?userId=4
  @Get()
  async findAll(@Query('userId') userId: number) {
    const practices: Practice[] = await this.practiceService.findByUserId(userId);
    return instanceToPlain(practices)
  }

  // ✅ GET /practices/:id (práctica específica)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const practice: Practice | null = await  this.practiceService.findOne(id);

    if (!practice){
      throw new NotFoundException('Practice not found');
    }
    return instanceToPlain(practice);
  }

  @Get(':id/result')
  async getPracticeResult(@Param('id', ParseIntPipe) id: number) {
    const practice: Practice | null = await this.practiceService.findOne(id);

    if (!practice) {
      throw new NotFoundException('Practice not found');
    }
    const totalDialogs = practice.dialogs.length;
    const dialogsCompleted = practice.dialogs.filter((dialog) => dialog.completed).length;
    return instanceToPlain({
      id: practice.id,
      name: practice.name,
      interest: practice.interest,
      totalDialogs: totalDialogs,
      dialogsCompleted: dialogsCompleted,
      completed: practice.completed,
      score: Math.round((dialogsCompleted / totalDialogs) * 100),
    });
  }
}
