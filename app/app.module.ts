import { NgModule, forwardRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeAdapter } from '@angular/upgrade';

// import { AngularTwoDemoComponent } from './shared/components-ng2/angular-two-demo/angular-two-demo.component';
// import { AngularTwoDemoService } from './shared/services/angular-two-demo.service';

// Using forwardRef() to reference AppModule passed to UpgradeAdapter, because AppModule
// takes upgraded components created by UpgradeAdapter in its definition
export const AppUpgradeAdapter = new UpgradeAdapter(forwardRef(() => AppModule)); // tslint:disable-line:variable-name

// make ng1 components/services available to ng2 code
const datepickerComponent = AppUpgradeAdapter.upgradeNg1Component('datepicker');
AppUpgradeAdapter.upgradeNg1Provider('userService');

@NgModule({
  imports: [ BrowserModule ],
  // declarations: [AngularTwoDemoComponent, datepickerComponent],
  // providers: [ AngularTwoDemoService ]
  declarations: [ datepickerComponent ],
  providers: [ ]
})
export class AppModule {}
