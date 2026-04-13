import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'defaultValue',
    standalone: false
})
export class DefaultValuePipe implements PipeTransform {
    transform(value: any, fallback: string = '-'): any {
        return value !== null && value !== undefined && value !== '' ? value : fallback;
    }
}