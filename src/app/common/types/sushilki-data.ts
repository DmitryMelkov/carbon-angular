export interface Temperatures {
  "Температура в топке": number;
  "Температура в камере смешения": number;
  "Температура уходящих газов": number;
}

export interface Vacuums {
  "Разрежение в топке": string;
  "Разрежение в камере выгрузки": string;
  "Разрежение воздуха на разбавление": string;
}

export interface Gorelka {
  "Мощность горелки №1": number;
  "Сигнал от регулятора №1": number;
  "Задание температуры №1": number;
}

export interface IM {
  "Индикация паротушения": boolean;
  "Индикация сбрасыватель": boolean;
}

export interface SushilkiData {
  temperatures: Temperatures;
  vacuums: Vacuums;
  gorelka: Gorelka;
  im: IM;
  lastUpdated: string;
}
