import { Injectable } from '@angular/core';
import {HttpCallService} from './http-call.service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategorieService {

  constructor(private httpCallServices: HttpCallService, private httpClient: HttpClient, public router: Router) { }

  categorieList(page, perPage, userId): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}/api/categorie/list`, {
      headers: this.httpCallServices.getHeader(localStorage.getItem('tokenAuth'), 'application/json'),
      params: {
        offset: page,
        limit: perPage,
        userId: userId,
      }
    }).pipe(map(data => data), catchError(err => throwError(err)))
      ;
  }

  getCategorie(categorieId: string): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}/api/categorie/${categorieId}`, {
      headers: this.httpCallServices.getHeader(localStorage.getItem('tokenAuth'), 'application/json'),
      params: {
        userId: localStorage.getItem('userId'),
      }
    });
  }

  newCategorie(categorie: Array<any>) {
    return this.httpClient.post(`${environment.apiUrl}/api/categorie/create/`, categorie, {
      headers: this.httpCallServices.getHeader(localStorage.getItem('tokenAuth'), 'application/json'),
    });
  }

  editCategorie(categorie: Array<any>) {
    return this.httpClient.post(`${environment.apiUrl}/api/categorie/update/`, categorie, {
      headers: this.httpCallServices.getHeader(localStorage.getItem('tokenAuth'), 'application/json'),
      params: {
        userId: localStorage.getItem('userId'),
      }
    });
  }

  deleteCategorie(categorieId) {

    const headers = {
      headers: this.httpCallServices.getHeader(localStorage.getItem('tokenAuth'), 'application/json'),
      body: {
        categorieId: categorieId
      }
    };

    return this.httpClient.delete(`${environment.apiUrl}/api/categorie/delete/`, headers);
  }
}
