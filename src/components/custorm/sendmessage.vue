<template>
  <div class="call">
    <span>{{modal1}}</span>
        <Modal
            v-model="modal1"
            :mask-closable="false"
            title="发送短信"
            @on-ok="ok"
            @on-cancel="cancel">
                <span>{{ modal1 }}</span>
                <span>{{ curstid }}</span>
                <p class="calltime">拨打时间：<span>{{ time }} </span></p>
                <div>
                  <ul>
                    <li> 沟通结果：</li>
                    <li v-for="fl in finl"><Button type="ghost">{{fl}}</Button></li>
                  </ul>
                </div>
                <!-- 备注 -->
                <div class="beizhu">
                    <Form :model="formItem" :label-width="80">
                        <FormItem label="备     注：">
                            <Input v-model="formItem.textarea" type="textarea" :autosize="{minRows: 5,maxRows: 5}" placeholder="Enter something..."></Input>
                        </FormItem>
                    </Form>
                </div>
        </Modal>
  </div>
</template>
<script>
export default {
  props:{
    isShow:{
      type:Boolean,
      default:false
    },
    custId:{
      type:Number,
      default:0
    }
  },
  watch:{
    isShow(val){
      this.isShow = val;
    }
  },
  data(){
    return{
      time:"2018-5-8 12:42",
      finl:["待沟通","有意向","待沟通","有意向"],
      modal1:this.isShow,
      formItem: {
          textarea: ''
      },
      curstid:this.custId
    }
  },
  methods: {
      ok () {
          this.$Message.info('Clicked ok');
      },
      cancel () {
          this.$Message.info('Clicked cancel');
      }
  }
};
</script>
<style lang="less" scoped>
    ul li:first-child{
      padding: 12px 0;
    }
    .beizhu{
      width: 100%;
      clear: both;
      margin-left: -10px;
      padding-top: 13px;
    }
    span{
      margin-left: 10px;
    };
    ul li{
      float: left;
      padding: 5px 10px;
    };
  .call{
    width: 100%;
    height: 150px;
    .calltime{
      padding: 10px 0;
    };


  }
</style>

