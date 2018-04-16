
<style lang="less" scoped>

</style>

<template>
    <Layout>
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
        <Row>
            <InputNumber :min="0" :max="5" :step="0.1"></InputNumber>
        </Row>
        <Row style="margin-top: 20px">
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
                }
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
