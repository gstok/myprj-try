
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
    </Layout>
</template>

<script>
    export default {
        name: 'learn',
        data () {
            return {
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
            }
        }
    };
</script>
