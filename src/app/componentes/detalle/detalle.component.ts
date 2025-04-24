import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Params } from '@angular/router';

@Component({
  selector: 'app-detalle',
  standalone: true,
  imports: [],
  templateUrl: './detalle.component.html',
  styleUrl: './detalle.component.scss'
})
export class DetalleComponent implements OnInit {

  nombre: string = "";

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {

    // Obtener Parametros de la ruta, para parametros obligatorios
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params.has('nombre')) {
        this.nombre = params.get('nombre') || '';
      }
    });

    // this.route.params.subscribe((params: Params) => {
    //   if (params['nombre']) {
    //     this.nombre = params['nombre'] || '';
    //   }
    // });


    // Obtener queryParams, se usa para parametros opcionales
    // this.route.queryParamMap.subscribe((params: ParamMap) => {
    //   if (params.has('nombre')) {
    //     this.nombre = params.get('nombre') || '';
    //   }
    // });

    // this.route.queryParams.subscribe((params: Params) => {

    //   if(params['nombre']) {
    //     this.nombre = params['nombre'] || '';
    //   }

    // });


  }





}
