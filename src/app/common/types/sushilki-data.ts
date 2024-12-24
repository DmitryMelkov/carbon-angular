export interface Temperatures {
  [key: string]: number; // Добавьте эту строку
  'Температура в топке': number;
  'Температура в камере смешения': number;
  'Температура уходящих газов': number;
}

export interface Vacuums {
  'Разрежение в топке': string;
  'Разрежение в камере выгрузки': string;
  'Разрежение воздуха на разбавление': string;
}

export interface Gorelka {
  [key: string]: number; // Индексный тип для динамических ключей
  'Мощность горелки': number;
  'Сигнал от регулятора': number;
  'Задание температуры': number;
}

export interface IM {
  'Индикация паротушения': boolean;
  'Индикация сбрасыватель': boolean;
}

export interface SushilkiData {
  temperatures: Temperatures;
  vacuums: Vacuums;
  gorelka: Gorelka;
  im: IM;
  lastUpdated: string;
}

