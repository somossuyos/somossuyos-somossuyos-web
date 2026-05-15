export interface HeaderDTO {
  id: number;
  titles: TitleDTO[];
}

export interface TitleDTO {
  id: number;
  content: string;
}