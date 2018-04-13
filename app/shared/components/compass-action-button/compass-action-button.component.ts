import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ActionButtonType } from '../../../enums/action-button-type.enum';

@Component({
    selector: 'compass-action-button',
    template: require('./compass-action-button.component.pug'),
    styles: [ require('./compass-action-button.component.scss') ]
})

export class CompassActionButtonComponent {
    @Input() actionLabel: ActionButtonType;
    @Input() isDisabled: boolean;
    @Output() onActionButtonClicked: EventEmitter<{actionType: ActionButtonType}> = new EventEmitter<{actionType: ActionButtonType}>();

    onButtonClicked(): void {
        this.onActionButtonClicked.emit({actionType: this.actionLabel});
    }
}
