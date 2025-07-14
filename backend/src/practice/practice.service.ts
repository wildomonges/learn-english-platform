import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Practice } from './entities/practice.entity';
import { Dialog } from './entities/dialog.entity';
import { CreatePracticeDto } from './dto/create-practice.dto';
import { User } from 'src/modules/users/user.entity';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class PracticeService {
  constructor(
    @InjectRepository(Practice)
    private practiceRepo: Repository<Practice>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Dialog)
    private dialogRepo: Repository<Dialog>,
  ) {}

  async create(createDto: CreatePracticeDto): Promise<any> {
    const user = await this.userRepo.findOneByOrFail({ id: createDto.userId });

    const practice = this.practiceRepo.create({
      name: createDto.name,
      topic: createDto.topic,
      interest: createDto.interests,
      user,
      dialogs: createDto.dialogs.map((d) =>
        this.dialogRepo.create({
          dialog: d.dialog,
          order: d.order,
          score: d.score,
          completed: d.completed ?? false,
        }),
      ),
    });

    const savedPractice = await this.practiceRepo.save(practice);

    return instanceToPlain(savedPractice);
  }

  async findAll(): Promise<any[]> {
    const practices = await this.practiceRepo.find({
      relations: ['dialogs', 'user'],
      order: {
        createdAt: 'DESC',
        dialogs: {
          order: 'ASC',
        },
      },
    });

    return practices.map((p) => instanceToPlain(p));
  }
}
