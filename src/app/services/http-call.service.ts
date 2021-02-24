import { Injectable } from '@angular/core';
import {HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpCallService {

  constructor() { }

  getHeader($token: string, $type: string) {
    let httpHeaders = new HttpHeaders()
      .set('Content-Type', $type);

    if ($token) {
      httpHeaders = new HttpHeaders()
        .set('Content-Type', $type)
        .set('Authorization', `Bearer ${$token}`);
    }
    return httpHeaders;
  }
}
