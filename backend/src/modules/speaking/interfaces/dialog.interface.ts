import { ApiProperty } from '@nestjs/swagger';

export class Dialog {
    @ApiProperty({ description: 'Teacher or Student' })
    speaker: string;

    @ApiProperty({ description: 'The text in English' })
    textEnglish: string;

    @ApiProperty({ description: 'The text in Spanish' })
    textSpanish: string;
}