<template>
    <div>
        <Poptip trigger="hover">
            <img :src="src" alt="" style="cursor: pointer">
            <div slot="content">
                {{stageName}}
            </div>
        </Poptip>
    </div>
</template>

<script>
    import imgChengjiao from '../../assets/img/chegnjiao.png';
    import imgChubu from '../../assets/img/chubuyixiang.png';
    import imgNewcust from '../../assets/img/newcut.png';
    import imgYixiang from '../../assets/img/yixiang.png';
    export default {
        name: "Gstage",
        props: {
            stName: {
                default() {
                    return ''
                }
            }
        },
        data() {
            return {
                stageName:this.stName,
                src:'',
                img: {
                    chengjiao: imgChengjiao,
                    chubu: imgChubu,
                    newCust: imgNewcust,
                    yixiang: imgYixiang
                },
            }
        },
        created() {
            this.getsrc();
        },
        methods:{
            getsrc(){
                switch (this.stageName) {
                    case "新客户":
                        this.src = this.img.newCust;
                        break;
                    case "初次接触":
                        this.src = this.img.chubu;
                        break;
                    case "意向线索":
                        this.src = this.img.yixiang;
                        break;
                    case "成交客户":
                        this.src = this.img.chengjiao;
                        break;
                }
            }
        }
    }
</script>

<style scoped>

</style>