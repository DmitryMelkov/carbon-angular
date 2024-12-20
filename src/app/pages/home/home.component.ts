import { Component } from '@angular/core';
import { SushilkaMnemoComponent } from '../sushilki/sushilka-mnemo/sushilka-mnemo.component';
import { SushilkaComponent } from '../sushilki/sushilka-current/sushilka.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [SushilkaMnemoComponent, SushilkaComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  selectedTab: string = 'sushilka1'; // Начальный выбранный таб
  selectedContent: string = ''; // Хранит выбранный контент
  id: string = 'sushilka1'; // Пример ID, который можно изменить в зависимости от выбранного таба

  selectTab(tab: string) {
    this.selectedTab = tab;
    this.id = tab; // Устанавливаем ID в зависимости от выбранного таба
    this.selectedContent = ''; // Сбросить контент при переключении табов
  }

  loadContent(contentType: string) {
    this.selectedContent = contentType; // Устанавливаем выбранный контент
  }
}
