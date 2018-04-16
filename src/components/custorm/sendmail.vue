<template>
  <div class="sendmail">
    <p>已选中
      <span>{{ num }}</span>个客户</p>
    <div class="custorm">
      <Button type="ghost" v-for="peo in people">
            <Icon type="person-stalker"></Icon>
            {{ peo }}
      </Button>
      <!-- <ul>
        <li v-for="peo in people">
          <Button type="ghost">
            <Icon type="person-stalker"></Icon>{{ peo }}</Button>
        </li>
      </ul> -->
    </div>
    <div class="templ">
      <Form :model="formItem" :label-width="80">
        <FormItem label="邮件模板">
          <Select v-model="formItem.model1" style="width:200px">
            <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="">
            <Input v-model="formItem.textarea" type="textarea" :autosize="{minRows: 5,maxRows: 5}" placeholder="Enter something..."></Input>
        </FormItem>
      </Form>
    </div>

  </div>
</template>
<script>
export default {
  name:"sendmail",
  data() {
    return {
      num: 3,
      people: ['李四', '李四', '李四', '李四'],
      cityList: [
        {
          value: 'New York',
          label: 'New York'
        },
        {
          value: 'London',
          label: 'London'
        }
      ],
      formItem: {
        model1: '',
        textarea:''
      }
    };
  }
};
</script>
<style lang="less" scoped>
.sendmail {
  .custorm {
    padding-bottom: 20px;
  }
  p{
    padding: 15px 0;
  }
   button:first-child{
    margin-left: 0
   }
  button{
    margin-left: 10px;
  }
  // ul li {
  //   float: left;
  //   padding: 5px 10px;
  // };
  // ul li:first-child{
  //   padding: 5px 0;
  // }
  span {
    color: #19be6b;
    padding: 0 5px;
  };
  .templ{
    clear: both;
    margin-left: -15px;
  }
}
</style>


