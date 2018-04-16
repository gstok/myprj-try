<style lang="less" scoped>
.listTag {
  width: 50%;
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 99;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.4);
  background: #fff;
  ul > li {
    list-style: none;
  }
  .content {
    padding: 20px;
    height: 80%;
    overflow-y: auto;
    .tit {
      font-size: 14px;
      font-weight: bold;
      color: #333333;
      position: relative;
      padding-left: 10px;
    }
    .tit::before {
      content: "";
      width: 2px;
      height: 14px;
      position: absolute;
      top: 3px;
      left: 0;
      background: #586ac0;
    }
    .tags {
      padding: 10px 0;
      li {
        margin-left: 15px;
        display: inline-block;
        margin-bottom: 10px;

        span {
          padding: 3px 8px;
          display: inline-block;
          border: 1px solid #dcdcdc;
          border-radius: 5px;
          font-size: 12px;
          cursor: pointer;
        }
        .active {
          background: #7e8fe1;
          color: #fff;
        }
        .unactive {
          background: #fff;
          color: #495060;
        }
      }
    }
    .tagItem {
      margin-top: 30px;
      .checkGroup {
        padding-left: 13px;
      }
      .ivu-checkbox-group {
        margin-top: 10px;
      }
    }
  }
  .btnDiv {
    width: 50%;
    height: 20%;
    position: fixed;
    right: 0;
    bottom: 0;
    text-align: center;
    background: #fff;
    border-top: 1px solid #e1e6e9;
    .tagBtn {
      margin: 50px 0;
      Button {
        padding: 8px 18px;
        border-color: #cdd6db;
      }
      .sure {
        padding: 8px 25px;
        background: #7e8fe1;
        color: #fff;
      }
    }
  }
}
</style>

<template>
  <div class="listTag" v-show="panelShow">
    <div class="content">
      <ul>
        <li class="tagItem">
          <div class="tit">自定义标签</div>
          <ul class="tags">
            <li v-for="(item,$index) in custTagList">
              <span @click="selectdefineStyle (item, $index)" :class="{'active':item.active,'unactive':!item.active}">{{item.name}}</span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="btnDiv">
      <div class="tagBtn">
        <Button @click="resetTags">清空</Button>
        <Button @click="cancelTags">取消</Button>
        <Button class="sure" @click="submitTags">
          <i class="icon icon-querenshoudao"></i>&nbsp;&nbsp;确定</Button>
      </div>
    </div>

  </div>
</template>
<script>
import Vue from "vue";
export default {
  name: "listTag",
  active: false,
  props: {
    show: {
        type: Boolean,
        default: false
    },
    define: {
      type: Array,
      default: []
    }
  },
  watch:{
    define(val){
      this.initDefineTags = val;
    },
    show(val) {
        this.panelShow = val;
        if (val) {
            this.getdefineTagList();
        }
    }
  },
  data() {
    return {
      panelShow: this.show,
      custTagList: [],//获取自定义标签数据
      initDefineTags: [], // 初始选择的标签
      selectDefineTags: [],//选中的自定义标签(数组)
      selectDefineActiveTags: []//选中的自定义标签(对象)
    }
  },
  created() {
    
  },
  methods: {
    // 获取自定义标签
    getdefineTagList() {
      this.$post("/user-apis/pc/custGroup/getAttrVal.action", { cd: 'custom_tag' }).then(res => {
        if (res.code === 200) {
          this.custTagList = [];
          this.selectDefineTags = [];
          this.selectDefineActiveTags = [];
          res.data.attrVal.forEach(element => {
            this.custTagList.push({ name: element, active: false });
          });
          let set = new Set();
          this.initDefineTags.forEach(val => set.add(val));
          let select = [];
          this.custTagList.forEach((item) => {
              if (set.has(item.name)) {
                  select.push(item);
              }
          });
          select.forEach(item => {
              this.selectdefineStyle(item);
          })
        }
      });
    },
    // 确定事件
    submitTags() {

      let params = {
        custTagList: this.custTagList,
        selectDefineTags: this.selectDefineTags
      };
      this.$emit('submit', params);
    },
    // 清空选中标签
    resetTags() {
      this.selectDefineActiveTags.forEach(function (item, i) {
        item.active = false;
      });
      this.selectDefineTags.splice(0, this.selectDefineTags.length);
    },
    // 取消选中标签
    cancelTags() {
      // 隐藏此组件
      this.panelShow = false;
      this.$emit('on-cancel');
    },
    // 点击自定义标签样式
    selectdefineStyle(item, index) {
      this.definTag = false;
      this.$nextTick(() => {
        if (item.active) {
          Vue.set(item, 'active', false);
          var $I = this.getindexOf(this.selectDefineTags, item.name);
          this.selectDefineTags.splice($I, 1);

        } else {
          Vue.set(item, 'active', true);
          this.selectDefineTags.push(item.name);
          this.selectDefineActiveTags.push(item);
        }
      });
    },
    // 获取当前值的索引值
    getindexOf(arr, item) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] === item) {
          return i;
        }
      }
    },
    
  }
}
</script>

