import { Injectable } from '@angular/core';
import {HttpCallService} from './http-call.service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategorieService {

  constructor(private httpCallServices: HttpCallService, private httpClient: HttpClient, public router: Router) { }

  categorieList(page, perPage, userId): Observable<any> {
    return this.httpClient.get(`http://localhost:8081/api/categorie/list`, {
      headers: this.httpCallServices.getHeader(localStorage.getItem('tokenAuth'), 'application/json'),
      params: {
        offset: page,
        limit: perPage,
        userId: userId,
      }
    }).pipe(map(data => data), catchError(err => throwError(err)))
      ;
  }
}
