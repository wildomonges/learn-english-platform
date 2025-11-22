import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserPracticeAnDialogDTO } from './dto/user-practice-dialog.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('practice-dialog')
  async fetchUserPracticeAnDialog(): Promise<UserPracticeAnDialogDTO[]> {
    return this.usersService.fetchUserPracticeAnDialog();
  }

  @Get(':id')
  async fetchUserById(@Param('id') id: string) {
    return this.usersService.fetchUserById(Number(id));
  }

  @Get(':id/details')
  async fetchUserDetails(@Param('id') id: string) {
    return this.usersService.fetchUserDetails(Number(id));
  }
}
