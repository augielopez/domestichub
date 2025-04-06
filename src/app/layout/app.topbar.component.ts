import { Component, ElementRef, ViewChild } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AppSidebarComponent } from './app.sidebar.component';
import {Router} from "@angular/router";

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopbarComponent {
    @ViewChild('menubutton') menuButton!: ElementRef;
    @ViewChild(AppSidebarComponent) appSidebar!: AppSidebarComponent;
    activeItem!: number;
    constructor(public layoutService: LayoutService, public el: ElementRef, private router: Router) {}

    onMenuButtonClick() {
        this.layoutService.onMenuToggle();
    }

    onSidebarButtonClick() {
        this.layoutService.showSidebar();
    }

    onConfigButtonClick() {
        this.layoutService.showConfigSidebar();
    }

    logout() {
        localStorage.removeItem('currentUser');
        console.log('navigating...');
        this.router.navigate(['/auth/login']).then(success => {
            console.log('Navigation success:', success);
        });
    }
}
