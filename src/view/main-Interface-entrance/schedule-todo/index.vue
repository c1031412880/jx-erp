<template>
  <el-card class="schedule-todo" :body-style="{padding: '0px'}">
    <div slot="header" class="clearfix">
      <span>日程待办</span>
      <el-button type="text"><i class="el-icon-bell" style="margin-right: 5px;"></i>日程消息</el-button>
    </div>
    <div class="content-box">
      <el-card class="content-left">
        <div slot="header" class="clearfix">
          <span>我的日程</span>
          <el-button @click="openAddScheduleEvent" type="text"><i class="el-icon-plus" style="margin-right: 5px;"></i>新建事件</el-button>
        </div>
        <div class="btn-box">
          <el-button @click="addScheduleTypeVisible = true" type="primary" size="mini">添加</el-button>
          <el-button @click="editScheduleType" type="primary" size="mini">编辑</el-button>
          <el-popover
            placement="bottom"
            title="操作确认"
            width="400"
            v-model="visible1">
            <div class="show-flex-box-r" style="">
              <span style="margin-right: 10px; color: #FF9900;" class="show-flex-box-r">
                <i class="el-icon-question" style="font-size: 25px;"></i>
              </span>
              <div class="show-flex-box-c">
                <p style="font-size: 18px; margin-bottom: 5px;">该类型下共关联了{{selectCheckedTree.count}}个日程。</p> 
                <!-- //是否确定删除？ 确定后 -->
                <span style="color:#F56C6C">是否确定删除？</span>
              </div>
            </div>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="visible1 = false">取消</el-button>
              <el-button type="primary" size="mini" @click="suerDeleteScheduleType()">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" size="mini" style="margin-left: 10px;">删除</el-button>
          </el-popover>
        </div>
        <schedule-type-tree ref="typeTree" @on-tree="selectTreeNode"></schedule-type-tree>
      </el-card>
      <div class="content-right" v-if="!isFilter">
        <div class="radio-box">
          <el-radio-group v-model="radio" @change="changeSelectType" size="mini">
            <el-radio-button label="month">月</el-radio-button>
            <el-radio-button label="week">周</el-radio-button>
            <el-radio-button label="today">日</el-radio-button>
          </el-radio-group>
        </div>
        <div class="filter-box">
          <el-input v-model="title" @focus="isFilter = true" size="mini" placeholder="请输入关键字"></el-input>
        </div>
        <el-calendar v-if="radio == 'month'" v-model="value" ref="monthCalendar" id="monthCalendar">
            <template
              slot="dateCell"
              slot-scope="{date, data}">
              <div class="day-schedule">
                <p style="text-align: right;">{{data.day.slice(-2)}}</p>
                <div style="overflow: hidden;width: 100%;height: calc(100% - 16px);" v-if="monthData[data.day]">
                  <div class="content-schedule" :style="{'height': (monthData[data.day] && monthData[data.day].length > 3) ? 'calc(100% - 26px)' :  '100%'}">
                    <div v-for="item in ((monthData[data.day] && monthData[data.day].length > 3) ? monthData[data.day].slice(0, 2) : monthData[data.day])" :key="item.id">
                      <el-popover
                        placement="left"
                        width="360"
                        :ref="refNamePopover+item.id">
                        <div class="second-popover">
                          <div style="display: flex;align-items: center;">
                            <div style="height: 14px; width: 8px; background-color:#169BD5;margin-right:10px;"></div>
                            <p>{{item.title}}</p>
                          </div>
                          <p><span>时间：</span><span>{{item.start_time + '~' + item.end_time}}</span></p>
                          <p><span>人员：</span><span>{{item.play_user_name}}</span></p>
                          <p><span>地点：</span><span>{{item.address}}</span></p>
                          <p><span>内容：</span><span>{{item.detail}}</span></p>
                        </div>
                        <div style="text-align: right; margin: 0">
                          <el-button @click="openScheduleDetail(item)" type="" size="mini" plain>查看详情</el-button>
                          <el-button @click="updateScheduleInfo(item)" v-show="item.created_id == user_id" type="primary" size="mini" plain>编辑</el-button>
                          <el-popconfirm
                            @confirm="deleteSchedule(item)"
                            title="确认删除?">
                            <el-button v-show="item.created_id == user_id" type="danger" size="mini" slot="reference" plain>删除</el-button>
                          </el-popconfirm>
                        </div>
                        <div slot="reference" class="second-title">
                          <div :style="{'width':'6px','height':'6px','border-radius': '50%','background-color': !!item.color ? item.color : '#030303','flex-shrink': 0,}"></div>
                          <p :style="{'text-decoration': item.state == 3 ? 'line-through' : 'blink'}">{{item.title}}</p>
                        </div>
                      </el-popover>
                    </div>
                  </div>
                    
                  <el-popover
                    width="360"
                    placement="left"
                    v-if="!!monthData[data.day] && monthData[data.day].length > 3"
                    trigger="click">
                      <div class="three-popover">
                        <div v-for="sing in monthData[data.day].slice(2)" :key="sing.id">
                          <el-popover
                            placement="left"
                            width="360"
                            :ref="refNamePopover+sing.id">
                            <div class="four-popover">
                              <div style="display: flex;align-items: center;">
                                <div style="height: 18px; width: 8px; background-color:#169BD5;margin-right:10px;"></div>
                                <p>{{sing.title}}</p>
                              </div>
                              <p><span>时间：</span><span>{{sing.start_time + '~' + sing.end_time}}</span></p>
                              <p><span>人员：</span><span>{{sing.play_user_name}}</span></p>
                              <p><span>地点：</span><span>{{sing.address}}</span></p>
                              <p><span>内容：</span><span>{{sing.detail}}</span></p>
                            </div>
                            <div style="text-align: right; margin: 0">
                              <el-button @click="openScheduleDetail(sing)" type="" size="mini" plain>查看详情</el-button>
                              <el-button @click="updateScheduleInfo(sing)" v-show="sing.created_id == user_id" type="primary" size="mini" plain>编辑</el-button>
                              <el-popconfirm
                                @confirm="deleteSchedule(sing)"
                                v-show="sing.created_id == user_id"
                                title="确认删除?">
                                <el-button type="danger" size="mini" slot="reference" plain>删除</el-button>
                              </el-popconfirm>
                            </div>
                            <div class="four-title" slot="reference">
                              <div :style="{'width':'6px','height':'6px','border-radius': '50%','background-color': !!sing.color ? sing.color : '#030303','flex-shrink': 0,}"></div>
                              <p :style="{'text-decoration': sing.state == 3 ? 'line-through' : 'blink'}">{{sing.title}}</p>
                            </div>
                          </el-popover>
                        </div>
                      </div>
                      <div slot="reference" class="three-title">
                        <span>查看更多</span><i class="el-icon-arrow-right"></i><i style="margin-left: -5px" class="el-icon-arrow-right"></i>
                      </div>
                  </el-popover>
                </div>
              </div>
            </template>
        </el-calendar>
        <week-list 
          v-else 
          ref="weekList" 
          :value="value" 
          :curSelectType="radio"
          @on-set="val => value = val"
          @update-tree="updateScheduleTypeTree"
          :schedule_type="monthForm.schedule_type"
          :schedule_title="monthForm.schedule_title"></week-list>
        <!-- <day-list v-if="radio == 'day'" ref="dayList" :value="value"></day-list> -->
      </div>
      <schedule-list 
        v-else 
        ref="scheduleList"
        :type="radio"
        :value="value"
        :schedule_type="monthForm.schedule_type"
        @on-back="isFilter = false"></schedule-list>
    </div>


    <div class="dialog-div">
      <add-schedule-event 
        ref="scheduleEvent"
        :title="addEventTitle"
        @save-add-edit="saveScheduleEvent"
        :dialogBool.sync="addScheduleEventVisible">
      </add-schedule-event>
      <add-schedule-type 
        ref="scheduleType" 
        @save-add-edit="saveScheduleType"
        :dialogBool.sync="addScheduleTypeVisible">
      </add-schedule-type>
      <schedule-detail-dialog 
        ref="scheduleDetail" 
        :user_id="user_id"
        @on-commit="getScheduleData"
        :dialogBool.sync="scheduleDetailVisible">
        <!-- @save-add-edit="saveScheduleType" -->
      </schedule-detail-dialog>
      <el-dialog
        title="编辑日程或计划"
        :visible.sync="dialogVisible"
        width="300px">
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
      <el-dialog
        title="删除日程或计划"
        :visible.sync="delVisible"
        width="300px">
        <el-form :model="delForm">
          <el-form-item prop="type">
            <el-radio v-model="delForm.type" :label="1">删除本次日程</el-radio>
            <el-radio v-model="delForm.type" :label="2">删除计划</el-radio>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="delVisible = false">取 消</el-button>
          <el-button type="primary" @click="deleteComment('form')">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </el-card>
