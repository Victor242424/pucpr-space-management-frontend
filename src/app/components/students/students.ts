import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StudentService } from '../../services/student.service';
import { AuthService } from '../../services/auth.service';
import { Student, StudentStatus } from '../../models/student.model';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  templateUrl: './students.html',
})
export class StudentsComponent implements OnInit {
  students: Student[] = [];
  filteredStudents: Student[] = [];
  isLoading = true;
  isAdmin = false;
  showModal = false;
  isEditMode = false;
  studentForm: FormGroup;
  selectedStudent: Student | null = null;
  searchTerm = '';

  studentStatuses = Object.values(StudentStatus);

  constructor(
    private studentService: StudentService,
    private authService: AuthService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.isAdmin = this.authService.isAdmin();
    this.studentForm = this.fb.group({
      registrationNumber: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      status: ['ACTIVE']
    });
  }

  ngOnInit(): void {
    this.loadStudents();
    this.cdr.detectChanges();
  }

  loadStudents(): void {
    this.isLoading = true;
    this.studentService.getAllStudents().subscribe({
      next: (response) => {
        if (response.success) {
          this.students = response.data;
          this.filteredStudents = this.students;
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erro ao carregar estudantes:', error);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  filterStudents(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredStudents = this.students.filter(student =>
      student.name.toLowerCase().includes(term) ||
      student.registrationNumber.toLowerCase().includes(term) ||
      student.email.toLowerCase().includes(term)
    );
  }

  openEditModal(student: Student): void {
    this.isEditMode = true;
    this.selectedStudent = student;
    this.studentForm.patchValue(student);
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.studentForm.reset();
  }

  onSubmit(): void {
    if (this.studentForm.invalid) return;

    const studentData = this.studentForm.value;

    if (this.isEditMode && this.selectedStudent) {
      this.studentService.updateStudent(this.selectedStudent.id, studentData).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadStudents();
            this.closeModal();
          }
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Erro ao atualizar estudante:', error);
          this.cdr.detectChanges();
        }
      });
    }
  }

  deleteStudent(student: Student): void {
    if (confirm(`Tem certeza que deseja excluir ${student.name}?`)) {
      this.studentService.deleteStudent(student.id).subscribe({
        next: () => {
          this.loadStudents();
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Erro ao excluir estudante:', error);
          this.cdr.detectChanges();
        }
      });
    }
  }

  getStatusBadgeClass(status: string): string {
    const classes: any = {
      'ACTIVE': 'badge-success',
      'INACTIVE': 'badge-gray',
      'SUSPENDED': 'badge-danger'
    };
    return `badge ${classes[status]}`;
  }

  getStatusLabel(status: string): string {
    const labels: any = {
      'ACTIVE': 'Ativo',
      'INACTIVE': 'Inativo',
      'SUSPENDED': 'Suspenso'
    };
    return labels[status] || status;
  }
}