export interface Interest {
  id: string;
  name: string;
  imgUrl: string;
}

export interface Topic {
  id: number;
  name: string;
  interests: Interest[];
}
