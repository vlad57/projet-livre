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
export class LivreService {

  constructor(private httpCallServices: HttpCallService, private httpClient: HttpClient, public router: Router) { }

  livreList(page: number, perPage: number, userId): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}/api/livre/list`, {
      headers: this.httpCallServices.getHeader(localStorage.getItem('tokenAuth'), 'application/json'),
      params: {
        offset: page.toString(),
        limit: perPage.toString(),
        userId: userId,
      }
    }).pipe(map(data => data), catchError(err => throwError(err)))
      ;
  }

  getLivre(livreId: string): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}/api/livre/${livreId}`, {
      headers: this.httpCallServices.getHeader(localStorage.getItem('tokenAuth'), 'application/json'),
      params: {
        userId: localStorage.getItem('userId'),
      }
    });
  }

  newLivre(livre: Array<any>) {
    return this.httpClient.post(`${environment.apiUrl}/api/livre/create/`, livre, {
      headers: this.httpCallServices.getHeader(localStorage.getItem('tokenAuth'), 'application/json'),
    });
  }

  editLivre(livre: Array<any>) {
    return this.httpClient.post(`${environment.apiUrl}/api/livre/update/`, livre, {
      headers: this.httpCallServices.getHeader(localStorage.getItem('tokenAuth'), 'application/json'),
      params: {
        userId: localStorage.getItem('userId'),
      }
    });
  }

  deleteLivre(livreId) {

    const headers = {
      headers: this.httpCallServices.getHeader(localStorage.getItem('tokenAuth'), 'application/json'),
      body: {
        livreId: livreId
      }
    };
    return this.httpClient.delete(`${environment.apiUrl}/api/livre/delete/`, headers);
  }

  checkTitle(params) {
    return this.httpClient.post(`${environment.apiUrl}/api/livre/checkTitle`, params, {
      headers: this.httpCallServices.getHeader(localStorage.getItem('tokenAuth'), 'application/json'),
    }).toPromise();
  }
}
