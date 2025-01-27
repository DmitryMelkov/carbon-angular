import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ModalHeaderComponent } from '../../../../components/modal-header/modal-header.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { accordionAnimation } from '../../../../common/animations/animations';

@Component({
  selector: 'app-sushilki-documentation',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ModalHeaderComponent,
    MatExpansionModule,
  ],
  templateUrl: './sushilki-documentation-modal.component.html',
  styleUrls: ['./sushilki-documentation-modal.component.scss'],
  animations: [accordionAnimation],
})
export class SushilkiDocumentationModalComponent {
  activeAccordion: string | null = 'schemes'; // 'schemes' для открытого состояния

  schemes = [
    {
      title: 'Общие данные',
      dwg: '/content/sushilki/schemes/common_data_sushilka.dwg',
      pdf: '/content/sushilki/schemes/PDF/common_data_sushilka.pdf',
    },
    {
      title: 'Структурная схема',
      dwg: '/content/sushilki/schemes/structural_sushilka.dwg',
      pdf: '/content/sushilki/schemes/PDF/structural_sushilka.pdf',
    },
    {
      title: 'Принципиальная схема питания',
      dwg: '/content/sushilki/schemes/power_sushilka.dwg',
      pdf: '/content/sushilki/schemes/PDF/power_sushilka.pdf',
    },
    {
      title: 'Функциональная схема',
      dwg: '/content/sushilki/schemes/functional_sushilka.dwg',
      pdf: '/content/sushilki/schemes/PDF/functional_sushilka.pdf',
    },
    {
      title: 'Принципиальная схема соединений контроллера I',
      dwg: '/content/sushilki/schemes/MK-500_first_sushilka.dwg',
      pdf: '/content/sushilki/schemes/PDF/MK-500_first_sushilka.pdf',
    },
    {
      title: 'Принципиальная схема соединений контроллера II',
      dwg: '/content/sushilki/schemes/MK-500_second_sushilka.dwg',
      pdf: '/content/sushilki/schemes/PDF/MK-500_second_sushilka.pdf',
    },
    {
      title: 'Схема внешних соединений',
      dwg: '/content/sushilki/schemes/external_sushilka.dwg',
      pdf: '/content/sushilki/schemes/PDF/external_sushilka.pdf',
    },
    {
      title: 'Схема электрических соединений соединений',
      dwg: '/content/sushilki/schemes/MKC_sushilka.dwg',
      pdf: '/content/sushilki/schemes/PDF/MKC_sushilka.pdf',
    },
    {
      title: 'Сборочный чертеж',
      dwg: '/content/sushilki/schemes/assembly_sushilka.dwg',
      pdf: '/content/sushilki/schemes/PDF/assembly_sushilka.pdf',
    },
    {
      title: 'Спецификация оборудования',
      dwg: '/content/sushilki/schemes/specification_sushilka.dwg',
      pdf: '/content/sushilki/schemes/PDF/specification_sushilka.pdf',
    },
  ];

  programs = [
    {
      title: 'Тут будет программа на контроллер',
      file: '#',
    },
    {
      title: 'Тут будет программа на панельку',
      file: '#',
    },
  ];

  constructor(
    public dialogRef: MatDialogRef<SushilkiDocumentationModalComponent>,
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
