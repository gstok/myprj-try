<template>
  <div class="topinfor">
      已选择 <span> {{ num }} </span>个用户
      <Button type="info" size="small" @click="HideMenu">取消</Button>
  </div>
</template>
<script>
export default {
  name:"topinfor",
  props:{
    people:{
      type:Number,
      default:0
    }
  },
  watch:{
    people(val){
      this.num = val;
    }
  },
  data(){
    return {
      num:this.people,
      menuShow:false,
    }
  },
  methods:{
    HideMenu(){
      this.num=0;
      console.log(1)
      this.$emit('muhide',this.menuShow,false)
    }
  }
}
</script>
<style lang="less" scoped>
  .topinfor {
    border: 1px solid #5cadff;
    border-radius: 5px 5px 0 0;
    text-align: center;
    line-height: 35px;
    span {
      color: #00cc66;
      font-weight: 800;
      padding: 0 2px;
    }
    button.ivu-btn.ivu-btn-info.ivu-btn-small {
      margin-top: 6px;
      margin-right: 4px;
    }
  }
</style>


