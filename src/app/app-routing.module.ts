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
                //Departments
                {
                    path: '',
                    component: AppLayoutComponent,
                    children: [
                        {
                            path: 'departments',
                            loadChildren: () =>
                                import(
                                    'src/app/modules/pages/departments/departments.module'
                                ).then((m) => m.DepartmentsModule),
                        },
                    ],
                },
                //Officer
                {
                    path: '',
                    component: AppLayoutComponent,
                    children: [
                        {
                            path: 'officer',
                            loadChildren: () =>
                                import(
                                    'src/app/modules/pages/officer/officer.module'
                                ).then((m) => m.officerModule),
                        },
                    ],
                },
                //staff-position
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
                //news
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
                //seminar
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

                //scientific-report
                {
                    path: '',
                    component: AppLayoutComponent,
                    children: [
                        {
                            path: 'science-report',
                            loadChildren: () =>
                                import(
                                    'src/app/modules/pages/science-report/science-report.module'
                                ).then((m) => m.ScienceReportModule),
                        },
                    ],
                },

                //curriculum
                {
                    path: '',
                    component: AppLayoutComponent,
                    children: [
                        {
                            path: 'curriculum',
                            loadChildren: () =>
                                import(
                                    'src/app/modules/pages/curriculum/curriculum.module'
                                ).then((m) => m.CurriculumModule),
                        },
                    ],
                },

                //science-project
                {
                    path: '',
                    component: AppLayoutComponent,
                    children: [
                        {
                            path: 'science-project',
                            loadChildren: () =>
                                import(
                                    'src/app/modules/pages/science-project/science-project.module'
                                ).then((m) => m.ScienceProjectModule),
                        },
                    ],
                },

                //intellectureal-property
                {
                    path: '',
                    component: AppLayoutComponent,
                    children: [
                        {
                            path: 'intellectureal-property',
                            loadChildren: () =>
                                import(
                                    'src/app/modules/pages/intellectureal-property/intellectureal-property.module'
                                ).then((m) => m.IntellecturealPropertyModule),
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
