export interface Interest {
  id: number;
  name: string;
  imgUrl: string;
}

export interface Topic {
  id: number;
  name: string;
  imgUrl: string;
  interests: Interest[];
}
