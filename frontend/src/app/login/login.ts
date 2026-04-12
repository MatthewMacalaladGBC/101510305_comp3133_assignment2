import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { AuthService } from '../services/auth';

// LOGIN is a Query (not Mutation) because that is how Assignment 1 defined it.
// apollo.query() is used instead of apollo.mutate() for the same reason.
const LOGIN = gql`
  query Login($username: String, $password: String!) {
    login(username: $username, password: $password) {
      message
      token
    }
  }
`;

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
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
    // FormBuilder.group() creates a FormGroup.
    // Each key maps to a FormControl with an initial value and an array of validators.
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  get username() { return this.form.get('username'); }
  get password() { return this.form.get('password'); }

  submit() {
    // Touching all controls forces validation messages to appear on submit
    // even if the user never focused a field.
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.loading = true;
    this.serverError = '';

    this.apollo.query<{ login: { token: string } }>({
      query: LOGIN,
      variables: this.form.value,
      // Bypass Apollo's cache so login always hits the server.
      fetchPolicy: 'no-cache',
    }).subscribe({
      next: ({ data }) => {
        this.authService.setToken(data!.login.token);
        this.router.navigate(['/employees']);
      },
      error: (err) => {
        // GraphQL errors surface here as err.message via Apollo's error policy.
        this.serverError = err.message;
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
