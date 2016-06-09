import { enableProdMode } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { WelcomeComponent } from './components/welcome/welcome.component';

// enableProdMode();

bootstrap(WelcomeComponent)
  .then(success => console.info('App status: started'))
  .catch(error => console.log(error));
