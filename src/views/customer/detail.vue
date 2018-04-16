<style lang="less">
.customerDetail {
  width: 100%;
  height: 100%;
  .detail-left {
    width: 74%;
    height: 100%;
    float: left;
    .detail-left-top {
      width: 100%;
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.4);
      background: #fff;
      .header-div {
        width: 150px;
        height: 100%;
        float: left;
        text-align: center;
        img {
          width: 120px;
          height: 120px;
          margin-top: 15px;
          background: #e2e2e2;
        }
      }
      .header-cont {
        height: 100%;
        margin-left: 150px;
        position: relative;
        .cont-div {
          float: left;
          height: 100%;
        }
        .name-d {
          width: 15%;
          padding: 15px 0;
          text-align: left;
          p {
            line-height: 23px;
            color: #999;
            font-size: 12px;
          }
          .userName {
            color: #333;
            font-size: 14px;
            font-weight: 500;
          }
          .user-company {
            color: #666;
            .icon {
              color: rgb(215, 4, 19);
              margin-right: 5px;
            }
          }
          .vvip {
            span {
              border: 1px solid #f8b551;
              display: inline;
              color: #f8b551;
              font-weight: bold;
              padding: 2px 4px;
              border-radius: 2px;
            }
          }
        }
        .progress-d {
          width: 70%;
          .progress-div {
            margin-top: 30px;
            .pro-line {
              width: 100%;
            }
            .user-steps {
              font-size: 0;
              width: 80%;
              margin: 0 auto;
              .user-steps-status {
                float: left;
                width: 25%;
                height: 30px;
                position: relative;
                .icon-icon-test1 {
                  cursor: pointer;
                }
                .icon-icon-test2 {
                  cursor: pointer;
                }
                .icon-icon-test3 {
                  cursor: pointer;
                }
                .status-icon {
                  position: absolute;
                  left: 0;
                  top: 3px;
                }
                .user-step-line {
                  display: inline-block;
                  height: 2px;
                  position: absolute;
                  right: 5px;
                  left: 20px;
                  top: 15px;
                }
                .user-step-name {
                  position: absolute;
                  bottom: -20px;
                  font-size: 12px;
                  left: -10px;
                }
              }
            }
          }
          .customer-day {
            color: #999;
            text-align: center;
            font-weight: 600;
            margin-top: 30px;
            padding-right: 88px;
            span {
              padding: 0 5px;
              font-size: 14px;
              color: #6cc090;
              font-weight: 600;
            }
          }
        }
        .remark {
          position: absolute;
          right: 10px;
          top: 10px;
          font-size: 11px;
          color: #999;
        }
        .icon-next {
          position: absolute;
          bottom: 24px;
          right: 24px;
          i {
            font-size: 20px;
            cursor: pointer;
          }
        }
      }
    }
    .left-bottom {
      width: 100%;
      position: relative;
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.4);
      margin-top: 1%;
      background: #fff;
      padding-bottom: 100px;
      .openMobile {
        width: 34px;
        background: rgba(218, 218, 222, 1);
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
        position: absolute;
        right: 0;
        top: 200px;
        text-align: center;
        padding: 10px 0;
        color: #666666;
        font-family: MicrosoftYaHei;
        cursor: pointer;
      }
      .tab-div {
        width: 100%;
        text-align: center;
        .tabs-ul {
          display: inline-block;
          li {
            float: left;
            .active {
              background: #a3b1ef;
              color: #fff !important;
              border-radius: 2px;
            }
            .tab-nav {
              padding: 12px 58px;
              color: #666;
              font-weight: 800;
              font-size: 14px;
              cursor: pointer;
            }
          }
        }
      }
      .d-cont {
        width: 80%;
        margin: 0 auto;
        .dynamic {
          margin-top: 20px;
          textarea {
            width: 100%;
            height: 70px;
            border-color: #e1e6e9;
            padding: 10px;
            border-radius: 2px;
            resize: none;
          }
          ::-webkit-input-placeholder {
            color: #a0a0a0;
            line-height: 50px;
          }
          :-moz-placeholder {
            /* Firefox 18- */
            color: #a0a0a0;
            line-height: 50px;
          }
          ::-moz-placeholder {
            /* Firefox 19+ */
            color: #a0a0a0;
            line-height: 50px;
          }

          :-ms-input-placeholder {
            color: #a0a0a0;
            line-height: 50px;
          }
          .btn-p {
            text-align: right;
            margin-top: 10px;
            .add-btn {
              padding: 10px 30px;
              background: #8c9deb;
              border-radius: 4px;
              color: #fff;
              cursor: pointer;
              margin-top: 10px;
            }
          }

          .dynamic-nav {
            width: 270px;
            margin: 20px auto;
            border-radius: 30px;
            box-shadow: 0 0 1px rgba(0, 0, 0, 0.4);
            li {
              width: 50%;
              line-height: 35px;
              float: left;
              text-align: center;
              font-size: 14px;
              font-weight: 800;
              color: #b4b4b4;
            }
            .active {
              color: #8c9deb;
              cursor: pointer;
            }
            .dy-phone {
              border-left: 1px solid #e1e6e9;
              position: relative;
              cursor: pointer;
              .icon {
                margin-left: 12px;
              }
              .dynamic-way-list {
                position: absolute;
                left: 0;
                right: 0;
                top: 40px;
                background: #fff;
                z-index: 1;
                border-left: 1px solid #e2e2e2;
                border-right: 1px solid #e2e2e2;
                border-bottom: 1px solid #e2e2e2;
                li {
                  float: none;
                  font-size: 12px;
                  width: 100%;
                  text-align: left;
                  padding-left: 30px;
                }
              }
            }
          }
          .cust-chats-cont {
            ul > li {
              margin-top: 15px;
            }
            .cust-chats-time {
              color: #666;
              width: 50%;
              position: relative;
              margin-left: 35px;
              .icon-comments {
                vertical-align: middle;
                margin-right: 5px;
              }
              .cust-new {
                position: absolute;
                right: 0;
                top: 0;
                color: #099444;
                .icon-jiantou1-copy {
                  color: #a3a3a3;
                  vertical-align: middle;
                  margin: 0 5px;
                }
              }
            }
            .me_right {
              float: right;
              margin-right: 35px;
            }
            .cust-voice {
              width: 60%;
              margin-top: 3px;
              img {
                float: left;
                width: 30px;
                height: 30px;
                border-radius: 100%;
                margin-top: 5px;
              }
              .cust-chat-detail {
                position: relative;
                padding: 10px 10px;
                margin-left: 40px;
                box-shadow: 0 0 2px rgba(0, 0, 0, 0.4);
                border-radius: 5px;
                .cust-chat-num {
                  color: #8c9deb;
                  position: absolute;
                  right: 20px;
                }
              }
              .cust-chat-arrow {
                position: absolute;
                top: 5px;
                left: -16px; /* 圆角的位置需要细心调试哦 */
                width: 0;
                height: 0;
                font-size: 0;
                border: solid 8px;
                border-color: transparent #ebebee transparent transparent;
              }
              .cust-chat-arrow-trans {
                position: absolute;
                top: 5px;
                left: -13px; /* 圆角的位置需要细心调试哦 */
                width: 0;
                height: 0;
                font-size: 0;
                border: solid 8px;
                border-color: transparent #fff transparent transparent;
              }
            }
            .cust-voice-right {
              float: right;
              position: relative;
              .cust-chat-header-right {
                position: absolute;
                right: 0;
                top: -8px;
              }
              .cust-chat-detail-right {
                margin-right: 40px;
                .cust-chat-arrow-right {
                  position: absolute;
                  top: 5px;
                  right: -16px;
                  width: 0;
                  height: 0;
                  font-size: 0;
                  border: solid 8px;
                  border-color: transparent transparent transparent #ebebee;
                }
                .cust-chat-arrow-trans-right {
                  position: absolute;
                  top: 5px;
                  right: -13px;
                  width: 0;
                  height: 0;
                  font-size: 0;
                  border: solid 8px;
                  border-color: transparent transparent transparent #fff;
                }
              }
              .me-name {
                color: #999;
                position: absolute;
                right: 2px;
                top: 30px;
              }
            }
          }
        }
        .cust-information {
          position: relative;
          font-size: 14px;
          color: #666;
          margin-top: 20px;
          ul {
            width: 100%;
            margin: 0 auto;
            .info-li {
              width: 50%;
              height: 50px;
              float: left;
              overflow: hidden;
              .info-tag-name {
                color:#999;
                float: left;
              }
              .info-tag-text {
                color:#666;
                margin-left: 100px;
              }
            }
          }
          .customerInfoMore-div {
            text-align: center;
            margin-top: 60px;
            span {
              cursor: pointer;
            }
            .customerInfoSave {
              padding: 10px 30px;
              background: #8c9deb;
              border-radius: 4px;
              color: #fff;
              cursor: pointer;
              margin-top: 10px;
            }
          }
          .customerInfoEdit {
            padding: 10px 30px;
            background: #8c9deb;
            border-radius: 4px;
            color: #fff;
            cursor: pointer;
            margin-top: 10px;
            position: absolute;
            right: -20px;
            top: -20px;
          }
        }
      }
    }
  }
  .detail-right {
    width: 25%;
    float: right;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.4);
    background: #fff;
    .cust-tag {
      border-bottom: 1px solid #e1e6e9;
      .cust-tag-tit {
        padding: 12px;
        color: #666666;
        font-size: 14px;
        font-weight: 800;
        position: relative;
      }
      .cust-tag-tit::before {
        content: "";
        width: 2px;
        height: 14px;
        position: absolute;
        top: 15px;
        left: -1px;
        background: #586ac0;
      }
      .cust-communication-way {
        padding: 5px;
        .ivu-poptip {
          .ivu-poptip-popper {
            min-width: auto;
          }
        }
        .icon {
          font-size: 45px;
          color: #93a3ec;
          margin-left: 10px;
          cursor: pointer;
        }
      }
      .cust-customer-tag {
        .cust-customer-tag-tit {
          padding: 5px 12px;
          color: #999;
          span {
            color: #8c9deb;
            float: right;
            cursor: pointer;
          }
        }
      }
      .cust-customer-tag-name {
        padding: 3px 12px;
        .detailTagDefin {
          border-radius: 3px;
          display: inline-block;
          margin: 2px 4px 2px 0;
          padding: 0 8px;
          height: 24px;
          line-height: 24px;
        }
      }
    }
  }
}

