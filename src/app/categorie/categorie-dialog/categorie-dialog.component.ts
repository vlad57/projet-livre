import {Component, Inject, OnInit} from '@angular/core';
import { CategorieService } from '../../services/categorie.service';
import {FormControl, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-categorie-dialog',
  templateUrl: './categorie-dialog.component.html',
  styleUrls: ['./categorie-dialog.component.css']
})
export class CategorieDialogComponent implements OnInit {

  categorie = new FormGroup({
    categorieId: new FormControl(''),
    categorieCode: new FormControl(''),
    categorieTitle: new FormControl(''),
    categorieDescription: new FormControl('')
  });

  messageError = null;

  // tslint:disable-next-line:max-line-length
  constructor(public dialogRef: MatDialogRef<CategorieDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public categorieService: CategorieService) { }



  ngOnInit(): void {
    this.categorie = this.data.categorie;
  }

  onSubmit() {

    // tslint:disable-next-line:max-line-length
    if (!this.categorie.controls.categorieCode.value || !this.categorie.controls.categorieTitle.value || !this.categorie.controls.categorieDescription.value) {
      this.messageError = 'Tous les champs doivent être complétés.';
      return false;
    }

    if (this.categorie.controls.categorieId.value) {
      this.categorieService.editCategorie(this.categorie.value).pipe(map(data => {
        this.dialogRef.close({dataReturn: data, insertedVal: this.categorie.value});
      })).subscribe();
    } else {
      this.categorieService.newCategorie(this.categorie.value).pipe(map(data => {
        this.dialogRef.close({dataReturn: data, insertedVal: this.categorie.value});
      })).subscribe();
    }

  }

}
