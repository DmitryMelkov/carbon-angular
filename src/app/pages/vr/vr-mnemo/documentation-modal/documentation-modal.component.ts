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
  selector: 'app-documentation-modal-vr',
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
      dwg: '../content/vr/schemes/common_data_vr.dwg',
      pdf: '../content/vr/schemes/PDF/common_data_vr.pdf',
    },
    {
      title: 'Структурная схема',
      dwg: '../content/vr/schemes/structural_vr.dwg',
      pdf: '../content/vr/schemes/PDF/structural_vr.pdf',
    },
    {
      title: 'Принципиальная схема питания',
      dwg: '../content/vr/schemes/power_vr.dwg',
      pdf: '../content/vr/schemes/PDF/power_vr.pdf',
    },
    {
      title: 'Функциональная схема',
      dwg: '../content/vr/schemes/functional_vr.dwg',
      pdf: '../content/vr/schemes/PDF/functional_vr.pdf',
    },
    {
      title: 'Принципиальная схема соединений контроллера I',
      dwg: '../content/vr/schemes/MK-500_first_vr.dwg',
      pdf: '../content/vr/schemes/PDF/MK-500_first_vr.pdf',
    },
    {
      title: 'Принципиальная схема соединений контроллера II',
      dwg: '../content/vr/schemes/MK-500_second_vr.dwg',
      pdf: '../content/vr/schemes/PDF/MK-500_second_vr.pdf',
    },
    {
      title: 'Принципиальная схема соединений термодата',
      dwg: '../content/vr/schemes/termodat_vr.dwg',
      pdf: '../content/vr/schemes/PDF/termodat_vr.pdf',
    },
    {
      title: 'Принципиальная схема соединений ИМ2300',
      dwg: '../content/vr/schemes/im2300_vr.dwg',
      pdf: '../content/vr/schemes/PDF/im2300_vr.pdf',
    },
    {
      title: 'Схема внешних соединений I',
      dwg: '../content/vr/schemes/external1_vr.dwg',
      pdf: '../content/vr/schemes/PDF/external1_vr.pdf',
    },
    {
      title: 'Схема внешних соединений II',
      dwg: '../content/vr/schemes/external2_vr.dwg',
      pdf: '../content/vr/schemes/PDF/external2_vr.pdf',
    },
    {
      title: 'Схема электрических соединений',
      dwg: '../content/vr/schemes/MKC_vr.dwg',
      pdf: '../content/vr/schemes/PDF/MKC_vr.pdf',
    },
    {
      title: 'Сборочный чертеж',
      dwg: '../content/vr/schemes/assembly_vr.dwg',
      pdf: '../content/vr/schemes/PDF/assembly_vr.pdf',
    },
    {
      title: 'Спецификация оборудования',
      dwg: '../content/vr/schemes/specification_vr.dwg',
      pdf: '../content/vr/schemes/PDF/specification_vr.pdf',
    },
  ];

  docs = [
    {
      title: 'Руководства по эксплуатации',
      file: '../content/vr/docs/re_air.pdf',
    }
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
      docs: this.activeAccordion === 'docs' ? 'open' : 'closed',
    };
  }
}
