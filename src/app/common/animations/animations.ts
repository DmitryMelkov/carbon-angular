import { trigger, state, style, animate, transition } from '@angular/animations';

export const blinkAnimation = trigger('blink', [
  state('normal', style({ color: 'green' })),
  state('warning', style({ color: 'red' })),
  transition('normal <=> warning', animate('500ms ease-in-out')),
]);
