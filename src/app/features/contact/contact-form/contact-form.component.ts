import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactService } from 'src/app/core/services/contact.service';
import { Contact } from '../models/contact.model';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
})
export class ContactFormComponent implements OnInit {
  contactForm!: FormGroup;
  contactId?: number;
  contact?: Contact;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private contactService: ContactService
  ) {}

  ngOnInit(): void {
    // Check if we are editing or adding a new contact
    const idParam = this.route.snapshot.paramMap.get('id');
    this.contactId = idParam ? +idParam : undefined; // Convert to number if present

    this.initForm();

    if (this.contactId != null) {
      // Editing an existing contact
      this.contactService.getContacts().subscribe((contacts) => {
        this.contact = contacts.find((c) => c.id === this.contactId);
        if (this.contact) {
          this.contactForm.patchValue(this.contact);
        } else {
          console.error(`No contact found with ID ${this.contactId}`);
        }
      });
    }
  }

  initForm(): void {
    this.contactForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      if (this.contactId != null) {
        // Updating an existing contact
        const updatedContact: Contact = {
          id: this.contactId,
          ...this.contactForm.value,
        };
        this.contactService.updateContact(updatedContact).subscribe(() => {
          this.router.navigate(['/contacts']);
        });
      } else {
        // Adding a new contact
        this.contactService.addContact(this.contactForm.value).subscribe(() => {
          this.router.navigate(['/contacts']);
        });
      }
    }
  }
}