// src/types/chartjs-plugin-crosshair.d.ts
import 'chart.js';

declare module 'chart.js' {
  interface PluginOptionsByType<TType extends ChartType> {
    crosshair?: {
      line?: {
        color?: string;
        width?: number;
      };
      sync?: {
        enabled?: boolean;
      };
      zoom?: {
        enabled?: boolean;
      };
      snap?: {
        enabled?: boolean;
      };
    };
  }
}
