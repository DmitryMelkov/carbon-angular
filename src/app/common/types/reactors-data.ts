export interface Temperatures {
  [key: string]: number;
}

export interface Levels {
  [key: string]: number;
}

export interface ReactorData {
  temperatures: {
    'Температура реактора 45/1': number;
    'Температура реактора 45/2': number;
    'Температура реактора 45/3': number;
    'Температура реактора 45/4': number;
  };
  levels: {
    'Уровень реактора 45/1': number;
    'Уровень реактора 45/2': number;
    'Уровень реактора 45/3': number;
    'Уровень реактора 45/4': number;
  };
  lastUpdated: string;
}
