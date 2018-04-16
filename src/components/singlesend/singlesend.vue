<template>
    <div>
        <!-- 发送短信弹窗的 -->
        <Modal v-model="sendMessage" :mask-closable="false" width="560" @on-ok="send" @on-cancel="cancel" :transfer="sendMessageShow">
            <p slot="header" style="color:#666;text-align:left;">
                <span>发送短信</span>
            </p>
            <div class="selectinfor">
                <p class="Prompt">
                    已选中1个客户
                </p>
                <Button type="ghost" style="margin: 15px 0">{{custName}}</Button>
            </div>
            <div class="templinfor">
                <!-- 下拉框 -->
                <label>
                    短信模板
                </label>
                <Select style="width:70%;margin-left:50px;" v-model="sendvalue">
                    <Option v-for="list in SMSLists" :value="list.content" :key="list.id">
                        {{ list.smsName }}
                    </Option>
                </Select>
                <Input v-model="sendvalue" type="textarea" :rows="4" style="width:70%;margin: 10px 0 0 100px;"></Input>
            </div>
        </Modal>
    </div>
</template>

<script>
    export default {
        name: "singlesend",
        props: {
            Sendshow: {
                default: true
            },
            custName: {
                default: ''
            },
            custId: {
                default: ''
            },
        },
        watch: {
            Sendshow(val) {
                this.sendMessage = val;
            }
        },
        data() {
            return {
                commonId:'',//短信模板id
                sendMessage: this.Sendshow,
                sendvalue:'',//发送内容
                SMSLists:[],
                sendMessageShow:false
            }
        },
        created() {
            this.getSMS(); //获取短信模板
        },
        methods: {
            //清空选取的短信模板
            clearMsg(){
                this.sendvalue = '';
            },
            //获取短信模板
            getSMS:function (){
                let that = this;
                this.$post("/user-apis/pc/sms/getSmsList.action").then(res => {
                    if(res.code == 200) {
                        that.SMSLists = res.data.data;
                    }
                });
            },
            send() {
                let that = this;
                if(that.sendvalue == ''){
                    that.$Message.warning('请选择短信模板！');
                    return;
                }
                console.log(this.SMSLists);
                this.SMSLists.forEach(function(item, i) {
                    if(item.content === that.sendvalue){
                        that.commonId = item.id;
                        console.log(that.commonId)
                    }
                });
                let  params = {
                    custIds:this.custId,
                    isSelAll:'',
                    commonId:this.commonId
                };

                this.$post("/user-apis/pc/sms/newSmsBatchSend.action",params).then(res => {
                    if(res.code == 200) {
                        this.$Message.success(res.msg);
                        this.sendMessage = false;
                        this.$emit('on-suc');
                    }
                });
            },
            cancel() {
                // 隐藏此组件
                this.$emit('on-cancel');
                //this.sendMessage = false
            }
        }
    }
</script>

<style scoped>
    .vertical-center-modal{
        display: flex;
        align-items: center;
        justify-content: center;}

    .ivu-modal{
        top: 0;
    }
</style>