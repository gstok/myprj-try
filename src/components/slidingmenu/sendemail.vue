<template>
    <Modal v-model="pushMessage" :mask-closable="false" width="560" :transfer="false" @on-cancel="sendCancel">
        <p slot="header" style="color:#666;text-align:left;">
            <span>发送邮件</span>
        </p>
        <div class="selectinfor">
            <p class="Prompt">
                已选中
                <span class="totalPeo"> {{ totalpeople }} </span>个客户,其中
                <span class="many"> {{ emptyMobile }} </span>个客户邮箱为空将无法发送邮件！
            </p>
            <div class="peoplelist">
                <div class="infor" v-show="firstshow">
                    <span v-for="(people,index) in sendMsgCustHave" v-if="index < 20" :key="people.id" class="spancla">
                      {{ people.name }}
                      <Icon type="close-round" @click.native="removeCust(index,people.id,1)" title="删除" style="font-size: 10px"
                         v-show="showRemoveCustIcon"></Icon>
                    </span>
                    <span v-for="(people,index) in sendMsgCustHasNo" v-if="index < (20-sendMsgCustHave.length)" :key="people.id">
                      {{ people.name }}
                      <Icon type="close-round" @click.native="removeCust(index,people.id,2)" title="删除" style="font-size: 10px"
                         v-show="showRemoveCustIcon"></Icon>
                    </span>
                </div>
                <div class="infor" v-show="secondshow">
                    <span v-for="(people,index) in sendMsgCustHave" :key="people.id" class="spancla">
                      {{ people.name }}
                      <Icon type="close-round" @click.native="removeCust(index,people.id,1)" title="删除" style="font-size: 10px"
                         v-show="showRemoveCustIcon"></Icon>
                    </span>
                    <span v-for="(people,index) in sendMsgCustHasNo" :key="people.id" :class="{spancla:people.mobile}">
                      {{ people.name }}
                      <Icon type="close-round" @click.native="removeCust(index,people.id,2)" title="删除" style="font-size: 10px"
                         v-show="showRemoveCustIcon"></Icon>
                    </span>
                </div>
                <div class="btncon">
                    <span class="suoming" v-show="btnshow2">最多预览50个客户</span>
                    <Button type="text" size="small" style="clear:both;" @click="seeMore"
                            v-show="btnshow1">
                        <Icon type="chevron-down"></Icon>&nbsp;&nbsp;查看更多
                    </Button>
                    <Button type="text" size="small" style="clear:both;" @click="shouqi"
                            v-show="btnshow2">
                        <Icon type="chevron-up"></Icon>&nbsp;&nbsp;收起
                    </Button>
                </div>
            </div>
        </div>
        <Form class="templinfor" :label-width="80">
            <FormItem label="邮件模板" prop="mestype">
                <Select v-model="mestype">
                    <Option v-for="item in mesModule" :value="item.content" :key="item.id">
                        {{ item.mailName }}
                    </Option>
                </Select>
            </FormItem>

            <FormItem>
                <Input v-model="mestype" type="textarea" :rows="4" readonly
                       placeholder="请输入您要发送的信息..."/>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="ghost" @click="sendCancel">取消</Button>
            <Button type="primary" @click="sendmesOk">发送</Button>
        </div>
        <!-- </div> -->
    </Modal>
