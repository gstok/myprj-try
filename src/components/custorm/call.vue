<template>

  <Modal v-model="modal1" title="拨打电话记录" :mask-closable="false" @on-ok="ok" @on-cancel="cancel" :transfer=false>
    <div class="shouqi" @click="layershow">收<br>起</div>
    <div class="call">
      <p class="calltime">拨打时间：
        <span>{{ Received.callTime }} </span>
      </p>
      <div>
        <ul>
          <li> 沟通结果：</li>
          <li v-for="(fl,index) in finl.result">
            <Button type="ghost" @click="getId(index)" :class="{'active':index===isActive}">{{fl}}</Button>
          </li>
        </ul>
      </div>
      <!-- 备注 -->
      <div class="beizhu">
        <Form :model="formItem" :label-width="80">
          <FormItem label="备     注：">
            <Input v-model="formItem.textarea" type="textarea" :autosize="{minRows: 5,maxRows: 5}" placeholder="请输入..."></Input>
          </FormItem>
        </Form>
      </div>
    </div>
  </Modal>
</template>
<script>
export default {
  props: {
    forlay: {
      type: Boolean,
      default: true
    },
    Received: {
      default: {}
    }
  },
  watch: {
    Received(val) {
      this.finl = val;
      console.log(this.finl);
    },
    forlay(val) {
      this.modal1 = val;
    }
  },
  data() {
    return {
      time: '',
      isActive: '',
      corid: '',
      finl: this.Received,
      modal1: this.forlay,
      formItem: {
        textarea: '',
      }
    };
  },
  methods: {
    // 控制弹窗的隐藏显示
    layershow() {
      this.modal1 = false;
      this.$emit("shbtn")
    },
    getId(id) {
      this.isActive = id;
      this.corid = id
    },
    ok() {
      let obj = {
        uuid: this.finl.uuid,
        remark: this.formItem.textarea,
        resultResponse: this.corid
      }
      this.$post('/user-apis/pc/eventCall/saveStatus.action', obj).then(
        res => {
          if (res.code == 200) {
            this.$Message.success('操作成功！');
            this.isActive = '';
            this.formItem.textarea = '';
          }
        }
      );
      this.$emit('phone-ok');
    },
    cancel() {
      this.isActive = '';
      this.formItem.textarea = '';
      this.$emit('phone-cancel');
    }
  }
};
</script>
<style lang="less" scoped>
div.shouqi {
  position: absolute;
  right: -22px;
  top: 3px;
  padding: 20px 5px;
  cursor: pointer;
  color: #666;
  background: #dadade;
  text-align: center;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  font-family: MicrosoftYaHei;
}
.active {
  background-color: #a3b1ef;
  color: #fff;
  border-color: #a3b1ef;
}
ul li:first-child {
  padding: 12px 0;
}
.beizhu {
  width: 100%;
  clear: both;
  margin-left: -10px;
  padding-top: 13px;
}
span {
  margin-left: 10px;
}
ul li {
  float: left;
  padding: 5px 10px;
}
.call {
  width: 100%;
  // height: 150px;
  .calltime {
    padding: 10px 0;
  }
}
</style>

