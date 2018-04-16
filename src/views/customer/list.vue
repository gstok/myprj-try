<template>
    <div>
        <h2>
            <a href="javascript:;">
                <i class="verticalLine"></i>
                用户管理
            </a>
        </h2>
        <div id='Gpage-inner' class='clearfix'>
            <!--群组列表-->
            <g-group ref="Ggroup" @addCust="addCust" @getid="getGroupId" @getGroupLists="getGroupLists"></g-group>
            <!--群组列表-->
            <div class='GcustListContBox'>
                <div class="GcustListCont">
                    <!--搜索区域-->
                    <g-groupsearch @search="search"
                                   :Gid = 'id'
                                   @reset="reset">
                    </g-groupsearch>
                    <!--搜索区域-->
                    <!--表格分页-->
                    <g-table ref="gTable"
                             :columns="columns"
                             :data="Cutists"
                             :stripe="true"
                             :loading="loading"
                             @on-select-all="handleTableSelectAll"
                             @on-selection-change="handleTableSelectionChange"
                             :total="total" :current="currentPage" :pageSize="pageSize"
                             @on-page-size-change="handlePageSizeChange"
                             @on-sort-change="handleSortChange"
                             @on-change="handlePageNumberChange"
                             @on-select-cancel="handleTableSelectCancel">
                    </g-table>
                    <!--表格分页-->
                </div>
            </div>
            <!--微信登录-->
            <wxLogin ref="wxLogin" :checkedCustNum="checkedCustNum"
                     :single="isSingle" :show = "isShow"
                     @on-finish="addWechatF"
                     @on-cancel="cancel">
            </wxLogin>
            <!--微信登录-->
            <!--侧边栏批量操作-->
            <SlidingMenu ref="SlidingMenu"
                         :custLists = 'checkedcustLists'
                         :tableSelectAll='tableSelectAll'
                         :checkedCustNum="checkedCustNum"
                         :searchParams="searchParams"
                         @movedepart="refreshMoveTab"
                         @fpman="refreshTab"
                         @delpeople="refreshMoveTab"
                         @muhide="muhide">
            </SlidingMenu>
            <!--侧边栏批量操作-->
            <!--单个发送短信-->
            <singlesend ref="singlesend"
                        :Sendshow="singlesendShow"
                        :custName='sendcustName'
                        :custId="sendcustId"
                        @on-cancel="cancel"
                        @on-suc="cancel">
            </singlesend>
            <!--单个发送短信-->
            <!--添加好友招呼语-->
            <addfriendsgreet ref="addFbox"
                             :sessionId="sessionId"
                             :addShow ='addFShow'
                             @addWechatFridens='addFridens'
                             @cancel="cancel">
            </addfriendsgreet>
            <!--添加好友招呼语-->
            <!--详情页-->
            <Modal v-model="detailShow"
                   :styles="{width: '100%',top:'70px',bottom:'0','padding-left':'60px'}"
                   :footerHide="true"
                   :mask-closable="false"
                   title='   ' class="custDetail"
                   @on-cancel="canceldetail">
                <customerDetail ref="custDetail" :userId="userId"
                                :mobileNum = 'mobile'
                                :searchParams="searchParams"
                                :position="custPosition"
                                @on-addCustTag="getCustList"
                                @addFs='detailaddF'>
                </customerDetail>
            </Modal>
            <!--详情页-->
        </div>
    </div>