.sqbtn {
  width: 36px;
  background-color: #a3b1ef;
  padding: 11px;
  color: #fff;
  cursor: pointer;
  top: 60px;
  position: absolute;
  right: 0;
}
.customerDetail .ivu-modal-mask {
  background-color: rgba(55, 55, 55, 0.6);
}
</style>

<template>
  <div class="customerDetail clearfix" @click="forDTmenu">
    <!-- 左内容 -->
    <div class="detail-left">
      <!-- 头像信息 -->
      <div class="detail-left-top clearfix">
        <div class="header-div">
          <img :src="customerLargeHead(customerInfo.wx_head_img_uri)" />
        </div>
        <div class="header-cont clearfix">
          <div class="cont-div name-d">
            <p class="userName" v-if="customerInfo.name">{{customerInfo.name}}&nbsp;
              <i style="color: #8c9deb;" class="icon" :class="{ 'icon-nanxing': customerInfo.sex=='男', 'icon-nv': customerInfo.sex=='女' }"></i>
            </p>
            <p class="user-company">
              <i style="color:#d70413" class="icon " :class="{'icon-gaiicon-16':customerInfo.source=='企业数据','icon-huakundaowei':customerInfo.source=='华坤道威','icon-gaiicon-18':customerInfo.source=='营销数据'}"></i>{{customerInfo.source}}</p>
            <p class="vvip" v-if="customerInfo.vip">
              <span>{{customerInfo.vip}}</span>
            </p>
            <p v-if="customerInfo.weixin_nice_name"><span style="color:#999">微信昵称&nbsp;:&nbsp;</span><span style="color:#666">{{customerInfo.weixin_nice_name}}</span></p>
            <p><span style="color:#999">30天活跃度&nbsp;:&nbsp;</span><span style="color:#666">{{thirtyLiveness}}</span></p>
          </div>
          <div class="cont-div progress-d">
            <div class="progress-div">
              <div class="user-steps clearfix">

                <div class="user-steps-status" v-for="(item,$index) in stageList" :key="$index">
                  <i class="icon icon-icon-test status-icon" v-if="stageId> item.id" style="color:#6cc090;"></i>
                  <i class="icon icon-icon-test2 status-icon" @click="stageClickEvent(item.id,1)" v-else-if="$index== stageIdIndex" style="color:#e1e6e9;"></i>
                  <i class="icon icon-icon-test1 status-icon" @click="stageClickEvent(item.id,1)" v-else-if="stageId== item.id" style="color:#6cc090;"></i>
                  <i class="icon icon-icon-test3 status-icon" @click="stageClickEvent(item.id,1)" v-else-if="stageId< item.id" style="color:#e1e6e9;"></i>

                  <span class="user-step-line" style="background:#6cc090;" v-if="stageId > item.id"></span>
                  <span class="user-step-line" style="background:#e1e6e9;" v-else-if="stageId <= item.id"></span>
                  <span class="user-step-line" style="background:#fff;" v-if="$index == stageList.length-1"></span>

                  <span class="user-step-name" style="background:#6cc090;color:#fff;border-radius: 4px;cursor:pointer;line-height:22px;width:72px;text-align:center;" v-if="stageId== item.id">{{item.name}}
                    <i v-if="$index != 0 " @click="stageClickEvent(stageId,0)" class="icon icon-cha" style="color:#fff;font-size:12px;"></i>
                  </span>
                  <span class="user-step-name" style="color:#6cc090" v-else-if="stageId> item.id">{{item.name}}</span>
                  <span class="user-step-name" style="color:#999999;cursor:pointer;" @click="stageClickEvent(item.id,1)" v-else>{{item.name}}</span>
                </div>

              </div>
            </div>
            <div class="customer-day">(您
              <span>{{noCommuniteWithCustomer}}</span>天没有和客户接触)</div>
          </div>
          <p class="remark">客户信息来自用户输入</p>
          <span class="icon-next">
            <div>
              <Tooltip content="上一个" placement="left-start">
                <i class="icon icon-iconset0433" @click="prevUserInfo(2)"></i>
              </Tooltip>
            </div>
            <div>
              <Tooltip content="下一个" placement="left-start">
                <i class="icon icon-iconset0434" @click="prevUserInfo(1)"></i>
              </Tooltip>
            </div>
          </span>

        </div>
      </div>
      <!-- 动态 资料 画像 -->
      <div class="left-bottom" style="position: relative;">
        <!-- 收起按钮 -->
        <div class="openMobile" v-show="openMobileShow" @click="openMobileEvent">
          展<br>开<br>拨<br>打<br>记<br>录<br>
        </div>
        <!-- 导航 -->
        <div class="tab-div">
          <ul class="tabs-ul clearfix">
            <li>
              <div class="tab-nav" :class="dtActive" @click="selectStyle(1)">动态</div>
            </li>
            <li>
              <div class="tab-nav" :class="zlActive" @click="selectStyle(2)">资料</div>
            </li>
            <li>
              <div class="tab-nav" :class="picActive" @click="selectStyle(3)">客户画像</div>
            </li>
          </ul>
        </div>
        <div class="d-cont">
          <!-- 动态 -->
          <div class="dynamic clearfix" v-show="dtShow">
            <textarea placeholder="您可以将您和客户的互动行为,以事件的形式记录下来~~~~不超过500汉字" v-model="textareaData">{{textareaData}}</textarea>
            <p class="btn-p">
              <span class="add-btn" v-show="$root.perEvent('cust','ADD')" @click="addInteraction(textareaData)">添加</span>
            </p>
            <ul class="dynamic-nav clearfix">
              <li :class="this.allDTunactive ?'':'active'" @click="getAllRecord" style="cursor:pointer">全部动态</li>
              <li class="dy-phone">
                <div @click="showDynamicWayList" :class="this.allDTunactive ?'active':''">{{showDynamicWayDefaultText}}
                  <i class="icon icon-iconfontjiantou"></i>
                </div>
                <ul class="dynamic-way-list" v-show="dynamicWaylist">
                  <li @click="selectDynamicWay('手动添加动态')">手动添加动态</li>
                  <li @click="selectDynamicWay('微页面与表单')">微页面与表单</li>
                  <li @click="selectDynamicWay('电子邮件')">电子邮件</li>
                  <li @click="selectDynamicWay('短信')">短信</li>
                  <li @click="selectDynamicWay('外呼')">外呼</li>
                  <li @click="selectDynamicWay('微信群')">微信群</li>
                  <li @click="selectDynamicWay('自有渠道事件')">自有渠道事件</li>
                  <li @click="selectDynamicWay('客户生命周期')">客户生命周期</li>
                  <li @click="selectDynamicWay('修改资料')">修改资料</li>
                  <li @click="selectDynamicWay('任务')">任务</li>
                </ul>
              </li>
            </ul>
            <div class="cust-chats-cont">
              <scroll :on-reach-bottom="handleReachBottom">
                <ul class="clearfix">
                  <li v-for="(item,$index) in eventByTimeGroup" :key="$index" class="clearfix">
                    <div class="cust-chats-time" :class="{ 'me_right': item.type==0}">
                      <i class="icon icon-comments"></i>{{item.showEventTime}}
                      <p class="cust-new" v-if="item.custEventTo">{{item.custEventTo}}
                        <i class="icon icon-jiantou1-copy"></i>{{item.custEventfrom}}</p>
                    </div>
                    <div class="cust-voice clearfix" :class="{ 'cust-voice-right': item.type==0}">
                      <img class="cust-chat-header" v-if="item.type == 1" :src="customerHead(item.wxHeadImgUri)" />
                      <p class="cust-chat-detail" :class="{ 'cust-chat-detail-right': item.type==0}">
                        <span style="color:#333">{{item.showEventRemark}}</span>

                        <span class="cust-chat-num" v-if="item.score == 0 | !item.score" v-show="false"></span>
                        <span class="cust-chat-num" v-show="true" v-else-if="item.score > 0">+{{item.score}}</span>
                        <span class="cust-chat-num" v-show="true" v-else>{{item.score}}</span>

                        <span :class="{'cust-chat-arrow':item.type==1,'cust-chat-arrow-right':item.type==0}"></span>
                        <span :class="{'cust-chat-arrow-trans':item.type==1,'cust-chat-arrow-trans-right':item.type==0}"></span>
                      </p>
                      <img v-if="item.type == 0" class="cust-chat-header-right" :src="userHead(item.headName)" />
                      <span v-if="item.type == 0" class="me-name">{{item.userName}}</span>
                      <span v-if="item.type == 1" class="me-name" style="color:#999">{{item.name}}</span>
                    </div>
                  </li>
                </ul>
              </scroll>
            </div>
          </div>
          <!-- 资料 -->
          <div class="cust-information" v-show="zlShow">
            <ul class="clearfix">
              <li class="info-li" v-for="item in commonAttrList" :key="item.attrKey" v-if="item.attrKey != 'city' && item.attrKey != 'county' && item.attrKey !='wx_head_img_uri' ">
                <span v-if='item.attrType === "select" && item.attrKey === "province"' class="info-tag-name">所在地区&nbsp;:</span>
                <span v-else class="info-tag-name">{{item.attrName}}&nbsp;:</span>

                <div v-if="item.attrKey === 'mobile' && grantMobileStatus == 10" class="info-tag-text">已加密</div>
                <div v-else-if="item.attrKey === 'stage_id'" class="info-tag-text">{{stageName}}</div>
                <div v-else-if="item.attrKey === 'province'" class="info-tag-text">{{customerInfo.province}}{{customerInfo.city}}{{customerInfo.county}}</div>
                <div v-else class="info-tag-text">{{item.contentvalue}}</div>
              </li>
              <li class="info-li" v-for="item in uncommonAttrList" v-show="uncommonAttrListShow" :key="item.attrKey" v-if="item.attrKey != 'city' && item.attrKey != 'county' && item.attrKey !='wx_head_img_uri' ">
                <span class="info-tag-name">{{item.attrName}}&nbsp;:</span>
                <div v-if="item.attrKey === 'mobile' && grantMobileStatus == 10" class="info-tag-text">已加密</div>
                <div v-else-if="item.attrKey === 'stage_id'" class="info-tag-text">{{stageName}}</div>
                <div v-else class="info-tag-text">{{item.contentvalue}}</div>
              </li>
            </ul>
            <div class="customerInfoMore-div">
              <span @click="uncommonAttrListShowEvent()" v-model="custInfoMore">{{custInfoMore}}
                <i class="icon" :class="{'icon-iconfontjiantou-copy':custInfoMore=='收起','icon-iconfontjiantou':custInfoMore=='更多'}"></i>
              </span>
            </div>
            <span class="customerInfoEdit" v-show="$root.perEvent('cust','UPDATE')" @click="customerInfoEditEdit">编辑</span>
          </div>
          <!-- 编辑资料 -->
          <div class="cust-information" v-show="editZlShow">
            <ul class="clearfix">
              <li class="info-li" v-for="item in editCommonAttrList" v-if="!filterEditKey.has(item.attrKey)" :key="item.attrKey">
                <span v-if='item.attrType === "select" && item.attrKey === "province"' class="info-tag-name">所在地区&nbsp;:</span>
                <span v-else class="info-tag-name">{{item.attrName}}&nbsp;:</span>
                <div class="info-tag-text">
                  <Input v-if='item.attrKey == "mobile" && grantMobileStatus == 10' :name="item.attrKey" v-model="customerInfo.mobile" clearable style="width: 200px" :maxlength="11" @on-keyup="function(event) {event.target.value=event.target.value.replace(/\D/g,'')}" />
                  <Input v-else-if='item.attrKey == "mobile"' :name="item.attrKey" v-model="item.contentvalue" clearable style="width: 200px" :maxlength="11" @on-keyup="function(event) {event.target.value=event.target.value.replace(/\D/g,'')}" />

                  <Input v-else-if='item.attrKey == "telephone"' :name="item.attrKey" v-model="item.contentvalue" clearable style="width: 200px" :maxlength="12" @on-keyup="function(event) {event.target.value=event.target.value.replace(/\D/g,'')}" />
                  <Input v-else-if='item.attrType == "text" ' :name="item.attrKey" v-model="item.contentvalue" clearable style="width: 200px" />
                  <DatePicker v-else-if='item.attrType == "date"' v-model="item.contentvalue" type="date" :name="item.attrKey" style="width: 200px"></DatePicker>

                  <Cascader transfer v-else-if='item.attrType === "select" && item.attrKey === "province"' :data="provinceList" change-on-select :name="item.attrKey" v-model="custProvince" style="width:200px"></Cascader>
                  <!-- 销售阶段 -->
                  <Select transfer v-else-if='item.attrKey == "stage_id"' :name="item.attrKey" v-model="item.contentvalue" style="width:200px">
                    <Option v-for="saleVal in stageList" :value="saleVal.id" :key="saleVal.id">
                      {{saleVal.name}}
                    </Option>
                  </Select>
                  <!-- 客户负责人 -->
                  <Select transfer v-else-if='item.attrKey == "user_name"' :name="item.attrKey" v-model="item.contentvalue" style="width:200px">
                    <Option v-for="user in userList" :value="user.id" :key="user.id">{{user.userName}}
                    </Option>
                  </Select>

                  <Select transfer v-else-if='item.attrType == "select"' :name="item.attrKey" v-model="item.contentvalue" style="width:200px">
                    <Option v-for="selectVal in item.attrVal? item.attrVal.split(';'):''" :value="selectVal" :key="selectVal">{{selectVal}}
                    </Option>
                  </Select>

                  <RadioGroup v-else-if='item.attrType == "bool"' v-model="item.contentvalue">
                    <Radio label="是" true-value="是"></Radio>
                    <Radio label="否" true-value="否"></Radio>
                  </RadioGroup>

                  <InputNumber v-else-if="item.attrType == 'digit'" style="width:200px;" v-model="item.contentvalue"></InputNumber>

                </div>
              </li>
              <li class="info-li" v-show="uncommonAttrEditListShow" v-for="item in editUncommonAttrList" v-if="!filterEditKey.has(item.attrKey)" :key="item.attrKey">
                <span v-if='item.attrType === "select" && item.attrKey === "province"' class="info-tag-name">所在地区&nbsp;:</span>
                <span v-else class="info-tag-name">{{item.attrName}}&nbsp;:</span>
                <div class="info-tag-text">

                  <Input v-if='item.attrKey == "mobile" && grantMobileStatus == 10' :name="item.attrKey" v-model="customerInfo.mobile" clearable style="width: 200px" :maxlength="11" @on-keyup="function(event) {event.target.value=event.target.value.replace(/\D/g,'')}" />
                  <Input v-else-if='item.attrKey == "mobile"' :name="item.attrKey" v-model="item.contentvalue" clearable style="width: 200px" :maxlength="11" @on-keyup="function(event) {event.target.value=event.target.value.replace(/\D/g,'')}" />

                  <Input v-else-if='item.attrKey == "telephone"' :name="item.attrKey" v-model="item.contentvalue" clearable style="width: 200px" :maxlength="12" @on-keyup="function(event) {event.target.value=event.target.value.replace(/\D/g,'')}" />
                  <Input v-else-if='item.attrType == "text" ' :name="item.attrKey" v-model="item.contentvalue" clearable style="width: 200px" />
                  <DatePicker v-else-if='item.attrType == "date"' v-model="item.contentvalue" type="date" :name="item.attrKey" style="width: 200px"></DatePicker>

                  <Cascader transfer v-else-if='item.attrType === "select" && item.attrKey === "province"' :data="provinceList" change-on-select :name="item.attrKey" v-model="custProvince" style="width:200px"></Cascader>
                  <!-- 销售阶段 -->
                  <Select transfer v-else-if='item.attrKey == "stage_id"' :name="item.attrKey" v-model="item.contentvalue" style="width:200px">
                    <Option v-for="saleVal in stageList" :value="saleVal.id" :key="saleVal.id">
                      {{saleVal.name}}
                    </Option>
                  </Select>
                  <!-- 客户负责人 -->
                  <Select transfer v-else-if='item.attrKey == "user_name"' :name="item.attrKey" v-model="item.contentvalue" style="width:200px">
                    <Option v-for="user in userList" :value="user.id" :key="user.id">{{user.userName}}
                    </Option>
                  </Select>

                  <Select transfer v-else-if='item.attrType == "select"' :name="item.attrKey" v-model="item.contentvalue" style="width:200px">
                    <Option v-for="selectVal in item.attrVal? item.attrVal.split(';'):''" :value="selectVal" :key="selectVal">{{selectVal}}
                    </Option>
                  </Select>

                  <RadioGroup v-else-if='item.attrType == "bool"' v-model="item.contentvalue">
                    <Radio label="是" true-value="是"></Radio>
                    <Radio label="否" true-value="否"></Radio>
                  </RadioGroup>

                  <InputNumber v-else-if="item.attrType == 'digit'" style="width:200px;" v-model="item.contentvalue"></InputNumber>

                </div>
              </li>
            </ul>
            <div class="customerInfoMore-div">
              <span @click="uncommonAttrEditListShowEvent()" v-model="editCustInfoMore">{{editCustInfoMore}}
                <i class="icon" :class="{'icon-iconfontjiantou-copy':editCustInfoMore=='收起','icon-iconfontjiantou':editCustInfoMore=='更多'}"></i>
              </span>
            </div>
            <div class="customerInfoMore-div">
              <span @click="custInfoUpdate" class="customerInfoSave">保存</span>
              <span @click="backUpdate" class="customerInfoSave">返回</span>
            </div>
          </div>
        </div>
        <!-- 客户画像 -->
        <div v-show="picShow">
          <iframe :src="'/view/customer/customer/miniPcProfile.html?id=' + this.id + '&type=1&companyId=1'" frameborder="0" width="100%" height="800px"></iframe>
        </div>

      </div>
    </div>
    <!-- 右内容 -->
    <div class="detail-right">
      <!-- 沟通方式 -->
      <div class="cust-tag">
        <div class="cust-tag-tit">沟通方式</div>
        <div class="cust-communication-way">

          <Poptip trigger="hover">
            <div slot="content" style="text-align:center;">
              <div>手机：
                <span style="cursor: pointer;" v-if="customerInfo.mobile" @click="callPageShowEvent(id,0,customerInfo.mobile)">{{customerInfo.mobile}}</span>
                <span v-else>无手机号</span>
              </div>
              <div>联系电话：
                <span style="cursor: pointer;" v-if="customerInfo.telephone" @click="callPageShowEvent(id,1,customerInfo.telephone)">{{customerInfo.telephone}}</span>
                <span v-else>无联系电话</span>
              </div>
            </div>

            <i class="icon icon-phone" style="position:relative;">
              <Badge :count="callCount" style="position:absolute;top:-3px;right:-12px;z-index:1"></Badge>
            </i>

          </Poptip>

          <Poptip trigger="hover">

            <div slot="content" style="text-align:center;">
              <span v-if="customerInfo.mobile">发短信</span>
              <span v-else>发短信:无手机号</span>
            </div>

            <i class="icon icon-comments1" @click="callPageShowEvent(id,2,customerInfo.mobile)"></i>
          </Poptip>

          <Poptip trigger="hover">
            <div slot="content" style="text-align:center;">
              <span v-if="customerInfo.mobile">发弹信</span>
              <span v-else>发弹信:无手机号</span>
            </div>
            <i class="icon icon--inquiry-template" @click="callPageShowEvent(id,3,customerInfo.mobile)"></i>
          </Poptip>

          <Poptip trigger="hover">
            <div slot="content" style="text-align:center;">
              <span v-if="customerInfo.email">发邮件</span>
              <span v-else>发邮件:无邮箱</span>
            </div>
            <i class="icon icon-email1" @click="callPageShowEvent(id,4,customerInfo.email)"></i>
          </Poptip>

          <Poptip trigger="hover">
            <div slot="content" style="text-align:center;">
              <span v-if="customerInfo.mobile">添加微信好友</span>
              <span v-else>添加微信好友:无手机号</span>
            </div>
            <i class="icon icon-add" @click="callPageShowEvent(id,5,customerInfo.mobile)"></i>
          </Poptip>

        </div>
      </div>
      <!-- 客户标签 -->
      <div class="cust-tag">
        <div class="cust-tag-tit">客户标签</div>
        <div class="cust-customer-tag">
          <p class="cust-customer-tag-tit">华坤道威标签</p>
          <div class="cust-customer-tag-name">
            <span class="detailTagDefin" v-for="item in hkdwTaglist" v-if="item" style="color: #f79023;border: 1px solid #f79023;">{{item}}</span>
          </div>
          <p class="cust-customer-tag-tit">自定义标签
            <span @click="addDefinedTag" v-show="$root.perEvent('cust','ADD')">添加</span>
          </p>
          <div class="cust-customer-tag-name">
            <tag v-for="(item,$index) in customTagList" v-if="item" :key="item" :name="item" closable color="green" @on-close="removeTag">{{item}}</tag>
          </div>
        </div>
      </div>
      <!-- 内容标签 -->
      <div class="cust-tag">
        <div class="cust-tag-tit">内容标签</div>
        <div class="cust-customer-tag-name">
          <span class="detailTagDefin" v-for="item in makingTagList" v-if="item" style="color: #6c7dc9;border: 1px solid #6c7dc9;">{{item}}</span>
        </div>
      </div>
      <!-- 所在群组 -->
      <div class="cust-tag" style="border-bottom:0;margin-bottom:30px;">
        <div class="cust-tag-tit">所在群组</div>
        <div class="cust-customer-tag-name">
          <span class="detailTagDefin" v-for="(item,$index) in groupTagArrayData" v-if="item" style="color: rgba(191,191,191,1);border: 1px solid rgba(191,191,191,1);">{{item.groupName}}</span>
        </div>
      </div>
    </div>
    <Spin style="width: 100%; height: 100%; min-height: 300px;" size="large" fix v-if="spinShow">
    </Spin>

    <!-- 打电话倒计时弹框 -->
    <modal v-model="callTimeoutModel" :footerHide="true" :closable=false :mask-closable="false" :transfer=false>
      <p style="text-align:center;font-size:20px;">拨号呼叫中,请注意接听您的手机</p>
      <p style="text-align:center;font-size:20px;"> <img :src="callGifPic" style="vertical-align: middle;" />
        <span v-model="callTimeNum"></span>{{callTimeNum}}秒</p>
    </modal>
    <!-- 自定义标签 -->
    <selectDefineTags :define="customTagList" :show="selectDefineTagsShow" @submit="submitTag" @on-cancel="cancelAddTag"></selectDefineTags>
    <!-- 打电话 -->
    <call @shbtn="callModelHide" :forlay="callModelShow" :btnhide="true" :checkedCustNum="1" :Received="callModelData" @phone-ok="sendSureModel" @phone-cancel="cancelSureModel"></call>
    <!-- 发短信 -->
    <singlesend :Sendshow="sendmessageShow" :custName='customerInfo.name' :custId="id" @on-cancel="cancelSureModel" @on-suc="sendSureModel"></singlesend>
    <!--  发弹信-->
    <sendtanxin :isshoww="sendtanxinShow" :btnhide="true" :checkedCustNum="1" :sendinfor="[{'id':id,'name':customerInfo.name}]" @onsuccessTan="sendSureModel" @onerrorTan="cancelSureModel"></sendtanxin>
    <!-- 发邮件 -->
    <sendemail :isshow2="sendemailShow" :btnhide="true" :checkedCustNum="1" :sendinfor="[{'id':id,'name':customerInfo.name}]" @on-success="sendSureModel" @on-cancel="cancelSureModel"></sendemail>
    <!-- 加好友 -->
    <addfriendsgreet ref="addFbox" :sessionId="sessionId" :addShow='addFShow' @addWechatFridens='addFridens' @cancel="cancelAddFridens"></addfriendsgreet>
    <!--微信登录-->
    <wxLogin ref="wxLogin" :checkedCustNum="0" :single="isSingle" :show="wxLoginShow" @on-finish="addWechatF" @on-cancel="cancelAddFridens"></wxLogin>
  </div>
