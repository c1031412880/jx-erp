<template>
  <el-dialog
    :visible="dialogBool"
    :before-close="dialogClose"
    center
    fullscreen>
    <tr-page-header ref="trPageHeader" slot="title" content="日程详情" @back="dialogClose"></tr-page-header>
    <div class="content-div">
      <div class="content-top">
        <div class="content-title item-content">
          <h1>{{form.title}}</h1>
          <el-tag v-show="form.state === 1" effect="plain" type="">未开始</el-tag>
          <el-tag v-show="form.state === 2" effect="plain" type="warning">进行中</el-tag>
          <el-tag v-show="form.state === 3" effect="plain" type="danger">已结束</el-tag>
        </div>
        <div class="content-auth item-content">
          <p style="margin-right: 20px;">{{form.created_date}}</p>
          <p>{{form.look_power == 310 ? '仅自己可见' : form.look_power == 320 ? '参与人员可见' : ''}}</p>
        </div>
        <div class="content-users item-content">
          <el-button @click="openUsersView" type="text" style="padding: 0">{{form.play_user_name}}共{{form.players.length}}人</el-button><i class="el-icon-arrow-right"></i><i style="margin-left: -5px" class="el-icon-arrow-right"></i>
        </div>
        <div class="content-time item-content">
          <p><span>时间：</span>{{form.start_time}} ~ {{form.end_time}}</p>
        </div>
        <div class="content-type item-content">
          <p><span>日程重复：</span><span>{{setRepeatType(this.form.repeat_type)}}</span></p>
        </div>
        <div class="content-address item-content">
          <p><span>地点：</span><span>{{form.address}}</span></p>
        </div>
        <div class="content-detail item-content">
          <p><span>详情：</span><span>{{form.detail}}</span></p>
        </div>
        <div class="content-rule item-content">
          <p><span>提醒规则：</span><span>{{getReminderRule()}}</span></p>
        </div>
        <div class="content-record item-content">
          <div style="height:16px;width:8px;background-color:#169BD5;margin: 0 5px 0 0;"></div>
          <p>日程记录</p>
        </div>
        <div class="content-box">
          <el-tabs  v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="日程记录" name="first">
              <div v-if="form.changes.length">
                <div class="content-tab" v-for="item in form.changes" :key="item.id">
                  <div v-if="item.type == 2" class="commend-left">
                    <p>{{item.user_name}}添加评论</p>
                    <p>{{item.content}}</p>
                  </div>
                  <p v-else>{{item.content}}</p>
                  <p>{{item.create_time}}</p>
                </div>
              </div>
              <el-empty v-else :image-size="120" description="暂无数据"></el-empty>
            </el-tab-pane>
            <el-tab-pane label="评论" name="second">
              <div v-if="commendData.length">
                <div class="content-tab" v-for="(item, index) in commendData" :key="index">
                  <div class="commend-left">
                    <p>{{item.user_name}}添加评论</p>
                    <p>{{item.content}}</p>
                  </div>
                  <p>{{item.create_time}}</p>
                </div>
              </div>
              <el-empty v-else :image-size="120" description="暂无数据"></el-empty>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div class="content-bottom">
        <div class="content-bottom-left">
          <div v-show="isShow" @click="addCommendVisible=true">
            <i class="el-icon-chat-dot-square"></i>
            <span>评论</span>
          </div>
        </div>
        <div class="content-bottom-right">
          <el-select v-model="state" @change="changeSelectState" size="small" style="width:90px;margin-right:10px;" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-button @click="updateScheduleInfo" v-show="form.created_id == user_id" type="primary" size="small" plain>编 辑</el-button>
          <el-button @click="delRowInfo" v-show="form.created_id == user_id" type="danger" size="small" plain>删除</el-button>
        </div>
      </div>
    </div>


    <div class="dialog-div">
      <commend-dialog 
        ref="addCommend" 
        @save-add="saveAddCommend"
        :dialogBool.sync="addCommendVisible">
      </commend-dialog>
      <users-dialog 
        ref="usersDialog" 
        :data="form.players"
        :dialogBool.sync="usersListVisible">
      </users-dialog>
      <add-schedule-event 
        ref="scheduleEvent"
        :title="'编辑日程'"
        @save-add-edit="saveScheduleEvent"
        :dialogBool.sync="addScheduleEventVisible">
      </add-schedule-event>
      <el-dialog
        title="编辑日程或计划"
        :visible.sync="dialogVisible"
        width="300px"
        append-to-body>
        <el-form :model="baseForm">
          <el-form-item prop="type">
            <el-radio v-model="baseForm.type" :label="1">编辑本次日程</el-radio>
            <el-radio v-model="baseForm.type" :label="2">编辑计划</el-radio>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="updatePlaybill('form')">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import { getUser } from "@/utils/auth";
