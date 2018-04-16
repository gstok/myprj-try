
import pageLearn from './learn.vue';

const routers = [
    {
        name: 'learn',
        path: '/views/iviewlearn',
        meta: {
            title: '学习'
        },
        component: pageLearn
    }
];

const iviewLearn = {
    routers: routers
};
export default iviewLearn;