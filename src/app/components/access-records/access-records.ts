import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AccessRecordService } from '../../services/access-record.service';
import { AuthService } from '../../services/auth.service';
import { AccessRecord } from '../../models/access-record.model';

@Component({
  selector: 'app-access-records',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './access-records.html',
})
export class AccessRecordsComponent implements OnInit {
  accessRecords: AccessRecord[] = [];
  filteredRecords: AccessRecord[] = [];
  isLoading = true;
  isAdmin = false;
  showModal = false;
  selectedRecord: AccessRecord | null = null;
  searchTerm = '';
  filterStatus = 'ALL';

  constructor(
    private accessRecordService: AccessRecordService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.isAdmin = this.authService.isAdmin();
  }

  ngOnInit(): void {
    this.loadAccessRecords();
  }

  loadAccessRecords(): void {
    this.isLoading = true;
    this.accessRecordService.getAllAccessRecords().subscribe({
      next: (response) => {
        if (response.success) {
          this.accessRecords = response.data;
          this.filteredRecords = this.accessRecords;
          this.applyFilters();
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading access records:', error);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.accessRecords];

    // Filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(record =>
        record.studentName.toLowerCase().includes(term) ||
        record.studentRegistrationNumber.toLowerCase().includes(term) ||
        record.spaceName.toLowerCase().includes(term) ||
        record.spaceCode.toLowerCase().includes(term)
      );
    }

    // Filter by status
    if (this.filterStatus !== 'ALL') {
      filtered = filtered.filter(record => record.status === this.filterStatus);
    }

    this.filteredRecords = filtered;
  }

  openDetailModal(record: AccessRecord): void {
    this.selectedRecord = record;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedRecord = null;
  }

  getStatusBadgeClass(status: string): string {
    const classes: any = {
      'ACTIVE': 'badge-success',
      'COMPLETED': 'badge-info',
      'CANCELLED': 'badge-danger'
    };
    return `badge ${classes[status] || 'badge-gray'}`;
  }

  getElapsedTime(entryTime: string, exitTime?: string): string {
    const entry = new Date(entryTime);
    const exit = exitTime ? new Date(exitTime) : new Date();
    const diff = exit.getTime() - entry.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }

  getDashboardLink(): string {
    return this.isAdmin ? '/dashboard' : '/dashboard-student';
  }

  exportToCSV(): void {
    const headers = ['ID', 'Student', 'Registration', 'Space', 'Code', 'Entry Time', 'Exit Time', 'Duration (min)', 'Status', 'Notes'];
    const rows = this.filteredRecords.map(record => [
      record.id,
      record.studentName,
      record.studentRegistrationNumber,
      record.spaceName,
      record.spaceCode,
      record.entryTime,
      record.exitTime || '-',
      record.durationInMinutes || '-',
      record.status,
      record.notes || '-'
    ]);

    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `access-records-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
