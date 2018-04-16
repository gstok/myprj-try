<style type="less">
html {
  height: 100%;
  overflow: hidden;
}
.menu {
  display: block;
  overflow: auto;
  height: 100%;
  ul {
    list-style: none none;
  }
  .menuNormal {
    height: 100%;
    background: #2b2f47;
    .menuTop {
      width: 100%;
      height: 69px;
      background: #45528e;
      color: #fff;
      text-align: center;
      img {
        margin: 16px 10px 0;
      }
    }

    ul {
      overflow: hidden;
      font-size: 14px;
      font-weight: bold;
      vertical-align: middle;

      .index {
        padding: 0 20px 0 20px;
      }

      li {
        cursor: pointer;
        border-bottom: 1px solid #23273e;

        a {
          line-height: 48px;
          color: #7b8299;
          width: 100%;
          height: 100%;

          .res-icon {
            float: left;
            width: 32px;
          }
        }

        div {
          line-height: 48px;
          color: #7b8299;
          width: 100%;
          height: 100%;
          padding: 0 20px 0 20px;

          .res-icon {
            float: left;
            width: 32px;
          }

          .res-switch {
            float: right;
          }
        }

        a:hover,
        div:hover {
          color: #fff;
        }

        .active {
          background-color: #262837;
          color: #fff;
        }

        .menuSbox {
          background-color: #2b2f47;
          li {
            div {
              padding-left: 54px;
            }
            a:hover,
            div:hover {
              background-color: #262837;
              color: #fff;
            }
            .active {
              background-color: #262837;
              color: #fff;
            }
          }
        }
      }
    }
  }

  .menuTop {
    height: 69px;
    background: #45528e;
    img {
      margin-left: 10px;
      margin-top: 15px;
    }
  }
}

/*small menu*/
.menu .meanSmall {
  position: fixed;
  left: 0;
  top: 0;
  background: #2b2f47;
  min-height: 100%;
}

.menu .meanSmall > ul > li {
  position: relative;
  width: 60px;
  padding: 10px 20px;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  line-height: 25px;
  cursor: pointer;
  color: #bac4da;
  border-bottom: 1px solid #24283f;
}

.menu .meanSmall > ul > li ul {
  position: absolute;
  left: 60px;
  top: 0;
  z-index: 9;
  min-height: 45px;
  width: 100px;
  background: #232830;
  text-align: center;
}

.menu .meanSmall > ul > li ul > li a {
  padding: 0;
  width: 100px;
  height: 45px;
  line-height: 45px;
  color: #7b8299;
}

.menu .meanSmall > ul > li.active,
.menu .meanSmall > ul > li ul > li a:hover {
  color: #fff;
  background: #262837;
}

.menu .meanSmall > ul > li:hover {
  color: #fff;
  background: #262837;
}

.menu .meanSmall > ul > li ul > li:last-of-type {
  padding-bottom: 15px;
}

/*head*/
.head {
  z-index: 999;
  height: 70px;
  background: #fff;
  border-bottom: 1px solid #dedede;
}

.head .menuSet {
  float: left;
  margin-top: 20px;
  width: 30px;
  height: 30px;
  background: #45528e;
  color: #fff;
  line-height: 30px;
  text-align: center;
  cursor: pointer;
  border-radius: 0 15px 15px 0;
}

.head .menuSet span {
  color: #45528e;
  margin-right: -6px;
}

.head .userImg {
  padding: 0;
  float: left;
  width: 35px;
  height: 35px;
}

.head .userImg img {
  width: 35px;
  height: 35px;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
  float: left;
}

.head .headTit {
  padding-left: 46px;
  line-height: 70px;
  font-size: 14px;
  color: #808080;
  float: left;
}

.head .headTit span {
  color: #45528e;
  margin-left: 10px;
}

.head .headUser {
  float: left;
  margin: 17px 40px 0 0;
  position: relative;
}

.head .headUser i {
  position: absolute;
  right: 10px;
  top: 5px;
  cursor: pointer;
  z-index: 99;
}

.head .usernameInput {
  width: 250px;
  line-height: 30px;
  color: #555;
  float: left;
  padding: 0 20px;
  border-radius: 17px;
}

.head .headOff {
  float: right;
  width: 70px;
  height: 70px;
  line-height: 70px;
  text-align: center;
  margin-right: 5px;
}

.head .headOff i {
  font-size: 25px;
}

.head .headOff:hover {
  cursor: pointer;
}

.dropdown-menu > li > a:hover {
  background: #606cbf;
}

.ivu-layout-sider-collapsed .menu .menuNormal {
  width: 0px;
  transition: width 0.2s ease;
  overflow: hidden;
}

