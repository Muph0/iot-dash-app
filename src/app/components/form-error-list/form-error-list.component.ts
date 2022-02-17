import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
    selector: 'app-form-error-list',
    templateUrl: './form-error-list.component.html',
    styleUrls: ['./form-error-list.component.scss']
})
export class FormErrorListComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

    @Input("control")
    control: AbstractControl;

    listErrors() {
        return this.control.errors;
    }

}
