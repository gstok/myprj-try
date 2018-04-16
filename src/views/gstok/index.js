
import myTest from './mytest.vue';

const routers = [
    {
        name: 'myTest',
        path: '/views/gstok/mytest',
        meta: {
            title: '我的测试'
        },
        component: myTest
    }
];

const gstok = { };
gstok.routers = routers;
export default gstok;