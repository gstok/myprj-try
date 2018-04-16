<template>
    <div class="lastmenu">
        <ul>
            <li @click="custGroup">移动群组</li>
            <li @click="fenpei">分配</li>
            <li @click="deleteCust">删除</li>
        </ul>

        <!-- 分组的信息 开始-->
        <div class="groups" v-show="showGroup">
            <ul>
                <li v-for="(qunzu,index) in qunzus" @click="updateCustGroup(index,qunzu.id)"
                    :class="{'active':index===isActive}" :key="qunzu.id">
                    {{ qunzu.groupName }}
                </li>
            </ul>
        </div>
        <!--  -->
        <!-- 删除的点击事件的弹窗 -->
        <Modal v-model="showDelete" :mask-closable="false" title="删除提示" @on-ok="confirmDeleteCust" @on-cancel="cancelDeleteCust">
            <div class="HintTitle">
                已选中
                <span>{{ totalpeople }}</span>个客户，是否确定删除?
            </div>
        </Modal>
        <!-- 分配的弹窗 -->
        <Modal v-model="pushMessage" :mask-closable="false" title="分配信息" @on-ok="confirmFenpei" @on-cancel="cancelFenpei">
            <div class="somebody">
                <p>
                    已选中
                    <span>{{ totalpeople }}</span>个客户
                </p>
                <!-- 人员列表 -->
                <div class="infor" v-show="firstshow">
                    <span v-for="(people,index) in checkedCustList" v-if="index < 20" :key="index">
                      {{ people.name }}
                      <Icon type="ios-trash" @click.native="removeCust(index,people.id)" title="删除"
                            v-show="showRemoveCustIcon"></Icon>
                    </span>
                </div>
                <div class="infor" v-show="secondshow">
                    <span v-for="(people,index) in checkedCustList" :key="index">
                      {{ people.name }}
                      <Icon type="ios-trash" @click.native="removeCust(index,people.id)" title="删除"
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
                <!-- 树结构部门：用组件封装一下 -->
                <div class="segment">
                    <p class="leftname">选择要分配同事</p>
                    <div class="lefttree">
                        <Tree :data="treeList" show-checkbox multiple @on-check-change="checkedNodes" empty-text></Tree>
                    </div>
                    <p class="desname">已选择的同事：
                        <span>请从左侧选择后添加</span>
                    </p>
                    <div class="rightbox">
                        <ul class="rightplist">
                            <li v-for="(people,index) in rightpeople">
                                {{ people.title }}
                                <Icon type="android-close" @click.native="deleName(index)"></Icon>
                            </li>
                        </ul>
                    </div>
                </div>
                <!-- 树结构结束 -->
            </div>
        </Modal>
    </div>
