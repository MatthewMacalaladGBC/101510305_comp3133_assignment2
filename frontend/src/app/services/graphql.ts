import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

const GET_ALL_EMPLOYEES = gql`
    query {
        getAllEmployees {
            id first_name last_name email gender
            designation salary date_of_joining
            department employee_photo
        }
    }
`;

const GET_EMPLOYEE_BY_ID = gql`
    query GetEmployeeById($id: ID!) {
        getEmployeeById(id: $id) {
            id first_name last_name email gender
            designation salary date_of_joining
            department employee_photo
        }
    }
`;

const SEARCH_EMPLOYEE = gql`
    query SearchEmployee($designation: String, $department: String) {
        searchEmployee(designation: $designation, department: $department) {
            id first_name last_name email gender
            designation salary date_of_joining
            department employee_photo
        }
    }
`

const ADD_EMPLOYEE = gql`
    mutation AddEmployee(
        $first_name: String!, $last_name: String!, $email: String!,
        $gender: String, $designation: String!, $salary: Float!,
        $date_of_joining: String!, $department: String!, $employee_photo: String
    ) {
        addEmployee(
            first_name: $first_name, last_name: $last_name, email: $email,
            gender: $gender, designation: $designation, salary: $salary,
            date_of_joining: $date_of_joining, department: $department,
            employee_photo: $employee_photo
        ) {
            id first_name last_name email designation department salary
        }
    }
`

const UPDATE_EMPLOYEE = gql`
    mutation UpdateEmployee(
        $id: ID!, $first_name: String, $last_name: String, $email: String,
        $gender: String, $designation: String, $salary: Float,
        $date_of_joining: String, $department: String, $employee_photo: String
    ) {
        updateEmployee(
            id: $id, first_name: $first_name, last_name: $last_name, email: $email,
            gender: $gender, designation: $designation, salary: $salary,
            date_of_joining: $date_of_joining, department: $department,
            employee_photo: $employee_photo
        ) {
            id first_name last_name email designation department salary
        }
    }
`;

const DELETE_EMPLOYEE = gql`
    mutation DeleteEmployee($id: ID!) {
        deleteEmployee(id: $id) {
            message
        }
    }
`;

@Injectable({ providedIn: 'root' })
export class GraphqlService {
    constructor(private apollo: Apollo) {}

    getAllEmployees(): Observable<any[]> {
        return this.apollo.watchQuery({ query: GET_ALL_EMPLOYEES, fetchPolicy: 'network-only' })
        .valueChanges.pipe(
            filter((res: any) => !res.loading && !!res.data),
            map((res: any) => res.data.getAllEmployees)
        );
    }

    getEmployeeById(id: string): Observable<any> {
        return this.apollo.query({ query: GET_EMPLOYEE_BY_ID, variables: { id } })
        .pipe(map((res: any) => res.data.getEmployeeById));
    }

    searchEmployee(designation?: string, department?: string): Observable<any[]> {
        return this.apollo.query({ query: SEARCH_EMPLOYEE, variables: { designation, department }, fetchPolicy: 'no-cache' })
        .pipe(map((res: any) => res.data.searchEmployee));
    }

    addEmployee(vars: any): Observable<any> {
        return this.apollo.mutate({ mutation: ADD_EMPLOYEE, variables: vars })
        .pipe(map((res: any) => res.data.addEmployee));
    }

    updateEmployee(vars: any): Observable<any> {
        return this.apollo.mutate({ mutation: UPDATE_EMPLOYEE, variables: vars })
        .pipe(map((res: any) => res.data.updateEmployee));
    }

    deleteEmployee(id: string): Observable<any> {
        return this.apollo.mutate({ mutation: DELETE_EMPLOYEE, variables: { id } })
        .pipe(map((res: any) => res.data.deleteEmployee));
    }
}