import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './components/button/button.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { DeleteConfirmationModalComponent } from './components/delete-confirmation-modal/delete-confirmation-modal.component';
@NgModule({
  declarations: [ButtonComponent, DeleteConfirmationModalComponent],
  exports: [ButtonComponent, NgbPaginationModule],
  imports: [CommonModule, NgbPaginationModule],
})
export class SharedModule {}
