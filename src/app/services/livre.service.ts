import { Injectable } from '@angular/core';
import {HttpCallService} from './http-call.service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LivreService {

  constructor(private httpCallServices: HttpCallService, private httpClient: HttpClient, public router: Router) { }

  livreList(page: number, perPage: number, userId): Observable<any> {
    return this.httpClient.get(`http://localhost:8081/api/livre/list`, {
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
    return this.httpClient.get(`http://localhost:8081/api/livre/${livreId}`, {
      headers: this.httpCallServices.getHeader(localStorage.getItem('tokenAuth'), 'application/json'),
      params: {
        userId: localStorage.getItem('userId'),
      }
    });
  }

  newLivre(livre: Array<any>) {
    return this.httpClient.post('http://localhost:8081/api/livre/create/', livre, {
      headers: this.httpCallServices.getHeader(localStorage.getItem('tokenAuth'), 'application/json'),
    });
  }

  editLivre(livre: Array<any>) {
    return this.httpClient.post('http://localhost:8081/api/livre/update/', livre, {
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

    return this.httpClient.delete('http://localhost:8081/api/livre/delete/', headers);
  }
}