</template>

<script type="text/ecmascript-6">
import {getDate, formatTime, getWeekDataList} from '@/utils/index'
import { getUser } from "@/utils/auth";
import weekList from "./component/week-list"
import scheduleList from "./component/schedule-list"
// import dayList from "./component/day-list"
import scheduleTypeTree from "./component/schedule-type-tree"
import addScheduleEvent from "./component/add-schedule-event"
import addScheduleType from "./component/add-schedule-type"
import scheduleDetailDialog from "./component/schedule-detail-dialog"
export default {
  name: 'schedule-todo',
  components: {
    // dayList,
    weekList,
    scheduleList,
    scheduleTypeTree,
    addScheduleEvent,
    addScheduleType,
    scheduleDetailDialog
  },
  data() {
    return {
      user_id: 0,
      addEventTitle: '添加日程',
      visible1: false,
      visible3: false,
      refNamePopover: 'popover-', // popover ref名称前缀
      loading:false,
      addScheduleEventVisible: false,
      addScheduleTypeVisible: false,
      value: new Date(),
      radio: 'month',
      title: '',
      selectCheckedTree: {},
      monthForm: {
        start_time: '',
        end_time: '',
        schedule_type: '',
        schedule_title: '',
      },
      monthData: {},
      scheduleDetailVisible: false,
      isFilter: false,
      id: 0,
      dialogVisible: false,
      baseForm: {
        id: '',
        type: 1
      },
      selectRow: {},
      delVisible: false,
      delForm: {
        type: 1
      }
    }
  },
  watch: {
    radio(val) {
      console.log(val);
      if(val === 'month') {
        this.changeSelectMonth()
      }
    }
  },
  activated () {
    let ids = this.$route.params.ids
    this.id = !!ids ? ids : 0
    this.getScheduleData(true)
  },
  mounted() {
    let ids = this.$route.params.ids
    this.id = !!ids ? ids : 0
    let userInfo = JSON.parse(getUser());
    this.user_id = Number(userInfo.user_id)
    this.setDateTime()
    this.$nextTick(() => {
      // 点击前一个月
      let prevBtn = document.querySelector(`#monthCalendar .el-calendar__button-group .el-button-group>button:nth-child(1)`);
      prevBtn.addEventListener('click', () => {
        this.changeSelectMonth()
      });

      //点击下一个月
      let nextBtn = document.querySelector(`#monthCalendar .el-calendar__button-group .el-button-group>button:nth-child(3)`);
      nextBtn.addEventListener('click', () => {
        this.changeSelectMonth()
      });

      //点击今天
      let todayBtn = document.querySelector(`#monthCalendar .el-calendar__button-group .el-button-group>button:nth-child(2)`);
      todayBtn.addEventListener('click', () => {
        this.changeSelectMonth()
      });
    });
  },
  methods: {
    // 初始化时间
    setDateTime() {
      let time = getDate('thisMonth');
      this.monthForm.start_time = time.startTime
      this.monthForm.end_time = time.endTime + ' 23:59:59'
    },
    // 切换月份
    changeSelectMonth() {
      let year = this.value.getFullYear()
      let month = this.value.getMonth() + 1
      let lastDay = new Date(year, month, 0)
      this.monthForm.start_time = year + '-' + month + '-01'
      this.monthForm.end_time = formatTime(lastDay) + ' 23:59:59'
      this.getScheduleData()
      // console.log(this.value,formatTime(this.value), year, month, lastDay, this.monthForm);
    },
    // 编辑日程类型
    editScheduleType() {
      if(!this.selectCheckedTree || !this.selectCheckedTree.id) {
        this.$message.error('请选择日程分类进行编辑。')
        return false
      }
      let info = Object.assign({}, this.selectCheckedTree)
      this.$refs.scheduleType.setData(info)
      this.addScheduleTypeVisible = true
    },
    // 保存日程代办类型
    saveScheduleType(form) {
      let params = {context: {}}
      params.context = form
      // let userInfo = JSON.parse(getUser());
      params.context.user_id = this.user_id
      this.$client.AddTypeScheduleManage(params)
        .then(res => { 
          if (res.head.result == "200") {
            this.addScheduleTypeVisible = false
            this.$refs.typeTree.getScheduleTypeList()
            this.$refs.scheduleEvent.getScheduleTypeList()
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
    // 删除待办类型
    suerDeleteScheduleType() {
      if(!this.selectCheckedTree || !this.selectCheckedTree.id) {
        this.$message.error('全部分类不能删除，请您选择日程分类进行删除。')
        return false
      }
      let params = {}
      params.context = this.selectCheckedTree.id
      this.$client.DelTypeScheduleManage(params)
        .then(res => { 
          this.visible1 = false
          if (res.head.result == "200") {
            this.$refs.typeTree.getScheduleTypeList()
            this.$refs.scheduleEvent.getScheduleTypeList()
            this.$message({
              showClose: true,
              message: '删除成功',
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
          this.visible1= false
          this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
    },  
    // 选中树节点
    selectTreeNode(data) {
      this.selectCheckedTree = Object.assign({}, data)
      this.monthForm.schedule_type = data.id
      if(this.radio == 'month') {
        this.getScheduleData()
      }else if(this.radio == 'week' || this.radio == 'today') {
        this.$refs.weekList.loadData()
      }else if(this.isFilter) {
        this.$refs.scheduleList.loadData()
      }
    },
    // 获取月日程信息
    getScheduleData() {
      let params = {context: {}}
      params.context = this.monthForm
      if(this.id) {
        params.context.id = this.id
      }
      this.$client.GetUserScheduleScheduleManage(params)
        .then(res => { 
          if(!!this.id)  this.id = 0
          if (res.head.result == "200") {
            this.monthData = res.context
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
    openAddScheduleEvent() {
      this.addEventTitle = '添加日程'
      this.baseForm.type = 1
      this.addScheduleEventVisible = true
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
            this.$refs.typeTree.getScheduleTypeList()
            this.getScheduleData()
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
    // 删除
    deleteSchedule(row) {
      if(row.repeat_type == 210) {
        let params = {context: row.id}
        this.$client.DelScheduleManage(params)
          .then(res => { 
            if (res.head.result == "200") {
              this.closeRefPopover(row.id)
              this.getScheduleData()
              this.$message({
                showClose: true,
                message: '删除成功',
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
            this.$message({
              showClose: true,
              message: err.body.message,
              type: "error",
            });
          })
      }else {
        this.delForm.type = 1
        this.selectRow = Object.assign({}, row)
        this.delVisible = true
      }
    },
    // 删除日程
    deleteComment() {
      let delHttp = {
        1: 'DelScheduleManage',
        2: 'DelPlanScheduleManage',
      }
      let params = {context: this.delForm.type == 1 ? this.selectRow.id : this.selectRow.plan_id}
      this.$client[delHttp[this.delForm.type]](params)
        .then(res => { 
          this.delVisible = false
          if (res.head.result == "200") {
            this.closeRefPopover(this.selectRow.id)
            this.getScheduleData()
            this.$refs.typeTree.getScheduleTypeList()
            this.$message({
              showClose: true,
              message: '删除成功',
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
    // 关闭相应popover
    closeRefPopover(id) {
      let refName = this.refNamePopover + id;
			// console.log('删除当前数据', id);
			// console.log('删除当前数据ref', this.$refs[refName]);
			// 通过操作dom树，关闭popover
			this.$refs[refName][0].doClose();
    },
    // 打开详情
    openScheduleDetail(row) {
      let params ={
        id: row.id,
        type: 1
      }
      this.$client.GetScheduleByIDScheduleManage(params)
        .then(res => { 
          if (res.head.result == "200") {
            // this.closeRefPopover(row.id)
            this.scheduleDetailVisible = true
            this.$refs.scheduleDetail.setData(res.context)
            if(!row.is_read) {
              // 日程已读
              this.setScheduleRead(row.id)
            }
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
    // 编辑日程
    updateScheduleInfo(row) {
      this.selectRow = Object.assign({}, row)
      if(row.repeat_type == 210) {
        this.baseForm.type = 1
        this.updatePlaybill()
      }else {
        this.dialogVisible = true
      }

      // this.addEventTitle = '编辑日程'
      // this.addScheduleEventVisible = true
      // let info = Object.assign({}, row)
      // this.$refs['scheduleEvent'].setData(info)
    },
    updatePlaybill() {
      this.baseForm.id = this.baseForm.type == 1 ? this.selectRow.id : this.selectRow.plan_id
      let params = Object.assign({}, this.baseForm)
      this.$client.GetScheduleByIDScheduleManage(params)
        .then(res => { 
          if (res.head.result == "200") {
            let info = Object.assign({}, res.context)
            this.addEventTitle = '编辑日程'
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
    // 切换显示类型
    changeSelectType(val) {
      // console.log(val);
      if(val == 'month') {
        this.$nextTick(() => {
      // 点击前一个月
          let prevBtn = document.querySelector(`#monthCalendar .el-calendar__button-group .el-button-group>button:nth-child(1)`);
          prevBtn.addEventListener('click', () => {
            this.changeSelectMonth()
          });

          //点击下一个月
          let nextBtn = document.querySelector(`#monthCalendar .el-calendar__button-group .el-button-group>button:nth-child(3)`);
          nextBtn.addEventListener('click', () => {
            this.changeSelectMonth()
          });

          //点击今天
          let todayBtn = document.querySelector(`#monthCalendar .el-calendar__button-group .el-button-group>button:nth-child(2)`);
          todayBtn.addEventListener('click', () => {
            this.changeSelectMonth()
          });
        });
      }
    },
    // 刷新日程类型树
    updateScheduleTypeTree() {
      this.$refs.typeTree.getScheduleTypeList()
    },
    // 调已读接口
    setScheduleRead(id) {
      this.$client.ReadScheduleManage({context: id})
        .then(res => { 
          if (res.head.result == "200") {
            this.getScheduleData()
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.schedule-todo {
  height: 100%;
  width: 100%;
  /deep/ .el-card__header {
    background-color: #F5F5F5
    .el-button {
      padding: 0;
      float: right;
    }
  }
  /deep/ .el-card__body {
    height: calc(100% - 53px);
    .content-box {
      height: 100%;
      display: flex;
      position: relative;
      .content-left {
        width: 320px;
        height: 100%;
        flex-shrink: 0;
      }
      .content-right {
        flex: 1;
        height: 100%;
        position: relative;
        .radio-box {
          position: absolute;
          right: 20px;
          top: 12px;
        }
        .filter-box {
          position: absolute;
          right: 220px;
          top: 12px;
        }
        .el-calendar {
          height: 100%;
          .el-calendar__header {
            justify-content: start;
            .el-calendar__title {
              margin-right: 60px
            }
          }
        }
      }
    }
  }
  /deep/ .el-calendar__body {
    padding: 10px 20px;
  }
  /deep/ .el-calendar-day {
    height: 110px;
    .day-schedule {
      height: 100%;
      width: 100%;
      .content-schedule {
        width: 100%;
        overflow: hidden;
        .second-title {
          display: flex;
          align-items: center;
          padding-left: 5px;
          &:hover{
            cursor:pointer;
            background: #ffffff;
          }
          p  {
            font-size: 14px;
            font-weight: 400;
            color: #333;
            line-height: 26px;
            padding-left: 5px;
            white-space:nowrap;/* 规定文本是否折行 */
            overflow: hidden;/* 规定超出内容宽度的元素隐藏 */
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
}
.second-popover, .four-popover {
  padding-bottom: 10px;
  p {
    font-size: 12px;
    line-height: 20px;
    white-space:nowrap;/* 规定文本是否折行 */
    overflow: hidden;/* 规定超出内容宽度的元素隐藏 */
    text-overflow: ellipsis;
  }
  div > p{
    font-size: 14px;
    line-height: 26px;
    font-weight: 600;
    color: #333;
  }
}
.three-title{
  cursor:pointer;
  background: #999999;
  span {
    padding-left: 19px;
    font-size: 14px;
    font-weight: 400;
    color: #333;
    line-height: 26px;
    white-space:nowrap;/* 规定文本是否折行 */
    overflow: hidden;/* 规定超出内容宽度的元素隐藏 */
    text-overflow: ellipsis;
  }
  i {
    font-size: 12px;
  }
}

.four-title {
  display: flex;
  align-items: center;
  padding-left: 5px;
  &:hover{
    cursor:pointer;
    background: #ffffff;
  }
  p  {
    font-size: 14px;
    font-weight: 400;
    color: #333;
    line-height: 26px;
    padding-left: 5px;
    white-space:nowrap;/* 规定文本是否折行 */
    overflow: hidden;/* 规定超出内容宽度的元素隐藏 */
    text-overflow: ellipsis;
  }
}
.three-popover {
  min-height: 170px;
}
</style>