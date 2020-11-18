import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA} from "@angular/material/dialog";
import { Router } from '@angular/router';

@Component({
    templateUrl: './error.component.html'
})
export class ErrorComponent{
    constructor(@Inject(MAT_DIALOG_DATA) public data: {message: string}, private router: Router){}

    public homeButtonClicked(): void{
        console.log('Going to home page');
        this.router.navigate(['/']);
    }
}



