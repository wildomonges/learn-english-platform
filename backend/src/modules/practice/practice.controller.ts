import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Patch,
} from '@nestjs/common';
import { PracticeService } from './practice.service';
import { CreatePracticeDto } from './dto/create-practice.dto';
import { Practice } from './entities/practice.entity';
import { UpdateDialogDto } from './dto/update-dialog.dto';

@Controller('practices')
export class PracticeController {
  constructor(private readonly practiceService: PracticeService) {}

  @Patch(':id/dialogs/:dialogId')
  async updateDialog(
    @Param('id') practiceId: number,
    @Param('dialogId') dialogId: number,
    @Body() updateDto: UpdateDialogDto,
  ) {
    return this.practiceService.updateDialog(+practiceId, +dialogId, updateDto);
  }

  @Patch(':id/complete')
  async completePractice(@Param('id') practiceId: number) {
    return this.practiceService.markPracticeAsCompleted(+practiceId);
  }

  @Post()
  create(@Body() createDto: CreatePracticeDto): Promise<Practice> {
    return this.practiceService.create(createDto);
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
}
