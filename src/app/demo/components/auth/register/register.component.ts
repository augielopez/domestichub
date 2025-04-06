import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";

@Component({
    templateUrl: './register.component.html',
})
export class RegisterComponent {
    confirmed: boolean = false;
    newUser = {
        username: '',
        email: '',
        password: ''
    };

    errorMessage: string = '';

    constructor(private layoutService: LayoutService, private authService: AuthService, private router: Router) {}

    get dark(): boolean {
        return this.layoutService.config().colorScheme !== 'light';
    }

    async handleSignup() {
        const { data, error } = await this.authService.createUser(this.newUser);

        if (!error) {
            this.router.navigate(['/auth/login']);
        } else {
            this.errorMessage = 'Could not create user';
        }
    }

}
