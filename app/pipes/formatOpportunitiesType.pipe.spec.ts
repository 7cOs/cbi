import { FormatOpportunitiesTypePipe } from './formatOpportunitiesType.pipe';

describe('Pipe: formatOpportunitiesType', () => {
  let pipe: FormatOpportunitiesTypePipe = new FormatOpportunitiesTypePipe();

  it('should work with empty string', () => {
    expect(pipe.transform('')).toEqual('');
  });

  it('should leave a non matchin string as is', () => {
    expect(pipe.transform('NOT MATCHING ANYTHING')).toEqual('NOT MATCHING ANYTHING');
  });

  it('should transform correct values', () => {
    const input = [
      'Mixed',
      'ND001',
      'ND_001',
      'AT_RISK',
      'NON_BUY',
      'NEW_PLACEMENT_NO_REBUY',
      'NEW_PLACEMENT_QUALITY',
      'LOW_VELOCITY'
    ];

    const expectedOutput = [
      'Custom',
      'New Distribution',
      'New Distribution',
      'At Risk',
      'Non-Buy',
      'New Placement No Rebuy',
      'New Placement Quality',
      'Low Velocity'
    ];

    const calculatedOutput = input.map((elem) => pipe.transform(elem));

    expect(calculatedOutput).toEqual(expectedOutput);
  });
});
