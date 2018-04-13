import { Component, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { TabComponent } from './tab/tab.component';

@Component({
  selector: 'compass-tabs',
  styles: [require('./compass-tabs.component.scss')] ,
  template: require('./compass-tabs.component.pug')
})
export class CompassTabsComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;
  ngAfterContentInit(): void {
    const activeTabs = this.tabs.filter((tab: TabComponent) => tab.active);
    if (!activeTabs.length) this.selectTab(this.tabs.first);
  }

  public selectTab(selectedTab: TabComponent): void {
    this.tabs.forEach((tab: TabComponent) => tab.active = false);
    selectedTab.active = true;
  }
}
