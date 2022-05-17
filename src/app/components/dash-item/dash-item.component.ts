import { AfterViewChecked, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DashboardItem } from 'src/app/domain';
import { RandomProvider } from 'src/app/services/random-provider.service';
import { assert } from 'src/app/utils';

@Component({
    selector: 'app-dash-item',
    templateUrl: './dash-item.component.html',
    styleUrls: ['./dash-item.component.scss']
})
export class DashItemComponent implements OnInit {

    constructor(
        private fb: FormBuilder,
        private rng: RandomProvider,
    ) {
        this.id = rng.getToken(8);
    }

    @Input() control: DashboardItem;
    inSettings = false;
    id: string;

    form: {
        width: FormControl;
        type: FormControl;
    };

    ngOnInit(): void {
        assert(this.control, 'Dashboard item: No control given.');

        this.form = {
            width: new FormControl(this.control.width),
            type: new FormControl(this.control.type),
        };

        this.form.width.valueChanges.subscribe(value => {
            this.control.width = value;
        });
        this.form.type.valueChanges.subscribe(value => {
            this.control.type = value;
        });
    }

    deleteSelf() {
        console.log('Delete');
    }
}
