export type ButtonConfig = {
  label: string;
  view: string;
};

export type ObjectType = 'sushilka' | 'mpa' | 'vr'  | 'mills' | 'reactors' | 'energy';

export const OBJECT_BUTTONS_CONFIG = {
  sushilka: [
    { label: 'Текущие параметры', view: 'parameters' },
    { label: 'Мнемосхема', view: 'mnemo' },
    { label: 'Графики температур', view: 'graph-tempers-general' },
    { label: 'Графики давления', view: 'graph-vacuums-general' }
  ],
  mpa: [
    { label: 'Текущие параметры', view: 'parameters' },
    { label: 'Мнемосхема', view: 'mnemo' },
    { label: 'Графики общие', view: 'graph-mpa-general' },
    { label: 'Графики температур', view: 'graph-mpa-general-temper' },
    { label: 'Графики давления/разрежения', view: 'graph-mpa-general-pressure' }
  ],
  vr: [
    { label: 'Текущие параметры', view: 'parameters' },
    { label: 'Мнемосхема', view: 'mnemo' },
    { label: 'Графики температур', view: 'graph-vr-general-temper' },
    { label: 'Графики давления', view: 'graph-vr-general-vacuums' },
    { label: 'Графики уровня', view: 'graph-vr-general-levels' },
    { label: 'Графики НОТИС', view: 'graph-vr-general-notis' }
  ],
  mills: [
    { label: 'Текущие параметры', view: 'parameters' },
    { label: 'График мельницы №1', view: 'mill1-graph' },
    { label: 'График мельницы №2', view: 'mill2-graph' },
    { label: 'График ШБМ №3', view: 'millsbm3-graph' },
    { label: 'График YGM-9517', view: 'millygm9517-graph' },
    { label: 'График YCVOK-130', view: 'millycvok130-graph' }
  ],
  reactors: [
    { label: 'Текущие параметры', view: 'parameters' },
    { label: 'Мнемосхема', view: 'mnemo' },
    { label: 'Графики реакторов', view: 'graph-reactors-general' },
    { label: 'Графики температуры прессов', view: 'chart-reactors-press-temper-general' },
    { label: 'Графики давления прессов', view: 'chart-reactors-press-pressure-general' }
  ],
  energy: [
    { label: 'Текущие параметры', view: 'parameters' },
    { label: 'Суточный отчет', view: 'daily-report' },
    { label: 'Месячный отчет', view: 'monthly-report' },
    { label: 'Графики давления', view: 'energy-resources-graph-pressure' },
    { label: 'Графики расхода', view: 'energy-resources-graph-consumption' }
  ]
} as const satisfies Record<ObjectType, readonly ButtonConfig[]>;