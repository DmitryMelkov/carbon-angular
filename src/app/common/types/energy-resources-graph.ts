export interface PressureData {
  lastUpdated: string;
  data: {
    [key: string]: number;
  };
}
