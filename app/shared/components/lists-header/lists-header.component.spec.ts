import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ListsHeaderComponent } from './lists-header.component';

describe('ListsHeaderComponent', () => {
  let fixture: ComponentFixture<ListsHeaderComponent>;
  let componentInstance: ListsHeaderComponent;
  let componentInstanceCopy: any;
  const mockUserService = {
    model: {
      currentUser: {
        firstName: chance.string(),
        lastName: chance.string()
      }
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ListsHeaderComponent
      ],
      providers: [
        {
          provide: 'userService',
          useValue: mockUserService
        }
      ]
    });

    fixture = TestBed.createComponent(ListsHeaderComponent);
    componentInstance = fixture.componentInstance;
    componentInstanceCopy = componentInstance as any;
  });

  describe('ngOnInit', () => {

    beforeEach(() => {
      componentInstance.ngOnInit();
    });

    it('should get firstName and lastName from userService', () => {
      expect(componentInstanceCopy.firstName).toBe(mockUserService.model.currentUser.firstName);
      expect(componentInstanceCopy.lastName).toBe(mockUserService.model.currentUser.lastName);
    });
  });

  describe('ngOnChange', () => {

    beforeEach(() => {
      componentInstance.ngOnInit();
    });

    it('should call the function `getOwnerName` with right parameters', () => {
      spyOn(componentInstanceCopy, 'getOwnerName').and.callThrough();
      componentInstance.ngOnChanges();
      fixture.detectChanges();
      expect(componentInstanceCopy.getOwnerName).toHaveBeenCalledWith(mockUserService.model.currentUser.firstName,
        mockUserService.model.currentUser.lastName);
    });
  });

  describe('component outputs', () => {

    it('should emit an event when the manage button is clicked', (done) => {
      fixture.detectChanges();
      componentInstance.manageButtonClicked.subscribe(() => {
        done();
      });
      fixture.debugElement.query(By.css('.btn-action')).triggerEventHandler('click', null);
    });

    it('should emit an event when the lists link is clicked', (done) => {
      fixture.detectChanges();
      componentInstance.listsLinkClicked.subscribe(() => {
        done();
      });
      fixture.debugElement.query(By.css('.link')).triggerEventHandler('click', null);
    });

  });
});
