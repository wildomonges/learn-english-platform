import { Controller, Get, Query } from '@nestjs/common';
import { AIAgentService } from './aiAgent.service';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import { DialogResponse } from './interfaces/dialogResponse.interface';
import { SpeechResponse } from './interfaces/speechResponse.interface';

@Controller('speaking')
export class SpeakingController {

    constructor(private readonly aiAgentService: AIAgentService) {}

    @Get('/getDialog')
    @ApiQuery({ name: 'topic', required: true, description: 'The main topic for the dialogue' })
    @ApiQuery({ name: 'interest', required: true, description: 'The specific interest or context' })
    @ApiResponse({ status: 200, type: DialogResponse })
    async getDialog(
        @Query('topic') topic: string,
        @Query('interest') interest: string
    ): Promise<DialogResponse> {
        const dialog = await this.aiAgentService.generateDialog(topic, interest);
        return {
            topic,
            interest,
            dialog,
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