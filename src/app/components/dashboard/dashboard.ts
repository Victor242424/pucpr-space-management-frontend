import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SpaceService } from '../../services/space.service';
import { AccessRecordService } from '../../services/access-record.service';
import { ReportService } from '../../services/report.service';
import { Space } from '../../models/space.model';
import { AccessRecord } from '../../models/access-record.model';
import { OccupancyReport } from '../../models/report.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
})
export class DashboardComponent implements OnInit {
  currentUser: any;
  spaces: Space[] = [];
  activeAccess: AccessRecord[] = [];
  occupancyReports: OccupancyReport[] = [];
  isLoading = true;
  isAdmin = false;

  stats = {
    totalSpaces: 0,
    availableSpaces: 0,
    occupiedSpaces: 0,
    activeUsers: 0
  };

  constructor(
    private authService: AuthService,
    private spaceService: SpaceService,
    private accessRecordService: AccessRecordService,
    private reportService: ReportService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.currentUser = this.authService.getCurrentUser();
    this.isAdmin = this.authService.isAdmin();
  }

  ngOnInit(): void {
    this.loadDashboardData();
    this.cdr.detectChanges(); 
  }

  loadDashboardData(): void {
    this.isLoading = true;

    this.spaceService.getAllSpaces().subscribe({
      next: (response) => {
        if (response.success) {
          this.spaces = response.data;
          this.calculateStats();
          this.cdr.detectChanges(); 
        }
      },
      error: (error) => {
        console.error('Error loading spaces:', error)
        this.cdr.detectChanges(); 
      } 
    });

    this.accessRecordService.getActiveAccessRecords().subscribe({
      next: (response) => {
        if (response.success) {
          this.activeAccess = response.data;
          this.stats.activeUsers = this.activeAccess.length;
          this.cdr.detectChanges(); 
        }
      },
      error: (error) => {
        console.error('Error loading active access:', error)
        this.cdr.detectChanges(); 
      } 
    });

    this.reportService.getOccupancyReport().subscribe({
      next: (response) => {
        if (response.success) {
          this.occupancyReports = response.data;
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

  calculateStats(): void {
    this.stats.totalSpaces = this.spaces.length;
    this.stats.availableSpaces = this.spaces.filter(s => s.status === 'AVAILABLE').length;
    this.stats.occupiedSpaces = this.spaces.filter(s => s.status === 'OCCUPIED').length;
  }

  getSpaceTypeLabel(type: string): string {
    const labels: any = {
      'CLASSROOM': 'Classroom',
      'LABORATORY': 'Laboratory',
      'STUDY_ROOM': 'Study Room'
    };
    return labels[type] || type;
  }

  getStatusBadgeClass(status: string): string {
    const classes: any = {
      'AVAILABLE': 'badge-success',
      'OCCUPIED': 'badge-warning',
      'MAINTENANCE': 'badge-danger',
      'UNAVAILABLE': 'badge-gray'
    };
    return `badge ${classes[status] || 'badge-gray'}`;
  }

  getOccupancyColor(rate: number): string {
    if (rate < 50) return 'text-green-600';
    if (rate < 80) return 'text-yellow-600';
    return 'text-red-600';
  }

  logout(): void {
    this.authService.logout();
  }
}
