export interface EnergyResourcesReportData {
  time: string;
  DE093: number | string; // Используем string для обработки значения '-'
  DD972: number | string;
  DD973: number | string;
  DD576: number | string;
  DD569: number | string;
  DD923: number | string;
  DD924: number | string;
}