</template>
<script>
    export default {
        props: {
            searchParams: {
                type: Object,
                default() {
                    return {}
                }
            },
            isshow2: {
                type: Boolean,
                default: false
            },
            // 总数组
            sendinfor: {
                type: Array,
                default: function () {
                    return [];
                }
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
            searchParams(val) {
                this.custSearchParams = val;
            },
            // 选择的总数
            checkedCustNum(val) {
                this.totalpeople = val;
                if (val <= 20) {
                    this.btnshow1 = false;
                    this.btnshow2 = false;
                } else {
                    this.btnshow1 = true;
                    this.btnshow2 = false;
                }
                this.showRemoveCustIcon = this.totalpeople !== 1;
            },
            // 是否是全选
            tableSelectAll(val) {
                let that = this;
                this.selectAll = val;
                if (val === true) {
                    this.$post(this.global.baseUrl + '/pc/newCust/getMoreList.action', this.custSearchParams).then(res => {
                        if (res.code === 200) {
                            that.sendMsgCustHave = [];
                            that.sendMsgCustHasNo = [];
                            this.emptyMobile = res.data.hasNoMobile;
                            res.data.data.forEach(function (item, i) {
                                if(item.email == 1){
                                    that.sendMsgCustHave.push(item);
                                }
                                if(item.email == 0){
                                    that.sendMsgCustHasNo.push(item);
                                }
                            })
                        }
                    });
                }
            },
            isshow2(val) {
                this.pushMessage = val;
                if (val) {
                    this.firstshow = true;
                    this.secondshow = false;
                    this.removeId = [];
                    this.commonId = null;
                    this.mestype = '';
                }
            },
            sendinfor(val) {
                this.sendMsgCust = JSON.parse(JSON.stringify(val));
                let num = 0;
                this.sendMsgCustHave = [];
                this.sendMsgCustHasNo = [];
                val.forEach(value => {
                    if (!value.mobile) {
                        num = num + 1;
                        this.sendMsgCustHasNo.push(value);
                    }else{
                        this.sendMsgCustHave.push(value);
                    }
                });
                this.emptyMobile = num;
            }
        },
        created() {
            // 发邮件模板
            this.$post(this.global.baseUrl + '/pc/email/getEmailList.action').then(res => {
                if (res.code === 200) {
                    this.mesModule = res.data.data;
                }
            });
        },
        data() {
            return {
                custSearchParams: this.searchParams,
                pushMessage: this.isshow,
                isSelall: false,
                firstshow: true,//用来处理第一次进来时的数据隐藏，显示
                secondshow: false,//用来处理点击查看更多时数据隐藏，显示
                btnshow1: true, //控制确定按钮
                btnshow2: false, //控制收起按钮
                sendMsgCust: this.sendinfor,
                sendMsgCustHave:[],//有电话号码的
                sendMsgCustHasNo:[],//无电话号码的
                selectAll: this.tableSelectAll,//是否全选了
                totalpeople: this.checkedCustNum, //选择的总数
                emptyMobile: 0, // 为空的手机号人数
                mesModule: [],
                mestype: '',
                commonId: null,
                removeId: [],
                showRemoveCustIcon: true // 显示移除客户的icon图标
            };
        },
        methods: {
            sendmesOk() {
                let that = this;
                if (!this.mestype) {
                    that.$Message.warning('请选择短信模板！');
                    return false;
                }
                this.mesModule.forEach(function (item, i) {
                    if (item.content === that.mestype) {
                        that.commonId = item.id;
                    }
                });
                let custIds = [];
                this.sendMsgCust.forEach(function (k, v) {
                    custIds.push(k.id)
                });

                let params = {};
                if (this.selectAll) {
                    params = this.custSearchParams;
                    params.isSelAll = '1';
                } else {
                    params.custIds = custIds;
                }
                params.removeCustId = this.removeId;
                params.commonId = this.commonId;
                this.$post(this.global.baseUrl + '/pc/email/newEmailBatchSend.action', params).then(res => {
                    if (res.code === 200) {
                        this.$Message.success(res.msg);
                        this.$emit('on-success');
                    }
                });
            },
            sendCancel() {
                this.$emit('on-cancel');
            },
            removeCust(index, id,type) {
                let custNum = this.sendMsgCust.length;
                if (custNum <= 2) {
                    this.showRemoveCustIcon = false;
                }
                this.totalpeople--;
                this.$emit("peoNum", this.totalpeople);
                if(type == 1){
                    this.sendMsgCustHave.splice(index, 1);
                }else{
                    this.sendMsgCustHasNo.splice(index, 1);
                }
                this.removeId.push(id);
            },
            // 点击收起时的按钮事件;
            shouqi() {
                this.firstshow = true;
                this.secondshow = false;
                this.btnshow1 = true;
                this.btnshow2 = false;
            },
            // 查看更多按钮
            seeMore() {
                this.firstshow = false;
                this.secondshow = true;
                this.btnshow1 = false;
                this.btnshow2 = true;
            }
        }
    };
</script>
<style lang="less" scoped>
    .selectinfor span.spancla {
        background-color: #a3b1ef !important;
        color: #fff;
    }

    .selectinfor span.totalPeo {
        color: #333;
    }

    button.ivu-btn.ivu-btn-text.ivu-btn-small {
        float: right;
    }

    .infor span {
        background: #fff;
        display: inline-block;
        border: 1px solid #ddd;
        border-radius: 5px;
        padding: 6px 15px;
        margin: 10px 5px;
        color: #666;
    }

    .infor span:hover {
        border-color: #f00;
        color: #f00;
        i.ivu-icon-ios-trash {
            color: #f00;
        }
    }

    .btncon {
        height: 40px;
        span.suoming {
            color: #f00;
            line-height: 30px;
        }
    }

    button.ivu-btn.ivu-btn-info.ivu-btn-small {
        float: right;
    }

    i.ivu-icon.ivu-icon-ios-trash {
        cursor: pointer;
    }
</style>

