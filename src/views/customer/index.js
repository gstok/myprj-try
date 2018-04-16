import List from './list.vue';
import CustDetail from './detail';
import addcust from './addcust';

const routers = [{
        name: 'customerList',
        path: '/views/customer/list',
        meta: { title: '客户管理' },
        component: List
    },
    {
        name: 'custDetail',
        path: '/views/customer/detail',
        meta: { title: '客户详情' },
        component: CustDetail
    },
    {
        name: 'addcust',
        path: '/views/customer/addcust',
        meta: { title: '新建客户' },
        component: addcust
    }
];
const customer = {};
customer.routers = routers;
export default customer;