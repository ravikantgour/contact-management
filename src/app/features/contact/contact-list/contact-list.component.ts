import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Contact } from '../models/contact.model';
import { ContactService } from 'src/app/core/services/contact.service';

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

  constructor(private contactService: ContactService, private router: Router) {}

  ngOnInit(): void {
    this.loadContacts();
  }

  // Method to load contacts based on pageIndex and pageSize
  loadContacts(): void {
    this.contactService
      .getContacts(this.pageIndex - 1, this.pageSize)
      .subscribe({
        next: (response: { contacts: Contact[]; totalContacts: number }) => {
          this.contacts = response.contacts; // Extract contacts
          this.totalContacts = response.totalContacts; // Extract total contacts for pagination
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

  // Handle contact deletion
  deleteContact(id: number): void {
    if (confirm('Are you sure you want to delete this contact?')) {
      this.contactService.deleteContact(id).subscribe({
        next: () => {
          this.loadContacts(); // Reload the contacts after deletion
        },
        error: (error) => {
          console.error('Error deleting contact:', error);
        },
      });
    }
  }

  // Handle page change event for pagination
  onPageChange(page: number): void {
    this.pageIndex = page;
    this.loadContacts();
  }
}
