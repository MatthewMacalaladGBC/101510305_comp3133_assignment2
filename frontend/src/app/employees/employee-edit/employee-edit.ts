import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GraphqlService } from '../../services/graphql';

@Component({
  selector: 'app-employee-edit',
  standalone: false,
  templateUrl: './employee-edit.html',
  styleUrl: './employee-edit.css',
})
export class EmployeeEdit implements OnInit {
  form!: FormGroup;
  employeeId = '';
  loading = true;
  saving = false;
  serverError = '';

  // Existing Cloudinary URL from the fetched employee
  existingPhotoUrl: string | null = null;
  // Base64 of a newly chosen file — only set if the user picks a new photo
  newPhotoBase64: string | null = null;

  genderOptions = ['Male', 'Female', 'Other'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private gql: GraphqlService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.employeeId = this.route.snapshot.paramMap.get('id')!;

    this.form = this.fb.group({
      first_name:      ['', Validators.required],
      last_name:       ['', Validators.required],
      email:           ['', [Validators.required, Validators.email]],
      gender:          [''],
      designation:     ['', Validators.required],
      salary:          [null, [Validators.required, Validators.min(1000)]],
      date_of_joining: ['', Validators.required],
      department:      ['', Validators.required],
    });

    this.gql.getEmployeeById(this.employeeId).subscribe({
      next: (emp) => {
        this.existingPhotoUrl = emp.employee_photo ?? null;
        this.form.patchValue({
          first_name:      emp.first_name,
          last_name:       emp.last_name,
          email:           emp.email,
          gender:          emp.gender ?? '',
          designation:     emp.designation,
          salary:          emp.salary,
          date_of_joining: this.toDateInputValue(emp.date_of_joining),
          department:      emp.department,
        });
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.serverError = err.message;
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  get f() { return this.form.controls; }

  /** Converts whatever the backend returns for a date into YYYY-MM-DD for <input type="date"> */
  private toDateInputValue(raw: string): string {
    if (!raw) return '';
    return new Date(isNaN(Number(raw)) ? raw : Number(raw))
      .toISOString()
      .split('T')[0];
  }

  get previewSrc(): string | null {
    return this.newPhotoBase64 ?? this.existingPhotoUrl;
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.newPhotoBase64 = reader.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  removePhoto() {
    this.newPhotoBase64 = null;
    this.existingPhotoUrl = null;
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.saving = true;
    this.serverError = '';

    const vars: any = {
      id: this.employeeId,
      ...this.form.value,
      salary: Number(this.form.value.salary),
    };

    // Only include employee_photo if the user picked a new file
    if (this.newPhotoBase64) {
      vars.employee_photo = this.newPhotoBase64;
    }

    this.gql.updateEmployee(vars).subscribe({
      next: () => {
        this.router.navigate(['/employees', this.employeeId]);
      },
      error: (err) => {
        this.serverError = err.message;
        this.saving = false;
        this.cdr.detectChanges();
      },
    });
  }
}
