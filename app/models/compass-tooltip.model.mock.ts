import { CompassTooltipObject } from './compass-tooltip-component.model';

export function getTooltipMock(): CompassTooltipObject {
  return {
    title: chance.string(),
    position: 'below',
    descriptions: Array(chance.natural({min: 1, max: 5})).fill('').map(() => chance.string())
  };
}
