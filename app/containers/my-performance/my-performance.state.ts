export const configState = ($stateProvider: any) => {
  $stateProvider
  .state('team-performance', {
    url: '/team-performance',
    component: 'myPerformance'
  });
};