</template>
<script>

    import singlesend from './../../components/singlesend';//单个发送
    import SlidingMenu from './../../components/slidingmenu';//滑动菜单
    import GTagTip from './tagTip.vue';//表格--标签
    import ListOpt from './listOpt';//操作
    import UserName from './userName';//客户姓名
    import Gstage from './stage';
    import customerDetail from './detail';
    import imgChengjiao from './../../assets/img/chegnjiao.png';
    import imgChubu from './../../assets/img/chubuyixiang.png';
    import imgNewcust from './../../assets/img/newcut.png';
    import imgYixiang from './../../assets/img/yixiang.png';
    let cookiesPageSizeConst = "cust_list_page_size";

    export default {
        name: 'cust-list',
        components: {
            GTagTip,
            ListOpt,
            UserName,
            SlidingMenu,
            singlesend,
            Gstage,
            customerDetail
        },
        data() {
            return {
                isSingle:true,//true 代表单个发送   false代表多个发送
                total:0,//总条数
                currentPage:1,//当前页
                pageSize: 20,
                orderBy:'create_time',//name  source  stage_id create_time
                orderByASC:'DESC',//ASC:顺序   DESC 倒叙
                sessionId:'',//微信id
                sendcustId:'',//单个发送的客户id
                addFShow:false,//单个添加好友招呼语显示隐藏
                sendcustName:'',//单个发送的客户名称
                singlesendShow:false,//单个发送显示隐藏
                checkedcustLists:[],//选中客户
                checkedCustNum:0,//选中客户的个数
                isShow:false,
                id:'',//群组id
                custPosition: -1,
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center',
                        sortable: 'custom'
                    },
                    {
                        title: '客户',
                        key: 'name',
                        sortable: 'custom',
                        render: (h, params) => {
                            let data = params.row,
                                userName = data.name,
                                sex = data.sex,
                                wximgUrl = data.wxHeadImgUri,
                                weixinNiceName = data.weixinNiceName,
                                userId = data.id,
                                that = this;

                            // 数据的游标
                            let position = (this.currentPage - 1) * this.pageSize + params.row._index + 1;

                            return h('div', [
                                h(UserName, {
                                    props: {
                                        userName: userName,
                                        sex:sex,
                                        wximgUrl:wximgUrl,
                                        weixinNiceName:weixinNiceName,
                                        userId:userId,
                                        position: position
                                    },
                                    on: {
                                        viewDetail: function (data, position) {
                                            that.detailShow = true;
                                            that.userId = data;
                                            that.custPosition = position;
                                        }
                                    }
                                })
                            ]);
                        }
                    },
                    {
                        title: '客户标签',
                        width:200,
                        key: 'customTagList',
                        render: (h, params) => {
                            let data = params.row;
                            let hkdwTaglist = data.hkdwTaglist;
                            let customTagList = data.customTagList;

                            return h('div', [
                                h(GTagTip, {
                                    props: {
                                        hkdwTaglist: hkdwTaglist,
                                        customTagList: customTagList
                                    }
                                })
                            ]);
                        }
                    },
                    {
                        title: '销售阶段',
                        align:'center',
                        key: 'stage_id',
                        sortable: 'custom',
                        // return h('div', [
                        //     h(Gstage, {
                        //         props: {
                        //             stName: stageName
                        //         }
                        //     })
                        // ])
                        render: (h, params) => {
                            let stageName = params.row.stageName;
                            let that = this;
                            let src = "";
                            switch (stageName) {
                                case "新客户":
                                    src = that.img.newCust;
                                    break;
                                case "初次接触":
                                    src = that.img.chubu;
                                    break;
                                case "意向线索":
                                    src = that.img.yixiang;
                                    break;
                                case "成交客户":
                                    src = that.img.chengjiao;
                                    break;
                            }
                            return h('div', [
                                h('Poptip', {
                                    props: {
                                        content: stageName,
                                        trigger:'hover'
                                    },
                                    style:{}
                                },[
                                    h('img', {
                                        attrs: {
                                            src: src
                                        },
                                        style:{
                                            cursor: 'pointer'
                                        }
                                    }),
                                ])
                            ])
                        }
                    },
                    {
                        title: '客户来源',
                        key: 'source',
                        sortable: 'custom',
                        render: (h, params) => {
                            let source = params.row.source;
                                let _class = "";
                                switch (source) {
                                    case "企业数据":
                                        _class = 'icon icon-gaiicon-5';
                                        break;
                                    case "华坤道威":
                                        _class = 'icon icon-huakundaowei red';
                                        break;
                                    case "营销数据":
                                        _class = 'icon icon-gaiicon-18';
                                        break;
                                }
                            return h('div', [
                                h('i', {
                                    attrs: {
                                        class: _class
                                    },
                                    style:{
                                        'font-size': '13px',
                                        'color': '#606cbf',
                                        'margin-right':'5px'
                                    }
                                }),
                                h('span', {}, source)
                            ])
                        }
                    },
                    {
                        title: '创建时间',
                        width:106,
                        key: 'create_time',
                        sortable: 'custom',
                        sortType: 'desc',
                        render: (h, params) => {
                            let date = new Date(params.row.createTime);
                            return h('div', {}, date.format('yyyy-MM-dd hh:mm'));
                        }
                    },
                    {
                        title: '最新动态',
                        width:185,
                        key: 'address',
                        render: (h, params) => {
                            let custLatestEventVo = params.row.custLatestEventVo;
                            let latestTime = '';
                            let remark = '';
                            if (custLatestEventVo) {
                                latestTime = custLatestEventVo.latestTime;
                                remark = custLatestEventVo.remark;
                            }

                            return h('div', [
                                h('p', {}, latestTime),
                                h('div', {
                                    style:{
                                        'width': '185px',
                                        'line-height': '20px',
                                        'word-wrap': 'break-word',
                                        'word-break': 'normal',
                                        'overflow': 'hidden',
                                        'text-overflow': 'ellipsis',
                                        'display': '-webkit-box',
                                        '-webkit-line-clamp': 2,
                                        '-webkit-box-orient': 'vertical',
                                        'color':'#099444'
                                    }
                                }, remark),
                            ])
                        }
                    },
                    {
                        title: '操作',
                        width:60,
                        align:'center',
                        render: (h, params) => {
                            let id = params.row.id,
                                mobile = params.row.mobile,
                                telephone = params.row.telephone,
                                name = params.row.name,
                                callCount = params.row.callCount,
                                Status = params.row.grantMobileStatus,
                                that = this;
                            return h('div', [
                                h(ListOpt, {
                                    props: {
                                        custId: id,
                                        custMobile:mobile,
                                        telephone:telephone,
                                        custName:name,
                                        callCount:callCount,
                                        MobileStatus:Status
                                    },
                                    on: {
                                        sendSms: function (data) {
                                            that.singlesendShow = true;
                                            that.sendcustName = data.name;
                                            that.sendcustId = data.custId;
                                            that.$refs.singlesend.clearMsg();
                                        },
                                        addFs:function (data) {
                                            that.AddWechatparams.custIds = data.custId;
                                            that.isSingle = data.singel;
                                            that.addFShow = true;
                                            that.$refs.addFbox.refresh();
                                        },
                                        call:function (data) {
                                            that.detailShow = true;
                                            that.userId = data.custId;
                                            that.mobile = data.custMobile;
                                            that.$refs.custDetail.callPageShowEvent(data.custId,data.type,data.custMobile);
                                        },
                                        portrait:function (data) {
                                            that.detailShow = true;
                                            that.userId = data.custId;
                                            setTimeout(function () {
                                                that.$refs.custDetail.selectStyle(3);
                                            },50);

                                        }
                                    }

                                })
                            ])
                        }
                    }
                ],//表格头部
                Cutists: [],//客户列表
                loading: false,//是否显示加载中
                wechatLoginShow:false,
                LShow:false,//登录框
                EShow:false,//二维码登录框
                CShow:false,//验证码框
                DShow:false,//拖拽框
                searchParams: {
                    groupId:this.id,//	群组id	number
                    stageIds:'',//	销售阶段id	array<number>
                    sources:'',//	客户来源	array<string>
                    haveNoCustomTag:'',//	无客户标签	number	任意int值
                    haveNoHkdwTag:'',//	无华坤标签	number	任意int值
                    hkdwTags:'',//	华坤标签
                    customTags:'',//	客户标签
                    userIds:'',//客户负责人
                    memberLevels:'',//	客户等级
                    callStatuses:'',//	拨打状态
                    callResultResponses:'',//	沟通结果

                    assignEndTime:'',//分配时间（结束）
                    assignStartTime:'',//	分配时间（开始）
                    fastSearch:'',//	快速搜索	string
                    lastCallEndTime:'',//	最后联系时间（结束）
                    lastCallStartTime:'',//	最后联系时间（开始）

                    pageIndex:1,//
                    pageSize:20,//

                    orderBy:'create_time',//name  source  stage_id create_time
                    orderByASC:'DESC'//ASC:顺序   DESC 倒叙
                }, // 搜索参数
                tableSelectAll: false, // 表格选择所有
                detailShow:false,//详情页默认隐藏
                userId:'',//客户id
                mobile:'',//打电话的号码
                AddWechatparams:{
                    logoutOnFinish:true,
                    custIds:'',
                    isSelAll:'',
                    commonId:'',
                    helloMessage:''
                },//添加好友的参数
                img: {
                    chengjiao: imgChengjiao,
                    chubu: imgChubu,
                    newCust: imgNewcust,
                    yixiang: imgYixiang
                }
            }
        },
        created() {
            let p = this.$cookies.get(cookiesPageSizeConst);
            if (!p) {
                this.pageSize = 20;
            } else {
                this.pageSize = Number(p);
            }
            //this.getCustList(); //获取客户列表
        },
        methods: {
            //侧边菜单重新刷新群组列表---分配
            getGroupLists(){
                this.$refs.SlidingMenu.getGroupList();
            },
            //点击重置表格里面取消勾选
            reset(){
                this.$refs.gTable.tableSelectAll(false);
            },
            //获取群组id
            getGroupId(params) {
                this.id = params;
                this.$refs.gTable.tableSelectAll(false);
                this.getCustList();
            },
            //点击取消
            cancel() {
                this.isShow = false;
                this.singlesendShow = false;
                this.addFShow = false;
            },
            //点击客户详情的关闭
            canceldetail(){
                this.userId = '';
                this.custPosition = -1;
            },
            //获取客户列表
            getCustList(params) {
                // console.log(params);
                this.searchParams.pageIndex = this.currentPage;
                this.searchParams.pageSize = this.pageSize;
                this.searchParams.orderByASC = this.orderByASC;
                this.searchParams.orderBy = this.orderBy;
                this.searchParams.groupId = this.id;//	群组id	number

                this.loading = true;
                this.$post(this.global.baseUrl +"/pc/newCust/queryList.action", this.searchParams).then(res => {
                    if (res.code === 200) {
                        this.loading = false;
                        this.Cutists = res.data.pageData.list;
                        if (this.tableSelectAll) {
                            this.Cutists.forEach(value => {
                                value._checked = true;
                            })
                        }else{
                            this.Cutists.forEach(value => {
                                value._checked = false;
                            })
                        }
                        this.total = res.data.pageData.page.total;
                        this.currentPage = res.data.pageData.page.pageIndex;
                    }
                });
            },
            handleTableSelectionChange(selection) {
                if (selection.length === 0) {
                    this.tableSelectAll = false;
                }
                this.checkedcustLists = selection;
                if (this.tableSelectAll) {
                    this.checkedCustNum = this.total;
                } else {
                    this.checkedCustNum = selection.length;
                }
            },
            handleTableSelectCancel(selection, row) {
                this.tableSelectAll = false;
            },
            handlePageSizeChange(pageSize) {
                this.pageSize = pageSize;
                this.$cookies.set(cookiesPageSizeConst, this.pageSize);
                this.getCustList();
            },
            handleSortChange(column, key, order) {
                console.log(order);
                if (order === 'normal') {
                    order = 'asc';
                }
                this.orderBy = key;
                this.orderByASC = order;
                this.getCustList();
            },
            handlePageNumberChange(page) {
                this.currentPage = page;
                this.getCustList();
            },
            //搜索
            search(params) {
                this.searchParams = params;
                this.currentPage = 1;
                this.getCustList();
            },
            //单个客户添加好友弹窗
            addFridens(params) {
                this.isShow = true;
                this.addFShow = false;
                this.AddWechatparams.logoutOnFinish = params.exit;
                this.AddWechatparams.isSelAll = params.isSelAll;
                this.AddWechatparams.helloMessage = params.helloMessage;
            },
            //单个加好友
            addWechatF(data){
                this.isShow = false;
                let that = this;
                that.AddWechatparams.commonId = data;
                this.$post(this.global.baseUrl + "/pc/wechatFriend/newAddWechatFriends.action",this.AddWechatparams).then(res => {
                    if(res.code == 200) {
                        that.$Message.success(res.msg);
                    }
                });
            },
            //新建客户
            addCust() {
                this.$router.push({path: '/views/customer/addcust'});
            },
            handleTableSelectAll(selection) {
                this.tableSelectAll = !this.tableSelectAll;
            },
            //点击滑动菜单的取消
            muhide(){
                this.$refs.gTable.tableSelectAll(false);
            },
            //批量移动群组，删除后刷新列表
            refreshMoveTab(){
                this.$refs.gTable.tableSelectAll(false);
                this.getCustList();
                this.$refs.Ggroup.getGroupList();
            },
            //批量分配后刷新列表
            refreshTab(){
                this.$refs.gTable.tableSelectAll(false);
                this.getCustList();
            },
            //详情页面单个加好友
            detailaddF(data){
                let that = this;
                that.AddWechatparams.custIds = data.custId;
                that.isSingle = data.singel;
                that.addFShow = true;
                that.$refs.addFbox.refresh();
            }
        }
    };
</script>
<style>

    .custDetail .ivu-modal-mask {
        background-color: rgba(55, 55, 55, 0);
    }

    #Gpage-inner {
        width: 100%;
        margin: 10px 20px 10px 0;
        padding: 10px 0;
        height: auto;
        position: relative;
    }

    .GcustListContBox {
        margin-left: 250px;
    }

    .GcustListCont {
        background-color: #fff;
        padding: 10px;
        float: left;
        width: 100%;
        min-height: 600px;
        border-radius: 5px;
        height: auto;
        box-shadow: 0 0 18px #e7e7e7;
    }
    .icon.red {
        color: red!important
    }

</style>
