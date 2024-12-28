// src/chartjs-plugin-annotation.d.ts
import 'chart.js';

declare module 'chart.js' {
  interface ChartOptions {
    plugins?: {
      annotation?: {
        annotations?: {
          [key: string]: {
            type: string;
            x: string | number;
            y: number;
            content: string;
            enabled: boolean;
            font: {
              size: number;
              family: string;
              weight: string;
              color: string;
            };
            position: string;
          };
        };
      };
    };
  }
}
