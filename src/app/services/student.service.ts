import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { Student } from '../models/student.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private readonly API_URL = 'http://localhost:8081/api/students';

  constructor(private http: HttpClient) {}

  getAllStudents(): Observable<ApiResponse<Student[]>> {
    return this.http.get<ApiResponse<Student[]>>(this.API_URL);
  }

  getStudentById(id: number): Observable<ApiResponse<Student>> {
    return this.http.get<ApiResponse<Student>>(`${this.API_URL}/${id}`);
  }

  updateStudent(id: number, student: Partial<Student>): Observable<ApiResponse<Student>> {
    return this.http.put<ApiResponse<Student>>(`${this.API_URL}/${id}`, student);
  }

  deleteStudent(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/${id}`);
  }
}
