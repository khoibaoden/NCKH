import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
// import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from './layout/app.layout.component';
import { AdminGuard } from './core/guards/admin.guard';
import { NotfoundComponent } from './partials/notfound/notfound.component';

@NgModule({
    imports: [
        RouterModule.forRoot(
            [
                {
                    path: '',
                    component: AppLayoutComponent,
                    children: [
                        {
                            path: 'staff-position',
                            loadChildren: () =>
                                import(
                                    'src/app/modules/pages/staff-position/show/show.module'
                                ).then((m) => m.ShowModule),
                        },
                    ],
                },
                {
                    path: '',
                    component: AppLayoutComponent,
                    children: [
                        {
                            path: 'news',
                            loadChildren: () =>
                                import(
                                    'src/app/modules/pages/news/news.module'
                                ).then((m) => m.NewsModule),
                        },
                    ],
                },
                {
                    path: '',
                    component: AppLayoutComponent,
                    children: [
                        {
                            path: 'seminar',
                            loadChildren: () =>
                                import(
                                    'src/app/modules/pages/seminar/seminar.module'
                                ).then((m) => m.SeminarModule),
                        },
                    ],
                },
                {
                    path: '',
                    component: AppLayoutComponent,
                    children: [
                        {
                            path: 'research-topic',
                            loadChildren: () =>
                                import(
                                    'src/app/modules/pages/research-topic/research-topic.module'
                                ).then((m) => m.ResearchTopicModule),
                        },
                    ],
                },
                {
                    path: '',
                    component: AppLayoutComponent,
                    children: [
                        {
                            path: 'scientific-report',
                            loadChildren: () =>
                                import(
                                    'src/app/modules/pages/scientific-report/scientific-report.module'
                                ).then((m) => m.ScientificReportModule),
                        },
                    ],
                },
                {
                    path: 'auth',
                    loadChildren: () =>
                        import('./modules/auth/auth.module').then(
                            (m) => m.AuthModule
                        ),
                },
                { path: 'notfound', component: NotfoundComponent },
                { path: '**', redirectTo: '/notfound' },
            ],
            {
                scrollPositionRestoration: 'enabled',
                anchorScrolling: 'enabled',
                onSameUrlNavigation: 'reload',
            }
        ),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
