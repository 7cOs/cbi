export const configState = ($stateProvider: any) => {
  $stateProvider
  .state('list-detail', {
    url: '/lists/:id',
    component: 'listDetail',
    title: 'List'
  });
};
