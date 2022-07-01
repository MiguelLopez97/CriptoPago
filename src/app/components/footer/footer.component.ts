import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  //Año actual
  public currentDate: Date = new Date();

  public links = [
    {nombre: 'Preguntas frecuentes', route: '/faq'},
    {nombre: 'Políticas de privacidad', route: '/politicas-de-privacidad'},
    {nombre: 'Términos y condiciones', route: '/terminos-y-condiciones'}
  ];
  
  constructor() { }

  ngOnInit(): void {
  }

}
