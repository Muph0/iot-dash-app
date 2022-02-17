import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { assert } from 'src/app/utils';
import { Observable, Subscription } from 'rxjs';
import { StatusService } from 'src/app/services/alert.service';
import { IIdentityService } from 'src/app/services/identity.service';
import { AuthResponse } from 'src/contract/backend-v1';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    ctrlUser = new FormControl('', [Validators.required]);
    ctrlPassword = new FormControl('', [Validators.required]);
    loading = false;

    loggedIn: Observable<boolean>;

    constructor(
        private readonly auth: IIdentityService,
        private readonly status: StatusService,
    ) {
        this.loggedIn = auth.loggedIn;
    }

    ngOnInit(): void {
    }

    async loginClick() {

        if (this.ctrlUser.valid && this.ctrlPassword.valid) {
            const email = this.ctrlUser.value;
            const passwd = this.ctrlPassword.value;

            this.loading = true;
            try {
                const result = await this.auth.login(email, passwd);
                console.log('Auth result:', result);
            } catch (err) {
                const resp = err as AuthResponse;
                if (resp.success === false) {
                    assert(resp.errors);

                    for (const e of resp.errors) {
                        this.status.showError(e);
                    }
                }
            } finally {
                this.loading = false;
            }
        } else {
            this.ctrlUser.markAsTouched();
            this.ctrlPassword.markAsTouched();
        }
    }

}
