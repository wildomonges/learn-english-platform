import { ApiProperty } from '@nestjs/swagger';

export class DialogResponse {
    @ApiProperty({ description: 'The main topic of the dialogue' })
    topic: string;

    @ApiProperty({ description: 'The specific interest or context' })
    interest: string;

    @ApiProperty({ description: 'The generated dialogue content' })
    dialog: string;

    @ApiProperty({ description: 'The timestamp when the dialogue was generated' })
    timestamp: string;
}