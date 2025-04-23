import { ApiProperty } from '@nestjs/swagger';

export class SpeechResponse {
    @ApiProperty({ 
        description: 'The audio content in base64 format',
        example: 'base64_encoded_audio_content'
    })
    audio: string;

    @ApiProperty({ 
        description: 'The audio format',
        example: 'mp3'
    })
    format: string;
}