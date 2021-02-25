import {Component, OnInit, ViewChild} from '@angular/core';
import { CategorieService } from '../../services/categorie.service';
import {HttpCallService} from '../../services/http-call.service';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {LivreService} from '../../services/livre.service';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {CategorieDialogComponent} from '../categorie-dialog/categorie-dialog.component';
import {FormControl, FormGroup} from '@angular/forms';


export interface DialogCategorie {
  id: number;
  code: string;
  titre: string;
  description: string;
}

@Component({
  selector: 'app-categorie-liste',
  templateUrl: './categorie-liste.component.html',
  styleUrls: ['./categorie-liste.component.css']
})
export class CategorieListeComponent implements OnInit {

  active = 'categorie';
  userId = null;
  userIdSave = null;
  data = [];
  displayedColumns = ['select', 'id', 'code', 'titre', 'description', 'action'];
  perPage = 5; // Le nombre par page
  totalItems = 0; // Le total des catégories

  categorie = new FormGroup({
    categorieId: new FormControl(''),
    categorieCode: new FormControl(''),
    categorieTitle: new FormControl(''),
    categorieDescription: new FormControl('')
  });

  @ViewChild('paginator') paginator: MatPaginator;
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<Element>(true, []);
  pageEvent: PageEvent;
  httpCallService: HttpCallService;

  // tslint:disable-next-line:variable-name
  constructor(public _httpCallService: HttpCallService, public dialog: MatDialog, public categorieService: CategorieService) {
    this.httpCallService = _httpCallService;
  }

  ngOnInit(): void {
    this.userId = this.userIdSave = localStorage.getItem('userId');
    this.liste(0, this.perPage, this.userId);
  }

  addEditCategorie(categorieId = null) {
    if (categorieId) {
      this.categorieService.getCategorie(categorieId).pipe(map(data => {
        this.categorie.controls.categorieId.setValue(data.id);
        this.categorie.controls.categorieCode.setValue(data.code);
        this.categorie.controls.categorieTitle.setValue(data.titre);
        this.categorie.controls.categorieDescription.setValue(data.description);
      })).subscribe();
    } else {
      this.categorie.reset();
    }

    const dialogRef = this.dialog.open(CategorieDialogComponent, {
      width: '100%',
      height: 'auto',
      data: {categorie: this.categorie}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && (result.dataReturn.created || result.dataReturn.isUpdated)) {
        this.liste(0, this.perPage, this.userId);

        if (this.paginator) {
          this.paginator.pageIndex = 0;
        }
      }
    });
  }


  liste(page, size, userId) {
    // @ts-ignore
    this.categorieService.categorieList(page, size, userId).pipe(map(data => {
      this.data = [];

      if (data.categories) {
        data.categories.rows.forEach((item) => {
          this.data.push({id: item.id, code: item.code, titre: item.titre, description: item.description});
        });

        this.totalItems = data.totalCategorie;

        this.dataSource.data = this.data;
      }

    })).subscribe();
  }

  onPageChange(pageEvent: PageEvent) {
    const size =  pageEvent.pageSize;

    const page = ((pageEvent.pageIndex + 1) * pageEvent.pageSize) - pageEvent.pageSize;

    this.liste(page, size, this.userId);
  }

  onDelete(categorieId) {
    if (confirm('Etes-vous sur de vouloir supprimer ?')) {
      this.categorieService.deleteCategorie(categorieId).pipe(map(data => {
        const dataReturned: any = data;

        if (dataReturned.deleted) {

          this.paginator.pageIndex = 0;

          this.liste(0, this.perPage, this.userId);
        }
      })).subscribe();
    }
  }

  onSelectGroup(value) {
    const idsToDelete = [];
    if (value === 'SUPPR_GROUP') {
      this.selection.selected.forEach(item => {
        idsToDelete.push(item.id);
      });

      this.onDelete(idsToDelete);

      this.selection.clear();
    }
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

}
