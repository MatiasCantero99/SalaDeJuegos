import { Component, Input } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-tabla-ranking',
  standalone: true,
  imports: [CommonModule,NgIf,NgFor],
  templateUrl: './tabla-ranking.component.html',
  styleUrl: './tabla-ranking.component.scss'
})
export class TablaRankingComponent {
  @Input() datos: any[] = [];

}
