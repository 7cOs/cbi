import { Component, ContentChildren, QueryList, AfterContentInit, Output, EventEmitter } from '@angular/core';
import { CompassTabComponent } from './tab/tab.component';

@Component({
  selector: 'compass-tabs',
  styles: [require('./compass-tabs.component.scss')] ,
  template: require('./compass-tabs.component.pug')
})
export class CompassTabsComponent implements AfterContentInit {
  @Output() onTabClicked = new EventEmitter<string>();

  @ContentChildren(CompassTabComponent) tabs: QueryList<CompassTabComponent>;

  ngAfterContentInit(): void {
    const activeTabs = this.tabs.filter((tab: CompassTabComponent) => tab.active);
    if (!activeTabs.length) this.selectTab(this.tabs.first);
  }

  public selectTab(selectedTab: CompassTabComponent): void {
    this.tabs.forEach((tab: CompassTabComponent) => tab.active = false);
    selectedTab.active = true;

    this.onTabClicked.emit(selectedTab.title);
  }
}
