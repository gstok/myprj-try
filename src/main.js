import Vue from "vue";
import iView from "iview";
import VueRouter from "vue-router";
import VueCookies from "vue-cookies";
import axios from "axios";
import Util from "./libs/util";
import Index from "./views/index.vue";
import "iview/dist/styles/iview.css";

Vue.use(VueCookies);
Vue.use(VueRouter);
Vue.use(iView);

Vue.prototype.axios = axios;

import { post, fetch, patch, put } from "./utils/http";
import GPage from "./components/page";
import GGroup from "./components/group";
import GGroupsearch from "./components/groupSearch";
// 音乐播放组件
import GAudio from "./components/audio";

/* 跟客户列表和详情页相关的组件----开始 */

// 引入组件收起弹出菜单
import SlidingMenu from "./components/slidingmenu/SlidingMenu.vue";
// 引入打电话组件
import call from "./components/custorm/call.vue";
// 引入发邮件组件
import sendmail from "./components/custorm/sendmail.vue";
// 最后联系时间的组件
import finalcontact from "./components/custorm/finalcontact.vue";

/* 跟客户列表和详情页相关的组件----结束 */

import GTable from "./components/gtable";

//添加招呼语
import addfriendsgreet from "./components/addfriendsgreeting";
//引入微信登录
import wxLogin from "./components/weChatLogin";

//定义全局变量
Vue.prototype.$post = post;
Vue.prototype.$fetch = fetch;
Vue.prototype.$patch = patch;
Vue.prototype.$put = put;

// 定义权限按钮全局变量
Vue.prototype.perObj = {
    permissionStatus: null,
    perList: []
};
// 业务全局变量

Vue.prototype.global = {
    baseUrl: "/user-apis",
    userInfo: {}
};

Vue.component("GPage", GPage);
Vue.component("GGroup", GGroup);
Vue.component("GGroupsearch", GGroupsearch);
Vue.component("GTable", GTable);
Vue.component("GAudio", GAudio);
// 添加好友招呼语设置
Vue.component("addfriendsgreet", addfriendsgreet);
//微信登录
Vue.component("wxLogin", wxLogin);
// 注册全局 （收起与展开菜单） 组件
Vue.component("SlidingMenu", SlidingMenu);
// 打电话组件
Vue.component("call", call);
// 发送邮件组件
Vue.component("sendmail", sendmail);
// 最后的联系时间组件
Vue.component("finalcontact", finalcontact);
let routerConfig = [];

// 模块依赖
import Customer from "./views/customer";
import Test from "./views/test";

import gstok from "./views/gstok";

routerConfig = routerConfig.concat(Customer.routers);
routerConfig = routerConfig.concat(Test.routers);
routerConfig = routerConfig.concat(gstok.routers);
// routerConfig = routerConfig.concat(Menu.routers);

// 路由配置
const RouterConfig = {
    mode: "history",
    routes: routerConfig
};
const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    Util.title(to.meta.title);
    next();
});

router.afterEach((to, from, next) => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});

new Vue({
    el: "#app",
    router: router,
    render: h => h(Index),
    methods: {
        perEvent(module, code) {
            if (localStorage.getItem("isAdmin") == 1 || !this.perObj.permissionStatus) {
                return true;
            } else {
                this.perObj.perList.forEach(function(item, i) {
                    if (item["moduleCode"] == module) {
                        if (item["permissionCode"] == code) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                });
            }
        }
    }
});