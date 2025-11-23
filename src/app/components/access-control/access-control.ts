import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AccessRecordService } from '../../services/access-record.service';
import { SpaceService } from '../../services/space.service';
import { StudentService } from '../../services/student.service';
import { AuthService } from '../../services/auth.service';
import { Space } from '../../models/space.model';
import { Student } from '../../models/student.model';
import { AccessRecord } from '../../models/access-record.model';

@Component({
  selector: 'app-access-control',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './access-control.html',
})
export class AccessControlComponent implements OnInit {
  entryForm: FormGroup;
  exitForm: FormGroup;
  spaces: Space[] = [];
  students: Student[] = [];
  activeRecords: AccessRecord[] = [];
  isLoading = true;
  successMessage = '';
  errorMessage = '';
  currentUser: any;
  isAdmin = false;

  constructor(
    private fb: FormBuilder,
    private accessRecordService: AccessRecordService,
    private spaceService: SpaceService,
    private studentService: StudentService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef

  ) {
    this.currentUser = this.authService.getCurrentUser();
    this.isAdmin = this.authService.isAdmin();

    this.entryForm = this.fb.group({
      studentId: [this.currentUser?.studentId || '', Validators.required],
      spaceId: ['', Validators.required],
      notes: ['']
    });

    this.exitForm = this.fb.group({
      accessRecordId: ['', Validators.required],
      notes: ['']
    });
  }


  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.cdr.detectChanges(); 

    this.spaceService.getAllSpaces().subscribe({
      next: (response) => {
        if (response.success) {
          this.spaces = response.data.filter(s => s.status === 'AVAILABLE' || s.status === 'OCCUPIED');
          this.cdr.detectChanges(); 
        }
      },
      error: (error) => {
        console.error('Error loading spaces:', error);
        this.cdr.detectChanges(); 
      }
    });

    if (this.isAdmin) {
      this.studentService.getAllStudents().subscribe({
        next: (response) => {
          if (response.success) {
            this.students = response.data.filter(s => s.status === 'ACTIVE');
            this.cdr.detectChanges(); 

          }
        },
        error: (error) => {
          console.error('Error loading students:', error);
          this.cdr.detectChanges(); 
        } 
      });
    }
    this.loadActiveRecords();
  }

  loadActiveRecords(): void {
    this.accessRecordService.getActiveAccessRecords().subscribe({
      next: (response) => {
        if (response.success) {
          this.activeRecords = response.data;
          
          // Filter to show only current user's records if not admin
          if (!this.isAdmin && this.currentUser?.studentId) {
            this.activeRecords = this.activeRecords.filter(
              record => record.studentId === this.currentUser.studentId
            );
          }
        }
        this.isLoading = false;
        this.cdr.detectChanges(); 
      },
      error: (error) => {
        console.error('Error loading active records:', error);
        this.isLoading = false;
        this.cdr.detectChanges(); 
      }
    });
  }

  registerEntry(): void {
    if (this.entryForm.invalid) return;

    this.errorMessage = '';
    this.successMessage = '';
    this.cdr.detectChanges(); 

    this.accessRecordService.registerEntry(this.entryForm.value).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = 'Entry registered successfully!';
          this.entryForm.patchValue({ spaceId: '', notes: '' });
          this.loadData();
          setTimeout(() => this.successMessage = '', 3000);
        }
        this.cdr.detectChanges(); 
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to register entry';
        this.cdr.detectChanges(); 
      }
    });
  }

  registerExit(): void {
    if (this.exitForm.invalid) return;

    this.errorMessage = '';
    this.successMessage = '';
    this.cdr.detectChanges(); 

    this.accessRecordService.registerExit(this.exitForm.value).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = 'Exit registered successfully!';
          this.exitForm.reset();
          this.loadData();
          setTimeout(() => this.successMessage = '', 3000);
          this.cdr.detectChanges(); 
        }
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to register exit';
        this.cdr.detectChanges(); 
      }
    });
  }

  quickExit(recordId: number): void {
    this.exitForm.patchValue({ accessRecordId: recordId });
    this.registerExit();
  }

  getElapsedTime(entryTime: string): string {
    const entry = new Date(entryTime);
    const now = new Date();
    const diff = now.getTime() - entry.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }

  getSpaceName(spaceId: number): string {
    const space = this.spaces.find(s => s.id === spaceId);
    return space?.name || 'Unknown';
  }

  getDashboardLink(): string {
    return this.isAdmin ? '/dashboard' : '/dashboard-student';
  }
}
