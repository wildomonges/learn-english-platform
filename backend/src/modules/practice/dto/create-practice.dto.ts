import { IsArray, IsString, IsInt, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class DialogDto {
  @IsString()
  speaker: string;

  @IsString()
  textEnglish: string;

  @IsString()
  textSpanish: string;

  @IsString()
  response: string;

  @IsInt()
  order: number;

  @IsInt()
  score: number;

  completed?: boolean;
}

export class CreatePracticeDto {
  @IsInt()
  userId: number;

  @IsString()
  name: string;

  @IsString()
  topic: string;

  @IsString()
  interests: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DialogDto)
  dialogs: DialogDto[];
}