</template>
<script>
    import clickoutside from '../../directives/clickoutside';

    export default {
        name: 'topinfor',
        directives: {clickoutside},
        props: {
            searchParams: {
                type: Object,
                default() {
                    return {}
                }
            },
            custList: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            checkedCustNum: {
                type: Number,
                default: 0
            },
            tableSelectAll: {
                type: Boolean,
                default: false
            }
        },
        watch: {
            searchParams(val) {
                this.custSearchParams = val;
            },
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
            tableSelectAll(val) {
                this.selectAll = val;
            },
            custList(val) {
                this.checkedCustList = val;
            }
        },
        mounted() {
            // this.$nextTick(function () {
            //     this.$post(this.global.baseUrl + '/pc/newCust/getList.action').then(res => {
            //         if (res.code === 200) {
            //             this.qunzus = res.data.data.list;
            //         }
            //     });
            // });
        },
        created() {
            this.getGroupList();
        },
        data() {
            return {
                custSearchParams: this.searchParams,
                totalpeople: this.checkedCustNum, //选择多少人
                checkedCustList: [],
                selectAll: this.tableSelectAll,//是否全选

                id: '',
                pushMessage: false, //控制弹窗隐藏显示

                showGroup: false, // 分组显示变量

                showDelete: false, // 删除弹框显示变量

                firstshow: true,//用来处理第一次进来时的数据隐藏，显示
                secondshow: false,//用来处理点击查看更多时数据隐藏，显示
                btnshow1: true, //控制确定按钮
                btnshow2: false, //控制收起按钮

                showRemoveCustIcon: true, // 显示移除客户的icon图标
                treeList: [],//存储树结构



                isActive: '', // 移动群组
                qunzus: [],
                isactive: false,
                // 树结构的造假数据
                rightpeople: [], //右侧的人员
                removeId: [],
            };
        },
        methods: {
            //获取群组列表
            getGroupList(){
                this.$post(this.global.baseUrl + '/pc/newCust/getList.action').then(res => {
                    if (res.code === 200) {
                        this.qunzus = res.data.data.list;
                    }
                });
            },
            //隐藏移动群组的群组列表
            hideTeam() {
                this.showGroup = false;
            },
            // 移动群组
            custGroup() {
                this.showGroup = !this.showGroup;
            },
            // 获取选中的群组
            updateCustGroup(index, id) {
                this.showGroup = !this.showGroup;
                this.isActive = index;

                let custIds = [];
                this.custList.forEach(function (k, v) {
                    custIds.push(k.id)
                });

                let params = {};
                if (this.selectAll) {
                    params = this.searchParams;
                    params.isSelAll = '1';
                } else {
                    params.custIds = custIds;
                }
                params.toGroupId = id;

                this.$post(this.global.baseUrl + '/pc/newCust/createCustGroup.action', params).then(
                    res => {
                        if (res.code === 200) {
                            this.$Message.success('分组成功！');
                            // 传给父组件，用来刷新分组成功后 的群组列表函数的刷新;
                            this.$emit('refresh')
                        }
                    }
                );
            },
            // 菜单上的 删除按钮 的点击事件
            deleteCust() {
                this.hideTeam();
                this.showDelete = true;
            },
            // 删除选择人*********弹窗里的确定和删除按钮的回调
            confirmDeleteCust() {
                let custIds = [];
                this.custList.forEach(function (k, v) {
                    custIds.push(k.id)
                });

                let params = {};
                if (this.selectAll) {
                    params = this.searchParams;
                    params.isSelAll = '1';
                } else {
                    params.custIds = custIds;
                }

                this.$post(this.global.baseUrl + '/pc/newCust/batchDelete.action', params).then(res => {
                    if (res.code === 200) {
                        this.$Message.info('删除成功！');
                        // 用语向父组件 调教回调，用于删除人员后，列表数据刷新
                        this.$emit('on-delete-cust');
                    }
                });
            },
            cancelDeleteCust() {
                this.showDelete = false;
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
            },
            removeCust(index, id) {
                let custNum = this.checkedCustList.length;
                if (custNum <= 2) {
                    this.showRemoveCustIcon = false;
                }
                this.totalpeople--;
                this.$emit("peoNum", this.totalpeople);
                this.checkedCustList.splice(index, 1);
                this.removeId.push(id);
            },
            // 分配事件的弹窗
            fenpei() {
                this.hideTeam();
                this.firstshow = true;
                this.secondshow = false;
                this.removeId = [];

                this.pushMessage = true;
                this.getTreelist();
            },
            /******树结构的逻辑函数----开*始**************/
            getTreelist() {
                this.treeList = [];
                this.rightpeople = [];

                if (this.selectAll === true) {
                    this.$post(this.global.baseUrl + '/pc/newCust/getMoreList.action', this.custSearchParams).then(res => {
                        if (res.code === 200) {
                            this.checkedCustList = res.data.data;
                        }
                    });
                }
                this.$post(this.global.baseUrl + '/pc/newCust/getUserTree.action').then(res => {
                    if (res.code === 200) {
                        let dar = res.data.data;
                        this.treeList.push(dar);
                    }
                });
            },
            deleName(index) {
                // 获取删除的当前的一个人的数据
                let people = this.rightpeople[index];
                //点击哪一个删除哪一个
                this.rightpeople.splice(index, 1);
                // // 树选中状态移除
                this.treeList.forEach(value => {
                    if (!value.isdepart) {
                        this.removeTreeChecked(value, people.id);
                    } else {
                        if (value.children) {
                            value.checked = false;
                            this.removeTreeChecked(value.children, people.id);
                        }
                    }
                });
            },
            //接口返回的树结构数据由于不知道有多少层的子数据；进行数据递归；
            removeTreeChecked(list, id) {
                list.forEach(item => {
                    // 进行取反，获取它下边的数据
                    if (!item.isdepart) {
                        // 判断如果这条数据id与被删除的数据的id相同，让节点的选中状态取消掉
                        if (id === item.id) {
                            item.checked = false;
                        }
                    } else {
                        if (item.children) {
                            // 获取它下边的子数据
                            item.checked = false;
                            this.removeTreeChecked(item.children, id);
                        }
                    }
                });
            },
            // 选择复选框事件
            checkedNodes(val) {
                this.rightpeople = [];
                val.forEach((k, v) => {
                    if (k.isdepart == false) {
                        this.rightpeople.push(k);
                    }
                });
            },
            /*******树结构的逻辑函数----结束**************/
            // 用户分配的确定按钮回调
            confirmFenpei() {
                let custIds = [];
                this.checkedCustList.forEach(function (k, v) {
                    custIds.push(k.id)
                });

                let toUserIdlist = [];
                this.rightpeople.forEach((k, v) => {
                    toUserIdlist.push(k.id);
                });

                let params = {};
                if (this.selectAll) {
                    params = this.custSearchParams;
                    params.isSelAll = '1';
                } else {
                    params.custIds = custIds;
                }
                params.toUserIdList = toUserIdlist;
                params.removeCustId = this.removeId;

                this.$Spin.show();
                this.$post(this.global.baseUrl + '/pc/newCust/batchDistribut.action', params).then(res => {
                    this.$Spin.hide();
                    if (res.code === 200) {
                        this.$Message.info(res.msg);
                        this.$emit("fenpei")
                    }
                }).catch(res => {
                    this.$Spin.hide();
                });

            },
            cancelFenpei() {
            }
        },
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

    .active {
        background: #5cadff;
        color: #fff !important;
    }

    .lastmenu {
        border: 1px solid #5cadff;
        border-top: 0;
        ul li {
            list-style: none;
            padding: 9px 20px;
            cursor: pointer;
            color: #5cadff;
        }
        ul li:hover {
            color: #3091f2;
        }
        .groups {
            position: absolute;
            left: -160px;
            overflow-y: scroll;
            height: 240px;
            bottom: -163px;
            background-color: #fff;
            width: 160px;
            border: 1px solid #5cadff;
            border-radius: 5px;
            box-shadow: 2px 5px 10px #fff;
        }
    }

    .HintTitle {
        height: 200px;
        text-align: center;
        line-height: 200px;
        span {
            color: #0c6;
            padding: 0 5px;
        }
    }

    .somebody {
        span {
            color: #0c6;
            padding: 0 5px;
        }
        span.pname {
            display: inline-block;
            border: 1px solid #5cadff;
            margin: 5px;
            padding: 5px;
            border-radius: 3px;
            color: #fff;
            background-color: #5cadff;
        }
        ul li:first-child {
            margin-left: 0;
        }
        .btnbottom {
            height: 40px;
            button.ivu-btn.ivu-btn-info.ivu-btn-small {
                float: right;
                margin-top: 15px;
            }
        }
        .segment {
            border-top: 1px solid #666;
            width: 106%;
            position: relative;
            height: 330px;
            margin-top: 10px;
            margin-left: -15px;
            p.leftname {
                margin-top: 20px;
                margin-left: 6px;
            }
            .lefttree {
                width: 48%;
                border: 1px solid #ddd;
                margin: 10px 5px;
                height: 265px;
                overflow-y: auto;
            }
            .rightbox {
                width: 48%;
                padding: 5px;
                border: 1px solid #ddd;
                height: 150px;
                position: absolute;
                right: 6px;
                top: 48px;
                height: 265px;
                overflow-y: auto;
                i.ivu-icon-android-close {
                    float: right;
                    display: none;
                }
                ul.rightplist li {
                    padding: 5px 5px;
                    cursor: pointer;
                    clear: both;
                }
                ul.rightplist li:hover {
                    background: #5cadff;
                    opacity: 0.8;
                    i.ivu-icon-android-close {
                        display: block;
                        margin-top: 3px;
                    }
                }
            }
            p.desname {
                position: absolute;
                right: 63px;
                top: 20px;
                span {
                    color: #999;
                }
            }
        }
    }
</style>


