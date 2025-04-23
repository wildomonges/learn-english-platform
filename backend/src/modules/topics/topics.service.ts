import { Injectable } from '@nestjs/common';

@Injectable()
export class TopicsService {
    getTopics() {
        return [
            {id: 1, name: 'English for Developer', interests: ['React programming', 'Vue programming']}, 
            {id: 2, name: 'English for Marketing', interests: ['Meta Business', 'SEO']},
        ];
    }
}
