import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserPracticeAnDialogDTO } from './dto/user-practice-dialog.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async fetchUserPracticeAnDialog(): Promise<UserPracticeAnDialogDTO[]> {
    const result = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('practice', 'practice', 'practice."userId" = user.id')
      .leftJoin('dialog', 'dialog', 'dialog."practiceId" = practice.id')
      .select('user.id', 'id')
      .addSelect("CONCAT(user.firstName, ' ', user.lastName)", 'nombreCompleto')
      .addSelect('COUNT(DISTINCT practice.id)', 'totalPracticas')
      .addSelect(
        'COUNT(DISTINCT CASE WHEN dialog.completed = true THEN dialog.id END)',
        'totalDialogos',
      )
      .addSelect('MAX(practice.createdAt)', 'ultimaFechaPractica')
      .groupBy('user.id')
      .addGroupBy('user.firstName')
      .addGroupBy('user.lastName')
      .getRawMany();

    return result.map((u) => ({
      id: Number(u.id),
      nombreCompleto: u.nombreCompleto,
      totalPracticas: Number(u.totalPracticas),
      totalDialogos: Number(u.totalDialogos),
      ultimaFechaPractica: u.ultimaFechaPractica
        ? new Date(u.ultimaFechaPractica)
        : null,
    }));
  }
}
