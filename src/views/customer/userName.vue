<template>
    <div @click="viewDetail" style="cursor: pointer">
        <span>{{userName}}</span></br>
        <i v-if="sex == '男'" class="icon icon-nanxing" style = 'color: #7e8fe1'></i>
        <template v-else>
            <i v-if="sex == '女'" class="icon icon-nv" style = 'color: #e58c8c'></i>
            <template v-else>

            </template>
        </template>

        <Poptip trigger="hover">
            <template v-if="wximgUrl" >
                <i class="icon icon-weixin" style = 'color: #82d842'></i>
                <div slot="content">
                    <img :src="wximgUrl" alt="" width="40" height="40" style="float: left"><span style="float: left;margin-left: 10px;line-height: 40px;">{{wxNiceName}}</span>
                </div>
            </template>
            <template v-else>

            </template>
        </Poptip>

    </div>
</template>

<script>
    export default {
        name: 'UserName',
        props: {
            userName: {
                default() {
                    return ''
                }
            },
            sex: {
                default() {
                    return ''
                }
            },
            wximgUrl:{
                default() {
                    return ''
                }
            },
            weixinNiceName:{
                default() {
                    return ''
                }
            },
            userId:{
                default() {
                    return ''
                }
            },
            position: {
                type: Number,
                default: -1
            }
        },
        data() {
            return {
                wxNiceName:this.weixinNiceName,
                id:this.userId
            }
        },
        created() {
        },
        methods: {
            viewDetail(){
                this.$emit('viewDetail', this.id, this.position);
            }
        }
    }
</script>

<style scoped>

</style>