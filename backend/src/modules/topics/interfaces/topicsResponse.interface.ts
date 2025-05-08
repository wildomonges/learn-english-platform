import { ApiProperty } from '@nestjs/swagger';
import { Interest } from './interest.interface';

export class TopicsResponse {
  @ApiProperty({ description: 'The id of the topic' })
  id: number;
  @ApiProperty({ description: 'The name of the topic' })
  name: string;
  @ApiProperty({ description: 'The interests of the topic' })
  interests: Interest[];
}
