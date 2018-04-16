<style type="less" scoped>
    .footer {
        float: right;
    }
    .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
</style>
<template>
    <div class="wechatLoginBox">
        <Modal title="微信登录" v-model="modalLogin" :footerHide="true" :transfer=false
               class-name="vertical-center-modal" @on-cancel="cancel" :mask-closable="false">
            <Spin style="width: 100%; height: 100%; min-height: 300px;" size="large" fix v-if="spinShow">
            </Spin>
            <div>
                <div class="accountLogin" v-show="accountLogin">
                    <Row>
                        <Form ref="wxAccount" :model="wxAccount" :rules="ruleValidate" :label-width="60">
                            <FormItem label="账号：" prop="account">
                                <Input v-model="wxAccount.account" placeholder="请输入账号"></Input>
                            </FormItem>
                            <FormItem label="密码：" prop="password">
                                <Input v-model="wxAccount.password" type="password" placeholder="请输入密码"></Input>
                            </FormItem>
                        </Form>
                        <div>
                            <dl>
                                <dt style="font-weight: bold;margin: 10px 0">提示：</dt>
                                <dd style="line-height: 24px;" v-if="0<custNum <= 50&&!isSingle">
                                    1.您总计勾选<span>{{custNum}}</span>个客户。
                                </dd>
                                <dd style="line-height: 24px;" v-if="custNum > 50">
                                    1.您总计勾选<span>{{custNum}}</span>个客户，但由于微信官方限制了每天发送好友请求的数量，系统会自动选取50个客户发送好友请求。
                                </dd>
                                <dd style="line-height: 24px;" v-if="isSingle">
                                    <span v-if="!isSingle">2.</span>当您在其他设备登陆微信后，会导致<span v-if="!isSingle">批量</span>添加微信好友的任务中断，您需要通过数聚客PC或App端再次登陆微信才能添加好友。
                                </dd>
                            </dl>
                        </div>
                    </Row>
                    <Row slot="footer">
                        <div class="footer" v-show="accountLogin">
                            <Button @click="cancel">取消</Button>
                            <Button @click="login" type="primary">确定</Button>
                        </div>
                    </Row>
                </div>

                <div class="qrcodeLogin" v-show="qrcodeLogin">
                    <Row>
                        <Row style="align-content: center">
                            <img :src="qrcodeSrc" style="width:135px;margin-left:176px"/>
                        </Row>
                        <Row >
                            <dl>
                                <dt style="font-weight: bold;margin: 10px 0">提示：</dt>
                                <dd>
                                    页面如未跳转请点击确定按钮
                                </dd>
                            </dl>
                        </Row>
                    </Row>
                    <Row slot="footer">
                        <div class="footer">
                            <Button @click="cancel">取消</Button>
                            <Button @click="login" type="primary">确定</Button>
                        </div>
                    </Row>
                </div>

                <div class="codeLogin" v-show="codeLogin">
                    <Row>
                        <div style="margin: 20px 0">
                            <label>验证码：</label>
                            <Input v-model="code" placeholder="请输入验证码" style="width: 255px"></Input>
                            <input type="hidden" v-model="replyTo"/>
                        </div>
                        <h3 class="codeMsg">{{codeMsg}}</h3>
                    </Row>
                    <Row slot="footer">
                        <div class="footer">
                            <Button @click="cancel">取消</Button>
                            <Button @click="login" type="primary">确定</Button>
                        </div>
                    </Row>
                </div>

                <div class="dragLogin" v-show="dragLogin">
                    <Row>
                        <div class="txtBox" style="width:330px;margin:auto;height: 285px;overflow:hidden">
                            <iframe id="dragframe" :src="dragUrl" style="width:348px;height: 302px;border: 0"></iframe>
                        </div>
                    </Row>
                    <Row slot="footer">
                        <div class="footer">
                            <Button @click="drag(false)">验证失败</Button>
                            <Button type="primary" @click="drag(true)">验证成功</Button>
                        </div>
                    </Row>
                </div>

                <div class="tipsBox" v-show="tipsShow" style="height: 200px;line-height: 200px;text-align: center"><img :src="img.load" alt="">{{tipsMsg}}</div>
            </div>
        </Modal>
    </div>
