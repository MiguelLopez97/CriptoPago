import { Component, OnInit } from '@angular/core';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-calificar-servicio',
  templateUrl: './calificar-servicio.component.html',
  styleUrls: ['./calificar-servicio.component.scss'],
  providers: [NgbRatingConfig] // add NgbRatingConfig to the component providers
})
export class CalificarServicioComponent implements OnInit {

  currentRate = 1;

  constructor(
    public configRating: NgbRatingConfig
  ) { 
    //Define el número máximo para las calificaciones (NgbRating)
    configRating.max = 5;
  }

  ngOnInit(): void {
  }

}
