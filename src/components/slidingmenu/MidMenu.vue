<template>
    <div class="midmenu">
        <ul>
            <li @click="sendmessage">发送短信</li>
            <li @click="sendtanxin">发送弹信</li>
            <li @click="sendemail">发送邮件</li>
            <li @click="addfriend">添加微信好友</li>
        </ul>
        <Sendmessage :isshow="isShow"
                     @on-cancel="closeSendMsg"
                     @peoNum="getdelnum(b)"
                     @on-success="openSendMsg"
                     :sendinfor="sendM"
                     :checkedCustNum="checkednum"
                     :tableSelectAll="isSelectAll">
        </Sendmessage>
        <sendtanxin :isshoww="isShow1" @onsuccessTan="open1" @onerrorTan="closeSend1" :sendinfor="sendM"
                    :checkedCustNum="checkednum" :tableSelectAll="isSelectAll"></sendtanxin>
        <sendemail :isshow2="isShow2" @onerrorER="closeSend2" @onsuccessOK="open2" :sendinfor="sendM"
                   :checkedCustNum="checkednum" :tableSelectAll="isSelectAll"></sendemail>
        <!-- <addfriend :adfshow="bfshow" @onsuOK="closeSend3" @onerOR="open3" :sendinfor="sendM"></addfriend> -->
        <!-- <wxLogin ref="wxLogin" :single="isSingle" :show="wxLoginShow" :on-finish="wxLoginFinish" @on-cancel="cancelAddFridens"></wxLogin> -->
        <!-- 加好友 -->
        <addfriendsgreet ref="addFbox" :sessionId="sessionId" :addShow='addFShow' @addWechatFridens='addFridens'
                         @cancel="cancelAddFridens"></addfriendsgreet>
        <!--微信登录-->
        <wxLogin ref="wxLogin" :checkedCustNum="0" :single="isSingle" :show="wxLoginShow" @on-finish="wxLoginFinish"
                 @on-cancel="cancelAddFridens"></wxLogin>
    </div>
</template>
<script>
    import Sendmessage from './sendmessage.vue';
    import sendtanxin from "./sendtanxin.vue";
    import sendemail from "./sendemail.vue";
    import addfriend from "./addfriend.vue";

    export default {
        props: {
            // 接收传过来的数组
            sendM: {
                type: Array,
                default: []
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
        data() {
            return {
                wxLoginShow: false,//微加好友
                isSingle: true,
                isShow: false,
                checkednum: this.checkedCustNum,
                isSelectAll: this.tableSelectAll,
                erray: this.sendM,
                isShow1: false,
                sessionId: '',//微信id
                addFShow: false,//添加好友招呼语显示隐藏
                isShow2: false,
                isShow3: false,
                custids: [],
                AddWechatparams: {
                    logoutOnFinish: '',
                    custIds: '',
                    isSelAll: 1,
                    commonId: '',
                    helloMessage: ''
                },//添加好友的参数
            }
        },
        watch: {
            sendM(val) {
                this.erray = val;
                // console.log(val)
            },
            checkedCustNum(val) {
                this.checkednum = val;
                // console.log(val)
            },
            tableSelectAll(val) {
                this.isSelectAll = val
                // console.log(val)
            }
        },
        components: {
            Sendmessage, sendtanxin, sendemail, addfriend
        },
        methods: {
            // 获取删除后剩余的人数
            getdelnum(val) {
            },
            addFridens(data) {
                this.wxLoginShow = true;
                // this.custids.push()
                this.sendM.forEach((k, v) => {
                    this.custids.push(k.id)
                });
                this.AddWechatparams.helloMessage = data.helloMessage;
                this.AddWechatparams.custIds = this.custids.join(',');
                this.AddWechatparams.logoutOnFinish = data.exit;
            },
            // addWechatF
            wxLoginFinish(params) {
                this.wxLoginShow = false;
                this.addFShow = true;
                this.AddWechatparams.commonId = params;
                this.$post(this.global.baseUrl + "/pc/wechatFriend/newAddWechatFriends.action", this.AddWechatparams).then(res => {
                    if (res.code == 200) {
                        that.$Message.success(res.msg);
                    }else{
                        that.$Message.error(res.msg);
                    }
                });
            },
            //单个客户添加好友
            // wxLoginFinish(params) {
            //   this.sessionId = params;
            //   this.bfshow = true
            // },
            cancelAddFridens() {
                this.wxLoginShow = false;
                this.addFShow = false;
            },
            sendmessage() {
                this.isShow = true;
                this.erray = this.sendM;
                // console.log(this.sendM);
            },
            sendtanxin() {
                this.isShow1 = true;
                this.erray = this.sendM;
                // console.log(this.total);
            },
            sendemail() {
                this.isShow2 = true;
                this.erray = this.sendM;
                // console.log(this.total);
            },
            addfriend() {
                // this.isShow3=true;
                this.erray = this.sendM;
                this.addFShow = true;
                // this.wxLoginShow = true;
            },
            closeSendMsg() {
                this.isShow = false;
            },
            closeSend1() {
                this.isShow1 = false;
            },
            closeSend2() {
                this.isShow2 = false;
            },
            closeSend3() {
                this.isShow3 = false;
                // 处理业务
            },
            openSendMsg() {
                this.isShow = false;
            },
            open1() {
                this.isShow1 = false;
            },
            open2() {
                this.isShow2 = false;
            },
            open3() {
                this.bfshow = false;
                // 处理业务
            },
            closeSendfriend() {
                this.bfshow = false;
            },
            //点击取消
            cancel() {
                this.isShow = false;
                this.singlesendShow = false;
                this.addFShow = false;
            },
        }
    };
</script>
<style lang="less" scoped>
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
</style>
