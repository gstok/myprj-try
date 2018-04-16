<template>
  <Modal v-model="pushMessage" :mask-closable="false" width="560" @on-ok="sendmesOk" @on-cancel="sendmesCancel">
    <!-- <div class="addfriend"> -->
       <p slot="header" style="color:#666;text-align:left;">
        <span>添加微信好友</span>
      </p>
      <div class="templinfor">
        <!-- 下拉框 -->
        <label>
          招呼语
        </label>
        <Input v-model="mesModule" placeholder="请输入打招呼语" style="width: 300px"></Input>
        <label>
        </label>
        <CheckboxGroup v-model="checkAllGroup">
            <Checkbox label="是"></Checkbox>
            <Checkbox label="否"></Checkbox>
        </CheckboxGroup>
      </div>
    <!-- </div> -->
  </Modal>
</template>
<script>
export default {
  props: {
    adfshow: {
      type: Boolean,
      default: false
    },
    sendinfor: {
      type: Array,
      default:function(){
        return [];
      }
    }
  },
  watch: {
    adfshow(val) {
      this.pushMessage = val;
    },
    sendinfor(val) {
      this.messPeople2 = val;
    }
  },

  data() {
    return {
      indeterminate: false,
      checkAllGroup: ['是', '否'],
      layertitle: '',
      pushMessage: this.adfshow,
      messPeople2: [],
      messageTotal: '',
      HowMany: 0,
      vvshow: false,
      model: '',
      mesModule: [],
      mestype: '',
      commonId: [],
      curstId: [],
      curstId2: []
    };
  },
  methods: {
    sendmesOk(){
      console.log(1);
      this.$emit('onsuOK');
    },
    sendmesCancel() {
      console.log(2)
      this.$emit('onerOR');
    }
  }
};
</script>
<style lang="less" scoped>
.infor span {
    background: #5cadff;
    display: inline-block;
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 4px;
    margin: 10px 5px;
    color: #fff;
}
.btncon {
  height: 40px;
}
button.ivu-btn.ivu-btn-info.ivu-btn-small {
    float: right;
}
i.ivu-icon.ivu-icon-ios-trash {
    cursor: pointer;
}
p.Prompt {
    padding-bottom: 15px;
}
</style>

