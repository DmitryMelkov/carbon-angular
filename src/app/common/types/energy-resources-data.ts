export interface EnergyResourceData {
  device: string;
  data: {
    [key: string]: number; // Индексационная подпись для динамических ключей
  };
  lastUpdated: string;
  outdated: boolean;
}
