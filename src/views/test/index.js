import test from './test.vue';
test.routers = [
  {
    name: 'test',
    path: '/views/test',
    meta: { title: 'test' },
    component: test
  }
];

export default test;
