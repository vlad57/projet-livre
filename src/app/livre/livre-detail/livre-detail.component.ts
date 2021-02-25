import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import { LivreService } from '../../services/livre.service';
import { CategorieService } from '../../services/categorie.service';
import {HttpCallService} from '../../services/http-call.service';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-livre-detail',
  templateUrl: './livre-detail.component.html',
  styleUrls: ['./livre-detail.component.css']
})
export class LivreDetailComponent implements OnInit {

  httpCallService: HttpCallService;
  userId;
  dataCategories;
  livreId = null;
  livreUserId = null;
  dataLivre;
  messageError = null;
  toSubmit = true;

  livre = new FormGroup({
    livreId: new FormControl(''),
    livreTitle: new FormControl(''),
    livreDescription: new FormControl(''),
    livreNote: new FormControl(''),
    categorieIds: new FormControl('')
  });

  // tslint:disable-next-line:variable-name max-line-length
  constructor(public _httpCallService: HttpCallService, private route: ActivatedRoute,  public router: Router,
              public livreService: LivreService, public categorieService: CategorieService) {
    this.httpCallService = _httpCallService;
  }

  ngOnInit(): void {
    this.livreId = +this.route.snapshot.paramMap.get('id');
    this.userId = localStorage.getItem('userId');

    this.categorieService.categorieList(0, null, this.userId).pipe(map(data => {
      if (data.categories) {
        this.dataCategories = data.categories.rows;
      }
    })).subscribe();

    if (this.livreId) {
      this.livreService.getLivre(this.livreId).pipe(map(data => {
        const idsCategories = [];


        this.dataLivre = data;

        this.livreUserId = data.User.id;

        data.Categories.forEach(cat => {
          idsCategories.push(cat.id);
        });

        this.livre.controls.livreId.setValue(this.livreId);
        this.livre.controls.livreTitle.setValue(data.titre);
        this.livre.controls.livreDescription.setValue(data.description);
        this.livre.controls.livreNote.setValue(data.note);
        this.livre.controls.categorieIds.setValue(idsCategories);

      })).subscribe();
    }

  }

  checkTitle(value): Promise<boolean> {
    if (typeof value !== 'string') {
      value = value.target.value;
    }

    let body;

    if (this.livreId) {
      body = {
        livreId: this.livreId,
        livreTitle: value
      };
    } else {
      body = {
        livreId: null,
        livreTitle: value
      };
    }

    return this.livreService.checkTitle(body).then(data => {
      let valToRet = false;

      const returnedData: any = data;

      if (!returnedData.isEmpty) {
        if (returnedData.livre.length > 1) {
          this.toSubmit = false;
          this.messageError = 'Ce titre existe déjà';
          valToRet = false;
        } else if (returnedData.livre.length === 1) {
          returnedData.livre.forEach(item => {
            if (+item.id !== +this.livreId) {
              this.toSubmit = false;
              this.messageError = 'Ce titre existe déjà';
              valToRet = false;
            } else {
              this.toSubmit = true;
              valToRet = true;
            }
          });
        } else {
          this.toSubmit = true;
          valToRet = true;
        }
      } else {
        this.toSubmit = true;
        valToRet = true;
      }

      return valToRet;
    });


  }

  onSubmit() {

    this.checkTitle(this.livre.controls.livreTitle.value).then(data => {
      if (data) {
        if (!this.livre.controls.livreTitle.value || !this.livre.controls.livreDescription.value) {
          this.messageError = 'Les champs obligatoires doivent être complétés.';
          return false;
        }

        if (!this.livre.controls.livreNote.value) {
          this.livre.controls.livreNote.setValue(1);
        }

        if (this.livreId) {
          this.livreService.editLivre(this.livre.value).subscribe(data => {
            const dataReturned: any = data;

            if (dataReturned.isUpdated) {
              this.router.navigate(['/livre/list']).then(r => null);
            }
          });
        } else {
          this.livreService.newLivre(this.livre.value).subscribe(data => {
            const dataReturned: any = data;

            if (dataReturned.created) {
              this.router.navigate(['/livre/list']).then(r => null);
            }
          });
        }
      }
    });
  }

}
