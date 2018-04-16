<template>
<div class="finalcontact" v-clickoutside="function() {boxshow = false}">
    <div class="lasttime" v-model="msg" :class="{'active':isActive}" @click="youself()" >
      {{ msg }}
      <Icon type="arrow-down-b"></Icon>
    </div>
    <transition name="slide-fade">
      <!-- @mouseout="thisnone" -->
      <div class="bbox" v-show="boxshow" >
        <ul>
          <li v-for="(arr,index) in arrlist" @click="getval(arr)">{{ arr }}</li>
        </ul>
        <Button class="zidy" type="info" size="small" @click="timebox">自定义</Button>
        <div class="showtime" v-show="time" >
          <DatePicker type="daterange" @on-ok="getDate" v-model="value2" confirm placement="bottom-end" placeholder="请选择时间" style="width: 200px"></DatePicker>
          <!-- <DatePicker :value="value2"  format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="Select date" style="width: 200px"></DatePicker> -->
          <Button type="info" @click="confirmtime" class="disblock:initial;">确定</Button>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import time from '../custorm/time.js';
import clickoutside from '../../directives/clickoutside';
export default {
  directives: { clickoutside },
  props: {
    show: {
      default: false
    },
    msgs: {
      default: ''
    },
    msgg: {
      default: ''
    },
    tit: {
        default: ''
    }
  },
  data() {
    return {
      isActive: false,
      msg: this.msgs,
      boxshow: false,
      // 传给父组件的时间单位
      starttime: '',
      endtime: '',
      time: false,
      day1: '',
      day2: '',
      value2: "",
      arrlist: ['不限', '今天', '昨天', '最近7天', '最近30天'],
      params: {
        start: '',
        end: ''
      }
    };
  },
  methods: {
    // js获取当前日期前后N天的方法
    youself() {
      this.boxshow = !this.boxshow;
      this.isActive = !this.isActive;
    },
    thisnone(){
      this.boxshow = false;
    },
    timebox() {
      this.boxshow = true;
      this.time = !this.time;
    },
    clearAll(){
      this.msg= this.tit
    },
    getval(index) {
      console.log(1);
      this.boxshow = !this.boxshow;
      console.log(2);
      this.msg = index;
      switch (index) {
        case '不限':
          this.starttime = '';
          this.endtime = '';
          break;
        case '今天':
          let today = new Date();
          this.starttime = today.toLocaleDateString().replace(/\//g, '-');
          this.endtime = today.toLocaleDateString().replace(/\//g, '-');
          break;
        case '昨天':
            this.starttime = time.timeForMat(1).guoqu;
            this.endtime = time.timeForMat(1).today;
            break;
        case '最近7天':
          this.starttime = time.timeForMat(7).guoqu;
          this.endtime = time.timeForMat(7).today;
          break;
        case '最近30天':
          this.starttime = time.timeForMat(30).guoqu;
          this.endtime = time.timeForMat(30).today;
          break;
        default:
          break;
      }
      this.params = {
        start: this.starttime,
        end: this.endtime
      };
      this.$emit('gettime', this.params);
    },
    getDate(){
      // if(this.value2)
      let a = new Date(this.value2[0]).format("yyyy-MM-dd");
      console.log(a);
      this.starttime = a;
      let b = new Date(this.value2[1]).format("yyyy-MM-dd");
      this.endtime = b;
    },
    confirmtime() {
        let a = new Date(this.value2[0]).format("yyyy-MM-dd");
        console.log(a);
        this.starttime = a;
        let b = new Date(this.value2[1]).format("yyyy-MM-dd");
        console.log(b);
        this.endtime = b;
        this.msg = a+"/"+b;
        this.boxshow = false;
        this.params = {
          start: this.starttime,
          end: this.endtime
        };
        this.value2 = "";
        this.time = false;
        this.$emit('gettime', this.params);
      }
    }
};
</script>
<style lang="less" scoped>
.finalcontact {
  float: left;
  margin-right: 10px;
  cursor: pointer;
  .bbox {
    width: 320px;
    border: 1px solid #dddee1;
    background-color: #fff;
    box-shadow: 2px 2px 8px #ccc;
    padding: 10px 5px;
    position: absolute;
    z-index: 9;
    margin-top: 5px;
    button.zidy {
      clear: both;
      display: block;
    }
    .showtime {
      padding: 10px 0;
    }
  }
  ul li {
    float: left;
    padding: 0 20px 8px 3px;
  }
  ul li:hover {
    cursor: pointer;
    color: #5cadff;
  }
  .lasttime.active {
    border-color: #57a3f3;
    outline: 0;
    box-shadow: 0 0 0 2px rgba(45, 140, 240, 0.2);
  }
  .lasttime {
    cursor: pointer;
    position: relative;
    color: #bbbec4;
    padding: 0 18px 0 8px;
    min-height: 30px;
    line-height: 30px;
    display: inline-block;
    border: 1px solid #dddee1;
    border-radius: 3px;
    i.ivu-icon.ivu-icon-arrow-down-b {
      padding-left: 18px;
      position: absolute;
      top: 7px;
      right: 5px;
      cursor: pointer;
      font-size: 14px;
      color: #80848f;
    }
  }
  .lasttime:hover{
      border-color: #57a3f3;
      outline: 0;
      box-shadow: 0 0 0 2px rgba(45, 140, 240, 0.2);
  }
}
.slide-fade-enter-active {
  transition: all 1s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.5, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(1px);
  opacity: 0;
}
</style>


