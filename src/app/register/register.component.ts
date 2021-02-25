import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {HttpCallService} from '../services/http-call.service';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  httpCallService: HttpCallService;

  registerForm = new FormGroup({
    email: new FormControl(''),
    username: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
  });

  messageError = null;

  constructor(private httpClient: HttpClient, public httpCallServices: HttpCallService, private router: Router) {
    this.httpCallService = httpCallServices;
  }

  ngOnInit(): void {
  }

  onSubmit() {

    // tslint:disable-next-line:max-line-length
    if ((!this.registerForm.controls.password || !this.registerForm.controls.confirmPassword) || (this.registerForm.controls.password.value !== this.registerForm.controls.confirmPassword.value)) {
      this.messageError = 'Les mots de passe ne sont pas identiques.';
      return false;
    }

    this.httpClient.post(`${environment.apiUrl}/api/user/register/`, {
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
      }, error => {

        this.messageError = error.error.error;
      });
  }

}
