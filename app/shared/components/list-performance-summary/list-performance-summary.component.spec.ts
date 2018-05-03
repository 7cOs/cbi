import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    selector: 'list-performance-summary',
    template: require('./list-performance-summary.component.pug'),
    styles: [require('./list-performance-summary.component.scss')]
})
export class ListPerformanceSummary implements OnInit, OnChanges {
    // Input for depletionsTotal
    // input for depletionsVsYA
    // input for effectiveDistributionTotal
    // input for effectiveDistributionVsYA

    ngOnChanges(changes: SimpleChanges): void {
        throw new Error('Method not implemented.');
    }
    ngOnInit(): void {
        throw new Error('Method not implemented.');
    }
}
