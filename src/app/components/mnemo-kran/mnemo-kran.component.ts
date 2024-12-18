import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-mnemo-kran',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './mnemo-kran.component.html',
  styleUrl: './mnemo-kran.component.scss'
})
export class MnemoKranComponent implements OnChanges {
  @Input() isActive: boolean | undefined = false;

  color: string = 'red';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isActive']) {
      this.color = this.isActive ? 'green' : 'red';
    }
  }
}
