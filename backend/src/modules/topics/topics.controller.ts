import { Controller, Get } from "@nestjs/common";
import { TopicsService } from "./topics.service";
import { TopicsResponse } from "./interfaces/topicsResponse.interface";
import { ApiResponse } from "@nestjs/swagger";

@Controller()
export class TopicsController {
    
    constructor(private topicsService: TopicsService) {}

    @Get('/topics')
    @ApiResponse({
        status: 200,
        description: 'The list of topics',
        type: TopicsResponse,
    })
    getTopics() {
        return this.topicsService.getTopics();
    }
}