export interface Temperatures {
  [key: string]: number;
}

export interface Levels {
  [key: string]: {
    value: number;
    percent: number;
  };
}

export interface Pressures {
  [key: string]: string;
}

export interface Vacuums {
  [key: string]: string;
}

export interface IM {
  [key: string]: boolean | number;
}

export interface Gorelka {
  [key: string]: number;
}

export interface VrTime {
  currentTime: string;
  lastUpdated: string;
}

export interface VrData {
  temperatures: Temperatures;
  levels: Levels;
  pressures: Pressures;
  vacuums: Vacuums;
  im: IM;
  gorelka: Gorelka;
  lastUpdated: string;
}
