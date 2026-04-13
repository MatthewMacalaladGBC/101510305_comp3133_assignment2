import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { GraphqlService } from '../../services/graphql';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-employee-list',
  standalone: false,
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css',
})
export class EmployeeList implements OnInit {
  employees: any[] = [];
  displayedColumns = ['name', 'email', 'department', 'designation', 'salary', 'actions'];
  loading = false;
  error = '';
  searchDept = '';
  searchDesig = '';

  constructor(
    private gql: GraphqlService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadAll();
  }

  loadAll() {
    this.loading = true;
    this.error = '';
    this.gql.getAllEmployees().subscribe({
      next: (data) => {
        this.employees = data ?? [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  search() {
    if (!this.searchDept && !this.searchDesig) {
      this.loadAll();
      return;
    }
    this.loading = true;
    this.error = '';
    this.gql.searchEmployee(
      this.searchDesig || undefined,
      this.searchDept || undefined
    ).subscribe({
      next: (data) => {
        this.employees = data ?? [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  clearSearch() {
    this.searchDept = '';
    this.searchDesig = '';
    this.loadAll();
  }

  deleteEmployee(id: string) {
    if (!confirm('Delete this employee? This cannot be undone.')) return;
    this.gql.deleteEmployee(id).subscribe({
      next: () => {
        this.employees = this.employees.filter(e => e.id !== id);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.message;
        this.cdr.detectChanges();
      },
    });
  }

  logout() {
    this.authService.logout();
  }
}
