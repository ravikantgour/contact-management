import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delete-confirmation-modal',
  templateUrl: './delete-confirmation-modal.component.html',
  styleUrls: ['./delete-confirmation-modal.component.scss'],
})
export class DeleteConfirmationModalComponent {
  @Input() contactName?: string; // Pass the contact name to display in modal

  constructor(public activeModal: NgbActiveModal) {}

  // Actions for the modal buttons
  confirmDeletion() {
    this.activeModal.close('confirm');
  }

  cancelDeletion() {
    this.activeModal.dismiss('cancel');
  }
}
