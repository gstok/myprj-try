<template>
    <Cascader :data="provincedatas" :load-data="loadData" change-on-select></Cascader>
</template>
<script>
export default {
    data() {
        return {
            provincedatas: []
        }
    },
    methods: {
        loadData(item, callback) {
            item.loading = true;
            setTimeout(() => {
                
                let params ={
                    fCode: item.value
                };
                        console.log(params);
                this.$post("/user-apis/common/getCity.action",params).then(res => {
                    if (res.code == 200) {
                        let pdata = res.data.city;
                        for (let i = 0; i < pdata.length; i++) {
                            let citys = {
                                value: item.value,
                                label: item.name,
                                children: [
                                    {
                                        value: '',
                                        label: '',
                                        children: [],
                                        loading: false
                                    }
                                ],
                                loading: false
                            }
                            citys.value = pdata[i].code;
                            citys.label = pdata[i].name;
                            item.children.push(citys);
                        }
                    }
                });

                item.loading = false;
                callback();
            }, 1000);
        }
    },
    mounted() {
        //获取省
        var that = this;
        this.$post("/user-apis/common/getProvince.action").then(res => {
            if (res.code == 200) {
                let pdata = res.data.province;
                for (let i = 0; i < pdata.length; i++) {
                    let provinces = {
                        value: '',
                        label: '',
                        children: [],
                        loading: false
                    }
                    provinces.value = pdata[i].code;
                    provinces.label = pdata[i].name;
                    that.provincedatas.push(provinces);
                }
                console.log(that.provincedatas);
            }
        });
    }
}
</script>
