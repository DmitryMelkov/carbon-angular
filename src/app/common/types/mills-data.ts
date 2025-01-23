export interface MillData {
  _id: string;
  data: {
    [key: string]: number;
  };
  lastUpdated: string;
  __v: number;
}
