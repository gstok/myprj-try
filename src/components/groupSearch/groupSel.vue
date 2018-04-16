<template>
    <div class='GfilterBox'>
            <div class="filterTit">{{Tit}}</div>
            <Tag ref="stageAllRef" checkable :checked='false' color="blue" @on-change="handleSelectAll">全部</Tag>
        <template v-for="(list, idx) in ListObj" v-if="list.name">
            <Tag :ref="'stageRef' + idx" checkable :checked='false'
                 color="blue"
                 @on-change="handleChange" :name="idx">{{list.name}}</Tag>
        </template>

            <template v-else v-for="(list, idx) in ListObj" v-if="list.custFrom">
                <Tag :ref="'stageRef' + idx" checkable :checked='false'
                     color="blue"
                     @on-change="handleChange" :name="idx">{{list.custFrom}}</Tag>
            </template>
    </div>
</template>
<script>
export default {
   props: {
        GfilterTit:{
            default: ''
        },
        ListObj: {
            default: []
        },
        AllChek:{
            default: []
        },
        AllChekSelectAll:{
            default:false
        },
        TotalChek:{
            default:false
        }
   },
   data() {
        return {
            Tit:this.GfilterTit,
            AllChekAll:this.AllChekSelectAll,
            TChek:this.TotalChek,
            result:[]
        }
    },
    created() {
    },
   methods: {
            handleChange(checked, name) {
                let that = this;
                this.result = [];
                if (this.TChek) {
                    return;
                }
                this.TChek = true;

                this.AllChek[name] = checked;
                let selectAll = true;
                for (let i = 0; i < this.AllChek.length; i++) {
                    if (!this.AllChek[i]) {
                        selectAll = false;
                        break;
                    }
                }

                if (this.AllChekAll && !selectAll) {
                    this.$refs.stageAllRef.check();
                    this.AllChekAll = false;
                }
                if (!this.AllChekAll && selectAll) {
                    this.$refs.stageAllRef.check();
                    this.AllChekAll = true;
                }
                for (let i = 0; i < this.AllChek.length; i++) {
                    if(this.AllChek[i]){
                        for (let h = 0; h < that.ListObj.length; h++) {
                            if(h == i){
                                if(that.ListObj[h].name){
                                    that.result.push(that.ListObj[h].id);
                                }else{
                                    that.result.push(that.ListObj[h].custFrom);
                                }

                            }
                        }
                    }
                }
                this.TChek = false;
                this.$emit('on-click', this.result.toString());
            },
            reset() {
                if (this.AllChekAll) {
                    this.$refs.stageAllRef.check();
                } else {
                    this.$refs.stageAllRef.check();
                    this.$refs.stageAllRef.check();
                }
            },
            handleSelectAll(checked) {
                this.result = [];
                let that = this;
                if (this.TChek) {
                    return;
                }
                this.TChek = true;
                this.AllChekAll = checked;
                if (checked) {
                    for (let i = 0; i < this.AllChek.length; i++) {
                        if (!this.AllChek[i]) {
                            let n = "stageRef" + i;
                            this.$refs[n][0].check();
                            this.AllChek[i] = true;
                        }

                    }
                    that.ListObj.forEach(function (item, i) {
                        if(item.name){
                            that.result.push(item.id);
                        }else{
                            that.result.push(item.custFrom);
                        }
                    });
                } else {
                    for (let i = 0; i < this.AllChek.length; i++) {
                        if (this.AllChek[i]) {
                            let n = "stageRef" + i;
                            this.$refs[n][0].check();
                            this.AllChek[i] = false;
                        }
                    }
                    for (let i = 0; i < this.AllChek.length; i++) {
                        if(this.AllChek[i]){
                            for (let h = 0; h < that.ListObj.length; h++) {
                                if(h == i){
                                    if(that.ListObj[h].name){
                                        that.result.push(that.ListObj[h].id);
                                    }else{
                                        that.result.push(that.ListObj[h].custFrom);
                                    }
                                }
                            }
                        }
                    }
                }
                this.TChek = false;
                this.$emit('on-change', this.result.toString());
            }
   }
}
</script>

<style>
.GfilterBox{line-height: 30px;}
.GfilterBox .filterTit{width:70px;float:left;font-weight: bold;color: #3c3c3c}
.GfilterBox span.addplus{font-size: 22px;line-height:18px;display:block;width: 15px; float:left;margin-right: 5px;}
.GfilterBox .ivu-btn{padding: 3px 8px;}
.GfilterBox .ivu-tag-blue, .ivu-tag-blue.ivu-tag-dot .ivu-tag-dot-inner {
    background: #7e8fe1;
    border:1px solid #7e8fe1;;
}
.ivu-tag:not(.ivu-tag-border):not(.ivu-tag-dot):not(.ivu-tag-checked) {
    background:transparent;
    border:1px solid #dddee1;
    color: #797979;
}
</style>

