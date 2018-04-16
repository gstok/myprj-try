<template>
  <div class="segment">
    <p class="leftname">选择要分配同事</p>
    <div class="lefttree">
      <Tree :data="data4" show-checkbox multiple @on-check-change="CheckedNodes" empty-text></Tree>
    </div>
    <p class="desname">已选择的同事：
      <span>请从左侧选择后添加</span>
    </p>
    <div class="rightbox">
      <ul>
        <li v-for="(people,index) in rightpeople">
          {{ people.title }}
          <Icon type="android-close" @click.native="deleName(index)"></Icon>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    renpo: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      selpeople: '',
      rightpeople:[],//右侧的人员
      // rightpeople2:[],
      data4: [ ]//存储树结构
    };
  },
  watch: {
    renpo(val) {
      val = this.renpo;
    }
  },
  created(){
    // 树结构数据接口对接
    this.getTreelist();
  },
  methods: {
    getTreelist() {
      this.$post('/user-apis/pc/newCust/getUserTree.action').then(res => {
        if (res.code == 200) {
          let dar = res.data.data;
          this.data4.push(dar)
        }
      });
    },
    deleName(index) {
      // 获取删除的当前的一个人的数据
      let people = this.rightpeople[index];
      //点击哪一个删除哪一个
      this.rightpeople.splice(index, 1);
      // 树选中状态移除
      this.data4.forEach(value => {
        if (!value.isdepart) {
          this.removeTreeChecked(value, people.id);
        } else {
          if (value.children) {
            this.removeTreeChecked(value.children, people.id);
          }
        }
      });
    },
    //接口返回的树结构数据由于不知道有多少层的子数据；进行数据递归；
    removeTreeChecked(list, id) {
      list.forEach(item => {
        // 进行取反，获取它下边的数据
        if (!item.isdepart) {
          // 判断如果这条数据id与被删除的数据的id相同，让节点的选中状态取消掉
          if (id === item.id) {
            item.checked = false;
          }
        } else {
          if (item.children) {
              // 获取它下边的子数据
              this.removeTreeChecked(item.children, id);
          }
        }
      })
    },
    // 选择复选框事件
    CheckedNodes(val) {
      this.rightpeople = [];
      val.forEach((k,v) => {
        if(k.isdepart==false){
          this.rightpeople.push(k)
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.segment {
  border-top: 1px solid #666;
  width: 106%;
  position: relative;
  height: 330px;
  margin-top: 10px;
  margin-left: -15px;
  p.leftname {
    margin-top: 20px;
    margin-left: 6px;
  }
  .lefttree {
    width: 48%;
    border: 1px solid #ddd;
    margin: 10px 5px;
    height: 265px;
    overflow-y: auto;
  }
  .rightbox {
    width: 48%;
    padding: 5px;
    border: 1px solid #ddd;
    height: 150px;
    position: absolute;
    right: 6px;
    top: 48px;
    height: 265px;
    overflow-y: auto;
    i.ivu-icon-android-close {
      float: right;
      display: none;
    }
    ul li {
      padding: 5px 5px;
      cursor: pointer;
    }
    ul li:hover {
      background: #5cadff;
      opacity: 0.8;
      i.ivu-icon-android-close {
        display: block;
        margin-top: 3px;
      }
    }
  }
  p.desname {
    position: absolute;
    right: 63px;
    top: 20px;
    span {
      color: #999;
    }
  }
}
</style>


