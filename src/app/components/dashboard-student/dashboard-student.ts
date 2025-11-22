import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Student } from '../../models/student.model';

@Component({
  selector: 'app-dashboard-student',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-student.html',
  styleUrl: './dashboard-student.scss',
})
export class DashboardStudentComponent implements OnInit {
  currentUser: any;
  currentStudent: Student | null = null;
  isAdmin = false;


  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.currentUser = this.authService.getCurrentUser();
    this.isAdmin = this.authService.isAdmin();
  }

  ngOnInit(): void {
    
    if (this.currentUser.role == 'STUDENT') {
      this.authService.getStudentDataBackend(
        this.currentUser.studentId.toString()
      ).subscribe(studentData => {
        this.currentStudent = studentData.data;
        this.cdr.detectChanges();
      });
    }
    
    this.cdr.detectChanges();
  }

  logout(): void {
    this.authService.logout();
  }

  
}
