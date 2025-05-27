import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'juegoFiltro',
  standalone: true
})
export class JuegoFiltroPipe implements PipeTransform {

  transform(juegos: any[], filtro: string): any[] {
    if (!filtro) return juegos;
    return juegos.filter(juego =>
      juego.nombre.toLowerCase().includes(filtro.toLowerCase())
    );
  }
}




//   transform(value: unknown, ...args: unknown[]): unknown {
//     return null;
//   }

// }
