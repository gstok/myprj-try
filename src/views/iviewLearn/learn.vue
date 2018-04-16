
<style lang="less" scoped>

</style>

<template>
    <Layout>
        <Row style="margin-top: 20px;">
            <Tabs type="card" value="name1">
                <TabPane label="步骤条学习">
                    <Row>
                        <Steps :current="curStep" status="error">
                            <Step title="第一步" content="第一步的操作介绍"></Step>
                            <Step title="第二步" content="第二步的操作介绍"></Step>
                            <Step title="第三步" content="第三步的操作介绍"></Step>
                            <Step title="第四步" content="第四步的操作介绍"></Step>
                        </Steps>
                    </Row>
                    <Row>
                        <Button type="info" @click="nextStep">下一步</Button>
                    </Row>
                </TabPane>
                <TabPane label="下拉框尝试" name="name7">
                    <Dropdown>
                        <a href="javascript:void(0)">
                            下拉菜单
                            <Icon type="arrow-down-b"></Icon>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem>驴打滚</DropdownItem>
                            <DropdownItem>炸酱面</DropdownItem>
                            <DropdownItem disabled>豆汁儿</DropdownItem>
                            <DropdownItem>冰糖葫芦</DropdownItem>
                            <DropdownItem divided>北京烤鸭</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <Dropdown trigger="click" placement="bottom-start" style="margin-left: 20px">
                        <Button type="primary">
                            下拉菜单
                            <Icon type="arrow-down-b"></Icon>
                        </Button>
                        <DropdownMenu slot="list">
                            <DropdownItem>驴打滚</DropdownItem>
                            <DropdownItem>炸酱面</DropdownItem>
                            <DropdownItem disabled>豆汁儿</DropdownItem>
                            <DropdownItem>冰糖葫芦</DropdownItem>
                            <DropdownItem divided>北京烤鸭</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>


                    <Dropdown>
                        <!-- <span>
                            全国各省
                            <Icon type="arrow-down-b"></Icon>
                        </span> -->
                        <a href="javascript:void(0)">
                            全国各省
                            <Icon type="arrow-down-b"></Icon>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem>浙江</DropdownItem>
                            <DropdownItem>江苏</DropdownItem>
                            <DropdownItem>安徽</DropdownItem>
                            <Dropdown placement="right-start">
                                <DropdownItem>
                                    山东
                                    <Icon type="ios-arrow-right"></Icon>
                                </DropdownItem>
                                <DropdownMenu slot="list">
                                    <DropdownItem>济南</DropdownItem>
                                    <DropdownItem>青岛</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            <DropdownItem>福建</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </TabPane>


                <TabPane label="穿梭框学习" name="name1">
                    <Row style="margin-top: 20px;">
                        <Transfer
                            filterable
                            :filter-method="filterMethod"
                            :data="totalList"
                            :target-keys="dstKeyList"
                            :render-format="renderFunc"
                            :operations="['向左','向右']"
                            :list-style="listStyle"
                            @on-change="handleChange">
                        </Transfer>
                    </Row>
                </TabPane>
                <TabPane label="各种按钮" name="name2">
                    <Row>
                        <Button>默认的按钮</Button>
                        <Button disabled type="primary">主要按钮样式</Button>
                        <Button type="ghost">Ghost</Button>
                        <Button type="dashed">Dashed</Button>
                        <Button type="text">Text</Button>
                        <Button size="large" long shape="circle" type="warning">警告</Button>
                        <Button size="large" type="success" loading>成功</Button>

                        <ButtonGroup vertical>
                            <Button type="success">
                                <Icon type="chevron-left"></Icon>
                                成功
                            </Button>
                            <Button type="warning">警告</Button>
                            <Button type="error">失败</Button>
                        </ButtonGroup>
                    </Row>
                </TabPane>
                <TabPane label="Select学习" name="name3">
                    <Row>
                        <Col span="4">
                            <Select filterable multiple clearable v-model="model1">
                                <OptionGroup label="城市">
                                    <Option v-for="(item, index) in cityList" :disabled="index % 2 == 1" :value="item.value" :key="item.value"></Option>
                                </OptionGroup>
                                <OptionGroup label="序号">
                                    <Option value="inUSA" label="在美国">
                                        <!-- <span>London</span>
                                        <span style="float:right;color:#ccc">U.S.A</span> -->
                                    </Option>
                                    <Option value="inChina" label="在中国">2</Option>
                                </OptionGroup>
                            </Select>
                        </Col>
                    </Row>
                </TabPane>
                <TabPane label="行内表单" name="name4">
                    <Row>
                        <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
                            <FormItem prop="user">
                                <Input type="text" v-model="formInline.user" placeholder="Username">
                                    <Icon type="ios-person-outline" slot="prepend"></Icon>
                                </Input>
                            </FormItem>
                            <FormItem prop="password">
                                <Input type="password" v-model="formInline.password" placeholder="Password">
                                    <Icon type="ios-locked-outline" slot="prepend"></Icon>
                                </Input>
                            </FormItem>
                            <FormItem>
                                <Button type="primary" @click="handleSubmit('formInline')">Signin</Button>
                            </FormItem>
                        </Form>
                    </Row>
                </TabPane>
                <TabPane label="其他小零件" name="name5">
                    <Row>
                        <InputNumber :min="0" :max="5" :step="0.1"></InputNumber>
                    </Row>
                </TabPane>
            </Tabs>
        </Row>
    </Layout>
