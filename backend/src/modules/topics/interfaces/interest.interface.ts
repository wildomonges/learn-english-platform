import { ApiProperty } from '@nestjs/swagger';

export class Interest {
  @ApiProperty({ description: 'The id of the interest' })
  id: number;
  @ApiProperty({ description: 'The name of the interest' })
  name: string;
  @ApiProperty({ description: 'The image of the interest ' })
  imgUrl: string;
}
