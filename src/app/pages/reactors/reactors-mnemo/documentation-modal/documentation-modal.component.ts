import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ModalHeaderComponent } from '../../../../components/modal-header/modal-header.component';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-documentation-modal-mpa',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ModalHeaderComponent,
    MatExpansionModule,
  ],
  templateUrl: './documentation-modal.component.html',
  styleUrls: ['./documentation-modal.component.scss'],
  animations: [
    trigger('accordionAnimation', [
      state(
        'closed',
        style({
          height: '0px',
          opacity: 0,
        })
      ),
      state(
        'open',
        style({
          height: '*',
          opacity: 1,
        })
      ),
      transition('closed <=> open', animate('300ms ease-in-out')),
    ]),
  ],
})
export class DocumentationModalComponent {
  activeAccordion: string | null = 'schemes'; // 'schemes' для открытого состояния

  schemes = [
    {
      title: 'Общие данные',
      dwg: 'http://Techsite4/schemes/common_data_sushilka.dwg',
      pdf: 'http://Techsite4/schemes/PDF/common_data_sushilka.pdf',
    },
    {
      title: 'Структурная схема',
      dwg: 'http://Techsite4/schemes/structural_sushilka.dwg',
      pdf: 'http://Techsite4/schemes/PDF/structural_sushilka.pdf',
    },
    {
      title: 'Принципиальная схема питания',
      dwg: 'http://Techsite4/schemes/power_sushilka.dwg',
      pdf: 'http://Techsite4/schemes/PDF/power_sushilka.pdf',
    },
    {
      title: 'Функциональная схема',
      dwg: 'http://Techsite4/schemes/functional_sushilka.dwg',
      pdf: 'http://Techsite4/kaskad/production/carbon/sushilki/modal-content/schemes/PDF/functional_sushilka.pdf',
    },
    {
      title: 'Принципиальная схема соединений контроллера I',
      dwg: 'http://Techsite4/kaskad/production/carbon/sushilki/modal-content/schemes/MK-500_first_sushilka.dwg',
      pdf: 'http://Techsite4/kaskad/production/carbon/sushilki/modal-content/schemes/PDF/MK-500_first_sushilka.pdf',
    },
    {
      title: 'Принципиальная схема соединений контроллера II',
      dwg: 'http://Techsite4/kaskad/production/carbon/sushilki/modal-content/schemes/MK-500_second_sushilka.dwg',
      pdf: 'http://Techsite4/kaskad/production/carbon/sushilki/modal-content/schemes/PDF/MK-500_second_sushilka.pdf',
    },
    {
      title: 'Схема внешних соединений',
      dwg: 'http://Techsite4/kaskad/production/carbon/sushilki/modal-content/schemes/external_sushilka.dwg',
      pdf: 'http://Techsite4/kaskad/production/carbon/sushilki/modal-content/schemes/PDF/external_sushilka.pdf',
    },
    {
      title: 'Схема электрических соединений соединений',
      dwg: 'http://Techsite4/kaskad/production/carbon/sushilki/modal-content/schemes/MKC_sushilka.dwg',
      pdf: 'http://Techsite4/kaskad/production/carbon/sushilki/modal-content/schemes/PDF/MKC_sushilka.pdf',
    },
    {
      title: 'Сборочный чертеж',
      dwg: 'http://Techsite4/kaskad/production/carbon/sushilki/modal-content/schemes/assembly_sushilka.dwg',
      pdf: 'http://Techsite4/kaskad/production/carbon/sushilki/modal-content/schemes/PDF/assembly_sushilka.pdf',
    },
    {
      title: 'Спецификация оборудования',
      dwg: 'http://Techsite4/kaskad/production/carbon/sushilki/modal-content/schemes/specification_sushilka.dwg',
      pdf: 'http://Techsite4/kaskad/production/carbon/sushilki/modal-content/schemes/PDF/specification_sushilka.pdf',
    },
  ];

  programs = [
    {
      title: 'Программа МК-500',
      file: 'http://Techsite4/progs/prog_mk500_sushilka.th7',
    },
    {
      title: 'Программа панели оператора DELTA',
      file: 'http://Techsite4/progs/prog_delta_sushilka.dpa',
    },
  ];

  constructor(
    public dialogRef: MatDialogRef<DocumentationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  toggleAccordion(section: string): void {
    this.activeAccordion = this.activeAccordion === section ? null : section;
  }

  get accordionState(): { [key: string]: string } {
    return {
      schemes: this.activeAccordion === 'schemes' ? 'open' : 'closed',
      programs: this.activeAccordion === 'programs' ? 'open' : 'closed',
    };
  }
}
