import { ApiProperty } from '@nestjs/swagger';
// solo dialogo generado por ia
export class Dialog {
  @ApiProperty({ description: 'Teacher or Student' })
  speaker: string;

  @ApiProperty({ description: 'The text in English' })
  textEnglish: string;

  @ApiProperty({ description: 'The text in Spanish' })
  textSpanish: string;
}