</template>
<script>
import defaultUserHead from '../../assets/img/user.png';
import UserDefaultHead from '../../assets/img/unknow.png';
import callGifPic from '../../assets/img/call.gif';
import selectDefineTags from '../../components/addCustomerTags/definedTag';//添加自定义标签model
import singlesend from '../../components/singlesend/singlesend' //发短信
import sendtanxin from '../../components/slidingmenu/sendtanxin' //发弹信
import sendemail from '../../components/slidingmenu/sendemail' //发邮件
import Bojilu from '../../components/custorm/call' //打电话

export default {
  name: "customerDetail",
  data() {
    return {
      openMobileShow: false,
      callModelShow: false,
      id: this.userId,
      defaultUserHead: defaultUserHead,
      UserDefaultHead: UserDefaultHead,
      callGifPic: callGifPic,
      dtActive: "active",
      zlActive: "unactive",
      picActive: "unactive",
      dtShow: true,
      zlShow: false,
      picShow: false,
      dynamicWaylist: false,
      showDynamicWayDefaultText: "请选择",
      customerInfo: {},
      thirtyLiveness: "",//30天活跃度
      stageList: [],
      noCommuniteWithCustomer: '',
      stageId: 0,
      stageName: '',
      textareaData: '',
      eventByTimeGroup: [],
      hkdwTaglist: [],
      customTagList: [],
      groupTagArrayData: {},
      makingTagList: [],
      commonAttrList: [],
      uncommonAttrList: [],
      selectDefineTagsShow: false,
      uncommonAttrListShow: false,
      uncommonAttrEditListShow: false,
      commonAttrEditListShow: false,
      editZlShow: false,
      custInfoMore: "更多",
      editCustInfoMore: "更多",
      editCommonAttrList: [],
      editUncommonAttrList: [],
      updateData: {}, // 编辑数据对象
      pageIndex: 1,
      sendTags: [],
      provinceList: window.provinceList,
      custProvince: [],
      stageIdIndex: '',
      filterEditKey: new Set(), // 不参与编辑的属性
      spinShow: false,
      sendmessageShow: false,//发短信
      sendtanxinShow: false,//发弹信
      sendemailShow: false,//发邮件
      wxLoginShow: false,//微加好友
      grantMobileStatus: 0, //手机号是否加密参数
      grantNameStatus: 0, //姓名是否加密参数
      callCount: 0, //拨打次数
      callTimeoutModel: false,
      callTimeNum: 3,
      addFShow: false,
      sessionId: '',//微信id
      isSingle: true,//true 代表单个发送   false代表多个发送
      callModelData: [], //给打电话组件传参
      listModelFilter: {},
      allDTunactive: false,
      AddWechatparams: {
        logoutOnFinish: true,
        custIds: '',
        isSelAll: '',
        commonId: '',
        helloMessage: ''
      },//添加好友的参数
      custPosition: this.position, // 客户位置游标，用来调用上一页下一页
    }
  },
  props: {
    userId: {
      default: ''
    },
    mobileNum: {
      default: ''
    },
    searchParams: {
      default: {}
    },
    position: {
        type: Number,
        default: -1
    }
  },
  watch: {
    userId(val) {
      this.id = val;
      
      if (this.id !== "") {
        this.pageIndex = 1;
        this.openMobileShow = false;
        this.dtActive = "active";
        this.zlActive = "unactive";
        this.picActive = "unactive";
        this.dtShow = true;
        this.zlShow = false;
        this.picShow = false;
        this.editZlShow = false;
        this.uncommonAttrListShow = false;
        this.uncommonAttrEditListShow = false;
        this.getCustomerDetail(); //获取客户信息
        this.getLiveness();
        this.getLiveness();
        this.contactTime();
        this.getCustEvent(); //动态聊天记录
        this.custGroupEvent();//所在群组数据
      }
    },
    mobileNum(val) {
      // this.customerInfo.mobile = val
    },
    searchParams(val) {
      this.listModelFilter = val;
    },
    position(val) {
        this.custPosition = val;
        console.log("position: ", this.custPosition);
    }
  },
  components: { selectDefineTags, singlesend, sendtanxin, sendemail, Bojilu },
  created() {
    ["id", "city", "county", "create_time",
      "update_time", "wx_head_img_uri", "source"].forEach(key => this.filterEditKey.add(key));
  },
  methods: {
    // tabs 切换样式
    selectStyle(index) {
      this.dtActive = "unactive";
      this.zlActive = "unactive";
      this.picActive = "unactive";
      this.dtShow = false;
      this.zlShow = false;
      this.picShow = false;
      if (index === 1) {
        this.dtActive = "active";
        this.dtShow = true;
        this.editZlShow = false;
      }
      if (index === 2) {
        this.zlActive = "active";
        this.zlShow = true;
      }
      if (index === 3) {
        this.picActive = "active";
        this.picShow = true;
        this.editZlShow = false;
      }
    },
    // 全部动态select显示事件
    showDynamicWayList() {
      this.dynamicWaylist = true;
      event.stopPropagation();
    },
    // 全部动态select选择样式
    selectDynamicWay(text) {
      this.allDTunactive = true;
      this.showDynamicWayDefaultText = text;
      this.dynamicWaylist = false;
      this.pageIndex = 1;
      this.getCustEvent(text);
    },
    //删除自定义标签
    removeTag(event, name) {
      const index = this.customTagList.indexOf(name);
      this.customTagList.splice(index, 1);
      this.$post(this.global.baseUrl + "/pc/cust/addCustTag.action", { custId: this.id, custTag: this.customTagList.join(";") }).then(res => {
        if (res.code === 200) {
          this.$Message.info('删除成功');
          this.$emit('on-addCustTag');
          this.getCustomerDetail();
        }
      })
    },
    // 获取客户信息
    getCustomerDetail() {
      let that = this;
      this.$post(this.global.baseUrl + "/pc/cust/showDetails.action", { id: this.id }).then(res => {
        if (res.code === 200) {
          this.stageList = res.data.stageList;
          this.stageId = res.data.stageId;
          this.stageName = res.data.stageName;

          this.stageList.forEach(function (item, i) {
            if (that.stageId == item.id) {
              that.stageIdIndex = i + 1
            }
          });


          this.hkdwTaglist = res.data.hkdwTaglist;
          this.customTagList = res.data.customTagList;
          this.makingTagList = res.data.makingTagList;
          this.commonAttrList = res.data.commonAttrList;
          this.uncommonAttrList = res.data.uncommonAttrList;
          this.grantMobileStatus = res.data.grantMobileStatus;
          this.grantNameStatus = res.data.grantNameStatus;
          this.callCount = res.data.callCount;
          let name, sex, vip, source, weixin_nice_name, wx_head_img_uri, mobile, email, telephone, province, city, county;
          res.data.commonAttrList.forEach(item => {
            if (item.attrKey === "name") {
              if (this.grantNameStatus == 10) {
                name = "客户" + this.id;
              } else {
                name = item.contentvalue;
              }

            } else if (item.attrKey === "member_level") {
              vip = item.contentvalue
            } else if (item.attrKey === "source") {
              source = item.contentvalue
            } else if (item.attrKey === "weixin_nice_name") {
              weixin_nice_name = item.contentvalue
            } else if (item.attrKey === "wx_head_img_uri") {
              wx_head_img_uri = item.contentvalue
            } else if (item.attrKey === "mobile") {
              if (this.grantMobileStatus == 10) {
                mobile = "已加密"
              } else {
                mobile = item.contentvalue
              }

            } else if (item.attrKey === "email") {
              email = item.contentvalue
            }
            else if (item.attrKey === "province") {
              province = item.contentvalue
            }
            else if (item.attrKey === "city") {
              city = item.contentvalue
            }
            else if (item.attrKey === "county") {
              county = item.contentvalue
            }
            else if (item.attrKey === "sex") {
              sex = item.contentvalue;
            }

          });
          res.data.uncommonAttrList.forEach(item => {
            if (item.attrKey === "sex") {
              sex = item.contentvalue;
            }
            else if (item.attrKey === "telephone") {
              telephone = item.contentvalue;
            }
          });
          this.customerInfo = {
            name: name,
            sex: sex,
            vip: vip,
            source: source,
            weixin_nice_name: weixin_nice_name,
            mobile: mobile,
            email: email,
            telephone: telephone,
            province: province,
            city: city,
            county: county,
            wx_head_img_uri: wx_head_img_uri
          }
        }
      });
      this.$post(this.global.baseUrl + "/pc/cust/selectById.action", { id: this.id }).then(res => {
        if (res.code === 200) {
          this.userList = res.data.userlist;
          res.data.commonAttrList.forEach(item => this.custInfoProc(item));
          res.data.uncommonAttrList.forEach(item => this.custInfoProc(item));
          this.editCommonAttrList = res.data.commonAttrList;
          this.editUncommonAttrList = res.data.uncommonAttrList;
        }
      });
    },
    custInfoProc(item) {
      let val = item.contentvalue;
      if (item.attrType === 'digit') {
        val = Number(val);
      } else if (item.attrType === 'bool') {
        if (!val) {
          val = '否';
        }
      }
      if (item.attrKey === "stage_id") {
        val = Number(val);
      } else if (item.attrKey === "user_name") {
        val = Number(val);
      }
      item.contentvalue = val;
      if (item.attrKey === 'province') {
        this.custProvince[0] = item.contentvalue;
      } else if (item.attrKey === 'city') {
        this.custProvince[1] = item.contentvalue;
      } else if (item.attrKey === 'county') {
        this.custProvince[2] = item.contentvalue;
      }
    },
    // 30天活跃度接口
    getLiveness() {
      this.$post(this.global.baseUrl + "/pc/cust/getLiveness.action", { custId: this.id }).then(res => {
        if (res.code === 200) {
          this.thirtyLiveness = res.data.thirtyLiveness;
        }
      })
    },
    contactTime() {
      // 未和客户接触天数
      this.$post(this.global.baseUrl + "/pc/cust/contactTime.action", { custId: this.id }).then(res => {
        if (res.code === 200) {
          this.noCommuniteWithCustomer = res.data.day;
        }
      })
    },
    // 聊天记录
    getCustEvent(eventFrom) {
      if (eventFrom == "请选择") {
        eventFrom = ""
      }
      this.$post(this.global.baseUrl + "/pc/cust/getNewCustEvent.action", { custId: this.id, eventFrom: eventFrom, pageIndex: this.pageIndex, pageSize: 20 }).then(res => {
        if (res.code === 200) {
          if (this.pageIndex == 1) {
            this.eventByTimeGroup = res.data.eventByTimeGroup.list
          } else {
            res.data.eventByTimeGroup.list.forEach(value => {
              this.eventByTimeGroup.push(value);
            });
          }

        }
      })
    },
    // 上一个,下一个
    prevUserInfo(index) {
      if (index === 1) {
          this.custPosition = this.custPosition + 1;
      } else {
          this.custPosition = this.custPosition - 1;
      }
      if (this.custPosition < 1) {
          this.$Message.info('没有上一个');
          this.custPosition = this.custPosition + 1;
          return;
      }
      this.listModelFilter.position = this.custPosition;
      this.spinShow = true;
      this.$post(this.global.baseUrl + "/pc/cust/upOrNext.action", this.listModelFilter).then(res => {
        if (res.code === 200) {
          if (res.data == null) {
            if (index == 1) {
              this.$Message.info('没有下一个');
              this.custPosition = this.custPosition - 1;
            } else {
              this.$Message.info('没有上一个');
            }
          } else {
            this.pageIndex = 1;
            this.eventByTimeGroup = [];
            this.id = res.data.custId;
            this.getLiveness();
            this.contactTime();
            this.getCustEvent();
            this.getCustomerDetail();
          }
          this.spinShow = false;

        }
      })
    },
    // 添加互动行为
    addInteraction(text) {
      if (text.length > 500) {
        this.$Message.info('最多只能输入500字');
        return false;
      }
      this.$post(this.global.baseUrl + "/pc/cust/addEvent.action", { custId: this.id, eventCd: 'add_record', remark: text }).then(res => {
        if (res.code === 200) {
          this.getCustEvent();
          this.textareaData = "";
          this.$Message.info('动态添加成功');
        }
      })
    },
    // 点击更多
    uncommonAttrListShowEvent() {
      if (this.custInfoMore == "更多") {
        this.custInfoMore = "收起"
        this.uncommonAttrListShow = true;
      } else {
        this.custInfoMore = "更多"
        this.uncommonAttrListShow = false;
      }
    },
    // 编辑点击更多
    uncommonAttrEditListShowEvent() {
      if (this.editCustInfoMore == "更多") {
        this.editCustInfoMore = "收起"
        this.uncommonAttrEditListShow = true;
      } else {
        this.editCustInfoMore = "更多"
        this.uncommonAttrEditListShow = false;
      }
    },
    //编辑资料
    customerInfoEditEdit() {
      this.editZlShow = true;
      this.zlShow = false;
      this.getCustomerDetail();
    },
    // 处理城市地区选择
    handleProvinceChange() {
      if (this.custProvince[0]) {
        this.updateData.province = this.custProvince[0];
      }
      if (this.custProvince[1]) {
        this.updateData.city = this.custProvince[1];
      }
      if (this.custProvince[2]) {
        this.updateData.county = this.custProvince[2];
      }
    },
    // 编辑资料保存
    custInfoUpdate() {
      this.updateData['id'] = this.id;
      this.saveDataProccess(this.editCommonAttrList);
      this.saveDataProccess(this.editUncommonAttrList);
      this.handleProvinceChange();
      this.$Spin.show();
      this.$post(this.global.baseUrl + "/pc/cust/update.action", this.updateData).then(res => {
        if (res.code === 200) {
          this.getCustomerDetail();
        }
        this.editZlShow = false;
        this.zlShow = true;
        this.$Spin.hide();
      })
    },
    // 保存数据预处理
    saveDataProccess(list) {
      list.forEach(item => this.updateData[item.attrKey] = item.contentvalue);
    },
    // 客户微信头像处理
    customerLargeHead(wx_head_img_uri) {
      if (wx_head_img_uri) {
        return wx_head_img_uri;
      } else {
        return this.defaultUserHead;
      }
    },
    // 客户头像处理
    customerHead(wxHeadImgUri) {
      if (wxHeadImgUri) {
        return wxHeadImgUri;
      } else {
        return this.defaultUserHead;
      }
    },
    // 用户头像处理
    userHead(headName) {
      if (headName) {
        return "/images/userHead/" + headName;
      } else {
        return this.UserDefaultHead
      }
    },
    // 新增自定义标签点击事件
    addDefinedTag() {
      // this.sendTags = this.customTagList;
      this.selectDefineTagsShow = true;
    },
    // 添加标签子组件确定按钮事件
    submitTag(params) {
      this.selectDefineTagsShow = false;
      this.customTagList = params.selectDefineTags;
      var tagData = {
        custTag: params.selectDefineTags.join(";"),
        custId: this.id
      };
      this.$post(this.global.baseUrl + "/pc/cust/addCustTag.action", tagData).then(res => {
        if (res.code === 200) {
          this.getCustomerDetail();
          this.$Message.info('自定义标签添加成功');
          this.$emit('on-addCustTag');
        }
      })
    },
    // 取消添加标签面板
    cancelAddTag() {
      this.selectDefineTagsShow = false;
    },

    // 阶段点击事件
    stageClickEvent(stageId, status) {
      let dataId, $i;
      if (status == 1) {
        dataId = stageId;
      } else {
        this.stageList.forEach(function (item, i) {
          if (item.id == stageId) {
            $i = i - 1;
          }
        })
        dataId = this.stageList[$i]["id"];
      }

      var stageData = {
        stageId: dataId,
        id: this.id
      }

      this.$post(this.global.baseUrl + "/pc/cust/updateStage.action", stageData).then(res => {
        if (res.code === 200) {
          this.getCustomerDetail();
          this.$Message.info('销售阶段更新成功');
        }
      })

    },
    // 动态加载聊天记录
    handleReachBottom() {
      return new Promise(resolve => {
        setTimeout(() => {
          const last = this.eventByTimeGroup[this.eventByTimeGroup.length - 1];
          this.pageIndex = this.pageIndex + 1;
          this.getCustEvent(this.showDynamicWayDefaultText);
          resolve();
        }, 1000);
      });
    },
    // 点击全部动态
    getAllRecord() {
      this.allDTunactive = false;
      this.showDynamicWayDefaultText = "请选择"
      this.dynamicWaylist = false;
      this.pageIndex = 1;
      this.getCustEvent();
    },
    // 沟通方式点击
    callPageShowEvent(id, k, val) {
      if (k == 0 || k == 1) {
        this.callTimeoutModel = true;
        this.callTimeNum = 3;
        this.$post(this.global.baseUrl + "/pc/eventCall/callPhone.action", { custId: id, custMobile: val, isTelephone: k }).then(res => {
          if (res.code === 200) {
            this.callModelData = res.data;
            console.log(res.data)
          }
        })
        this.t_callback();
      }
      if (val) {

        // 短信
        if (k == 2) {
          this.sendmessageShow = true;
        }
        // 弹信
        if (k == 3) {
          this.sendtanxinShow = true;
        }
        // 邮件
        if (k == 4) {
          console.log(k)
          this.sendemailShow = true;
        }
        // 微信加好友
        if (k == 5) {
          this.addFShow = true;
        }

      }

    },
    t_callback() {
      setTimeout(() => {
        if (this.callTimeNum == 1) {
          this.callTimeoutModel = false;
          this.callModelShow = true;
        } else {
          this.callTimeNum = this.callTimeNum - 1
          this.t_callback();
        }
      }, 1000);
    },
    // 关闭打电话model
    cancelSureModel() {
      this.openMobileShow = false;
      this.callModelShow = false;
      this.sendmessageShow = false;
      this.sendtanxinShow = false;
      this.sendemailShow = false;
      this.wxLoginShow = false;
    },
    sendSureModel() {
      this.openMobileShow = false;
      this.callModelShow = false;
      this.sendmessageShow = false;
      this.sendtanxinShow = false;
      this.sendemailShow = false;
      this.wxLoginShow = false;
    },

    sureDeleteTag() {

    },
    cancelDeleteTag() {
      this.$Message.info('Clicked cancel');
    },
    //单个客户添加好友
    wxLoginFinish(params) {
      this.sessionId = params;
      this.addFShow = true
    },
    cancelAddFridens() {
      this.wxLoginShow = false;
      this.addFShow = false;
    },
    forDTmenu() {
      this.dynamicWaylist = false;
    },
    custGroupEvent() {
      this.$post(this.global.baseUrl + "/pc/cust/custGroup.action", { 'custId': this.id }).then(res => {
        if (res.code === 200) {
          this.groupTagArrayData = res.data.groupList
        }
      })
    },
    backUpdate() {
      this.zlShow = true;
      this.editZlShow = false;
      this.uncommonAttrListShow = false;
      this.uncommonAttrEditListShow = false;
    },

    addFridens(params) {
      this.wxLoginShow = true;
      this.addFShow = false;
      this.AddWechatparams.logoutOnFinish = params.exit;
      this.AddWechatparams.isSelAll = params.isSelAll;
      this.AddWechatparams.helloMessage = params.helloMessage;
    },
    //单个加好友
    addWechatF(data) {
      this.wxLoginShow = false;
      this.AddWechatparams.commonId = data;
      this.AddWechatparams.custIds = this.id;
      this.$post(this.global.baseUrl + "/pc/wechatFriend/newAddWechatFriends.action", this.AddWechatparams).then(res => {
        if (res.code == 200) {
          this.$Message.success(res.msg);
        }
      });
    },
    callModelHide() {
      this.callModelShow = false;
      this.openMobileShow = true; //展开拨打记录按钮
    },
    // 点击展开拨打记录
    openMobileEvent() {
      console.log(this.callModelShow)
      this.openMobileShow = false; //展开拨打记录按钮
      this.callModelShow = true; //拨打model
    }
  }
}
</script>


