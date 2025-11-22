import { Injectable, NotFoundException } from '@nestjs/common';
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

  // Obtain data for user LIST (statistics)
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

  //Get ONLY a user by their ID (avoids 404 error)
  async fetchUserById(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user)
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    return user;
  }

  // Get full DETAILS (for UserDetailsPage)
  async fetchUserDetails(userId: number) {
    return this.userRepository.findOne({
      where: { id: userId },
      relations: ['practices', 'practices.dialogs'],
    });
  }
}
