<template>
    <div>
        <!-- 添加好友招呼语弹窗 -->
        <Modal v-model="addF" width="560" :mask-closable="false" @on-ok="add" @on-cancel="cancel" :transfer=false>
            <p slot="header" style="color:#666;text-align:left;">
                <span>添加好友招呼语设置</span>
            </p>

            <div class="templinfor">
                <label>
                    招呼语
                </label>
                <Input v-model="helloMessage" style="width:60%;margin-left:100px;"></Input>

            </div>
            <div class="templinfor" style="margin-top: 20px;">
                <label>
                    添加完成是否退出账号
                </label>
                <RadioGroup v-model="exit" style="margin-left: 20px">
                    <Radio label="是"></Radio>
                    <Radio label="否"></Radio>
                </RadioGroup>

            </div>
        </Modal>
    </div>
</template>

<script>
    export default {
        name: "addfriendsgreet",
        props: {
            sessionId: {
                default: true
            },
            // custId: {
            //     default: ''
            // },
            addShow:{
                default: true
            }
        },
        watch: {
            addShow(val) {
                this.addF = val;
                this.helloMessage = '';
                this.exit = '是';
            }
        },
        data() {
            return {
                helloMessage:'',//招呼语
                exit:'是',//是否退出账号
                // custIds:this.custId,//要添加的客户的id
                commonId:this.sessionId,//微信id
                addF: this.addShow
            }
        },
        created() {
        },
        methods: {
            refresh(){
                this.exit = '是';
                this.helloMessage = '';
            },
            add() {
                let  params = {
                    isSelAll:'',
                    exit:this.exit,
                    helloMessage:this.helloMessage
                };
                this.$emit('addWechatFridens',params);
            },
            cancel() {
                this.$emit('cancel');
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