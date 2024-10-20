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
  ): Observable<{ contacts: Contact[]; totalContacts: number }> {
    const url = `${this.apiUrl}?pageIndex=${pageIndex}&pageSize=${pageSize}`;
    return this.http.get<{ data: Contact[]; totalCount: number }>(url).pipe(
      map((response) => ({
        contacts: response.data, // Rename 'data' to 'contacts'
        totalContacts: response.totalCount, // Rename 'totalCount' to 'totalContacts'
      }))
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
