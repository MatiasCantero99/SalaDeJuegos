import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AhorcadoComponent } from '../../componentes/ahorcado/ahorcado.component';
import { BlackjackComponent } from '../../componentes/blackjack/blackjack.component';
import { MayorYMenorComponent } from '../../componentes/mayor-y-menor/mayor-y-menor.component';
import { PreguntadoComponent } from '../../componentes/preguntado/preguntado.component';

const routes: Routes = [
  {path: 'Ahorcado', component: AhorcadoComponent},
  {path: 'Blackjack', component: BlackjackComponent},
  {path: 'MayoryMenor', component: MayorYMenorComponent},
  {path: 'Preguntado', component: PreguntadoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JuegosRoutingModule { }
