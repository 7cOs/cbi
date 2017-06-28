export const configState = ($stateProvider: any) => {
  $stateProvider
  .state('my-performance', {
    url: '/my-performance',
    component: 'myPerformance'
  });
};
