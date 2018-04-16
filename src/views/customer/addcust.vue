<style type="less" scoped>
    .cust-information {
        position: relative;
        font-size: 14px;
        color: #666;
        margin-top: 20px;
        box-shadow: 0 0 18px #e7e7e7;
        background-color: #fff;
        padding: 20px;
        ul {
            width: 900px;
            margin: 0 auto;
            .info-li {
                width: 50%;
                height: 50px;
                float: left;
                overflow: hidden;
                .info-tag-name {
                    float: left;
                }
                .info-tag-text {
                    margin-left: 100px;
                }
            }
        }
        .customerInfoMore-div {
            text-align: center;
            margin-top: 60px;
            span {
                cursor: pointer;
            }
            .customerInfoSave {
                padding: 10px 30px;
                background: #8c9deb;
                border-radius: 4px;
                color: #fff;
                cursor: pointer;
                margin-top: 10px;
            }
        }
        .customerInfoEdit {
            padding: 10px 30px;
            background: #8c9deb;
            border-radius: 4px;
            color: #fff;
            cursor: pointer;
            margin-top: 10px;
            position: absolute;
            right: -20px;
            top: -20px;
        }
    }
</style>
<template>
    <div>
        <h2>
            <a href="javascript:;"><i class="verticalLine"></i>新建客户</a>
        </h2>

        <div id='Gpage-inner' class='clearfix'>
            <div class="cust-information">
                <Form :rules="rules">
                    <ul class="clearfix">
                        <li class="info-li" v-for="item in editCommonAttrList" v-if="!filterEditKey.has(item.attrKey)" :key="item.attrKey">
                            <span v-if='item.attrType === "select" && item.attrKey === "province"' class="info-tag-name">所在地区&nbsp;:</span>
                            <span v-else class="info-tag-name">{{item.attrName}}&nbsp;:</span>
                            <div class="info-tag-text">
                                <Input v-if='item.attrKey == "mobile"' :name="item.attrKey" v-model="item.contentvalue" clearable style="width: 200px" :maxlength="11" @on-keyup="function(event) {event.target.value=event.target.value.replace(/\D/g,'')}" />
                                <Input v-else-if='item.attrKey == "telephone"' :name="item.attrKey" v-model="item.contentvalue" clearable style="width: 200px" :maxlength="12" @on-keyup="function(event) {event.target.value=event.target.value.replace(/\D/g,'')}" />
                                <Input v-else-if='item.attrType == "text" ' :name="item.attrKey" v-model="item.contentvalue" clearable style="width: 200px" />
                                <DatePicker v-else-if='item.attrType == "date"' v-model="item.contentvalue" type="date" :name="item.attrKey" style="width: 200px"></DatePicker>

                                <Cascader v-else-if='item.attrType === "select" && item.attrKey === "province"' :data="provinceList" change-on-select :name="item.attrKey" v-model="custProvince" style="width:200px"></Cascader>
                                <!-- 销售阶段 -->
                                <Select v-else-if='item.attrKey == "stage_id"' :name="item.attrKey" v-model="item.contentvalue" style="width:200px">
                                    <Option v-for="saleVal in stageList" :value="saleVal.id" :key="saleVal.id">
                                        {{saleVal.name}}
                                    </Option>
                                </Select>
                                <!-- 客户负责人 -->
                                <Select v-else-if='item.attrKey == "user_name"' :name="item.attrKey" v-model="item.contentvalue" filterable style="width:200px">
                                    <Option v-for="user in userList" :value="user.id" :key="user.id">{{user.userName}}
                                    </Option>
                                </Select>

                                <Select v-else-if='item.attrType == "select"' :name="item.attrKey" v-model="item.contentvalue" style="width:200px">
                                    <Option v-for="selectVal in item.attrVal? item.attrVal.split(';'):''" :value="selectVal" :key="selectVal">{{selectVal}}
                                    </Option>
                                </Select>

                                <RadioGroup v-else-if='item.attrType == "bool"' v-model="item.contentvalue">
                                    <Radio label="是" true-value="是"></Radio>
                                    <Radio label="否" true-value="否"></Radio>
                                </RadioGroup>

                                <InputNumber v-else-if="item.attrType == 'digit'" style="width:200px;" v-model="item.contentvalue"></InputNumber>

                            </div>
                        </li>
                        <li class="info-li" v-show="uncommonAttrEditListShow" v-for="item in editUncommonAttrList" v-if="!filterEditKey.has(item.attrKey)" :key="item.attrKey">
                            <span v-if='item.attrType === "select" && item.attrKey === "province"' class="info-tag-name">所在地区&nbsp;:</span>
                            <span v-else class="info-tag-name">{{item.attrName}}&nbsp;:</span>
                            <div class="info-tag-text">

                                <Input v-if='item.attrKey == "mobile"' :name="item.attrKey" v-model="item.contentvalue" clearable style="width: 200px" :maxlength="11" @on-keyup="function(event) {event.target.value=event.target.value.replace(/\D/g,'')}" />
                                <Input v-else-if='item.attrKey == "telephone"' :name="item.attrKey" v-model="item.contentvalue" clearable style="width: 200px" :maxlength="12" @on-keyup="function(event) {event.target.value=event.target.value.replace(/\D/g,'')}" />
                                <Input v-else-if='item.attrType == "text" ' :name="item.attrKey" v-model="item.contentvalue" clearable style="width: 200px" />
                                <DatePicker v-else-if='item.attrType == "date"' v-model="item.contentvalue" type="date" :name="item.attrKey" style="width: 200px"></DatePicker>

                                <Cascader v-else-if='item.attrType === "select" && item.attrKey === "province"' :data="provinceList" change-on-select :name="item.attrKey" v-model="custProvince" style="width:200px"></Cascader>
                                <!-- 销售阶段 -->
                                <Select v-else-if='item.attrKey == "stage_id"' :name="item.attrKey" v-model="item.contentvalue" style="width:200px">
                                    <Option v-for="saleVal in stageList" :value="saleVal.id" :key="saleVal.id">
                                        {{saleVal.name}}
                                    </Option>
                                </Select>
                                <!-- 客户负责人 -->
                                <Select v-else-if='item.attrKey == "user_name"' :name="item.attrKey" v-model="item.contentvalue" style="width:200px">
                                    <Option v-for="user in userList" :value="user.id" :key="user.id">{{user.userName}}
                                    </Option>
                                </Select>

                                <Select v-else-if='item.attrType == "select"' :name="item.attrKey" v-model="item.contentvalue" style="width:200px">
                                    <Option v-for="selectVal in item.attrVal? item.attrVal.split(';'):''" :value="selectVal" :key="selectVal">{{selectVal}}
                                    </Option>
                                </Select>

                                <RadioGroup v-else-if='item.attrType == "bool"' v-model="item.contentvalue">
                                    <Radio label="是" true-value="是"></Radio>
                                    <Radio label="否" true-value="否"></Radio>
                                </RadioGroup>

                                <InputNumber v-else-if="item.attrType == 'digit'" style="width:200px;" v-model="item.contentvalue"></InputNumber>

                            </div>
                        </li>
                    </ul>
                    <div class="customerInfoMore-div">
                      <span @click="uncommonAttrEditListShowEvent()" v-model="editCustInfoMore">{{editCustInfoMore}}
                        <i class="icon" :class="{'icon-iconfontjiantou-copy':editCustInfoMore=='收起','icon-iconfontjiantou':editCustInfoMore=='更多'}"></i>
                      </span>
                    </div>
                    <div class="customerInfoMore-div">
                        <Button type="ghost" @click="turnback" size="large" style="margin-right: 20px;padding:6px 25px 7px">返回</Button>
                        <span @click="custInfoUpdate" class="customerInfoSave">保存</span>
                    </div>
                </Form>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "addcust",
        data() {
            return {
                editCommonAttrList: [],
                editUncommonAttrList: [],
                rules: {
                    mobile: [
                        {pattern: '/^1[3|4|5|8][0-9]\\d{4,8}$/', type: 'String', trigger: 'blur'}
                    ]
                },
                updateData: {},
                custProvince: [],
                provinceList: window.provinceList,
                stageList: [],//销售阶段
                userList: [],//客户负责人
                filterEditKey: new Set(),
                editCustInfoMore:"更多",
                uncommonAttrEditListShow:false
            }
        },
        created() {
            this.getUserInfo();
            ["id", "city", "county", "create_time",
                "update_time", "wx_head_img_uri", "source"].forEach(key => this.filterEditKey.add(key));
        },
        methods: {
            getUserInfo() {
                this.$post("/user-apis/pc/cust/selectById.action", {id: this.id}).then(res => {
                    if (res.code === 200) {
                        this.userList = res.data.userlist;
                        this.stageList = res.data.stageList;
                        res.data.commonAttrList.forEach(item => this.custInfoProc(item));
                        res.data.uncommonAttrList.forEach(item => this.custInfoProc(item));
                        this.editCommonAttrList = res.data.commonAttrList;
                        this.editUncommonAttrList = res.data.uncommonAttrList;
                    }
                });
            },
            custInfoProc(item) {
                let val = item.contentvalue;
                if (item.attrType === 'digit') {
                    val = Number(val);
                } else if (item.attrType === 'bool') {
                    if (!val) {
                        val = '';
                    }
                }
                if (item.attrKey === "stage_id") {
                    if(!val){
                        val = '';
                    }else {
                        val = Number(val);
                    }
                } else if (item.attrKey === "user_name") {
                    if(!val){
                        val = '';
                    }else {
                        val = Number(val);
                    }

                }
                item.contentvalue = val;
                if (item.attrKey === 'province') {
                    this.custProvince[0] = item.contentvalue;
                } else if (item.attrKey === 'city') {
                    this.custProvince[1] = item.contentvalue;
                } else if (item.attrKey === 'county') {
                    this.custProvince[2] = item.contentvalue;
                }
            },
            // 处理城市地区选择
            handleProvinceChange() {
                if (this.custProvince[0]) {
                    this.updateData.province = this.custProvince[0];
                }
                if (this.custProvince[1]) {
                    this.updateData.city = this.custProvince[1];
                }
                if (this.custProvince[2]) {
                    this.updateData.county = this.custProvince[2];
                }
            },
            //点击更多
            uncommonAttrEditListShowEvent() {
                if (this.editCustInfoMore == "更多") {
                    this.editCustInfoMore = "收起";
                    this.uncommonAttrEditListShow = true;
                } else {
                    this.editCustInfoMore = "更多";
                    this.uncommonAttrEditListShow = false;
                }
            },
            // 资料保存
            custInfoUpdate() {
                this.updateData['id'] = this.id;
                this.saveDataProccess(this.editCommonAttrList);
                this.saveDataProccess(this.editUncommonAttrList);
                this.handleProvinceChange();
                this.$Spin.show();
                this.$post("/user-apis/pc/cust/insert.action", this.updateData).then(res => {
                    if (res.code === 200) {
                        this.$Message.success('客户新建成功！');
                        this.$router.push({path: '/views/customer/list'});
                    }
                    this.$Spin.hide();
                })
            },
            // 保存数据预处理
            saveDataProccess(list) {
                list.forEach(item => this.updateData[item.attrKey] = item.contentvalue);
            },
            //返回按钮
            turnback(){
                this.$router.push({path: '/views/customer/list'});
            }
        }
    }
</script>

