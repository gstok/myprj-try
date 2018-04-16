<style>
    .geeker-menu {
        width: 200px;
        position: fixed;
        top: 0;
        left: 0;
        background: #2b2f47;
        float: left;
        z-index: 100;
        min-height: 100vh;

        .menuTop {
            width: 200px;
            height: 69px;
            background: #45528e;
            color: #fff;
            text-align: center;
            vertical-align: middle;
            font-size: 14px;
            display: table-cell;
        }

        .ivu-menu {
            background: #2b2f47;
        }

        .ivu-menu-vertical {
            .ivu-menu-opened {
                background: #262837;

                .ivu-menu-submenu-title {
                    background: #262837;
                }
            }

            .ivu-menu-submenu-title {
                background: #2b2f47;
            }

            .ivu-menu-submenu-title:hover {
                background: #262837;
            }
        }
    }
</style>
<template>
    <Layout class="geeker-menu">
        <Sider :style="{position: 'fixed', height: '100vh', left: 0, overflow: 'auto', background: '#2b2f47'}">
            <div class="menuTop">
                <div>
                    <span>DATA</span>
                    <img src="/view/images/dcrm.png" alt="" />
                    <span>GEEKR</span>
                </div>
            </div>
            <Menu active-name="/views/customer/list" accordion :theme="menuTheme" width="auto" :open-names="['cust']" @on-select="menuClick">

                <Submenu v-for="oneMenu in oneLevelMenu" v-if="!oneMenu.resUrl" :name="oneMenu.resCode">
                    <template slot="title">
                        <i :class="'icon icon-' + oneMenu.icon"></i>
                        {{oneMenu.resName}}
                    </template>
                    <MenuItem v-for="twoMenu in twoLevelMenu"
                              v-if="twoMenu.parentId === oneMenu.id"
                              :name="twoMenu.resUrl">{{twoMenu.resName}}</MenuItem>
                </Submenu>
                <MenuItem v-else :name="oneMenu.resUrl">
                    <i :class="'icon icon-' + oneMenu.icon"></i>
                    {{oneMenu.resName}}
                </MenuItem>
            </Menu>
        </Sider>
    </Layout>
</template>
<script>
    export default {
        name: "GMenu",
        data() {
            return {
                menuTheme: 'dark',
                oneLevelMenu: [],
                twoLevelMenu: []
            }
        },
        created() {
            this.getMenuList(); //获取菜单数据
        },
        methods: {
            menuClick (url) {
                window.location.href = url;
            },
            getMenuList: function() {
                let that = this;
                this.$post(this.global.baseUrl + "/pc/user/selectById.action").then(res => {
                    if (res.code === 200) {
                        this.global.userInfo.isAdmin =res.data.obj.isAdmin;
                        res.data.sysResList.forEach(function(item, i) {
                            if (item.isDisplay === 1) {
                                if (item.resType === 1) {
                                    console.log(item);
                                    that.oneLevelMenu.push(item);
                                } else if (item.resType === 2) {
                                    that.twoLevelMenu.push(item);
                                }
                            }
                        });
                    }
                });
            }
        }
    }
</script>