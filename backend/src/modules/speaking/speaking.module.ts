import { Module } from "@nestjs/common";
import { SpeakingController } from "./speaking.controller";
import { AIAgentService } from "./aiAgent.service";

@Module({
    controllers: [SpeakingController],
    providers: [AIAgentService],
})
export class SpeakingModule {}