.user-head {
  width: 70px;
  height: 70px;
  float: right;
  padding-left: 17px;
  padding-top: 17px;
  line-height: 34px;
  font-size: 14px;
  color: #333;

  .user-img {
    width: 36px;
    height: 36px;
    border-radius: 18px;
    /*margin-top: 17px;*/
    /*margin-left: 17px;*/
  }

  .ivu-dropdown-menu {
    width: 160px;

    .ivu-dropdown-item {
      a {
        font-size: 14px;
        color: #333;
      }
    }
  }
}

.verticalLine {
  position: relative;
  top: 3px;
  width: 2px;
  height: 16px;
  background: #586ac0;
  display: inline-block;
  margin-right: 5px;
}

h2 {
  font-weight: bold;
  color: #333;
  font-size: 14px;
  margin: 20px 0 10px 0;
}

h2 a {
  color: #333;
}

#page-wrapper {
  overflow: auto;
  padding: 15px;
  background: #f0f0f5;
}

.clearfix {
  *zoom: 1;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
  height: 0;
}

.clearfix:after {
  clear: both;
}

.clearfix:after {
  content: "\0020";
  display: block;
  height: 0;
  clear: both;
}

.clearfix {
  zoom: 1;
}

ul > li {
  list-style: none;
}

textarea {
  resize: none;
  outline: none;
}

// 滚动条
::-webkit-scrollbar {
  width: 14px;
  height: 14px;
}
::-webkit-scrollbar-track,
::-webkit-scrollbar-thumb {
  border-radius: 999px;
  border: 5px solid transparent;
}
::-webkit-scrollbar-track {
  box-shadow: 1px 1px 5px rgba(130, 149, 206, 1) inset;
}
::-webkit-scrollbar-thumb {
  min-height: 20px;
  background-clip: content-box;
  box-shadow: 0 0 0 5px rgba(130, 149, 206, 1) inset;
}
::-webkit-scrollbar-corner {
  background: transparent;
}
</style>
<template>
    <Layout style="overflow: hidden">
        <Sider ref="menuSider" hide-trigger collapsible :collapsed-width="60" v-model="isCollapsed" style="z-index: 999" :style="{minHeight: '100vh'}">
            <div class="menu">
                <div class="menuNormal">
                    <div class="menuTop">
                        <span>DATA</span>
                        <img src="/view/images/dcrm.png" alt="">
                        <span>GEEKR</span>
                    </div>
                    <ul>
                        <li v-for="(oneMenu, idx) in oneLevelMenu" :key="oneMenu.id" v-if="!oneMenu.resUrl" :class="oneMenu.resClass" :id="'index_' + oneMenu.resClass" @click="oneLevelClick(idx)">
                            <div v-bind:class="{active: idx === index}">
                                <i :class="'res-icon icon icon-' + oneMenu.icon"></i>
                                {{oneMenu.resName}}
                                <i class="res-switch icon" v-bind:class="[idx === index ? 'icon-jiantou' : 'icon-arrow']"></i>
                            </div>

                            <ul class="menuSbox" :class="{active: (idx === index)}" v-show="(idx === index)">
                                <li :id="'index_' + twoMenu.resClass" v-for="twoMenu in twoLevelMenu" :key="twoMenu.id" v-if="oneMenu.id === twoMenu.parentId">
                                    <div @click="handleMenu(twoMenu.resUrl, twoMenu.id)" :class="{active: twoMenu.id === selectMenuId}">
                                        <a>
                                            {{twoMenu.resName}}
                                        </a>
                                    </div>

                                </li>
                            </ul>
                        </li>
                        <li v-else :class="oneMenu.resClass" class="index" :id="'index_' + oneMenu.resClass">
                            <a :href="oneMenu.resUrl" v-bind:class="{active: idx === index}" @click="handleMenu(oneMenu.resUrl)">
                                <i :class="'res-icon icon icon-' + oneMenu.icon"></i>
                                {{oneMenu.resName}}
                            </a>
                        </li>
                    </ul>
                </div>
                <div class="meanSmall" v-show="isCollapsed">
                    <div class="menuTop"><img src="/view/images/dcrm.png" alt=""></div>
                    <ul>
                        <li v-for="(oneMenu, idx) in oneLevelMenu" v-if="!oneMenu.resUrl" :key="oneMenu.id" @mouseenter="oneLevelClick(idx)" @mouseleave="oneLevelClick(-1)">
                            <i :class="'icon icon-' + oneMenu.icon"></i>
                            <ul v-show="(idx === index)">
                                <li v-for="twoMenu in twoLevelMenu" :key="twoMenu.id" v-if="oneMenu.id === twoMenu.parentId" @click="handleMenu(twoMenu.resUrl)">
                                    <a>{{twoMenu.resName}}</a>
                                </li>
                            </ul>
                        </li>
                        <li v-else @mouseenter="oneLevelClick(idx)" @mouseleave="oneLevelClick(-1)">
                            <i :class="'icon icon-' + oneMenu.icon"></i>
                            <ul v-show="(idx === index)">
                                <li @click="handleMenu(oneMenu.resUrl)">
                                    <a>{{oneMenu.resName}}</a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </Sider>
        <Layout style="height: 100vh; overflow: hidden">
            <Header :style="{padding: 0, height:'70px', background:'#fff'}" class="head">
                <div class="menuSet icon icon-shousuo1" @click="collapsedSider">
                    <span>&gt;</span>
                </div>
                <div style="padding-left: 16px;line-height: 70px;font-size: 14px;color: #808080;float: left;">
                    客户管理（新版）已上线，欢迎试用！
                </div>
                <div class="user-head">
                    <Dropdown trigger="click" placement="bottom-end" @on-click="handleUserMenu">
                        <a href="javascript:void(0)">
                            <img class="user-img" :src="headSrc">
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem divided v-for="(userMenu, idx) in userLevelMenu" :key="idx" name="idx">
                                <a :href="userMenu.resUrl">{{userMenu.resName}}</a>
                            </DropdownItem>
                            <DropdownItem divided>
                                <a @click="logout">退出登录</a>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </Header>
            <Content id='page-wrapper'>

                <router-view></router-view>

            </Content>
        </Layout>
    </Layout>
