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
      expect(componentInstance.firstName).toBe(mockUserService.model.currentUser.firstName);
      expect(componentInstance.lastName).toBe(mockUserService.model.currentUser.lastName);
    });
  });

  describe('ngOnChange', () => {

    beforeEach(() => {
      componentInstance.ngOnChanges();
    });

    it('should get firstName and lastName from userService', () => {
      spyOn(componentInstanceCopy, 'getOwnerName').and.callThrough();
      expect(componentInstanceCopy.getOwnerName).toHaveBeenCalledWith(componentInstance.firstName, componentInstance.lastName);
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
