export interface Summary {
    income: number;
    expense: number;
    savings: number;
}

export interface CategoryBreakdown {
  _id: string;
  total: number;
  [key: string]: string | number;
}
