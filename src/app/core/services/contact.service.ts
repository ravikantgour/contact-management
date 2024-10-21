import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Contact } from '../../features/contact/models/contact.model';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Get paginated contacts
  getContacts(
    pageIndex: number = 0,
    pageSize: number = 10
  ): Observable<{ contacts: Contact[]; totalContacts: number }> {
    const url = `${this.apiUrl}?pageIndex=${pageIndex}&pageSize=${pageSize}`;
    return this.http.get<{ data: Contact[]; totalCount: number }>(url).pipe(
      map((response) => ({
        contacts: response.data,
        totalContacts: response.totalCount,
      })),
      catchError(this.handleError) // Error handling for API call
    );
  }

  // Get contact by ID (optimized for edit scenario)
  getContactById(id: number): Observable<Contact> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Contact>(url).pipe(catchError(this.handleError));
  }

  // Add new contact
  addContact(contact: Contact): Observable<Contact> {
    return this.http
      .post<Contact>(this.apiUrl, contact)
      .pipe(catchError(this.handleError));
  }

  // Update an existing contact
  updateContact(contact: Contact): Observable<Contact> {
    const url = `${this.apiUrl}/${contact.id}`;
    return this.http
      .put<Contact>(url, contact)
      .pipe(catchError(this.handleError));
  }

  // Delete a contact
  deleteContact(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url).pipe(catchError(this.handleError));
  }

  // Common error handling method
  private handleError(error: any): Observable<never> {
    console.error('API error: ', error);
    return throwError(() => new Error(error.message || 'An error occurred'));
  }
}
