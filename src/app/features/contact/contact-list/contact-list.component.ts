import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Contact } from '../models/contact.model';
import { ContactService } from 'src/app/core/services/contact.service';
import { DeleteConfirmationModalComponent } from 'src/app/shared/components/delete-confirmation-modal/delete-confirmation-modal.component';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss'],
})
export class ContactListComponent implements OnInit {
  contacts: Contact[] = [];
  pageIndex: number = 1; // Start with the first page
  pageSize: number = 10; // Number of contacts per page
  totalContacts: number = 0; // Will be updated by the API response

  constructor(
    private contactService: ContactService,
    private router: Router,
    private modalService: NgbModal // Inject NgbModal service
  ) {}

  ngOnInit(): void {
    this.loadContacts();
  }

  // Load contacts based on pageIndex and pageSize
  loadContacts(): void {
    this.contactService
      .getContacts(this.pageIndex - 1, this.pageSize)
      .subscribe({
        next: (response: { contacts: Contact[]; totalContacts: number }) => {
          this.contacts = response.contacts;
          this.totalContacts = response.totalContacts;
          console.log('Contacts Loaded:', this.contacts);
        },
        error: (error) => {
          console.error('Error fetching contacts:', error);
        },
      });
  }

  // Navigate to edit page
  editContact(contact: Contact): void {
    this.router.navigate(['/contacts/edit', contact.id]);
  }

  // Open the modal for contact deletion confirmation
  openDeleteModal(contact: Contact): void {
    const modalRef = this.modalService.open(DeleteConfirmationModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.contactName = `${contact.firstName} ${contact.lastName}`;

    modalRef.result
      .then((result) => {
        if (result === 'confirm') {
          this.deleteContact(contact.id);
        }
      })
      .catch((error) => {
        console.log('Modal dismissed', error);
      });
  }

  // Delete contact and reload the list
  deleteContact(id: number): void {
    this.contactService.deleteContact(id).subscribe({
      next: () => {
        this.loadContacts(); // Reload contacts after deletion
      },
      error: (error) => {
        console.error('Error deleting contact:', error);
      },
    });
  }

  // Handle page change event
  onPageChange(page: number): void {
    this.pageIndex = page;
    this.loadContacts();
  }
}
