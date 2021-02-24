import {Component, OnInit, ViewChild} from '@angular/core';
import { LivreService } from '../../services/livre.service';
import {HttpCallService} from '../../services/http-call.service';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';

@Component({
  selector: 'app-livre-liste',
  templateUrl: './livre-liste.component.html',
  styleUrls: ['./livre-liste.component.css']
})
export class LivreListeComponent implements OnInit {

  @ViewChild('paginator') paginator: MatPaginator;
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<Element>(true, []);

  pageEvent: PageEvent;
  httpCallService: HttpCallService;
  active = 'livre';
  displayedColumns = ['select', 'id', 'titre', 'description', 'note', 'categorie', 'action'];
  selectDisplay = [
    {value: 1, text: 'Mes livres'},
    {value: 2, text: 'Tous les livres'}
  ];
  data = [];
  userId = null;
  userIdSave = null;
  totalItems = 0; // Le total des livres
  perPage = 2; // Le nombre par page

  actualPage = 0; // La page actuelle sur laquelle le paginator s'est arrêté.
  actualSize = this.perPage; // La size des elements qui est mise à jour avec le paginator.

  // tslint:disable-next-line:variable-name
  constructor(public _httpCallService: HttpCallService, private httpClient: HttpClient, public livreService: LivreService) {
    this.httpCallService = _httpCallService;
  }

  ngOnInit(): void {

    this.userId = this.userIdSave = localStorage.getItem('userId');
    this.liste(0, this.perPage, this.userId);
  }

  onPageChange(pageEvent: PageEvent) {
    const size = this.actualSize = pageEvent.pageSize;

    const page = this.actualPage = ((pageEvent.pageIndex + 1) * pageEvent.pageSize) - pageEvent.pageSize;

    this.liste(page, size, this.userId);
  }

  onSelectChange(value) {
    if (value === 2) {
      this.userId = null;
    } else {
      this.userId = localStorage.getItem('userId');
    }

    this.liste(0, this.perPage, this.userId);
    this.paginator.pageIndex = 0;
  }

  liste(page, perPage, userId = null): void {

    this.livreService.livreList(page, perPage, userId).pipe(map(data => {
      this.data = [];
      data.livres.rows.forEach((item) => {
        let categorieName = '';
        let inc = 0;

        item.Categories.forEach((categorie) => {
          inc++;
          categorieName += categorie.titre;

          if (inc !== item.Categories.length) {
            categorieName += ' ; ';
          }
        });

        // tslint:disable-next-line:max-line-length
        this.data.push({id : item.id, titre: item.titre, description: item.description, note: item.note, categorie: categorieName, user: item.User});
      });

      this.totalItems = data.totalLivre;

      this.dataSource.data = this.data;

    })).subscribe();
  }

  onDelete(livreId) {
    this.livreService.deleteLivre(livreId).subscribe(data => {
      const dataReturned: any = data;

      if (dataReturned.success) {

        this.paginator.pageIndex = 0;

        console.log(dataReturned);

        this.liste(0, this.perPage, this.userId);
      }
    });
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
