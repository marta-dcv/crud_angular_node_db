import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../models/student.model';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private http = inject(HttpClient);
  private API = 'http://localhost:3000/students';

  getAll(search = ''): Observable<Student[]> {
    return this.http.get<Student[]>(this.API, {
      params: search ? { search } : {}
    });
  }

  create(data: Omit<Student, 'id' | 'created_at'>) {
    return this.http.post(this.API, data);
  }

  update(id: number, data: Omit<Student, 'id' | 'created_at'>) {
    return this.http.put(`${this.API}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.API}/${id}`);
  }
}
