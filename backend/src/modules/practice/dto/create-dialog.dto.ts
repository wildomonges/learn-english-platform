import { IsString, IsInt } from 'class-validator';
export class CreateDialogDto {
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
