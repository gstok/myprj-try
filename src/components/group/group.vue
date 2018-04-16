
<template>
    <div class="layout GgroupBox">
        <Layout>
            <div class="addCustBox">
                <Button type="ghost" @click.stop='AddCust' style="margin-left: 60px">
                    <span class='addplus'>+</span>新建客户
                </Button>
            </div>

            <p class="GgroupTit">群组</p>

            <ul class="groupUl">
                <li class="groupLi" @click="pushGroupId('')"><i class="icon icon-dankehu"></i>
                    <!--<span title='全部'>全部({{allcustNum}})</span>-->
                    <span title='全部'>全部</span>
                </li>
                <li class="groupLi" v-for="(list, index) in groupLists" :key="index" @mouseover="toggleShow(index)"
                    @mouseout="!toggleShow(-1)" @click="pushGroupId(list.id, index)" :class="liIdx === index ? 'active' : ''">
                    <i class="icon icon-kehu2"></i>
                    <!--<span :title='list.groupName'>{{list.groupName}}({{list.custNum}})</span>-->
                    <span :title='list.groupName'>{{list.groupName}}</span>
                    <i class='Gicon icon icon-shanchu' v-show="iconShow && (index == iconIdx)" @click.stop='delPop(list.id,list.groupName)'></i>
                    <i class='Gicon icon icon-bianji' v-show="iconShow && (index == iconIdx)" @click.stop='editGroupPop(index,list.id,list.groupName)'></i>
                    <Form label-position="top" ref="editdate" :model="editdate" :rules="ruleeditdate"
                          style="position: absolute;left: 0;top:0;padding-top: 10px;background: #f3f3f3;z-index: 99;width: 240px"
                          v-show="editGroupShow && (index == inputIdx)">
                        <FormItem style="margin-bottom:0" prop="editgrouptitle">
                            <Input v-model="editdate.editgrouptitle" placeholder="请输入群组名称"></Input>
                        </FormItem>
                        <FormItem style="float: right;margin: 10px 0">
                            <Button type="primary" @click="editGroup()">确定</Button>
                            <Button type="ghost" @click="notAdd" style="margin-left: 8px">取消</Button>
                        </FormItem>
                    </Form>
                </li>
            </ul>

            <div class='GgroupAddBtn' @click='addGroupPop' v-show='addGroupShow'>
                <span>+</span>新建群组
            </div>

            <!--这里是新建群组的表单-->
            <Form v-show='!addGroupShow' label-position="top" ref="formValidate" :model="formValidate" :rules="ruleValidate" style="margin-top: 10px;">
                <FormItem style="margin-bottom:0" prop="grouptitle">
                    <Input v-model="formValidate.grouptitle" placeholder="请输入群组名称"></Input>
                </FormItem>
                <FormItem style="float: right;margin: 10px 0">
                    <Button type="primary" @click="addGroup('formValidate')">确定</Button>
                    <Button type="ghost" @click="notAdd" style="margin-left: 8px">取消</Button>
                </FormItem>
            </Form>

            <!--模态弹框-->
            <Modal v-model="modalDel" width="360" :mask-closable="false">
                <p slot="header" style="color:#f60;text-align:center">
                    <Icon type="information-circled"></Icon>
                    <span>删除警告！</span>
                </p>
                <div style="text-align:center">
                    <p>{{delGoupMsg}}</p>
                </div>
                <div slot="footer">
                    <Button @click="noDel">取消</Button>
                    <Button type='primary' :loading="modal_loading" @click="delGroup">删除</Button>
                </div>
            </Modal>
        </Layout>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                formValidate: {
                    grouptitle: '',//新建群组时群组名称
                },
                ruleValidate: {
                    grouptitle: [
                        {required: true, message: '群组名称不能为空！', trigger: 'blur'},
                        { type: 'string', max: 16, message: '不能超过16个字符！', trigger: 'blur' }
                    ]
                },
                editdate: {
                    editgrouptitle: '',//编辑群组时群组名称
                },
                ruleeditdate: {
                    editgrouptitle: [
                        {required: true, message: '群组名称不能为空！', trigger: 'blur'},
                        { type: 'string', max: 16, message: '不能超过16个字符！', trigger: 'blur' }
                    ]
                },
                id: '',//群组id
                groupTheme: 'light',
                groupLists: [],//群组名称
                addGroupShow: true,//新建群组input默认隐藏
                editgrouptitle: '',//编辑群组时群组名称
                iconShow: false,
                editGroupShow: false,
                inputIdx: -1,
                iconIdx: -1,
                allcustNum:'',//全部群组人数
                modalDel:false,
                modal_loading:false,
                delGoupMsg:'',
                active:[],
                liIdx: -1

            }
        },
        computed: {
            menuitemClasses: function () {
                return [
                    'menu-item',
                    this.isCollapsed ? 'collapsed-menu' : ''
                ]
            }
        },
        created() {
            this.getGroupList(); //获取菜单数据
            this.groupLists.forEach(function(item, i) {
                this.active.push(false);
            });
        },
        methods: {
            //取到群组id
            pushGroupId:function (id, idx) {
                let that = this;
                let newArr = [];
                this.liIdx = idx;
                this.$emit('getid', id);
                this.active[this.iconIdx] = true;

            },
            toggleShow: function (index) {
                this.iconShow = true;
                this.iconIdx = index;
            },

            async mytest () {
                await new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve();
                    }, 4000);
                });
            },


            getGroupList: function () {
                let that = this;
                this.$post("/user-apis/pc/newCust/getList.action").then(res => {
                    if (res.code === 200) {
                        that.groupLists = res.data.data.list;
                        that.allcustNum  = res.data.data.count;
                    }
                });
                // let res = await this.$post("/user-apis/pc/newCust/getList.action");
                // if (res.code === 200) {
                //     that.groupLists = res.data.data.list;
                //     that.allcustNum  = res.data.data.count;
                // }
            },
            //点击新建群组按钮
            addGroupPop: function () {
                this.formValidate.grouptitle = '';
                this.addGroupShow = false;
                this.editGroupShow = false;
            },
            //新建群组
            addGroup: function () {
                this.editGroupShow = false;
                let that = this;
                if (this.formValidate.grouptitle == '') {
                    this.$Message.warning('群组名称不能为空！');
                    return;
                }
                let data = {
                    groupName:that.formValidate.grouptitle
                };
                that.$post("/user-apis/pc/newCust/createGroup.action",data).then(res => {
                    if (res.code === 200) {
                        that.getGroupList();
                        this.$emit("getGroupLists");
                        that.addGroupShow = true
                    }
                });
            },
            //点击取消按钮
            notAdd: function () {
                this.addGroupShow = true;
                this.editGroupShow = false;
            },
            //删除弹窗
            delPop:function (id,tit) {
                this.modalDel = true;
                this.id = id;
                this.delGoupMsg = "确定删除群组"+tit+"吗？"
            },
            //取消删除
            noDel:function () {
                this.modalDel = false;
            },
            //删除群组
            delGroup: function () {
                let that = this;
                let data = {
                    id: this.id
                };
                this.$post("/user-apis/pc/custGroup/delectGroup.action", data).then(res => {
                    if (res.code === 200) {
                        that.getGroupList();
                        that.modal_loading = true;
                        setTimeout(() => {
                            that.modal_loading = false;
                            that.modalDel = false;
                            that.$Message.success('删除成功！');
                        }, 2000);
                    }
                });
            },
            //编辑群组弹窗
            editGroupPop: function (index, id, tit) {
                this.id = id;
                this.editdate.editgrouptitle = tit;
                this.inputIdx = index;
                this.editGroupShow = true;
                this.addGroupShow = true;
            },
            //编辑
            editGroup: function () {
                let data = {
                    id: this.id,
                    groupName: this.editdate.editgrouptitle
                };
                let that = this;
                that.$post(this.global.baseUrl +"/pc/newCust/updateGroup.action", data).then(res => {
                    if (res.code === 200) {
                        that.editGroupShow = false;
                        that.getGroupList();
                    }
                });
            },

            //新建客户
            AddCust () {
                this.$emit('addCust');
                this.$emit('gstokTest');
            }
        },
        async mounted () {
            let res = await this.$post("/user-apis/pc/newCust/getList.action");
            if (res.code === 200) {
                console.log(res.data.data.count);
                console.log(res.data.data.list);
            }
        }
    }
