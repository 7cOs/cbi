import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    selector: 'list-performance-summary',
    template: require('./list-performance-summary.component.pug'),
    styles: [require('./list-performance-summary.component.scss')]
})
export class ListPerformanceSummaryComponent implements OnInit, OnChanges {
    @Input() depletionsTotal: number;
    @Input() depletionsVsYA: number;
    @Input() distributionsTotal: number;
    @Input() distributionsVsYA: number;

    public depletionsTitle: string = 'DEPLETIONS CYTD';
    public distributionsTitle: string = 'EFFECTIVE POD L90';

    ngOnChanges(changes: SimpleChanges): void {
        throw new Error('Method not implemented.');
    }
    ngOnInit(): void {
        throw new Error('Method not implemented.');
    }
}
