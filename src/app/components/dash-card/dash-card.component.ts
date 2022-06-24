import { AfterViewChecked, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DashCardInfo as DashCardInfo, PersistentCard } from 'src/app/domain';
import { DashboardService } from 'src/app/services/dashboard.service';
import { RandomProvider } from 'src/app/services/random-provider.service';
import { assert } from 'src/app/utils';

@Component({
    selector: 'app-dash-card',
    templateUrl: './dash-card.component.html',
    styleUrls: ['./dash-card.component.scss']
})
export class DashItemComponent implements OnInit {

    constructor(
        private fb: FormBuilder,
        private rng: RandomProvider,
        private db: DashboardService,
    ) {
        this.id = rng.getToken(8);
    }

    @Input() card: PersistentCard;
    inSettings = false;
    id: string;

    form: {
        width: FormControl;
        type: FormControl;
    };

    ngOnInit(): void {
        assert(this.card, 'Dashboard item: No control given.');

        this.form = {
            width: new FormControl(this.card.width),
            type: new FormControl(this.card.type),
        };

        this.form.width.valueChanges.subscribe(value => {
            this.card.width = value;
        });
        this.form.type.valueChanges.subscribe(value => {
            this.card.type = value;
        });
    }

    deleteSelf() {
        this.db.removeCard(this.card);
    }
}
