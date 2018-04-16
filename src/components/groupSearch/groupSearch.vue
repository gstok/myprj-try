<template>
    <div class='GgroupSearchBox'>
        <Row>
            <div class="searchBox">
                <Input v-model="fastSearch" placeholder="请输入姓名、手机号、微信号、微信昵称搜索" style="width:560px"></Input>
                <i class='icon icon-sousuo-sousuo'></i>
            </div>
        </Row>
        <Row>
            <groupSel ref="stageSel" @on-click='getstageIds' @on-change='getstageIds' :GfilterTit='stagefilterTit' :ListObj='stageListObj' :AllChek='stageAllChek' :AllChekSelectAll='stageAllChekSelectAll' :TotalChek='stageTotalChek'></groupSel>
        </Row>

        <Row>
            <groupSel ref="sourceSel" @on-click='getsources' @on-change='getsources' :GfilterTit='sourcefilterTit' :ListObj='sourceListObj' :AllChek='sourceAllChek' :AllChekSelectAll='sourceAllChekSelectAll' :TotalChek='sourceTotalChek'></groupSel>
        </Row>
        <Row>
            <div class='filterBox'>
                <div class="filterTit">客户标签</div>
                <Tag ref="tagAllRef" checkable :checked='false' color="blue" @on-change="allTagsCheck">全部</Tag>
                <!--<Checkbox v-model="allTags" @on-change="allTagsCheck">全部</Checkbox>-->
                <Tag closable v-for="list in HkTagLists" :key="list" :name="list" @on-close="handleCloseHkTag">{{list}}</Tag>
                <Tag closable v-for="list in DefineTagLists" :key="list" :name="list" @on-close="handleCloseDefineTag">{{list}}</Tag>
                <Tag closable v-for="list in TagLists" :key="list" :name="list" @on-close="handleCloseTag">{{list}}</Tag>
                <Button type="ghost" @click='AddustTagsPop'>
                    <span class='addplus'>+</span>添加</Button>
            </div>
        </Row>
        <CustTags ref="custTags"
                  :show = "CustTagisShow"
                  :defineCustomTagList="DefineTagLists"
                  :defineHkTagList="HkTagLists"
                  :haveNoHkTag="haveNoHkTag"
                  :haveNoCTag="haveNoCTag"
                  @submit="submitTag"
                  @on-cancel="cancel">
        </CustTags>
        <Row>
            <div class='filterBox' style="margin: 10px 0">
                <div class="filterTit">选项</div>
                <Select v-model="customerManager" filterable multiple clearable style="width:inherit;float: left;margin-right: 10px;" placeholder="客户负责人">
                    <Option v-for="list in customerManagerLists" :key="list.id" :value="list.id">{{list.userName}}</Option>
                </Select>
                <Select v-model="AttrVal" multiple clearable style="width:inherit;float: left;margin-right: 10px;" placeholder="客户级别">
                    <Option v-for="list in AttrValLists" :key="list" :value="list">{{list}}</Option>
                </Select>
                <finalcontact ref='finafinaTime' :show="finaShow" :msgs="finaMsg" :tit="finaMsg" @gettime="finaTime"></finalcontact>
                <Select v-model="CallStatus" clearable style="width:inherit;float: left;margin-right: 10px;" placeholder="拨打状态">
                    <Option value="1">已拨打</Option>
                    <Option value="0">未拨打</Option>
                </Select>
                <Select v-model="ComResults" multiple clearable style="width:inherit;float: left;margin-right: 10px;" placeholder="沟通结果">
                    <Option value="0">待沟通</Option>
                    <Option value="1">有意向</Option>
                    <Option value="2">已购买</Option>
                    <Option value="3">拒绝</Option>
                </Select>
                <finalcontact ref='finacallTime' :show="callShow" :msgs="callMsg" :tit="callMsg" @gettime="callTime"></finalcontact>
                <Button type="ghost" @click='reset()'>重置</Button>
            </div>
        </Row>
    </div>
