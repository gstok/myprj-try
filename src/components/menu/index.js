import GMenu from "./menu.vue";

const routers = [{
    name: "MenuList",
    path: "/views/menu/menu",
    meta: { title: "数聚客" },
    component: GMenu
}];

GMenu.routers = routers;

export default GMenu;