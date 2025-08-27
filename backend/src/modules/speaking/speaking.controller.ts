import { Controller, Get, Query } from '@nestjs/common';
import { AIAgentService } from './aiAgent.service';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import { DialogsResponse } from './interfaces/dialogsResponse.interface';
import { SpeechResponse } from './interfaces/speechResponse.interface';

@Controller('speaking')
export class SpeakingController {

    constructor(private readonly aiAgentService: AIAgentService) {}

    @Get('/getDialogs')
    @ApiQuery({ name: 'topic', required: true, description: 'The main topic for the dialogue' })
    @ApiQuery({ name: 'interest', required: true, description: 'The specific interest or context' })
    @ApiResponse({ status: 200, type: DialogsResponse })
    async getDialogs(
        @Query('topic') topic: string,
        @Query('interest') interest: string
    ): Promise<DialogsResponse> {
        const dialogs = await this.aiAgentService.generateDialogs(topic, interest);
        return {
            topic,
            interest,
            dialogs,
            timestamp: new Date().toISOString(),
        };
    }

    @Get('/getSpeech')
    @ApiQuery({ name: 'text', required: true, description: 'The text to generate the audio' })
    @ApiResponse({ status: 200, description: 'Audio file in base64 format', type: SpeechResponse })
    async getSpeech(
        @Query('text') text: string
    ) {
        const audioBuffer = await this.aiAgentService.generateSpeech(text);
        return {
            audio: audioBuffer.toString('base64'),
            format: 'mp3'
        };
    }
}