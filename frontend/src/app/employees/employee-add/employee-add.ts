import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GraphqlService } from '../../services/graphql';

@Component({
  selector: 'app-employee-add',
  standalone: false,
  templateUrl: './employee-add.html',
  styleUrl: './employee-add.css',
})
export class EmployeeAdd implements OnInit {
  form!: FormGroup;
  loading = false;
  serverError = '';
  photoPreview: string | null = null;
  photoBase64: string | null = null;

  genderOptions = ['Male', 'Female', 'Other'];

  constructor(
    private fb: FormBuilder,
    private gql: GraphqlService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
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
  }

  get f() { return this.form.controls; }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.photoPreview = reader.result as string;
      this.photoBase64 = reader.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  removePhoto() {
    this.photoPreview = null;
    this.photoBase64 = null;
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.loading = true;
    this.serverError = '';

    const vars = {
      ...this.form.value,
      salary: Number(this.form.value.salary),
      employee_photo: this.photoBase64 ?? undefined,
    };

    this.gql.addEmployee(vars).subscribe({
      next: () => {
        this.router.navigate(['/employees']);
      },
      error: (err) => {
        this.serverError = err.message;
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
