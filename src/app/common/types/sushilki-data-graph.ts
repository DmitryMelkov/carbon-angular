// src/models/sushilki-data-graph.model.ts
export interface TemperatureData {
  lastUpdated: string;
  temperatures: {
    'Температура в топке': number;
    'Температура в камере смешения': number;
    'Температура уходящих газов': number;
  };
}
