import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListPerformanceSummaryComponent } from './list-performance-summary.component';
import { CompassListClassUtilService } from '../../../services/compass-list-class-util.service';

describe('ListPerformanceSummaryComponent', () => {
  let fixture: ComponentFixture<ListPerformanceSummaryComponent>;
  let componentInstance: ListPerformanceSummaryComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListPerformanceSummaryComponent],
      providers: [CompassListClassUtilService]
    });

    fixture = TestBed.createComponent(ListPerformanceSummaryComponent);
    componentInstance = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should check if  component to be defined', () => {
      expect(componentInstance).toBeDefined();
    });

    it('should put class values into css variables', () => {
      componentInstance.depletionsVsYA = 1;
      componentInstance.distributionsVsYA = 1;

      fixture.detectChanges();
      expect(componentInstance.depletionsVsYAColorClass).toBe('positive');
      expect(componentInstance.distributionsVsYAColorClass).toBe('positive');
    });
  });

  describe('getPercentColorClass', () => {
    it('should get positive classes for postive number', () => {
      const cls = componentInstance.getPercentColorClass(1);
      expect(cls).toEqual('positive');
    });

    it('should get negative classes for negative number', () => {
      const cls = componentInstance.getPercentColorClass(-1);
      expect(cls).toEqual('negative');
    });

    it('should get positive classes for 0', () => {
      const cls = componentInstance.getPercentColorClass(0);
      expect(cls).toEqual('positive');
    });

    it('should get positive classes for undefined', () => {
      const cls = componentInstance.getPercentColorClass(undefined);
      expect(cls).toEqual('positive');
    });
  });
});
