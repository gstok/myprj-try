
import pageTable from "./table.vue";

const routers = [
    {
        name: 'table',
        path: '/views/table',
        meta: {
            title: '表格学习'
        },
        component: pageTable
    }
];

const iviewTable = {
    routers: routers
};
export default iviewTable;