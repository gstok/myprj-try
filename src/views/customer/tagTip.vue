<style type="less" scoped>
    .tag {
        .hkdw-tag {
            overflow: hidden;
        }
    }

</style>
<template>
    <div>
        <Poptip trigger="hover">
            <div class="tag">
                <div class="hkdw-tag">
                    <Tag v-for="(item, idx) in hkdwTaglist" v-if="idx < 2" :key="item" color="yellow" type="border">{{item}}</Tag>
                </div>
                <div class="custom-tag">
                    <Tag v-for="(item, idx) in customTagList" v-if="idx < 2" :key="item" color="green" type="border">{{item}}</Tag>
                </div>
            </div>
            <div slot="content">
                <div class="tag-tip">
                    <div class="hkdw-tag">
                        <Tag v-for="(item, idx) in hkdwTaglist" v-if="idx < 4" :key="item" color="yellow" type="border">{{item}}</Tag>
                    </div>
                    <div class="custom-tag">
                        <Tag v-for="(item, idx) in customTagList" v-if="idx < 4" :key="item" color="green" type="border">{{item}}</Tag>
                    </div>
                </div>
            </div>
        </Poptip>


    </div>
</template>
<script>
    export default {
        name: 'GTagTip',
        props: {
            hkdwTaglist: {
                type: Array,
                default() {
                    return []
                }
            },
            customTagList: {
                type: Array,
                default() {
                    return []
                }
            }
        },
        data() {
            return {
            }
        },
        created() {
        },
        methods: {
        }
    }
</script>