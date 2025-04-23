import { Injectable } from "@nestjs/common";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";

@Injectable()
export class AIAgentService {
    private bedrockClient: BedrockRuntimeClient;
    private pollyClient: PollyClient;

    constructor() {
        this.bedrockClient = new BedrockRuntimeClient({
            region: process.env.AWS_REGION || 'us-east-1',
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
            },
        });

        this.pollyClient = new PollyClient({
            region: process.env.AWS_REGION || 'us-east-1',
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
            },
        });
    }

    async generateDialog(topic: string, interest: string): Promise<any> {
        const prompt = `Act as a helpful English teacher.
                       Generate a natural English conversation between you and the student about ${topic}.
                       Include a few questions and answers in the conversation.
                       The conversation should include the Student interest ${interest}. 
                       The conversation must be in English in the principal line and Spanish as secondary line,
                       so the student can understand the conversation.
                       Format the response as a dialogue with Teacher and Student.`;

        try {
            const command = new InvokeModelCommand({
                modelId: "anthropic.claude-v2",
                contentType: "application/json",
                accept: "application/json",
                body: JSON.stringify({
                    prompt: `\n\nHuman: ${prompt}\n\nAssistant:`,
                    max_tokens_to_sample: 2000,
                    temperature: 0.7,
                    top_p: 0.9,
                }),
            });

            const response = await this.bedrockClient.send(command);
            const responseBody = JSON.parse(new TextDecoder().decode(response.body));
            
            return responseBody.completion;
        } catch (error) {
            console.error('Error generating dialogue:', error);
            throw error;
        }
    }

    async generateSpeech(text: string): Promise<Buffer> {
        try {
            const command = new SynthesizeSpeechCommand({
                Text: text,
                OutputFormat: "mp3",
                VoiceId: "Joanna", // You can choose different voices
                Engine: "neural",   // Using the neural engine for better quality
                LanguageCode: "en-US"
            });

            const response = await this.pollyClient.send(command);
            
            // Handle the AudioStream as a Blob
            if (!response.AudioStream) {
                throw new Error('No AudioStream in response');
            }

            // Convert Blob to Buffer directly
            const audioData = await response.AudioStream.transformToByteArray();
            return Buffer.from(audioData);
            
        } catch (error) {
            console.error('Error generating speech:', error);
            throw error;
        }
    }
}