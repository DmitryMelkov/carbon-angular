export interface Temperatures {
  [key: string]: number; // Добавьте эту строку
}

export interface Pressures {
  [key: string]: string; // Динамические ключи
}

export interface MpaData {
  temperatures: Temperatures;
  pressures: Pressures;
  lastUpdated: string;
}

