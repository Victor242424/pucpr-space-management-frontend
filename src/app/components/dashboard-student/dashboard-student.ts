import { Component } from '@angular/core';
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
export class DashboardStudentComponent {
  currentUser: any;
  curerntStudent: Student | null = null;
  isAdmin = false;


  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    this.currentUser = this.authService.getCurrentUser();
    this.curerntStudent = this.authService.getStudentDataStorage();
    this.isAdmin = this.authService.isAdmin();
  }

  logout(): void {
    this.authService.logout();
  }
}
