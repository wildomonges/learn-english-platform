import { IsArray, IsString, IsInt, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateDialogDto } from './create-dialog.dto';

export class CreatePracticeDto {
  @IsInt()
  userId: number;

  @IsString()
  name: string;

  @IsString()
  topic: string;

  @IsString()
  interest: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDialogDto)
  dialogs: CreateDialogDto[];
}
