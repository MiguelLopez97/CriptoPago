import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaisesService {

  public baseUrl: string = 'https://restcountries.eu/rest/v2/all';

  constructor(
    private _http: HttpClient
  ) { }

  getAllPaises():Observable<any>
  {
    return this._http.get(this.baseUrl);
  }
}
