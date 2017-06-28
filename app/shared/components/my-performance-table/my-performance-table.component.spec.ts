import { By } from '@angular/platform-browser';
import { inject, TestBed, ComponentFixture } from '@angular/core/testing';

import { FormatOpportunitiesTypePipe } from '../../../pipes/formatOpportunitiesType.pipe';
import { TimeAgoPipe } from '../../../pipes/timeAgo.pipe';
import { MyPerformanceTableComponent } from './my-performance-table.component';
import {
  targetListNotificationNotificationMock,
  opportunityNotificationMock,
  storeNotificationMock,
  accountNotificationMock
} from '../../../models/notification.model.mock';

describe('NotificationsComponent', () => {

  let fixture: ComponentFixture<MyPerformanceTableComponent>;

  beforeEach(() => {
    const mockAngulartics2 = jasmine.createSpyObj('angulartics2', ['eventTrack']);
    mockAngulartics2.eventTrack = jasmine.createSpyObj('angulartics2', ['next']);

    TestBed.configureTestingModule({
      declarations: [
        MyPerformanceTableComponent
      ],
      providers: [
        MyPerformanceTableComponent
      ]
    });

    fixture = TestBed.createComponent(MyPerformanceTableComponent);
  });

});
