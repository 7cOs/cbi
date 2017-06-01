import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../state/reducers/root.reducer';
import { FetchVersionAction } from '../../../state/actions/compass-version.action';

@Component({
  selector: 'app-root',
  template: require('./app.component.pug')
})
export class AppComponent implements OnInit {

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.store.dispatch(new FetchVersionAction());
  }
}