</script>
<style type="less" scoped>

    .GgroupBox.layout {
        background: #fff;
        position: relative;
        border-radius: 5px;
        overflow: hidden;
    }

    .GgroupBox {
        width: 240px;
        position: absolute;
        top: 0;
        left: 0;
        float: left;
        min-height: 100vh;
        box-shadow: 0 0 18px #e7e7e7;

        .addCustBox {
            background: #fff;
            padding: 20px 0;
            span.addplus {
                font-size: 22px;
                line-height: 18px;
                display: block;
                width: 15px;
                float: left;
                margin-right: 5px;
            }
        }
        .icon {
            color: #ababab
        }
        .icon.icon-dankehu,
        .icon.icon-kehu2 {
            color: #c0c0c0
        }
        .GgroupTit {
            height: 30px;
            line-height: 30px;
            padding-left: 20px;
            /*border-bottom: 1px solid #d7dde4;*/
        }
        .ivu-menu-vertical .ivu-menu-item {
            padding: 7px 8px;
            position: relative;
            cursor: pointer;
            z-index: 1;
            transition: all 0.2s ease-in-out;
        }
        .ivu-menu-vertical .ivu-menu-item > span {
            width: 160px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        .ivu-menu-item > i {
            margin-right: 0
        }
        .ivu-menu-vertical .ivu-menu-submenu-title-icon {
            float: left;
            position: relative;
            top: 4px;
        }
        .Gicon {
            float: right;
            margin-right: 0;

        }
        .Gicon.icon-shanchu {
            margin-left: 10px;
        }
        .ivu-menu-vertical .ivu-menu-submenu-title {
            padding: 14px 10px;
        }

        .GgroupAddBtn {
            height: 36px;
            cursor: pointer;
            line-height: 36px;
            padding-left: 6px;
            /*border-top: 1px solid #d7dde4;*/
            /*border-bottom: 1px solid #d7dde4;*/
            background: #fff;
            width: 240px;
        }
        .GgroupAddBtn span {
            font-size: 22px;
            line-height: 36px;
            display: block;
            width: 15px;
            float: left;
        }

    }

    .groupUl {
        background: #fff;
        border-right: 2px solid #fff;
        li {
            line-height: 30px;
            position: relative;
            padding: 0 5px
        }
        li:hover {
            background: #f5f7f9;
            border-right: 2px solid #f5f7f9;
        }
        li.active, li.active:hover, li:hover.active {
            background: #f5f7f9;
            border-right: 2px solid #7e8fe1;
        }

    }

    .groupLi {
        cursor:pointer;
    }

    .GgroupBox .ivu-btn {
        padding: 3px 8px;
    }

    .GgroupBox .ivu-btn.ivu-btn-primary {
        background: #7e8fe1;
        border: 1px solid #7e8fe1;
    }

    .GgroupBox .ivu-btn.ivu-btn-ghost {
        margin-right: 5px;
    }

    .GgroupBox .ivu-btn.ivu-btn-ghost:hover {
        color: #7e8fe1;
        background-color: transparent;
        border-color: #7e8fe1;
    }

</style>