import commendDialog from "./commend-dialog"
import usersDialog from "./users-dialog"
import addScheduleEvent from "./add-schedule-event"
export default {
  components: {
    commendDialog,
    usersDialog,
    addScheduleEvent
  },
  props: {
    dialogBool: Boolean,
    user_id: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      activeName: 'first',
      form: {
        players: [],
        changes: [],
        remind_rule: [],
        remind_type: []
      },
      commendData: [],
      state: '',
      addCommendVisible: false,
      usersListVisible: false,
      addScheduleEventVisible: false,
      dialogVisible: false,
      baseForm: {
        id: '',
        type: 1
      },
      isShow: false,
      selectRow: {},
      options:[
        {value: 1, label: '已接收'},
        {value: 2, label: '拒绝'},
        {value: 3, label: '暂定'},
      ],
      remindList: {
        410: '不提醒',
        420: '开始时',
        430: '开始前5分钟',
        440: '开始前15分钟',
        450: '开始前30分钟',
        460: '开始前1小时',
        470: '开始前2小时',
        480: '开始前1天',
        490: '开始前2天',
        510: 'WEB端提醒',
        520: 'APP提醒',
        530: '小程序提醒',
      }
    }
  },
  mounted() {
    
  },
  watch: {
    dialogBool(bool) {
      if (!bool) {
        Object.assign(this.$data.form, this.$options.data().form);
        Object.assign(this.$data, this.$options.data());
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    handleClick(tab, event) {
      
    },
    // 详情回显
    setData(info) {
      this.form = Object.assign({}, info)
      if(info.changes && info.changes.length) {
        this.commendData = info.changes.filter(item => {
          return item.type === 2 
        })
      }
      let my = info.players.filter(item => {
        return item.user_id == this.user_id
      })
      console.log(my);
      this.isShow = true
      this.state = !!my && my.length ? my[0].state : ''
    },
    // 提醒规则字符串组装
    getReminderRule() {
      let text = ''
      this.form.remind_rule.forEach((item, index) => {
        let str = index == (this.form.remind_rule.length - 1) ? this.remindList[item] : this.remindList[item] + '、'
        text += str
      })
      text+= ';'
      this.form.remind_type.forEach((item,index) => {
        let str = index == (this.form.remind_type.length - 1) ? this.remindList[item] : this.remindList[item] + '、'
        text += str
      })
      return text
    },
    // 回显日程重复
    setRepeatType(val) {
      let str = '' 
      if(val == 210) {
        str = '一次性事件'
      }else if(val == 220) {
        str = '每' + this.form.day_count + '天'
      }else if(val == 230) {
        str = '每' + this.form.week_count + '周（周' + this.form.i_week_day + ')'
      }else if(val == 240) {
        str = '每' + this.form.week_count + '月（第' + this.form.month_day + '天)'
      }else if(val == 250) {
        str = '每' + this.form.year_count + '年'
      }
      return str
    },
    // 保存评论
    saveAddCommend(form) {
      let params = {context: {}}
      params.context = form
      // let userInfo = JSON.parse(getUser());
      params.context.user_id = this.user_id
      params.context.schedule_id = this.form.id
      this.$client.AddScheduleCommentScheduleManage(params)
        .then(res => { 
          if (res.head.result == "200") {
            this.addCommendVisible = false
            this.getScheduleManage()
            this.$emit('on-commit')
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch(err => {
          this.$message({
            showClose: true,
            message: err.body.describle,
            type: "error",
          });
        })
    },
    // 删除日程
    delRowInfo() {
      this.$parent.$parent.deleteSchedule(this.form)
      this.dialogClose()
    },
    // 更改日程状态
    changeSelectState(val) {
      // if(val == 1) return false
      let params = {context: {}}
      params.context.schedule_id = this.form.id
      params.context.state = val
      params.context.user_id = this.user_id
      this.$client.UpdateScheduleManage(params)
        .then(res => { 
          if (res.head.result == "200") {
            this.getScheduleManage()
            this.$emit('on-commit')
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "success",
            });
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch(err => {
          // console.log(err);
          this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
    },
    // 根据id获取指定日程 
    getScheduleManage() {
      this.$client.GetScheduleByIDScheduleManage({id: this.form.id, type: 1})
        .then(res => { 
          if (res.head.result == "200") {
            this.form = res.context
            if(this.form.changes.length) {
              this.commendData = this.form.changes.filter(item => {
                return item.type === 2 
              })
            }
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch(err => {
          // console.log(err);
          this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
    },
    // 打开参会人员列表
    openUsersView() {
      this.usersListVisible = true
    },
    // 编辑日程
    updateScheduleInfo() {
      this.selectRow = Object.assign({}, this.form)
      if(this.form.repeat_type == 210) {
        this.baseForm.type = 1
        this.updatePlaybill()
      }else {
        this.dialogVisible = true
      }

      // this.addScheduleEventVisible = true
      // let info = Object.assign({}, this.form)
      // this.$refs['scheduleEvent'].setData(info)
    },
    updatePlaybill() {
      this.baseForm.id = this.baseForm.type == 1 ? this.selectRow.id : this.selectRow.plan_id
      let params = Object.assign({}, this.baseForm)
      this.$client.GetScheduleByIDScheduleManage(params)
        .then(res => { 
          if (res.head.result == "200") {
            let info = Object.assign({}, res.context)
            // this.addEventTitle = '编辑日程'
            this.addScheduleEventVisible = true
            this.$refs['scheduleEvent'].setData(info)
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch(err => {
          console.log(err);
          this.$message({
            showClose: true,
            message: err.body.describle,
            type: "error",
          });
        })
    },
    // 保存创建日程
    saveScheduleEvent(form) {
      let httpObj = {
        1: 'AddScheduleManage',
        2: 'EditScheduleManage'
      }
      let params = {context: {}}
      params.context = form
      this.$client[httpObj[this.baseForm.type]](params)
        .then(res => { 
          this.dialogVisible = false
          if (res.head.result == "200") {
            this.addScheduleEventVisible = false
            this.getScheduleManage()
            this.$emit('on-commit')
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch(err => {
          // console.log(err);
          this.$message({
            showClose: true,
            message: err.body.describle,
            type: "error",
          });
        })
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
/deep/ .el-dialog__body {
  background-color: #F2F2F2;
  height: calc(100% - 57px);
  padding-bottom: 0;
}
/deep/ .el-dialog__header {
  // background-color: #F2F2F2;
}
.content-div {
  width: 880px;
  height: 100%;
  border-radius: 6px;
  margin: 0 auto;
  .content-top {
    padding: 10px 20px;
    height: calc(100% - 70px);
    background-color: #ffffff;
    overflow-y: auto;
    .item-content {
      margin-bottom: 10px;
      line-height: 24px;
      span:first-child {
        color: #000000;
      }
    }
    .content-auth {
      display: flex;
      align-items: center;
    }
    .content-users {
      color:#409EFF;
      display: flex;
      align-items: center;
    }
    .content-detail {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;/*省略几行写几*/
      -webkit-box-orient: vertical;
    }
    .content-record {
      margin: 20px 0 0;
      display: flex;
      align-items: center;
    }
    .content-box {
      width: 100%;
      .content-tab {
        display: flex;
        align-items: center;
        justify-content: space-between
        padding: 5px 0;
        line-height: 24px;
        p:first-child {
          color: #333333;
          font-weight: 400;
          font-size: 14px;
        }
        p:last-child {
          color: #999999;
          font-size: 14px;
        }
      }
    }
    /deep/ .el-tabs {
      width: 100%;
    }
    /deep/ .el-tabs__content {
      min-height: 360px;
      overflow-y: auto;
    }
  }
  .content-bottom {
    width: 880px;
    height: 60px;
    padding: 0 20px;
    background-color: #ffffff;
    position: fixed;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .content-bottom-left > div {
      display: flex;
      flex-direction: column;
      &:hover {
        color: #409EFF;
        cursor: pointer;
      }
      i {
        font-size: 22px;
      }
      span {
        font-size: 12px;
        font-weight: 400;
        color: #333333;
      }
    }
  }
}


</style>