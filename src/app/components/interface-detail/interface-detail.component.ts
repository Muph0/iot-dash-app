import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { BehaviorSubject, debounceTime, filter, first, of, switchMap, takeUntil, timer } from 'rxjs';
import { IotInterface, IotInterfaceKind } from 'src/app/domain';
import { InterfaceService } from 'src/app/services/interface.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-interface-detail',
    templateUrl: './interface-detail.component.html',
    styleUrls: ['./interface-detail.component.scss']
})
export class InterfaceDetailComponent implements OnInit {

    @Input() iface: IotInterface;
    form: FormGroup;
    isOutput: boolean;

    constructor(
        private fb: FormBuilder,
        private ifsvc: InterfaceService
    ) {
    }

    listKinds() {
        return Object.entries(IotInterfaceKind);
    }

    updateInterface(iface: IotInterface) {
        Object.assign(this.iface, iface);
        this.isOutput = this.iface.isOutput;
    }

    ngOnInit(): void {
        this.form = this.fb.group({
            topic: [this.iface.topic],
            kind: [this.iface.kind],
            historyEnabled: [this.iface.historyEnabled],
            expression: [this.iface.expression],
        });

        let debounceTimes: { [k: string]: number } = {
            kind: 0,
            historyEnabled: 0,
        };

        // setup validators
        for (const key in this.form.controls) {
            const control = this.form.controls[key];
            let debounceT1 = key in debounceTimes
                ? debounceTimes[key]
                : 500;
            const value$ = new BehaviorSubject<string | null>(null);
            const error$ = value$.asObservable().pipe(
                debounceTime(debounceT1),
                //filter(val => val !== null),
                switchMap(async val => {

                    const patch = {
                        id: this.iface.id,
                        [key]: control.value,
                    };
                    const result = await this.ifsvc.patchInterface(patch);

                    let errors: ValidationErrors | null;

                    if (result.ok) {
                        console.log("valid", result.value);
                        this.updateInterface(result.value);
                        errors = null;
                    } else {
                        console.error("invalid", result.errors);
                        errors = {
                            messages: result.errors,
                        };
                    }

                    return errors;
                }),
                first(),
            );

            control.setAsyncValidators(((control: AbstractControl) => {
                if (control.dirty) {
                    value$.next(control.value);
                    console.log("pushing", control.value);
                    return error$;//.pipe(takeUntil(timer(5000)));
                }
                return of(null);
            }) as AsyncValidatorFn);
        }
    }

}
