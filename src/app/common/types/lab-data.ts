export interface LabData {
  value: string;
  valueTime: string;
  valueDate: string;
  valuePH: string;
  valuePHTime: string;
  valuePHDate: string;
  valueSUM: string;
  valueSUMTime: string;
  valueSUMDate: string;
}

export interface LabFormData {
  volatileSubstances: string;
  pH: string;
  sum: string;
  time: string;
  password: string;
}

export interface LabLastDay {
  _id: string;
  value: string;
  valuePH: string;
  valueSUM: string;
  recordTime: string;
  recordDate: string;
}
