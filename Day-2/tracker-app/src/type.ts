export interface ITracker {
  id: number;
  title: string;
  nominal: number;
  type: "income" | "expense";
  category: "salary" | "food" | "transport";
  date: Date;
}
