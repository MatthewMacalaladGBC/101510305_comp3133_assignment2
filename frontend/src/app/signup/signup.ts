import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { AuthService } from '../services/auth';

const SIGNUP = gql`
  mutation Signup($username: String!, $email: String!, $password: String!) {
    signup(username: $username, email: $email, password: $password) {
      message
      token
    }
  }
`;

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup implements OnInit {
  form!: FormGroup;
  loading = false;
  serverError = '';

  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      username: ['', Validators.required],
      // Validators.email checks for a valid email format (e.g. must contain @).
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get username() { return this.form.get('username'); }
  get email()    { return this.form.get('email'); }
  get password() { return this.form.get('password'); }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.loading = true;
    this.serverError = '';

    this.apollo.mutate<{ signup: { token: string } }>({
      mutation: SIGNUP,
      variables: this.form.value,
    }).subscribe({
      next: ({ data }) => {
        this.authService.setToken(data!.signup.token);
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
