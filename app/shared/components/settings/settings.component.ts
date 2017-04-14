import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'settings',
  template: require('./settings.component.pug')
})
export class SettingsComponent implements OnInit {
  firstName: string;
  lastName: string;
  versionNumber: string;
  versionHash: string;

  constructor(@Inject('userService') private userService: any, @Inject('versionService') private versionService: any) {}

  ngOnInit() {
    this.firstName = this.userService.model.currentUser.firstName;
    this.lastName = this.userService.model.currentUser.lastName;

    this.versionService.getVersion().then((data) => {
      this.versionNumber = data.version;
      this.versionHash = data.hash;
    });
  }
}