</template>
<script>
export default {
    data() {
        return {
            menuTheme: 'dark',
            defaultFirstUrl: null,
            oneLevelMenu: [],
            twoLevelMenu: [],
            userLevelMenu: [
                {
                    resName: "任务管理",
                    resUrl: "/view/task/task.html"
                },
                {
                    resName: "财务中心",
                    resUrl: "/view/Finance/Finance/list.html"
                },
                {
                    resName: "标签设置",
                    resUrl: "/view/setting/selfcustomerTag.html"
                },
                {
                    resName: "个人设置",
                    resUrl: "/view/setting/selfsetting.html"
                },
                {
                    resName: "修改密码",
                    resUrl: "/view/setting/updatepwd.html"
                }
            ],
            isCollapsed: true,
            isActive: false,
            index: -1,
            selectMenuId: -1,
            headSrc: ''
        }
    },
    created() {
        this.hasPer();
        // let isCollapsed = this.$cookies.get("menuIsCollapsed");
        // if (isCollapsed === "true") {
        //     this.isCollapsed = true;
        // } else if (isCollapsed === "false") {
        //     this.isCollapsed = false;
        // }
        this.getMenuList(); //获取菜单数据
    },
    mounted() {
        this.handleMenu(this.defaultFirstUrl);
    },
    computed: {
        menuitemClasses() {
            return ['menu-item', this.isCollapsed ? 'collapsed-menu' : '']
        }
    },
    methods: {
        menuClick(url) {
            window.location.href = url;
        },
        getMenuList: function () {
            let that = this;
            this.$post(this.global.baseUrl + "/pc/user/selectById.action").then(res => {
                if (res.code === 200) {
                    this.headSrc = res.data.obj.headUrl;
                    this.global.userInfo = res.data.obj;
                    res.data.sysResList.forEach(function (item, i) {
                        if (item.isDisplay === 1) {
                            if (that.defaultFirstUrl === null && item.resUrl) {
                                that.defaultFirstUrl = item.resUrl;
                            }
                            if (item.resType === 1) {
                                that.oneLevelMenu.push(item);
                            } else if (item.resType === 2) {
                                that.twoLevelMenu.push(item);
                            }
                        }
                    });
                }
            });
        },
        collapsedSider: function () {
            this.index = -1;
            this.$refs.menuSider.toggleCollapse();
            this.saveMenuStatus();
        },
        saveMenuStatus: function () {
            this.$cookies.set("menuIsCollapsed", this.isCollapsed);
        },
        oneLevelClick: function (idx) {
            this.index = idx;
        },
        handleUserMenu: function (name) {
            let menu = this.userLevelMenu[name];
            if (menu) {
                window.location.href = menu.resUrl;
            }
        },
        handleMenu: function (url, selectMenuId) {
            if (!url) {
                return;
            }
            let reg = new RegExp(".html$");
            if (reg.test(url)) {
                window.location.href = url;
            } else {
                this.selectMenuId = selectMenuId;
                this.$router.push(url);
            }
        },
        logout: function () {
            this.$post(this.global.baseUrl + "/logOut.action").then(res => {
                if (res.code === 200) {
                    window.location.href = "/login.html";
                } else {
                    this.$Message.error('退出登录失败，请稍后重试!');
                }
            });
        },
        // 按钮权限
        hasPer() {
            this.$post(this.global.baseUrl + "/common/alphaConfig.action").then(res => {
                if (res.code == 200) {
                    this.perObj.permissionStatus = res.data.permissionStatus;
                }
            });
            this.$post(this.global.baseUrl + "/pc/user/selectFunction.action").then(res => {
                if (res.code == 200) {
                    this.perObj.perList = res.data;
                     
                }
            });
        }
    }
}
</script>

