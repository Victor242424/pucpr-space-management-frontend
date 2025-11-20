import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges(); 

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        if (response.success) {
          if (response.data.role === 'ADMIN') {
            this.router.navigate(['/dashboard']);
          } else if (response.data.role === 'STUDENT') {
            this.router.navigate(['/dashboard-student']);
          }
        } else {
          this.errorMessage = response.message || 'Login failed';
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Invalid username or password';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }
}