</template>
<script>
    import groupSel from './groupSel.vue';
    import addCustTags from './../addCustomerTags/listTag.vue';
    export default {
        props: {
            Gid: { // 群组id
                default: ''
            },
        },
        data() {
            return {
                finaMsg:'分配时间',
                finaShow:false,//默认时间选择框隐藏，点击显示
                callShow:false,
                callMsg:'拨打时间',

                groupId:this.Gid,
                stagefilterTit: '销售阶段',
                stageListObj: [],//全部销售阶段
                stageAllChek: [],
                stageAllChekSelectAll: false,
                stageTotalChek: false,
                stageIds:[],//销售阶段参数

                sourcefilterTit: '客户来源',
                sourceListObj: [],//客户来源
                sourceAllChek: [],
                sourceAllChekSelectAll: false,
                sourceTotalChek: false,
                sources:[],//客户来源参数

                customerManager: [],//客户负责人
                customerManagerLists:[],//客户负责人列表

                AttrVal: [],//客户级别
                AttrValLists:[],//客户级别列表

                CallStatus:[],//拨打状态

                ComResults:[],//沟通结果

                CustTagisShow:false,//客户标签默认隐藏

                DefineTagLists:[],//点击添加获取的自定义标签列表
                HkTagLists:[],//点击添加获取的自定义标签列表
                TagLists:[],//点击添加获取的无自定义标签，无华坤标签

                assignStartTime:'',//分配开始时间
                assignEndTime:'',//分配结束时间
                lastCallStartTime:'',//最后联系开始时间
                lastCallEndTime:'',//最后联系结束时间

                fastSearch:'',//快速搜索

                allTags:false,//默认全部标签不选中
                haveNoCustomTag:'',//	无客户标签	number	任意int值
                haveNoHkdwTag:'',//	无华坤标签	number	任意int值
                timoutSearch: null,
                fastResetTimeout: null,
                isReset: false,
                haveNoCTag:0,
                haveNoHkTag:0,
            }
        },
        components: {
            groupSel,
            CustTags:addCustTags
        },
        created() {
            this.allStage(); //获取全部销售阶段
            this.allSource();//获取全部来源
            this.selectExecutorUser();//获取全部客户负责人
            this.getAttrVal();//获取客户级别
            this.search();
        },
        watch: {
            groupId(val){//群组id
                this.timeoutSearch();
                if (val) {
                    this.resetfastSearch();
                }
            },
            stageIds(val){//销售阶段
                this.timeoutSearch();
                if (val) {
                    this.resetfastSearch();
                }
            },
            sources(val){//客户来源
                this.timeoutSearch();
                if (val) {
                    this.resetfastSearch();
                }
            },
            DefineTagLists(val) {//自定义标签
                this.timeoutSearch();
                if (val) {
                    this.resetfastSearch();
                }
            },
            HkTagLists(val) {//华坤标签
                this.timeoutSearch();
                if (val) {
                    this.resetfastSearch();
                }
            },
            TagLists(val) {
                this.timeoutSearch();
                if (val) {
                    this.resetfastSearch();
                }
            },
            customerManager(val) {//客户负责人
                this.timeoutSearch();
                if (val) {
                    this.resetfastSearch();
                }
            },
            AttrVal(val) {//客户级别
                this.timeoutSearch();
                if (val) {
                    this.resetfastSearch();
                }
            },
            CallStatus(val) {//拨打状态
                this.timeoutSearch();
                if (val) {
                    this.resetfastSearch();
                }
            },
            ComResults(val) {//沟通结果
                this.timeoutSearch();
                if (val) {
                    this.resetfastSearch();
                }
            },
            assignStartTime(val) {//分配开始时间
                this.timeoutSearch();
                if (val) {
                    this.resetfastSearch();
                }
            },
            assignEndTime(val) {//分配结束时间
                this.timeoutSearch();
                if (val) {
                    this.resetfastSearch();
                }
            },
            lastCallStartTime(val) {//最后联系开始时间
                this.timeoutSearch();
                if (val) {
                    this.resetfastSearch();
                }
            },
            lastCallEndTime(val) {//最后联系结束时间
                this.timeoutSearch();
                if (val) {
                    this.resetfastSearch();
                }
            },
            fastSearch(val) {//快速搜索
                this.isReset = true;
                if(val){
                    this.resetterm();
                }
                this.timeoutSearch();
            }

        },
        methods: {
            //点击标签的全部
            allTagsCheck(checked){
                if(checked){
                    this.DefineTagLists = [];
                    this.HkTagLists = [];
                }
            },
            //添加客户标签弹窗
            AddustTagsPop(){
                // this.$refs.custTags.panelShow = true;
                this.CustTagisShow = true;
                if(this.TagLists.indexOf('无华坤道威标签')>-1){
                    this.haveNoHkTag = 1
                }else{
                    this.haveNoHkTag = 0
                }
                if(this.TagLists.indexOf('无自定义标签')>-1){
                    this.haveNoCTag = 1
                }else{
                    this.haveNoCTag = 0
                }
                console.log(this.haveNoHkTag);
                console.log(this.haveNoCTag);

            },
            //获取全部销售阶段
            allStage() {
                let that = this;
                this.$post("/user-apis/common/stageSelect.action").then(res => {
                    if (res.code === 200) {
                        that.stageListObj = res.data.stageList;
                        res.data.stageList.forEach(function (item, i) {
                            // that.stageListObj.push(item.name);
                            that.stageAllChek.push(false);
                        });
                    }
                });
            },
            //获取全部来源
            allSource() {
                let that = this;
                this.$post("/user-apis/common/getCustSource.action").then(res => {
                    if (res.code == 200) {
                        that.sourceListObj = res.data.list;
                        res.data.list.forEach(function (item, i) {
                            //that.sourceListObj.push(item.custFrom);
                            that.sourceAllChek.push(false);
                        });
                    }
                })
            },
            //获取全部客户负责人
            selectExecutorUser() {
                let that = this;
                this.$post("/user-apis/public/selectExecutorUser.action").then(res => {
                    if (res.code == 200) {
                        that.customerManagerLists = res.data.data;
                    }
                })
            },
            //获取客户级别
            getAttrVal() {
                let that = this;
                let data = {
                    cd:'member_level'
                };
                this.$post("/user-apis/pc/custGroup/getAttrVal.action",data).then(res => {
                    if (res.code == 200) {
                        that.AttrValLists = res.data.attrVal;
                    }
                })
            },
            //清空快速搜索
            resetfastSearch(){
                this.$emit('reset');
                if (this.fastResetTimeout) {
                    clearTimeout(this.fastResetTimeout);
                }
                let that = this;
                this.fastResetTimeout = setTimeout(function () {
                    if (that.isReset) {
                        that.isReset = false;
                    } else {
                        that.fastSearch = '';         //快速搜索
                    }
                }, 500);

            },
            //清空搜索条件

            resetterm(){
                this.stageIds = '';           //销售阶段id array<number>
                this.$refs.stageSel.reset();
                this.sources = '';            //客户来源	array<string>
                this.$refs.sourceSel.reset();
                this.DefineTagLists = [];     //客户标签
                this.HkTagLists = [];         //华坤标签
                this.TagLists = [];           //无华坤标签，无自定义标签
                this.customerManager =  [];   //客户负责人
                this.AttrVal =  [];           //客户级别
                this.$refs.finafinaTime.clearAll();
                this.assignEndTime = '';      //分配时间（结束）
                this.assignStartTime = '';	  //分配时间（开始）
                this.CallStatus = [];         //拨打状态
                this.ComResults = [];         //沟通结果
                this.lastCallEndTime = '';    //最后联系时间（结束）
                this.lastCallStartTime = '';  //最后联系时间（开始）
                this.$refs.finacallTime.clearAll();
                this.$emit('reset');
            },
            //重置
            reset(){
                this.resetfastSearch();
                this.resetterm();
            },
            //点击确定添加标签
            submitTag(params) {
                this.TagLists = [];
                this.TagLists = [];
                if(this.$refs.tagAllRef.isChecked){
                    this.$refs.tagAllRef.check();
                }else{
                    this.$refs.tagAllRef.check();
                    this.$refs.tagAllRef.check();
                }
                this.DefineTagLists = params.selectDefineTags;
                this.HkTagLists  = params.selectHkTags;
                //this.TagLists = this.DefineTagLists.concat(this.HkTagLists);
                this.CustTagisShow = false;
                this.haveNoCustomTag = params.haveNoCustomTag;//无客户标签	number	任意int值
                this.haveNoHkdwTag = params.haveNoHkdwTag;//	无华坤标签	number	任意int值
                if(this.haveNoHkdwTag == 1){
                    this.TagLists.push('无华坤道威标签');
                    this.haveNoHkTag = 1
                }else{
                    this.haveNoHkTag = 0
                }
                if(this.haveNoCustomTag == 1){
                    this.TagLists.push('无自定义标签');
                    this.haveNoCTag = 1
                }else{
                    this.haveNoCTag = 0
                }
            },
            //
            cancel() {
                this.CustTagisShow = false;
            },
            //点击销售阶段
            getstageIds(params) {
                this.stageIds = params;
            },
            //点击客户来源
            getsources(params) {
                this.sources = params;
            },
            //点击关闭华坤标签
            handleCloseHkTag(event, name) {
                console.log(name);
                let index = this.HkTagLists.indexOf(name);
                this.HkTagLists.splice(index, 1);
            },
            //点击关闭无自定义标签
            handleCloseDefineTag(event, name) {
                let index = this.DefineTagLists.indexOf(name);
                this.DefineTagLists.splice(index, 1);
            },
            //点击关闭无定义标签
            handleCloseTag(event, name) {
                this.CustTagisShow = false;
                let _index = this.TagLists.indexOf(name);
                this.TagLists.splice(_index, 1);
            },
            //获取分配时间
            finaTime(data){
                this.assignStartTime = data.start;
                this.assignEndTime = data.end;
            },
            //获取拨打时间
            callTime(data){
                this.lastCallStartTime = data.start;
                this.lastCallEndTime = data.end;
            },
            search() {
                // 搜索条件
                let searchParams = {
                    groupId:this.groupId,//	群组id	number
                    stageIds:this.stageIds,//	销售阶段id	array<number>
                    sources:this.sources,//	客户来源	array<string>
                    haveNoCustomTag:this.haveNoCustomTag,//	无客户标签	number	任意int值
                    customTags:this.DefineTagLists.toString(),//	客户标签
                    haveNoHkdwTag:this.haveNoHkdwTag,//	无华坤标签	number	任意int值
                    hkdwTags:this.HkTagLists.toString(),//	华坤标签
                    userIds:this.customerManager.toString(),//客户负责人
                    memberLevels:this.AttrVal.toString(),//	客户等级
                    callStatuses:this.CallStatus.toString(),//	拨打状态
                    callResultResponses:this.ComResults.toString(),//	沟通结果
                    assignEndTime:this.assignEndTime,//分配时间（结束）
                    assignStartTime:this.assignStartTime,//	分配时间（开始）
                    lastCallEndTime:this.lastCallEndTime,//	最后联系时间（结束）
                    lastCallStartTime:this.lastCallStartTime,//	最后联系时间（开始）
                    fastSearch:this.fastSearch,//	快速搜索	string

                    orderBy:'create_time',//name  source  stage_id create_time
                    orderByASC:'DESC'//ASC:顺序   DESC 倒叙
                };//全部的搜索条件
                this.$emit('search', searchParams);
            },
            //延迟搜索
            timeoutSearch() {
                let that = this;
                if (this.timoutSearch) {
                    clearTimeout(this.timoutSearch);
                }
                this.timoutSearch = setTimeout(function () {
                    that.search();
                }, 1000);
            }
        }

    }
