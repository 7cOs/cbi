import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompassUserSearchComponent } from '../compass-user-search/compass-user-search.component';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { UserDTO } from '../../../models/lists/user-dto.model';

describe('Compass User Search Component', () => {
  let fixture: ComponentFixture<CompassUserSearchComponent>;
  let componentInstance: CompassUserSearchComponent;
  let formBuilder: FormBuilder = new FormBuilder();
  let fakeUserDTO: UserDTO = {
      accounts: [],
      roles: [],
      employeeId: '1234',
      firstName: chance.string(),
      lastName: chance.string(),
      email: chance.string(),
      id: chance.string()
    };

  let searchServiceMock = {
    getUsers: jasmine.createSpy('getUsers').and.callFake((arg: any) => {
      return new Promise((resolve, reject) => {
        resolve([
          fakeUserDTO
        ]);
      });
    }),
    setSearchActive: setSearchActive
  };
  function setSearchActive() {
    return true;
  }
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
    fixture.componentInstance.showX = true;
    componentInstance = fixture.componentInstance;
    componentInstance.parentGroup = formBuilder.group({userSearchTerm: ''});
    fixture.detectChanges();
  });

  describe('User input ', () => {
    it('should return for user', () => {
      componentInstance.parentGroup.controls['userSearchTerm'].setValue('tests');
      componentInstance.callSearch();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(componentInstance.searchResults).toEqual([fakeUserDTO]);
      });
    });
  });

  describe('clearModel function', () => {
    it('should clear the form input and selected result and close button', () => {
      componentInstance.parentGroup.controls['userSearchTerm'].setValue('tests');
      componentInstance.clearModel();
      fixture.detectChanges();
      expect(componentInstance.showX).toBeFalsy();
      expect(componentInstance.parentGroup.controls['userSearchTerm'].value).toEqual('');
    });
  });

  describe('resultChosen function', () => {
    it('should select a user and emit an event and call close to hide the ui', () => {
      let testUser = {user: 'test'};
      componentInstance.resultChosen(testUser);
      fixture.detectChanges();

      componentInstance.addedCollaboratorEvent.subscribe((value: object) => {
        expect(value).toEqual(testUser);
      });

      expect(componentInstance.showX).toBeFalsy();
      expect(componentInstance.showSearchIcon).toBeFalsy();
      expect(componentInstance.searchResults).toEqual([]);
      expect(componentInstance.showResults).toBeFalsy();
    });
  });

});
