import { Component, EventEmitter, HostListener, Output, Inject, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UserDTO } from '../../../models/lists/user-dto.model';

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
  public searchResults: Array<UserDTO> = [];
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

  public clearModel(): void {
    this.parentGroup.get('userSearchTerm').patchValue('');
    this.showX = false;
  }

  public callSearch(): void {
    if (this.parentGroup.get('userSearchTerm').value.length < 3) {
      this.showLengthError = true;
    }
    this.loading = true;
    this.searchResults = [];
    this.errorMessage = null;
    this.showResults = true;
    this.showSearchIcon = true;

    this.searchService.setSearchActive(true);

    this.searchService['getUsers'](this.parentGroup.get('userSearchTerm').value).then((data: Array<UserDTO>) => {
      this.loading = false;
      this.searchResults = data;
    }, (reason: string) => {
      this.loading = false;
      this.errorMessage = reason;
    });
  }

  public resultChosen(result: any): void {
    this.showSearchIcon = false;
    this.showX = false;
    this.addedCollaboratorEvent.emit(result);
    this.close();
  }

  public close(): void {
    this.parentGroup.get('userSearchTerm').patchValue('');
    this.showX = false;
    this.loading = false;
    this.searchResults = [];
    this.showResults = false;
  }

  public checkSearchTermLength (): boolean {
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
