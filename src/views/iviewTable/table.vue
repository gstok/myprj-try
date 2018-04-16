
<style lang="less" scoped>

</style>

<template>
    <div>
        <Table
            border
            stripe
            height="300"
            :columns="columns"
            :data="dataList">
        </Table>
    </div>
</template>

<script>
    export default {
        name: 'tableLearn',
        data () {
            return {
                columns: [
                    {
                        title: "姓名",
                        key: "name",
                    },
                    {
                        title: "性别",
                        key: "sex",
                        render: (h, params) => {
                            let hFunc;
                            let sex = params.row.sex;
                            if (sex == "男") {
                                hFunc = h("Button", {
                                    props: {
                                        type: "primary"
                                    }
                                }, '男生哦');
                            }
                            else if (sex == "女") {
                                hFunc = h("Button", {
                                    props: {
                                        type: "error"
                                    }
                                }, '女生哦');
                            }
                            else {
                                hFunc = h("Button", {
                                    props: {
                                        type: "ghost"
                                    }
                                }, '未知生物');
                            }


                            return hFunc;
                            // return h('div', [
                            //     h('Button', {
                            //         props: {
                            //             type: 'primary',
                            //             size: 'small'
                            //         },
                            //         style: {
                            //             marginRight: '5px'
                            //         },
                            //     }, 'View'),
                            //     h('Button', {
                            //         props: {
                            //             type: 'error',
                            //             size: 'small'
                            //         },
                            //     }, 'Delete')
                            // ]);
                        }
                    },
                    {
                        title: "年龄",
                        key: "age",
                    },
                ],
                dataList: [
                    {
                        name: "顾世豪",
                        sex: "男",
                        age: 25
                    },
                    {
                        name: "习近平",
                        sex: "男",
                        age: 70
                    },
                    {
                        name: "彭丽媛",
                        sex: "女",
                        age: 60
                    },
                    {
                        name: "顾世豪",
                        sex: "男",
                        age: 25
                    },
                    {
                        name: "习近平",
                        sex: "男",
                        age: 70
                    },
                    {
                        name: "彭丽媛",
                        sex: "女",
                        age: 60
                    },
                    {
                        name: "小埋",
                        sex: "未知生物",
                        age: 14
                    },
                ]
            };
        }
    };
</script>
