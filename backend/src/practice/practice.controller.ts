import { Controller, Get, Post, Body } from '@nestjs/common';
import { PracticeService } from './practice.service';
import { CreatePracticeDto } from './dto/create-practice.dto';
import { Practice } from './entities/practice.entity';

@Controller('practices')
export class PracticeController {
  constructor(private readonly practiceService: PracticeService) {}

  @Post()
  create(@Body() createDto: CreatePracticeDto): Promise<Practice> {
    return this.practiceService.create(createDto);
  }

  @Get()
  findAll(): Promise<Practice[]> {
    return this.practiceService.findAll();
  }
}
