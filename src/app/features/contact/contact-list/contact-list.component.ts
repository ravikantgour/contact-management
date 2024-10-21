import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Contact } from '../models/contact.model';
import { ContactService } from 'src/app/core/services/contact.service';
import { DeleteConfirmationModalComponent } from 'src/app/shared/components/delete-confirmation-modal/delete-confirmation-modal.component';
import { ToastrService } from 'ngx-toastr';
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
  sortField: string = 'id'; // Default sort field
  sortOrder: 'asc' | 'desc' = 'asc'; // Default sort order
  loading: boolean = false;

  constructor(
    private contactService: ContactService,
    private router: Router,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadContacts();
  }

  // Load contacts based on pageIndex, pageSize, and sort options
  loadContacts(): void {
    this.loading = true;
    this.contactService
      .getContacts(this.pageIndex - 1, this.pageSize)
      .subscribe({
        next: (response: { contacts: Contact[]; totalContacts: number }) => {
          this.contacts = response.contacts;
          this.totalContacts = response.totalContacts;
          this.sortContacts(this.sortField, false); // Sort by the default field
        },
        error: (error) => {
          this.toastr.error('Error fetching contacts', 'Error');
        },
        complete: () => {
          this.loading = false; // Hide the loading spinner once data is loaded
        },
      });
  }

  // Sort contacts based on selected field and order
  sortContacts(field: string, resetPage: boolean = true): void {
    if (this.sortField === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'; // Toggle sort order
    } else {
      this.sortField = field;
      this.sortOrder = 'asc'; // Default to ascending if sorting by a new field
    }

    this.contacts.sort((a, b) => {
      let valA = a[field as keyof Contact];
      let valB = b[field as keyof Contact];

      // Check if the value is a string, then convert to lowercase for case-insensitive comparison
      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
      }
      if (typeof valB === 'string') {
        valB = valB.toLowerCase();
      }

      // Compare values based on the current sort order
      if (this.sortOrder === 'asc') {
        return valA < valB ? -1 : valA > valB ? 1 : 0;
      } else {
        return valA > valB ? -1 : valA < valB ? 1 : 0;
      }
    });

    // Reset the page to the first page if sort is changed
    if (resetPage) {
      this.pageIndex = 1;
    }
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
        this.toastr.error('Modal dismissed', 'Error');
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
