import { Component, EventEmitter, HostListener, Output, Inject, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

const ENTER = 13;

@Component({
  selector: 'compass-user-search',
  template: require('./compass-user-search.component.pug'),
  styles: [require('./compass-user-search.component.scss')]
})

export class CompassUserSearchComponent {
  @Input() parentGroup: FormGroup;
  @Output() addedCollaboratorEvent  = new EventEmitter<object>();

  public showSearchIcon: boolean = false;
  public showResults: boolean = false;
  public errorMessage: string = '';
  public searchResults: Array<any> = [];
  public selectedResult: object = {};
  public showLengthError: boolean = false;
  public loading: boolean = false;
  public showX: boolean = false;

  constructor(
    @Inject('searchService') private searchService: any
  ) {
  }

  @HostListener('document:keydown', ['$event']) public handleKeydown(event: KeyboardEvent) {
    this.showSearchIcon = true;
    if (event.keyCode === ENTER) {
      event.preventDefault();
      this.callSearch();
    } else {
      this.showResults = false;
      this.showLengthError = false;
    }
  }

  public clearModel() {
    this.selectedResult = null;
    this.parentGroup.get('userSearchTerm').patchValue('');
    this.showX = false;
  }

  public callSearch() {
    if (this.parentGroup.get('userSearchTerm').value.length < 3) {
      this.showLengthError = true;
    }
    this.loading = true;
    this.searchResults = [];
    this.selectedResult = {};
    this.errorMessage = null;
    this.showResults = true;
    this.showSearchIcon = true;

    this.searchService.setSearchActive(true);

    this.searchService['getUsers'](this.parentGroup.get('userSearchTerm').value).then((data: Array<object>) => {
      this.loading = false;
      this.searchResults = data;
    }, (reason: string) => {
      this.loading = false;
      this.errorMessage = reason;
    });
  }

  public resultChosen(result: any) {
    this.showSearchIcon = false;
    this.showX = false;
    this.selectedResult = result;
    this.addedCollaboratorEvent.emit(this.selectedResult);
    this.close();
  }

  public close() {
    this.parentGroup.get('userSearchTerm').patchValue('');
    this.selectedResult = {};
    this.showX = false;
    this.loading = false;
    this.searchResults = [];
    this.showResults = false;
  }

  public checkSearchTermLength () {
    return this.parentGroup.get('userSearchTerm').value.length > 2 ? true : false;
  }

  public userDataFormat(user: any) {
    if (user) {
      if (user.roles.length > 0) {
        return user.roles[0] + ' | ' + user.email;
      } else {
        return user.email;
      }
    }
  }
}
