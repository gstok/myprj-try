<template>
    <div class="flex">
        <!-- 右边的内容 -->
        <transition name="slide-fade">
            <div class="SlidingMenu" v-show="showbox">
                <!-- 左边的菜单切换按钮 Start -->
                <span class="clickBtn" v-if="showcontent" @click="clickBtn">收起菜单</span>
                <span class="clickBtn" v-else @click="clickBtn">展开菜单</span>
                <div class="content" v-show="showcontent">
                    <!-- 顶部 选择了几个人-->
                    <!-- <topinfor :people="num"></topinfor> -->
                    <div class="topinfor">
                        已选择 <span> {{ checkedCustNum }} </span>个用户
                        <Button type="info" size="small" @click="HideMenu">取消</Button>
                    </div>
                    <!-- 中间菜单项 -->
                    <!--<midmenu :sendM="curstorm" :checkedCustNum="checkednum" :tableSelectAll="isSelectAll"></midmenu>-->
                    <div class="midmenu">
                        <ul>
                            <li @click="showSendMessage">发送短信</li>
                            <li @click="showSendTx">发送弹信</li>
                            <li @click="showSendEmail">发送邮件</li>
                            <li @click="showAddWxFriend">添加微信好友</li>
                        </ul>
                        <!-- 发送短信 -->
                        <SendMessage :isshow="showMsg"
                                     @on-cancel="closeSendMsg"
                                     @on-success="closeSendMsg"
                                     :sendinfor="curstorm"
                                     :checkedCustNum="checkednum"
                                     :tableSelectAll="isSelectAll"
                                     :searchParams="custSearchParams">
                        </SendMessage>

                        <!-- 发送弹信 -->
                        <SendTanxin :isshow="showTanxin"
                                    @on-success="closeSendTx"
                                    @on-cancel="closeSendTx"
                                    :sendinfor="curstorm"
                                    :checkedCustNum="checkednum"
                                    :tableSelectAll="isSelectAll"
                                    :searchParams="custSearchParams" />

                        <!-- 发送邮件 -->
                        <SendEmail :isshow="showEmail"
                                   @on-cancel="closeSendEmail"
                                   @on-success="closeSendEmail"
                                   :sendinfor="curstorm"
                                   :checkedCustNum="checkednum"
                                   :tableSelectAll="isSelectAll"
                                   :searchParams="custSearchParams" />

                        <!-- 加好友 -->
                        <addfriendsgreet ref="addFbox"
                                         :addShow='showAddFriend'
                                         @addWechatFridens='confirmAddWxFriend'
                                         @cancel="closeAddWxFriend" />
                        <!--微信登录-->
                        <wxLogin ref="wxLogin"
                                 :checkedCustNum="checkednum"
                                 :single="false"
                                 :show="showWxLogin"
                                 @on-finish="wxLoginFinish"
                                 @on-cancel="cancelWxLogin" />
                    </div>

                    <!-- 底部菜单项 -->
                    <lastmenu ref="lastmenu"
                              :custList="curstorm"
                              :checkedCustNum="checkednum"
                              :tableSelectAll="isSelectAll"
                              :searchParams="custSearchParams"
                              @on-delete-cust="deleteCust"
                              @fenpei="Fenpeople"
                              @refresh="removeqz" />
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
    /* 引入头部,中间，尾部信息组件  */
    // import topinfor from './TopInfor';
    // import midmenu from './MidMenu';
    import lastmenu from './LastMenu';

    import SendMessage from './sendmessage.vue';
    import SendTanxin from "./sendtanxin.vue";
    import SendEmail from "./sendemail.vue";
    import AddFriend from "./addfriend.vue";

    export default {
        // props接收父子件的数据
        components: {SendMessage, SendTanxin, SendEmail, AddFriend, lastmenu},
        props: {
            searchParams: {
                type: Object,
                default() {
                    return {}
                }
            },
            custLists: {
                type: Array,  //类型
                default: []   //默认值
            },
            // 选择的人的总数
            checkedCustNum: {
                type: Number,
                default: 0
            },
            // 是否是全选
            tableSelectAll: {
                type: Boolean,
                default: false
            }
        },
        watch: {
            custLists(val) {
                this.curstorm = val;
            },
            checkedCustNum(val) {
                this.checkednum = val;
            },
            tableSelectAll(val) {
                this.isSelectAll = val
            },
            searchParams(val) {
                this.custSearchParams = val;
            }
        },
        data() {
            return {
                showbox: false,
                showcontent: true,
                num: 0,
                curstorm: this.custLists,
                checkednum: this.checkedCustNum,
                isSelectAll: this.tableSelectAll,
                custSearchParams: this.searchParams,

                showMsg: false,
                showTanxin: false,
                showEmail: false,
                showAddFriend: false,
                showWxLogin: false,

                addWxFriendParams: {}
            };
        },
        beforeUpdate() {
            if (this.curstorm.length == 0) {
                this.showbox = false;
            } else {
                this.num = this.curstorm.length;
                this.showbox = true;
            }
        },
        methods: {
            //重新调用获取群组列表接口
            getGroupList(){
                this.$refs.lastmenu.getGroupList();
            },
            // 发送短信
            showSendMessage() {
                this.$refs.lastmenu.hideTeam();
                this.showMsg = true;
                // this.erray = this.sendM;
                // console.log(this.sendM);
            },
            closeSendMsg() {
                this.showMsg = false;
            },
            // 发送弹信
            showSendTx() {
                this.$refs.lastmenu.hideTeam();
                this.showTanxin = true;
            },
            closeSendTx() {
                this.showTanxin = false;
            },
            // 发送邮件
            showSendEmail() {
                this.$refs.lastmenu.hideTeam();
                this.showEmail = true;
            },
            closeSendEmail() {
                this.showEmail = false;
            },
            // 添加微信好友
            showAddWxFriend() {
                this.$refs.lastmenu.hideTeam();
                this.showAddFriend = true;
            },
            closeAddWxFriend() {
                this.showAddFriend = false;
            },
            confirmAddWxFriend(params) {
                this.addWxFriendParams = params;
                this.closeAddWxFriend();
                this.showWxLogin = true;
            },
            // 微信登录
            cancelWxLogin() {
                this.showWxLogin = false;
            },
            wxLoginFinish(sessionId) {
                this.showWxLogin = false;
                let str = JSON.stringify(this.searchParams);
                let sp = JSON.parse(str);
                sp.commonId = sessionId;
                sp.isSelAll = this.isSelectAll ? '1' : '0';
                sp.logoutOnFinish = this.addWxFriendParams.exit;
                sp.helloMessage = this.addWxFriendParams.helloMessage;

                this.$post(this.global.baseUrl + "/pc/wechatFriend/newAddWechatFriends.action", sp).then(res => {
                    if(res.code === 200) {
                        this.$Message.success(res.msg);
                    }
                });
            },
            // 移动群组
            removeqz() {
                this.$emit("movedepart")
            },
            clickBtn() {
                this.showcontent = !this.showcontent;
            },
            // 分配
            Fenpeople() {
                this.$emit("fpman")
            },
            // 删除子组件的某人
            deleteCust() {
                this.$emit("delpeople")
            },
            HideMenu() {
                this.custLists.length = 0;
                this.showbox = false;
                //点击取消按钮，影藏数据
                this.$emit('muhide')
            }
        }
    };
