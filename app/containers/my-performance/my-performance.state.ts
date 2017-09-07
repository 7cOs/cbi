export const configState = ($stateProvider: any, resetBreadcrumbFunction: any) => {
  $stateProvider
  .state('my-performance', {
    url: '/my-performance',
    component: 'myPerformance',
    title: 'My Performance'
  });
};
