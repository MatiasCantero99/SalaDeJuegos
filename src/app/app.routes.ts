import { Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { BienvenidosComponent } from './componentes/bienvenidos/bienvenidos.component';
import { ErrorComponent } from './componentes/error/error.component';
import { QuienSoyComponent } from './componentes/quien-soy/quien-soy.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { AhorcadoComponent } from './componentes/ahorcado/ahorcado.component';
import { MayorYMenorComponent } from './componentes/mayor-y-menor/mayor-y-menor.component';

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
        path: 'MayoryMenor',
        component: MayorYMenorComponent,
    },
    {
        path: 'registro',
        component: RegistroComponent,
    },
    {
        path: 'Ahorcado',
        component: AhorcadoComponent,
    },
    {
        path: '**',
        component: ErrorComponent
    },
];
