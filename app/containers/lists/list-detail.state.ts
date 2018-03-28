export const configState = ($stateProvider: any) => {
  $stateProvider
  .state('list-detail', {
    url: '/new-lists/:id',
    component: 'listDetail',
    title: 'List'
  });
};
