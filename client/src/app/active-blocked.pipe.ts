
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'activeBlocked'})
export class ActiveBlockedPipe implements PipeTransform {
    transform(value) {
        return value ? 'Active' : 'Inactive';
    }
}
