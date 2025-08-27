import { ApiProperty } from '@nestjs/swagger';
import { Dialog } from './dialog.interface';

export class DialogsResponse {
    @ApiProperty({ description: 'The main topic of the dialogue' })
    topic: string;

    @ApiProperty({ description: 'The specific interest or context' })
    interest: string;

    @ApiProperty({ description: 'The generated dialogue content' })
    dialogs: Array<Dialog>;

    @ApiProperty({ description: 'The timestamp when the dialogue was generated' })
    timestamp: string;
}