</script>
<style>
    .GgroupSearchBox {
        width: 100%;border-bottom: 1px solid #797979
    }
    .GgroupSearchBox .searchBox {
        position: relative;
        width: 560px;
    }
    .GgroupSearchBox .searchBox input {
        height: 30px;
        border-radius: 4px;
        border: 1px solid #d7dde4;
    }
    .GgroupSearchBox .searchBox .icon {
        position: absolute;
        right: 10px;
        top: 2px;
    }
    .GgroupSearchBox .filterBox {
        line-height: 30px;
    }
    .GgroupSearchBox .filterBox .filterTit {
        width: 70px;
        float: left;
        font-weight: bold;
        color: #3c3c3c;
    }
    .GgroupSearchBox .filterBox span.addplus {
        font-size: 22px;
        line-height: 18px;
        display: block;
        width: 15px;
        float: left;
        margin-right: 5px;
    }
    .GgroupSearchBox .ivu-btn-ghost{padding:4px 15px}
    /*.GgroupSearchBox .ivu-select-selection{height: 32px;overflow: hidden}*/
    .GgroupSearchBox .ivu-tag-blue, .ivu-tag-blue.ivu-tag-dot .ivu-tag-dot-inner {
        background: #7e8fe1;
        border:1px solid #7e8fe1;;
    }
    .ivu-tag:not(.ivu-tag-border):not(.ivu-tag-dot):not(.ivu-tag-checked) {
        background:transparent;
        border:1px solid #dddee1;
        color: #797979;
    }
</style>