</template>
<script>
    import loadimg from '../../assets/img/loading.gif';
    export default {
        name: 'wxLogin',
        props: {
            checkedCustNum: {
                default: 0
            },
            single: {
                type: Boolean,
                default: true
            },
            show: {
                type: Boolean,
                default: false
            }
        },
        watch: {
            checkedCustNum(val) {
                this.custNum = val;
            },
            single(val) {
                this.isSingle = val;
            },
            show(val) {
                this.modalLogin = val;
                if (val) {
                    this.init();
                }
            }
        },
        data() {
            return {
                isSingle:this.single,//true 代表单个发送   false代表多个发送
                custNum:this.checkedCustNum,//选中客户的个数
                accountLogin: false,
                qrcodeLogin: false,
                codeLogin: false,
                dragLogin: false,
                qrcodeSrc: null,
                dragUrl: '',

                modalLogin: this.show,
                spinShow: false,

                wxAccount: {
                    account: '',//账号
                    password: ''//密码
                },
                ruleValidate: {
                    account: [
                        {required: true, message: '微信账号不能为空！', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '微信密码不能为空！', trigger: 'blur'}
                    ]
                },
                sessionId: null,
                replyTo: '',
                codeMsg: '',
                code: '',
                tipsShow:false,//提示语默认隐藏
                tipsMsg:'',//提示语
                img: {
                    load: loadimg
                },
                setint:null
            }
        },
        created() {
        },
        methods: {
            //检查是否登录
            init: function () {
                this.accountLogin = false;
                this.qrcodeLogin = false;
                this.codeLogin = false;
                this.dragLogin = false;

                let that = this;
                let wxloginName = that.$cookies.get("wxloginName");
                console.log(wxloginName);
                if (wxloginName == "" ||wxloginName == 'null'||wxloginName == null) {
                    console.log(that.accountLogin);
                    // 未登录
                    that.accountLogin = true;
                    that.tipsShow = false;
                    console.log(that.accountLogin);
                } else {
                    // 已登录，检查群控登录状态
                    this.spinShow = true;
                    this.axios.post("/task_server/device/sessionMatch?account=" + wxloginName).then(res => {
                        this.spinShow = false;
                        if (res.data.status === 200) {//已登录
                            that.sessionId = res.data.data;
                            that.modalLogin = false;
                            that.$emit('on-finish', that.sessionId);
                        } else if (res.data.status === 404) {//登录过期
                            that.accountLogin = true;
                            that.modalLogin = true;
                        }
                    });
                }
            },
            //关闭登录弹窗
            cancel: function () {
                // 隐藏此组件
                this.$emit('on-cancel');
                clearInterval(this.setint);
                // this.modalLogin = false;
            },
            //登录
            login: function () {
                let that = this;
                // this.$refs[name].validate((valid) => {
                //     if (valid) {
                //         this.$Message.success('Success!');
                //     } else {
                //         this.$Message.error('Fail!');
                //     }
                // });
                this.spinShow = true;
                this.axios.post('/task_server/device/login', this.wxAccount).then(res => {
                    if (res.data.status === 200) {
                        that.$Message.success('登录请求发送成功！');
                        this.spinShow = false;
                        that.sessionId = res.data.data;
                        console.log(res.data.data);
                        console.log(that.sessionId);

                        function getWsHost(){
                            let hostname = location.hostname;

                            if(hostname === 'geeker.worken.cn'){
                                return hostname+":52361"
                            } else {
                                return location.host;
                            }
                        }

                        let url = "ws://" + getWsHost() + "/task_server/socket/bindDevice";
                        let socket = new WebSocket(url);
                        let lock = false;
                        websocket();
                        let showH = function(lock){
                            if(lock){
                                that.qrcodeLogin = true;
                            }else{
                                that.qrcodeLogin = false;
                            }
                        };
                        function websocket() {
                            socket.onmessage = function (data) {
                                let datas = JSON.parse(data.data);
                                console.log(lock + "    " + data.data);
                                that.accountLogin = false;
                                that.qrcodeLogin = false;
                                that.codeLogin = false;
                                that.dragLogin = false;

                                if (datas.status === 109) {//登录过程
                                    that.tipsShow = true;
                                    that.tipsMsg = datas.message;
                                    if(datas.message=="扫码完成,请点击确认"){
                                        showH(false);
                                        that.spinShow = true;
                                        lock = false;
                                    }else{
                                        showH(lock);
                                    }

                                } else if (datas.status === 200) {//登录成功
                                    let wxlogin_Name = that.wxAccount.account;
                                    that.$cookies.set("wxloginName", wxlogin_Name);
                                    that.qrcodeLogin = false;
                                    that.modalLogin = false;
                                    that.tipsShow = false;
                                    that.$Message.info("微信登录成功！");
                                    that.$emit('on-finish', that.sessionId);
                                    socket.close();
                                } else if (datas.status === 102) {//输入验证码
                                    that.replyTo = datas.replyTo;
                                    that.codeMsg = datas.message;
                                    that.codeLogin = true;
                                    that.tipsShow = false;
                                } else if (datas.status === 104) {//出现二维码
                                    that.setint = setInterval(function(){
                                        websocket();
                                    },500);
                                    that.tipsShow = false;
                                    that.qrcodeLogin = true;
                                    that.qrcodeSrc = datas.data;
                                } else if (datas.status === 105) {//出现拖动验证码
                                    that.tipsShow = false;
                                    that.dragLogin = true;
                                    that.dragUrl = datas.data;
                                    that.replyTo = datas.replyTo;
                                } else {
                                    clearInterval(that.setint);
                                    that.$Message.error(datas.message);
                                    that.modalLogin = false;
                                }
                            };
                        }

                        socket.onclose = function () {
                            websocket();
                        }
                    }else{
                        that.$Message.error(datas.message);
                        setTimeout(function () {
                            that.modalLogin = false;
                        },500)
                    }
                });
            },
            //提交验证码
            verifyCode: function () {
                let that = this;
                clearInterval(that.setint);
                let data = {
                    code: this.code,
                    replyTo: this.replyTo
                };
                this.spinShow = true;
                this.axios.post("/task_server/device/verifyCode", data).then(res => {
                    if (res.data.status === 200) {
                        that.codeLogin = false;
                        that.spinShow = false;
                    }
                });
            },
            //拖动验证码
            drag: function (success) {
                let that = this;
                clearInterval(that.setint);
                let data = {
                    "success": success,//拖动验证成功true/验证失败(取消)false
                    "replyTo": this.replyTo//设备下发的消息id(replyTo)
                };
                this.spinShow = true;
                this.axios.post("/task_server/device/dragOpReply", data).then(res => {
                    if (res.data.status === 200) {
                        that.dragLogin = false;
                        that.spinShow = false;
                    }
                });
            },
        }
    }
</script>