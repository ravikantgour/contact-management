import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact } from '../../features/contact/models/contact.model';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private apiUrl = 'http://localhost:5225/api/contact';

  constructor(private http: HttpClient) {}

  getContacts(
    pageIndex: number = 0,
    pageSize: number = 10
  ): Observable<Contact[]> {
    const url = `${this.apiUrl}?pageIndex=${pageIndex}&pageSize=${pageSize}`;
    return this.http.get<{ contacts: Contact[] }>(url).pipe(
      map((data) => data.contacts) // Extract only the contacts array
    );
  }

  addContact(contact: Contact): Observable<Contact> {
    return this.http.post<Contact>(this.apiUrl, contact);
  }

  updateContact(contact: Contact): Observable<Contact> {
    const url = `${this.apiUrl}/${contact.id}`;
    return this.http.put<Contact>(url, contact);
  }

  deleteContact(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
