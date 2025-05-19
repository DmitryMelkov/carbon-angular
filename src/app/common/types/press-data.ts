// src/app/common/types/press-data.ts
export interface PressData {
  controllerData: {
    "Статус работы": boolean;
    "Кол-во наработанных часов": number;
  };
  termodatData: {
    "Температура масла": number;
    "Давление масла": number;
  };
  lastUpdated: string;
}