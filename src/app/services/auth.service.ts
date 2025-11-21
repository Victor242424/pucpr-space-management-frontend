import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { LoginRequest, AuthResponse } from '../models/auth.model';
import { ApiResponse } from '../models/api-response.model';
import { CreateStudentRequest, Student } from '../models/student.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';
  private readonly STUDENT_KEY = 'student_data';

  
  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(this.getUserData());
  private currentStudent = new BehaviorSubject<Student | null>(this.getStudentDataStorage());
  public currentStudent$ = this.currentUserSubject.asObservable();
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(credentials: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.API_URL}/auth/login`, credentials)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.setSession(response.data);
            this.currentUserSubject.next(response.data);
            if (response.data.role === 'STUDENT') {
              this.getStudentDataBackend(response.data.studentId!.toString()).subscribe();
            }
          }
        })
      );
  }

  register(data: CreateStudentRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.API_URL}/auth/register`, data);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.STUDENT_KEY);
    this.currentUserSubject.next(null);
    this.currentStudent.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  isAdmin(): boolean {
    const user = this.getUserData();
    return user?.role === 'ADMIN';
  }

  getCurrentUser(): AuthResponse | null {
    return this.currentUserSubject.value;
  }

  private setSession(authResult: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, authResult.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(authResult));
  }

  private getUserData(): AuthResponse | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }


  getStudentDataBackend(student_id: String): Observable<ApiResponse<Student>> {
    return this.http.get<ApiResponse<Student>>(`${this.API_URL}/students/${student_id}`)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            localStorage.setItem(this.STUDENT_KEY,JSON.stringify(response.data));
            this.currentStudent.next(response.data);
          }
        })
      );
  }

  getStudentDataStorage(): Student | null {
    const studentData = localStorage.getItem(this.STUDENT_KEY);
    return studentData ? JSON.parse(studentData) : null;
  }
}