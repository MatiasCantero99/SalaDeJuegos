import { Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { BienvenidosComponent } from './componentes/bienvenidos/bienvenidos.component';
import { ErrorComponent } from './componentes/error/error.component';
import { DetalleComponent } from './componentes/detalle/detalle.component';
import { QuienSoyComponent } from './componentes/quien-soy/quien-soy.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'home',
        component: BienvenidosComponent
    },
    {
        path: 'quien-soy',
        component: QuienSoyComponent,
    },
    {
        path: '**',
        component: ErrorComponent
    },
];
