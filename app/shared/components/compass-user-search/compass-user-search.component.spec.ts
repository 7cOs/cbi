import * as Chance from 'chance';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { CompassUserSearchComponent } from '../compass-user-search/compass-user-search.component';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, FormBuilder } from '@angular/forms';

const chance = new Chance();

fdescribe('Compass User Search Component', () => {
  let fixture: ComponentFixture<CompassUserSearchComponent>;
  let componentInstance: CompassUserSearchComponent;
  let fixtureDebugElement: DebugElement;
  let formBuilder: FormBuilder = new FormBuilder();
  let searchServiceMock = {
    getUsers: getUsers,
    setSearchActive: setSearchActive
  };
  function getUsers (value: string) {
    return new Promise((resolve, reject) => {
      resolve([{value: 'test'}]);
    });
  }
  function setSearchActive() {
    return true;
  }
  let searchService: any;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      declarations: [ CompassUserSearchComponent ],
      providers: [
        {
          provide: 'searchService',
          useValue: searchServiceMock
        },
        { provide: FormBuilder,
          useValue: formBuilder
        }
      ]
    });

    fixture = TestBed.createComponent(CompassUserSearchComponent);
    componentInstance = fixture.componentInstance;
    componentInstance.parentGroup = formBuilder.group({userSearchTerm: ''});
    fixture.detectChanges();
  });

  describe('User input ', () => {
    it('should return for user', () => {
      spyOn(searchServiceMock, 'getUsers').and.callFake(function() {
        return {
          then: (callback: any) => { return callback([{value: 'test'}]); }
        };
      });
      componentInstance.parentGroup.controls['userSearchTerm'].setValue('tests');
      componentInstance.callSearch();
      fixture.detectChanges();wan
      expect(componentInstance.searchResults).toBe([{value: 'test'}]);
    });
  });

});
