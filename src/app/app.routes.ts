import { Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { BienvenidosComponent } from './componentes/bienvenidos/bienvenidos.component';
import { ErrorComponent } from './componentes/error/error.component';
import { QuienSoyComponent } from './componentes/quien-soy/quien-soy.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { RankingComponent } from './componentes/ranking/ranking.component';
import { EncuestaComponent } from './componentes/encuesta/encuesta.component';

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
        path: 'registro',
        component: RegistroComponent,
    },
    {
        path: 'ranking',
        component: RankingComponent,
    },
    {
        path: 'encuesta',
        component: EncuestaComponent,
    },
    {
        path:'juegos',
    loadChildren: () =>
    import('./modulos/juegos/juegos.module').then(m => m.JuegosModule)
    },
    {
        path: '**',
        component: ErrorComponent
    },
];
