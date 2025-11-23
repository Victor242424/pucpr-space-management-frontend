import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: any;
  let router: any;
  let cdr: ChangeDetectorRef;

  beforeEach(async () => {
    // Mock do AuthService
    authService = {
      login: vi.fn()
    };

    // Mock do Router
    router = {
      navigate: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    cdr = fixture.debugElement.injector.get(ChangeDetectorRef);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize with empty form', () => {
      expect(component.loginForm.value).toEqual({
        username: '',
        password: ''
      });
    });

    it('should have invalid form when empty', () => {
      expect(component.loginForm.valid).toBe(false);
    });

    it('should initialize isLoading as false', () => {
      expect(component.isLoading).toBe(false);
    });

    it('should initialize errorMessage as empty string', () => {
      expect(component.errorMessage).toBe('');
    });
  });

  describe('Form Validation', () => {
    it('should require username', () => {
      const username = component.loginForm.get('username');
      expect(username?.valid).toBe(false);
      expect(username?.hasError('required')).toBe(true);
    });

    it('should require password', () => {
      const password = component.loginForm.get('password');
      expect(password?.valid).toBe(false);
      expect(password?.hasError('required')).toBe(true);
    });

    it('should require password with minimum 6 characters', () => {
      const password = component.loginForm.get('password');
      password?.setValue('12345');
      expect(password?.hasError('minlength')).toBe(true);
    });

    it('should be valid when all fields are correctly filled', () => {
      component.loginForm.patchValue({
        username: 'testuser',
        password: 'password123'
      });
      expect(component.loginForm.valid).toBe(true);
    });
  });

  describe('onSubmit', () => {
    it('should not submit if form is invalid', () => {
      component.onSubmit();
      expect(authService.login).not.toHaveBeenCalled();
    });

/*     it('should set isLoading to true when submitting', () => {
      component.loginForm.patchValue({
        username: 'testuser',
        password: 'password123'
      });

      authService.login.mockReturnValue(of({ 
        success: true, 
        data: { role: 'ADMIN', token: 'fake-token' } 
      }));

      component.onSubmit();
      expect(component.isLoading).toBe(true);
    });
 */
    it('should clear error message when submitting', () => {
      component.errorMessage = 'Previous error';
      component.loginForm.patchValue({
        username: 'testuser',
        password: 'password123'
      });

      authService.login.mockReturnValue(of({ 
        success: true, 
        data: { role: 'ADMIN', token: 'fake-token' } 
      }));

      component.onSubmit();
      expect(component.errorMessage).toBe('');
    });

    it('should call authService.login with form values', () => {
      const credentials = {
        username: 'testuser',
        password: 'password123'
      };

      component.loginForm.patchValue(credentials);
      authService.login.mockReturnValue(of({ 
        success: true, 
        data: { role: 'ADMIN', token: 'fake-token' } 
      }));

      component.onSubmit();
      expect(authService.login).toHaveBeenCalledWith(credentials);
    });
  });

  describe('Login Success', () => {
    beforeEach(() => {
      component.loginForm.patchValue({
        username: 'admin',
        password: 'admin123'
      });
    });

    it('should navigate to /dashboard for ADMIN role', async () => {
      authService.login.mockReturnValue(of({
        success: true,
        data: { role: 'ADMIN', token: 'fake-token' }
      }));

      component.onSubmit();
      await fixture.whenStable();

      expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it('should navigate to /dashboard-student for STUDENT role', async () => {
      authService.login.mockReturnValue(of({
        success: true,
        data: { role: 'STUDENT', token: 'fake-token' }
      }));

      component.onSubmit();
      await fixture.whenStable();

      expect(router.navigate).toHaveBeenCalledWith(['/dashboard-student']);
    });

    it('should set isLoading to false after successful login', async () => {
      authService.login.mockReturnValue(of({
        success: true,
        data: { role: 'ADMIN', token: 'fake-token' }
      }));

      component.onSubmit();
      await fixture.whenStable();

      expect(component.isLoading).toBe(false);
    });
  });

  describe('Login Failure', () => {
    beforeEach(() => {
      component.loginForm.patchValue({
        username: 'wronguser',
        password: 'wrongpass'
      });
    });

    it('should set error message when login fails', async () => {
      const errorResponse = {
        error: { message: 'Invalid credentials' }
      };

      authService.login.mockReturnValue(throwError(() => errorResponse));

      component.onSubmit();
      await fixture.whenStable();

      expect(component.errorMessage).toBe('Invalid credentials');
    });

    it('should use default error message if none provided', async () => {
      authService.login.mockReturnValue(throwError(() => ({})));

      component.onSubmit();
      await fixture.whenStable();

      expect(component.errorMessage).toBe('Invalid username or password');
    });

    it('should set isLoading to false after error', async () => {
      authService.login.mockReturnValue(throwError(() => ({})));

      component.onSubmit();
      await fixture.whenStable();

      expect(component.isLoading).toBe(false);
    });

    it('should set error message when success is false', async () => {
      authService.login.mockReturnValue(of({
        success: false,
        message: 'Login failed'
      }));

      component.onSubmit();
      await fixture.whenStable();

      expect(component.errorMessage).toBe('Login failed');
    });
  });

  describe('navigateToRegister', () => {
    it('should navigate to /register', () => {
      component.navigateToRegister();
      expect(router.navigate).toHaveBeenCalledWith(['/register']);
    });
  });

  describe('Template Rendering', () => {
/*     it('should display error message when present', async () => {
      component.errorMessage = 'Test error message';
      fixture.detectChanges();
      await fixture.whenStable();

      const compiled = fixture.nativeElement;
      const errorDiv = compiled.querySelector('.bg-red-50');
      expect(errorDiv?.textContent?.trim()).toContain('Test error message');
    }); */

    it('should disable submit button when form is invalid', () => {
      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(button.disabled).toBe(true);
    });

    it('should enable submit button when form is valid', () => {
      component.loginForm.patchValue({
        username: 'testuser',
        password: 'password123'
      });
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(button.disabled).toBe(false);
    });

    it('should show loading text when isLoading is true', () => {
      component.isLoading = true;
      component.loginForm.patchValue({
        username: 'testuser',
        password: 'password123'
      });
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(button.textContent).toContain('Signing in...');
    });

    it('should show normal text when isLoading is false', () => {
      component.isLoading = false;
      component.loginForm.patchValue({
        username: 'testuser',
        password: 'password123'
      });
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(button.textContent).toContain('Sign In');
    });
  });

  describe('Username Field', () => {
    it('should update form value when username input changes', () => {
      const input = fixture.nativeElement.querySelector('#username');
      input.value = 'newuser';
      input.dispatchEvent(new Event('input'));

      expect(component.loginForm.get('username')?.value).toBe('newuser');
    });

    it('should show validation error when touched and empty', () => {
      const username = component.loginForm.get('username');
      username?.markAsTouched();
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const errorDiv = compiled.querySelector('.text-red-500');
      expect(errorDiv).toBeTruthy();
    });
  });

  describe('Password Field', () => {
    it('should update form value when password input changes', () => {
      const input = fixture.nativeElement.querySelector('#password');
      input.value = 'newpassword';
      input.dispatchEvent(new Event('input'));

      expect(component.loginForm.get('password')?.value).toBe('newpassword');
    });

    it('should show minlength error', () => {
      const password = component.loginForm.get('password');
      password?.setValue('123');
      password?.markAsTouched();
      fixture.detectChanges();

      expect(password?.hasError('minlength')).toBe(true);
    });
  });
});