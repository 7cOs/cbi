import { ListOpportunitiesTableRowComponent } from './list-opportunities-table-row.component';
import { MatCheckboxModule } from '@angular/material';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CompassListClassUtilService } from '../../../services/compass-list-class-util.service';

const chance = new Chance();

describe('ListOpportunitiesTableRowComponent', () => {
  let fixture: ComponentFixture<ListOpportunitiesTableRowComponent>;
  let componentInstance: ListOpportunitiesTableRowComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatCheckboxModule],
      declarations: [ListOpportunitiesTableRowComponent],
      providers: [CompassListClassUtilService]
    });

    fixture = TestBed.createComponent(ListOpportunitiesTableRowComponent);
    componentInstance = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should check if  component to be defined', () => {
      expect(componentInstance).toBeDefined();
    });
  });

  describe('getTrendClass', () => {
    it('should return positive if given a positive number', () => {
      const cls = componentInstance.getTrendClass(chance.floating({min: 1.0}));
      expect(cls).toEqual('positive');
    });

    it('should return positive if given 0', () => {
      const cls = componentInstance.getTrendClass(0);
      expect(cls).toEqual('positive');
    });

    it('should return negative if given a negative number', () => {
      const cls = componentInstance.getTrendClass(chance.floating({max: -0.1}));
      expect(cls).toEqual('negative');
    });
  });

});
