import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TimeSpan } from 'src/app/domain/time-span';
import { TokenPair } from 'src/app/domain/token';
import { IIdentityService } from 'src/app/services/identity.service';

@Component({
    selector: 'app-user-detail',
    templateUrl: './user-detail.component.html',
    styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit, OnDestroy {

    tokens: TokenPair;
    loggedIn: boolean;
    timeLeft: TimeSpan = new TimeSpan(0);

    private subs: Subscription[] = [];
    private alive = true;

    constructor(
        private readonly auth: IIdentityService,
        private readonly router: Router,
    ) { }

    animate() {
        if (this.alive) {

            this.timeLeft = this.tokens.jwt.timeLeft()
            requestAnimationFrame(() => this.animate());
        }
    }

    ngOnInit(): void {
        this.subs.push(
            this.auth.tokenPair.subscribe({
                next: tokens => {
                    if (tokens) {
                        this.tokens = tokens;
                    }
                    this.loggedIn = !!tokens;
                }
            }),
        );

        this.animate();
    }

    ngOnDestroy(): void {
        this.alive = false;
        this.subs.forEach(s => s.unsubscribe());
    }

    clickLogout() : void {
        this.auth.logout();
        this.router.navigate(['/login']);
    }

}
