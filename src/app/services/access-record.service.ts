import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { AccessRecord, EntryRequest, ExitRequest } from '../models/access-record.model';

@Injectable({
  providedIn: 'root'
})
export class AccessRecordService {
  private readonly API_URL = 'http://localhost:8080/api/access';

  constructor(private http: HttpClient) {}

  registerEntry(request: EntryRequest): Observable<ApiResponse<AccessRecord>> {
    return this.http.post<ApiResponse<AccessRecord>>(`${this.API_URL}/entry`, request);
  }

  registerExit(request: ExitRequest): Observable<ApiResponse<AccessRecord>> {
    return this.http.post<ApiResponse<AccessRecord>>(`${this.API_URL}/exit`, request);
  }

  getAllAccessRecords(): Observable<ApiResponse<AccessRecord[]>> {
    return this.http.get<ApiResponse<AccessRecord[]>>(this.API_URL);
  }

  getAccessRecordsByStudent(studentId: number): Observable<ApiResponse<AccessRecord[]>> {
    return this.http.get<ApiResponse<AccessRecord[]>>(`${this.API_URL}/student/${studentId}`);
  }

  getAccessRecordsBySpace(spaceId: number): Observable<ApiResponse<AccessRecord[]>> {
    return this.http.get<ApiResponse<AccessRecord[]>>(`${this.API_URL}/space/${spaceId}`);
  }

  getActiveAccessRecords(): Observable<ApiResponse<AccessRecord[]>> {
    return this.http.get<ApiResponse<AccessRecord[]>>(`${this.API_URL}/active`);
  }
}