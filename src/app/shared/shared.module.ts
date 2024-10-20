import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './components/button/button.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [ButtonComponent],
  exports: [ButtonComponent, NgbPaginationModule],
  imports: [CommonModule, NgbPaginationModule],
})
export class SharedModule {}
