import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";

@Component({
    templateUrl: './login.component.html',
})
export class LoginComponent {
    rememberMe: boolean = false;
    username: string = '';
    password: string = '';
    errorMessage: string = '';

    constructor(private layoutService: LayoutService, private authService: AuthService, private router: Router) {}

    get dark(): boolean {
        return this.layoutService.config().colorScheme !== 'light';
    }

    async login() {
        const { user, error } = await this.authService.login(this.username, btoa(this.password));

        if (error) {
            this.errorMessage = error;
        } else if (user) {

            if(user.is_active){
                // Optionally store user in a shared state or localStorage
                localStorage.setItem('currentUser', JSON.stringify(user));

                // Navigate to dashboard or wherever
                this.router.navigate(['/']);
            }
            else {
                this.errorMessage = 'not user found';
            }

        }
    }
}
