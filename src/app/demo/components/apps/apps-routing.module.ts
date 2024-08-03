import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: 'accounts', data: { breadcrumb: 'Accounts' }, loadChildren: () => import('./accounts/account.module').then((m) => m.AccountModule) },
            { path: 'bills', data: { breadcrumb: 'Bills' }, loadChildren: () => import('./bills/bills.app.module').then((m) => m.BillsAppModule) },
            { path: 'recon', data: { breadcrumb: 'Recon' }, loadChildren: () => import('./recon/recon.module').then((m) => m.ReconModule) },
            { path: 'calendar', data: { breadcrumb: 'Calendar' }, loadChildren: () => import('./calendar/calendar.app.module').then((m) => m.CalendarAppModule) },
            { path: 'tasklist', data: { breadcrumb: 'Task List' }, loadChildren: () => import('./tasklist/tasklist.app.module').then((m) => m.TaskListAppModule) },
            { path: 'chat', data: { breadcrumb: 'Chat' }, loadChildren: () => import('./chat/chat.app.module').then((m) => m.ChatAppModule) },
            { path: 'files', data: { breadcrumb: 'Files' }, loadChildren: () => import('./file/file.app.module').then((m) => m.FileAppModule) },
            { path: 'mail', data: { breadcrumb: 'Mail' }, loadChildren: () => import('./mail/mail.app.module').then((m) => m.MailAppModule) },
            { path: 'kanban', data: { breadcrumb: 'Kanban' }, loadChildren: () => import('./kanban/kanban.app.module').then((m) => m.KanbanAppModule) },
            { path: 'blog', data: { breadcrumb: 'Blog' }, loadChildren: () => import('./blog/blog.app.module').then((m) => m.BlogAppModule) },
            { path: '**', redirectTo: '/notfound' }
        ])
    ],
    exports: [RouterModule]
})
export class AppsRoutingModule {}
