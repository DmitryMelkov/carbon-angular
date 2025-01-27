import { trigger, state, style, animate, transition } from '@angular/animations';

export const fadeInAnimation = trigger('fadeIn', [
  state('void', style({ opacity: 0 })), // Начальное состояние
  state('*', style({ opacity: 1 })), // Конечное состояние
  transition('void => *', animate('0.3s ease-in-out')), // Анимация появления
]);

export const blinkAnimation = trigger('blink', [
  state('normal', style({ color: 'green' })),
  state('warning', style({ color: 'red' })),
  transition('normal <=> warning', animate('500ms ease-in-out')),
]);

export const accordionAnimation = trigger('accordionAnimation', [
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
]);