</template>

<script>
    export default {
        name: 'learn',
        data () {
            return {
                cityList: [
                    {
                        value: 'New York',
                        label: 'New York'
                    },
                    {
                        value: 'London',
                        label: 'London'
                    },
                    {
                        value: 'Sydney',
                        label: 'Sydney'
                    },
                    {
                        value: 'Ottawa',
                        label: 'Ottawa'
                    },
                    {
                        value: 'Paris',
                        label: 'Paris'
                    },
                    {
                        value: 'Canberra',
                        label: 'Canberra'
                    }
                ],
                model1: ['London'],

                formInline: {
                    user: '',
                    password: ''
                },
                ruleInline: {
                    user: [
                        {
                            required: true,
                            message: '请填写用户名',
                            trigger: 'blur'
                        }
                    ],
                    password: [
                        {
                            required: true,
                            message: '请填写密码',
                            trigger: 'blur'
                        },
                        {
                            type: 'string', 
                            min: 6,
                            message: 'The password length cannot be less than 6 bits', 
                            trigger: 'blur' 
                        }
                    ]
                },

                totalList: [],
                dstKeyList: [],

                listStyle: {
                    width: '400px',
                    height: '300px'
                },

                curStep: 0
            }
        },
        methods: {
            handleSubmit(name) {
                this.$refs[name].validateField('user', (valia) => {
                    console.log("用户名校验失败");
                });
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Message.success('成功!');
                    }
                    else {
                        this.$Message.error('失败');
                    }
                })
            },

            renderFunc (item) {
                return item.label + " - " + item.description;
            },
            handleChange (newTargetKeys, direction, moveKeys) {
                console.log(newTargetKeys);
                console.log(direction);
                console.log(moveKeys);
                this.dstKeyList = newTargetKeys;
            },

            //搜索函数，返回布尔值，一一对比进行判断
            filterMethod (data, query) {
                return data.label.indexOf(query) > -1;
            },

            nextStep () {
                this.curStep++;
                if (this.curStep > 3) {
                    this.curStep = 0;
                }
            }
        },

        mounted () {
            this.totalList = Array(20).fill(0).map((item, index) => {
                return {
                    key: index.toString(),
                    label: 'Content ' + index,
                    description: 'The desc of content  ' + index,
                    disabled: false
                };
            });
            this.dstKeyList = ["0", "1", "2"];
        }
    };
</script>
