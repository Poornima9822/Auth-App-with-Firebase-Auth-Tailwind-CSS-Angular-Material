import { Routes } from '@angular/router';

export const routes: Routes = [
    { path : '', title: 'Login', loadComponent: () =>
        import('./login/login').then((m) => m.LoginComponent)
    },

    {
        path: 'register', title: 'Register', loadComponent: () =>
            import('./register/register').then((m) => m.RegisterComponent)
    },
    {
        path: 'home',
        title: 'Home',
        loadComponent: () =>
            import('./home/home').then((m) => m.HomeComponent)
    }
];
