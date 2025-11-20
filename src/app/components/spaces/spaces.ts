import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SpaceService } from '../../services/space.service';
import { AuthService } from '../../services/auth.service';
import { Space, SpaceType, SpaceStatus } from '../../models/space.model';

@Component({
  selector: 'app-spaces',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule ],
  templateUrl: './spaces.html',
})
export class SpacesComponent implements OnInit {
  spaces: Space[] = [];
  filteredSpaces: Space[] = [];
  isLoading = true;
  isAdmin = false;
  showModal = false;
  isEditMode = false;
  spaceForm: FormGroup;
  selectedSpace: Space | null = null;
  searchTerm = '';

  spaceTypes = Object.values(SpaceType);
  spaceStatuses = Object.values(SpaceStatus);

  constructor(
    private spaceService: SpaceService,
    private authService: AuthService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.isAdmin = this.authService.isAdmin();
    this.spaceForm = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      type: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]],
      building: [''],
      floor: [''],
      description: [''],
      status: ['AVAILABLE']
    });
  }

  ngOnInit(): void {
    this.loadSpaces();
    this.cdr.detectChanges();
  }

  loadSpaces(): void {
    this.isLoading = true;
    this.spaceService.getAllSpaces().subscribe({
      next: (response) => {
        if (response.success) {
          this.spaces = response.data;
          this.filteredSpaces = this.spaces;
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading spaces:', error);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  filterSpaces(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredSpaces = this.spaces.filter(space =>
      space.name.toLowerCase().includes(term) ||
      space.code.toLowerCase().includes(term) ||
      space.building?.toLowerCase().includes(term)
    );
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.selectedSpace = null;
    this.spaceForm.reset({ status: 'AVAILABLE' });
    this.showModal = true;
  }

  openEditModal(space: Space): void {
    this.isEditMode = true;
    this.selectedSpace = space;
    this.spaceForm.patchValue(space);
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.spaceForm.reset();
  }

  onSubmit(): void {
    if (this.spaceForm.invalid) return;

    const spaceData = this.spaceForm.value;

    if (this.isEditMode && this.selectedSpace) {
      this.spaceService.updateSpace(this.selectedSpace.id, spaceData).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadSpaces();
            this.closeModal();
          }
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error updating space:', error)
          this.cdr.detectChanges();
        } 
      });
    } else {
      this.spaceService.createSpace(spaceData).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadSpaces();
            this.closeModal();
          }
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error creating space:', error)
          this.cdr.detectChanges();
        } 
      });
    }
  }

  deleteSpace(space: Space): void {
    if (confirm(`Are you sure you want to delete ${space.name}?`)) {
      this.spaceService.deleteSpace(space.id).subscribe({
        next: (response) => {
          console.log(response);
          debugger;
          this.loadSpaces();
          this.cdr.detectChanges();
        },
        error: (error) => {
          debugger;
          console.error('Error deleting space:', error)
          this.cdr.detectChanges();
        } 
      });
    }
  }

  getStatusBadgeClass(status: string): string {
    const classes: any = {
      'AVAILABLE': 'badge-success',
      'OCCUPIED': 'badge-warning',
      'MAINTENANCE': 'badge-danger',
      'UNAVAILABLE': 'badge-gray'
    };
    return `badge ${classes[status]}`;
  }

  getTypeLabel(type: string): string {
    const labels: any = {
      'CLASSROOM': 'Classroom',
      'LABORATORY': 'Laboratory',
      'STUDY_ROOM': 'Study Room'
    };
    return labels[type] || type;
  }
}
