import { Injectable } from '@nestjs/common';

@Injectable()
export class TopicsService {
  getTopics() {
    return [
      {
        id: 1,
        name: 'English for Developer',
        imgUrl:
          'https://cdn.dribbble.com/userupload/16505523/file/original-ead560979b865f6fa8273e27291b810d.jpg?resize=400x0',
        interests: [
          {
            id: '1',
            name: 'React programming',
            imgUrl:
              'https://blog.cellenza.com/wp-content/uploads/2015/05/React-JS.png',
          },
          {
            id: '2',
            name: 'Vue programming',
            imgUrl:
              'https://miro.medium.com/v2/resize:fit:900/1*0_zl1YRcPy0ymOpgJ0dQKA.jpeg',
          },
        ],
      },
      {
        id: 2,
        name: 'English for Marketing',
        imgUrl:
          'https://cdn.vectorstock.com/i/1000v/57/84/digital-marketing-logo-vector-46455784.jpg',

        interests: [
          {
            id: '3',
            name: 'Meta Business',
            imgUrl:
              'https://www.inabaweb.com/wp-content/uploads/2023/04/Meta-Business-Suite.png',
          },
          {
            id: '4',
            name: 'SEO',
            imgUrl: 'https://www.xplora.eu/wp-content/uploads/que-es-seo.png',
          },
        ],
      },
    ];
  }
}
