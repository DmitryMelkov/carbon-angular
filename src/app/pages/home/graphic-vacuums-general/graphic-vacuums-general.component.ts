import { Component } from '@angular/core';
import { SushilkaGraphVacuumsComponent } from '../../sushilki/sushilka-graph-davl/sushilka-graph-vacuums.component';

@Component({
  selector: 'app-graphic-vacuums-general',
  templateUrl: './graphic-vacuums-general.component.html',
  styleUrls: ['./graphic-vacuums-general.component.scss'],
  standalone: true,
  imports: [SushilkaGraphVacuumsComponent],
})
export class GraphicVacuumsGeneralComponent {}