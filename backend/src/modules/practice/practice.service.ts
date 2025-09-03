import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Practice } from './entities/practice.entity';
import { Dialog } from './entities/dialog.entity';
import { CreatePracticeDto } from './dto/create-practice.dto';
import { User } from 'src/modules/users/user.entity';
import { instanceToPlain } from 'class-transformer';
import { UpdateDialogDto } from './dto/update-dialog.dto';

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

  async create(createDto: CreatePracticeDto): Promise<Practice> {
    const user = await this.userRepo.findOneByOrFail({ id: createDto.userId });
    const practice = await this.practiceRepo.save(createDto);

    return practice;
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

  // ✅ OBTENER PRÁCTICAS DE UN USUARIO POR ID
  async findByUserId(userId: number): Promise<any[]> {
    const practices = await this.practiceRepo.find({
      where: { user: { id: userId } },
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

  // ✅ OBTENER UNA PRÁCTICA POR ID
  async findOne(id: number): Promise<any> {
    const practice = await this.practiceRepo.findOne({
      where: { id },
      relations: ['dialogs', 'user'],
    });

    return instanceToPlain(practice);
  }

  async updateDialog(
    practiceId: number,
    dialogId: number,
    updateDto: UpdateDialogDto,
  ): Promise<Dialog> {
    const dialog = await this.dialogRepo.findOne({
      where: {
        id: dialogId,
        practice: { id: practiceId },
      },
    });

    if (!dialog) {
      throw new Error(
        'Dialog not found or does not belong to the specified practice',
      );
    }

    if (updateDto.response !== undefined) {
      dialog.response = updateDto.response;
    }
    if (updateDto.score !== undefined) {
      dialog.score = updateDto.score;
    }
    if (updateDto.completed !== undefined) {
      dialog.completed = updateDto.completed;
    }

    const updated = await this.dialogRepo.save(dialog);
    return updated;
  }

  async markPracticeAsCompleted(practiceId: number): Promise<any> {
    const practice = await this.practiceRepo.findOne({
      where: { id: practiceId },
    });

    if (!practice) {
      throw new Error('Practice not found');
    }

    practice.completed = true;
    const updated = await this.practiceRepo.save(practice);
    return instanceToPlain(updated);
  }
}
