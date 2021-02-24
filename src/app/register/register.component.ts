import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {HttpCallService} from '../services/http-call.service';
import {isInteger} from '@ng-bootstrap/ng-bootstrap/util/util';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private httpClient: HttpClient, public httpCallServices: HttpCallService, private router: Router) {
    this.httpCallService = httpCallServices;
  }

  httpCallService: HttpCallService;

  registerForm = new FormGroup({
    email: new FormControl(''),
    username: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
  });

  ngOnInit(): void {
  }

  onSubmit() {

    this.httpClient.post('http://localhost:8081/api/user/register/', {
      'email': this.registerForm.get('email').value,
      'username': this.registerForm.get('username').value,
      'password': this.registerForm.get('password').value
    },  {
      headers: this.httpCallService.getHeader(null, 'application/json')
    })
      .subscribe(data => {
        const anyData: any = data;

        if (Number.isInteger(anyData.userId) && anyData.userId) {
          this.router.navigate(['/login'], {
            state: {
              'email': this.registerForm.get('email').value,
              'password': this.registerForm.get('password').value
            }
          }).then(r => null);
        }
      });
  }

}