</script>
<style lang="less" scoped>
    /* 可以设置不同的进入和离开动画 */
    /* 设置持续时间和动画函数 */
    .slide-fade-enter-active {
        transition: all 1s ease;
    }

    .slide-fade-leave-active {
        transition: all 0.3s cubic-bezier(1, 0.5, 0.5, 1);
    }

    .slide-fade-enter,
    .slide-fade-leave-to {
        transform: translateX(1px);
        opacity: 0;
    }

    .flex {
        position: fixed;
        right: 40px;
        z-index: 999;
    }

    //底下的信息
    .SlidingMenu {
        position: absolute;
        right: 0;
        .topinfor {
            border: 1px solid #5cadff;
            border-radius: 5px 5px 0 0;
            text-align: center;
            line-height: 35px;
            span {
                color: #00cc66;
                font-weight: 800;
                padding: 0 2px;
            }
            button.ivu-btn.ivu-btn-info.ivu-btn-small {
                margin-top: 6px;
                margin-right: 4px;
            }
        }
        .content {
            width: 171px;
            height: 300px;
            border-radius: 5px 5px 0 0;
            background-color: #eee;
            box-shadow: 2px 2px 10px #ddd;
        }
        .clickBtn {
            width: 20px;
            cursor: pointer;
            display: inline-block;
            height: 80px;
            background-color: #5cadff;
            border-radius: 3px 0 0 3px;
            color: #fff;
            position: absolute;
            top: 53px;
            left: -20px;
            text-align: center;
            padding-top: 4px;
        }

        .midmenu {
            border: 1px solid #5cadff;
            margin-top: 5px;
            ul li {
                list-style: none;
                padding: 9px 20px;
                cursor: pointer;
                color: #5cadff;
            }
            ul li:hover {
                color: #3091f2;
            }
        }
    }

</style>

