import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService
import { ContactService } from 'src/app/core/services/contact.service';
import { Contact } from '../models/contact.model';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
})
export class ContactFormComponent implements OnInit {
  contactForm!: FormGroup;
  contactId?: number;
  contact?: Contact;
  formTitle: string = 'Add Contact';
  formButton: string = 'Save';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private contactService: ContactService,
    private toastr: ToastrService // Inject ToastrService
  ) {}

  ngOnInit(): void {
    // Check if we are editing or adding a new contact
    const idParam = this.route.snapshot.paramMap.get('id');
    this.contactId = idParam ? +idParam : undefined; // Convert to number if present

    this.initForm();

    if (this.contactId != null) {
      // Editing an existing contact
      this.formTitle = 'Edit Contact';
      this.formButton = 'Update Contact';
      this.contactService
        .getContacts()
        .subscribe(
          (response: { contacts: Contact[]; totalContacts: number }) => {
            this.contact = response.contacts.find(
              (c: Contact) => c.id === this.contactId
            );
            if (this.contact) {
              this.contactForm.patchValue(this.contact);
            } else {
              console.error(`No contact found with ID ${this.contactId}`);
            }
          }
        );
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
    if (this.contactForm.invalid) {
      // Focus on the first invalid field
      const firstInvalidControl = Object.keys(this.contactForm.controls).find(
        (control) => this.contactForm.get(control)?.invalid
      );
      const firstInvalidElement = document.getElementById(
        firstInvalidControl || ''
      );
      if (firstInvalidElement) {
        firstInvalidElement.focus();
      }
      return;
    }

    if (this.contactId != null) {
      // Updating an existing contact
      const updatedContact: Contact = {
        id: this.contactId,
        ...this.contactForm.value,
      };
      this.contactService.updateContact(updatedContact).subscribe(() => {
        this.toastr.success('Contact updated successfully!', 'Success'); // Toast message on update
        this.router.navigate(['/contacts']);
      });
    } else {
      // Adding a new contact
      this.contactService.addContact(this.contactForm.value).subscribe(() => {
        this.toastr.success('Contact added successfully!', 'Success'); // Toast message on add
        this.router.navigate(['/contacts']);
      });
    }
  }
}
