import { AfterContentInit, Component, EventEmitter, ContentChildren,  Output, QueryList } from '@angular/core';
import { CompassTabComponent } from './tab/tab.component';

@Component({
  selector: 'compass-tabs',
  styles: [require('./compass-tabs.component.scss')] ,
  template: require('./compass-tabs.component.pug')
})
export class CompassTabsComponent implements AfterContentInit {
  @Output() selectedTab: EventEmitter<{selectedTab: string}> = new EventEmitter<any>();

  @ContentChildren(CompassTabComponent) tabs: QueryList<CompassTabComponent>;
  ngAfterContentInit(): void {
    const activeTabs = this.tabs.filter((tab: CompassTabComponent) => tab.active);
    if (!activeTabs.length) this.selectTab(this.tabs.first);
  }

  public selectTab(selectedTab: CompassTabComponent): void {
    this.tabs.forEach((tab: CompassTabComponent) => tab.active = false);
    selectedTab.active = true;
    this.selectedTab.emit({selectedTab: selectedTab.title});
  }
}
