import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Import Router
import { Contact } from '../models/contact.model';
import { ContactService } from 'src/app/core/services/contact.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss'],
})
export class ContactListComponent implements OnInit {
  contacts: Contact[] = [];
  pageIndex: number = 1;
  pageSize: number = 10;
  totalContacts: number = 0;

  constructor(private contactService: ContactService, private router: Router) {} // Inject Router

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(): void {
    this.contactService
      .getContacts(this.pageIndex - 1, this.pageSize)
      .subscribe({
        next: (contacts: Contact[]) => {
          this.contacts = contacts;
          this.totalContacts = 100; // Simulate total contacts (replace with API response later)
        },
        error: (error) => {
          console.error('Error fetching contacts:', error);
        },
      });
  }

  // Handle Edit Contact (navigate to edit page with the contact id)
  editContact(contact: Contact): void {
    this.router.navigate(['/contacts/edit', contact.id]); // Navigate to the edit page
  }

  deleteContact(id: number): void {
    if (confirm('Are you sure you want to delete this contact?')) {
      this.contactService.deleteContact(id).subscribe({
        next: () => {
          this.loadContacts();
        },
        error: (error) => {
          console.error('Error deleting contact:', error);
        },
      });
    }
  }

  onPageChange(page: number): void {
    this.pageIndex = page;
    this.loadContacts();
  }
}
