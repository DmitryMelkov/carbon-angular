// src/models/sushilki-data-graph.model.ts
export interface TemperatureData {
  lastUpdated: string;
  temperatures: {
    'Температура в топке': number;
    'Температура в камере смешения': number;
    'Температура уходящих газов': number;
  };
}

export interface VacuumsData {
  lastUpdated: string;
  vacuums: {
    'Разрежение в топке': string;
    'Разрежение в камере выгрузки': string;
    'Разрежение воздуха на разбавление': string;
  };
}

