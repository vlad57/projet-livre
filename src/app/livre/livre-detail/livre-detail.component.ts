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

  livre = new FormGroup({
    livreId: new FormControl(''),
    livreTitle: new FormControl(''),
    livreDescription: new FormControl(''),
    livreNote: new FormControl(''),
    categorieIds: new FormControl('')
  });

  // tslint:disable-next-line:variable-name max-line-length
  constructor(public _httpCallService: HttpCallService, private route: ActivatedRoute,  public router: Router,
              private httpClient: HttpClient, public livreService: LivreService, public categorieService: CategorieService) {
    this.httpCallService = _httpCallService;
  }

  ngOnInit(): void {
    this.livreId = +this.route.snapshot.paramMap.get('id');
    this.userId = localStorage.getItem('userId');

    this.categorieService.categorieList(0, null, this.userId).pipe(map(data => {
      this.dataCategories = data.categories.rows;
    })).subscribe();

    if (this.livreId) {
      this.livreService.getLivre(this.livreId).pipe(map(data => {
        const idsCategories = [];


        this.dataLivre = data;

        console.log(this.dataLivre)

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

  onSubmit() {

    if (!this.livre.controls.livreNote.value) {
      this.livre.controls.livreNote.setValue(0);
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

}
