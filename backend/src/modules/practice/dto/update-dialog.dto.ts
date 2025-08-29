import { IsString, IsNumber, IsBoolean } from 'class-validator';

export class UpdateDialogDto {
  @IsString()
  response: string;

  @IsNumber()
  score: number;

  @IsBoolean()
  completed: boolean;
}
