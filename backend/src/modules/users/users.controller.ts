import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserPracticeAnDialogDTO } from './dto/user-practice-dialog.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('practice-dialog')
  async fetchUserPracticeAnDialog(): Promise<UserPracticeAnDialogDTO[]> {
    return this.usersService.fetchUserPracticeAnDialog();
  }
}
