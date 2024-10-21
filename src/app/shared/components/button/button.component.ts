import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input() label: string = '';
  @Input() btnClass: string = 'btn-primary';
  @Input() type: string = 'button';
  @Input() ariaLabel: string = '';
  @Input() ariaHaspopup: boolean | null = null;
  @Input() role: string = 'button';
  @Input() disabled: boolean = false;
  @Input() ariaExpanded: boolean | null = null;
  @Input() tabIndex: number = 0;
}
