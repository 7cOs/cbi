import { ComponentFixture, fakeAsync, TestBed,  tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActionButtonComponent } from './action-button.component';

describe('ActionButtonComponent', () => {
    let fixture: ComponentFixture<ActionButtonComponent>;
    let componentInstance: ActionButtonComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ ActionButtonComponent ]
        });

    fixture = TestBed.createComponent(ActionButtonComponent);
    componentInstance = fixture.componentInstance;
    fixture.detectChanges();
    });

    it('Should call onButtonClicked when element is clicked', fakeAsync(() => {
        spyOn(componentInstance, 'onButtonClicked').and.callThrough();
        const element = fixture.debugElement.query(By.css('.btn-action')).nativeElement;
        element.click();
        expect(componentInstance.onButtonClicked).toHaveBeenCalled();
    }));

    it('Should emit onActionButtonClicked event when button is clicked', fakeAsync(() => {
        componentInstance.actionLabel = 'Add To List';
        spyOn(componentInstance.onActionButtonClicked, 'emit');
        componentInstance.onButtonClicked();
        tick(1);
        expect(componentInstance.onActionButtonClicked.emit).toHaveBeenCalled();
        expect(componentInstance.onActionButtonClicked.emit).toHaveBeenCalledWith({actionType: 'Add To List'});
    }));

    it('Should make the button disabled when passed from parent', () => {
        componentInstance.isDisabled = true;
        const element = fixture.debugElement.query(By.css('.btn-action')).nativeElement;
        fixture.detectChanges();
        expect(element.disabled).toBeTruthy();
    });

    it('Should make the button enabled when passed from parent', () => {
        componentInstance.isDisabled = false;
        const element = fixture.debugElement.query(By.css('.btn-action')).nativeElement;
        fixture.detectChanges();
        expect(element.disabled).toBeFalsy();
    });
});
