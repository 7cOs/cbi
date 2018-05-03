import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    selector: 'list-performance-summary',
    template: require('./list-performance-summary.component.pug'),
    styles: [require('./list-performance-summary.component.scss')]
})
export class ListPerformanceSummaryComponent implements OnInit, OnChanges {
    // Input for depletionsTotal
    public depletionsTotal: number = 2837;
    // input for depletionsVsYA
    public depletionsVsYA: number = -2.4;
    // input for effectiveDistributionTotal
    public distributionsTotal: number = 7474;
    // input for effectiveDistributionVsYA
    public distributionsVsYA: number = 2.2;

    public depletionsTitle: string = 'DEPLETIONS CYTD';
    public distributionsTitle: string = 'EFFECTIVE POD L90';

    ngOnChanges(changes: SimpleChanges): void {
        throw new Error('Method not implemented.');
    }
    ngOnInit(): void {
        throw new Error('Method not implemented.');
    }
}
