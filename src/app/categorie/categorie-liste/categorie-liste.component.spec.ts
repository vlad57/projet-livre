import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorieListeComponent } from './categorie-liste.component';

describe('CategorieListeComponent', () => {
  let component: CategorieListeComponent;
  let fixture: ComponentFixture<CategorieListeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategorieListeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategorieListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
