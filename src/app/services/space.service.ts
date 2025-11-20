import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { Space } from '../models/space.model';

@Injectable({
  providedIn: 'root'
})
export class SpaceService {
  private readonly API_URL = 'http://localhost:8080/api/spaces';

  constructor(private http: HttpClient) {}

  getAllSpaces(): Observable<ApiResponse<Space[]>> {
    return this.http.get<ApiResponse<Space[]>>(this.API_URL);
  }

  getSpaceById(id: number): Observable<ApiResponse<Space>> {
    return this.http.get<ApiResponse<Space>>(`${this.API_URL}/${id}`);
  }

  createSpace(space: Partial<Space>): Observable<ApiResponse<Space>> {
    return this.http.post<ApiResponse<Space>>(this.API_URL, space);
  }

  updateSpace(id: number, space: Partial<Space>): Observable<ApiResponse<Space>> {
    return this.http.put<ApiResponse<Space>>(`${this.API_URL}/${id}`, space);
  }

  deleteSpace(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/${id}`);
  }
}