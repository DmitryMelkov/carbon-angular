import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { ControlButtonComponent } from '../../components/control-button/control-button.component';
import { SushilkaComponent } from '../sushilki/sushilka-current/sushilka.component';
import { SushilkaMnemoComponent } from '../sushilki/sushilka-mnemo/sushilka-mnemo.component';
import { MpaComponent } from '../mpa/mpa-current/mpa.component';
import { MpaMnemoComponent } from '../mpa/mpa-mnemo/mpa-mnemo.component';
import { VrComponent } from '../vr/vr-current/vr.component';
import { VrMnemoComponent } from '../vr/vr-mnemo/vr-mnemo.component';
import { GraphicVacuumsGeneralComponent } from '../sushilki/sushilka-graph-general/graphic-vacuums-general/graphic-vacuums-general.component';
import { GraphicTempersGeneralComponent } from '../sushilki/sushilka-graph-general/graphic-tempers-general/graphic-tempers-general.component';
import { GraphicMpaGeneralComponent } from '../mpa/mpa-graph-general/mpa-graph-general.component';
import { MillsCurrentComponent } from '../mills/mills-current/mills-current.component';
import { Mill1GraphComponent } from '../mills/mill1-graph/mill1-graph.component';
import { Mill2GraphComponent } from '../mills/mill2-graph/mill2-graph.component';
import { MillSBM3Component } from '../mills/mill-sbm3/mill-sbm3.component';
import { MillYGM9517Component } from '../mills/mill-ygm9517/mill-ygm9517.component';
import { MillYCVOK130Component } from '../mills/mill-ycvok130/mill-ycvok130.component';
import { ReactorComponent } from '../reactors/reactors-current/reactors.component';
import { ReactorMnemoComponent } from '../reactors/reactors-mnemo/reactors-mnemo.component';
import { GraphicReactorsGeneralComponent } from '../reactors/reactors-graph-general/reactors-graph-general.component';
import { EnergyResourcesCurrentComponent } from '../energy-resources/energy-resources-current/energy-resources-current.component';
import { EnergyResourcesReportDayComponent } from '../energy-resources/energy-resources-report-day/energy-resources-report-day.component';
import { EnergyResourcesReportMonthComponent } from '../energy-resources/energy-resources-report-month/energy-resources-report-month.component';
import { EnergyResourcesGraphPressureComponent } from '../energy-resources/energy-resources-graph-pressure/energy-resources-graph-pressure.component';
import { EnergyResourcesGraphConsumptionComponent } from '../energy-resources/energy-resources-graph-consumption/energy-resources-graph-consumption.component';
import { MpaGraphGeneralTemperComponent } from '../mpa/mpa-graph-general-temper/mpa-graph-general-temper.component';
import { MpaGraphGeneralPressureComponent } from '../mpa/mpa-graph-general-pressure/mpa-graph-general-pressure.component';
import { GraphicTempersGeneralVrComponent } from '../vr/vr-graph-general/graphic-tempers-general/graphic-tempers-general.component';
import { GraphicVacuumsGeneralVrComponent } from '../vr/vr-graph-general/graphic-vacuums-general/graphic-vacuums-general.component';
import { GraphicNotisGeneralVrComponent } from '../vr/vr-graph-general/graphic-notis-general/graphic-notis-general.component';
import { GraphicLevelsGeneralVrComponent } from '../vr/vr-graph-general/graphic-levels-general/graphic-levels-general.component';
import { ButtonConfig, OBJECT_BUTTONS_CONFIG, ObjectType } from '../../common/shared/object-buttons.config';
import { ReactorsPressChartTemperGeneralComponent } from '../reactors/reactors-press-chart-temper-general/reactors-press-chart-temper-general.component';
import { ReactorsPressChartPressureGeneralComponent } from "../reactors/reactors-press-chart-pressure-general/reactors-press-chart-pressure-general.component";

interface ObjectData {
  id: string;
  name: string;
  type: ObjectType;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    ControlButtonComponent,
    // Сушилки
    SushilkaComponent,
    SushilkaMnemoComponent,
    GraphicTempersGeneralComponent,
    GraphicVacuumsGeneralComponent,
    // МПА
    MpaComponent,
    MpaMnemoComponent,
    GraphicMpaGeneralComponent,
    MpaGraphGeneralTemperComponent,
    MpaGraphGeneralPressureComponent,
    // ПК
    VrComponent,
    VrMnemoComponent,
    GraphicTempersGeneralVrComponent,
    GraphicVacuumsGeneralVrComponent,
    GraphicLevelsGeneralVrComponent,
    GraphicNotisGeneralVrComponent,
    // Мельницы
    MillsCurrentComponent,
    Mill1GraphComponent,
    Mill2GraphComponent,
    MillSBM3Component,
    MillYGM9517Component,
    MillYCVOK130Component,
    // Реакторы
    ReactorComponent,
    ReactorMnemoComponent,
    GraphicReactorsGeneralComponent,
    ReactorsPressChartTemperGeneralComponent,
    ReactorsPressChartPressureGeneralComponent,
    // Энергоресурсы
    EnergyResourcesCurrentComponent,
    EnergyResourcesReportDayComponent,
    EnergyResourcesReportMonthComponent,
    EnergyResourcesGraphPressureComponent,
    EnergyResourcesGraphConsumptionComponent,
    ReactorsPressChartPressureGeneralComponent
],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  objectData: ObjectData[] = [
    { id: 'vr1', name: 'ПК №1', type: 'vr' },
    { id: 'vr2', name: 'ПК №2', type: 'vr' },
    { id: 'mpa2', name: 'МПА №2', type: 'mpa' },
    { id: 'mpa3', name: 'МПА №3', type: 'mpa' },
    { id: 'sushilka1', name: 'Сушилка №1', type: 'sushilka' },
    { id: 'sushilka2', name: 'Сушилка №2', type: 'sushilka' },
    { id: 'mills', name: 'Мельницы', type: 'mills' },
    { id: 'reactors', name: 'Корпус 296', type: 'reactors' },
    { id: 'energy', name: 'Энергоресурсы', type: 'energy' }
  ];

  selectedObjectId: string = this.objectData[0].id;
  activeView: string = 'parameters';
  buttonsConfig: Record<ObjectType, readonly ButtonConfig[]> = OBJECT_BUTTONS_CONFIG;

  getButtonsByType(type: string): readonly ButtonConfig[] {
    const safeType = type as ObjectType;
    return this.buttonsConfig[safeType] || [];
  }

  trackById(index: number, item: ObjectData): string {
    return item.id;
  }

  setActiveView(view: string, id?: string) {
    this.activeView = view;
    if (id) {
      this.selectedObjectId = id;
    }
  }
}
