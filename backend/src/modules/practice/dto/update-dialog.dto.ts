import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class UpdateDialogDto {
  @IsOptional()
  @IsString()
  response?: string;

  @IsOptional()
  @IsNumber()
  score?: number;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
