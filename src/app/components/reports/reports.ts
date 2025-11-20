import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReportService } from '../../services/report.service';
import { OccupancyReport } from '../../models/report.model';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './reports.html',
})
export class ReportsComponent implements OnInit {
  reports: OccupancyReport[] = [];
  isLoading = true;

  constructor(
    private reportService: ReportService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.isLoading = true;
    this.reportService.getOccupancyReport().subscribe({
      next: (response) => {
        if (response.success) {
          this.reports = response.data;
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading reports:', error);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getOccupancyColor(rate: number): string {
    if (rate < 50) return 'text-green-600';
    if (rate < 80) return 'text-yellow-600';
    return 'text-red-600';
  }

  getOccupancyBarColor(rate: number): string {
    if (rate < 50) return 'bg-green-500';
    if (rate < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  }

  calculateAverage(): number {
    if (!this.reports || this.reports.length === 0) return 0;
    const sum = this.reports.reduce((total, report) => total + report.occupancyRate, 0);
    return Number((sum / this.reports.length).toFixed(1));
  }
  calculateTotalActiveUsers(): number {
    if (!this.reports || this.reports.length === 0) return 0;
    return this.reports.reduce((sum, r) => sum + r.currentOccupancy, 0) 
  }
}
