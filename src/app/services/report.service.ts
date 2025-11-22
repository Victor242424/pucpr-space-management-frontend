import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { OccupancyReport } from '../models/report.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private readonly API_URL = 'http://localhost:8081/api/reports';

  constructor(private http: HttpClient) {}

  getOccupancyReport(): Observable<ApiResponse<OccupancyReport[]>> {
    return this.http.get<ApiResponse<OccupancyReport[]>>(`${this.API_URL}/occupancy`);
  }

  getOccupancyReportBySpace(spaceId: number): Observable<ApiResponse<OccupancyReport>> {
    return this.http.get<ApiResponse<OccupancyReport>>(`${this.API_URL}/occupancy/space/${spaceId}`);
  }
}