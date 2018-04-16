<style type="less" scoped>
    .opt-icon {
        margin: 0 8px;
    }
    .iconBox .icon{font-size: 28px;color: #93a3ec}
    .iconBox .ivu-btn{padding:0 8px}
</style>
<template>
    <div>
        <div @mouseover="function() {show = true}" @mouseout="function() {show = false}">

            <div style='right: 40px;position: absolute;background: #fff;border:1px solid #ddd;border-radius: 4px;
                    padding:6px;margin-top: -16px' v-show="show" class="iconBox">
                <!--<ButtonGroup>-->
                <Poptip trigger="hover">
                    <Button type="ghost">
                        <i class="icon icon-phone1"></i>
                        <div v-show='isShow' style="width:18px;height: 18px;background: red;border-radius: 9px;
                            position: absolute;top:1px;right:1px;color: #fff">{{callNum}}
                        </div>
                    </Button>
                    <div slot="content">
                        <div v-if="this.mobile && (grantMobileStatus != 10)" style="cursor: pointer" @click="call(0,mobile)">手机号码:{{mobile}}</div>

                        <div v-if="this.mobile && (grantMobileStatus == 10)" style="cursor: pointer" @click="call(0,mobile)">手机号码:<i class="icon icon-mima"></i></div>
                        <div v-if="!this.mobile" style="cursor: pointer">手机号码：无手机号码</div>

                        <div v-if="this.teleNum" style="cursor: pointer" @click="call(1,teleNum)">联系电话:{{teleNum}}</div>
                        <div v-if="!this.teleNum" style="cursor: pointer">联系电话：无联系电话</div>
                    </div>
                </Poptip>
                <Poptip trigger="hover" :content="this.mobile ? '发短信':'发短信:无手机号'">
                    <Button type="ghost" @click="sendSMS">
                        <i class="icon icon-comments"></i>
                    </Button>
                </Poptip>
                <Poptip trigger="hover" :content="this.mobile ? '添加微信好友':'添加微信好友:无手机号'">
                    <Button type="ghost" @click="addFriends">
                        <i class="icon icon-wjia"></i>
                    </Button>
                </Poptip>
                <Poptip trigger="hover" :content="'客户画像'">
                    <Button type="ghost" @click="portrait">
                        <i class="icon icon-bussinessman"></i>
                    </Button>
                </Poptip>
                <Poptip trigger="hover" :content="'播放录音'">
                    <Button type="ghost" @click="playRecord">
                        <i class="icon icon-luyin2"></i>
                    </Button>
                </Poptip>
                <!--</ButtonGroup>-->
            </div>

            <div style="">
                <i class="icon icon-caozuo-zhankai" style="cursor: pointer"></i>
            </div>
        </div>
        <GAudio :recordSrc="recordSource" :show="showRecord"
                @on-record-ok="closeRecordModal" @on-record-cancel="closeRecordModal" />
    </div>
</template>
<script>
    export default {
        props: {
            custId:{
                default: ''
            },
            custMobile:{
                default: ''
            },
            telephone:{
                default: ''
            },
            custName:{
                default: ''
            },
            callCount:{
                default: ''
            },
            MobileStatus:{
                default: 0
            }
        },
        data() {
            return {
                grantMobileStatus:this.MobileStatus,
                id:this.custId,
                mobile:this.custMobile,
                teleNum:this.telephone,
                isTelephone:1,
                recordSource: null,
                showRecord: false,
                isShow:false,//打电话次数显示
                callNum:this.callCount,//打电话次数
                show: false
            }
        },
        created() {
            if(this.callNum>0){
                this.isShow = true
            }else{
                this.isShow = false
            }

        },
        methods: {
            //打电话
            call(type,num) {
                let data = {
                    custId:this.id,
                    custMobile:num,
                    type:type
                };
                if(!this.mobile && !this.teleNum){
                    this.$Message.warning('无电话号码！');
                }else{
                    this.$emit('call', data);
                }
            },
            //发短信
            sendSMS() {
                let params = {
                    custId:this.id,
                    name:this.custName
                };
                if(this.mobile){
                    this.$emit('sendSms', params);
                }

            },
            //添加好友
            addFriends() {
                let params = {
                    custId:this.id,
                    singel:true
                };
                if(this.mobile) {
                    this.$emit('addFs', params);
                }
            },
            //播放录音
            playRecord() {
                this.$post(this.global.baseUrl + "/pc/eventCall/lastRecordings.action", {custId: this.id}).then(res => {
                    if (res.code === 200) {
                        this.recordSource = res.data.calllog.recordUri;
                        this.showRecord = true;
                    }
                });
            },
            closeRecordModal() {
                this.showRecord = false;
            },
            //客户画像
            portrait(){
                let params = {
                    custId:this.id
                };
                this.$emit('portrait', params);
            }
        }
    }
</script>