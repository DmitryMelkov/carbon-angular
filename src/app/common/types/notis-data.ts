export interface Notis {
  [key: string]: string | number | boolean;
}

export interface NotisData {
  _id: string;
  data: Notis; // Нотисы находятся в поле `data`
  status: string;
  lastUpdated: string;
  __v: number;
}
