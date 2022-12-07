export enum TableBoardItemStyle{
  "NONE",
  "BOLD"
}

export interface TableBoardItemSchema{
  title: string;
  style: TableBoardItemStyle;
}

export interface TableBoardElement{
  title: string;
  schema: TableBoardItemSchema[];
}
