<template>
  <el-card class="schedule-message">
    <div slot="header" class="clearfix">
      <div class="header-left">
        <el-image :src="require('@/assets/home-image/modular-5.png')"></el-image>
        <span style="color: #000; font-size: 15px; font-weight: 400; font-family: 黑体">
          工作提醒
        </span>
      </div>
      <div class="header-right">
        <el-button @click="lookRouter" type="text" style="padding: 5px 0">
          查看全部
          <i class="el-icon-arrow-right"></i>
          <i style="margin-left: -5px" class="el-icon-arrow-right"></i>
        </el-button>
      </div>
    </div>
    <div class="center-top">
      <el-calendar v-model="value" ref="homeCalendar" id="homeCalendar">
        <template slot="dateCell" slot-scope="{ date, data }">
          <div v-if="monthData[data.day]" style="position: relative">
            <div
              :style="{
                'background-color': !!monthData[data.day][0].color
                  ? monthData[data.day][0].color
                  : '#030303',
                position: 'absolute',
                right: '-5px',
                top: '-5px',
                width: '6px',
                height: '6px',
                'border-radius': '50%',
                'flex-shrink': 0
              }"
            ></div>
            <p>{{ data.day.slice(-2) }}</p>
          </div>
          <span v-else>{{ data.day.slice(-2) }}</span>
        </template>
      </el-calendar>
    </div>
    <div class="center-bottom">
      <div class="bottom-header">
        <div class="bottom-title">今日待办</div>
        <!-- <el-button type="text">添加<i class="el-icon-circle-plus-outline" style="margin-left: 5px"></i></el-button> -->
      </div>
      <el-divider></el-divider>
      <div class="bottom-body" style="overflow-y: auto" v-if="dayData.length">
        <div class="item-data" v-for="(item, index) in dayData" :key="index">
          <el-popover placement="left" width="360" :ref="refNamePopover + item.id">
            <div class="home-popover">
              <div style="display: flex; align-items: center">
                <div
                  style="height: 14px; width: 8px; background-color: #169bd5; margin-right: 10px"
                ></div>
                <p>{{ item.title }}</p>
              </div>
              <p>
                <span>时间：</span>
                <span>{{ item.start_time + '~' + item.end_time }}</span>
              </p>
              <p>
                <span>人员：</span>
                <span>{{ item.play_user_name }}</span>
              </p>
              <p>
                <span>地点：</span>
                <span>{{ item.address }}</span>
              </p>
              <p>
                <span>内容：</span>
                <span>{{ item.detail }}</span>
              </p>
            </div>
            <div style="text-align: right; margin: 0">
              <el-button @click="openScheduleDetail(item)" type="" size="mini" plain>
                查看详情
              </el-button>

              <el-button
                @click="updateScheduleInfo(item)"
                v-show="item.created_id == user_id"
                type="primary"
                size="mini"
                plain
              >
                编辑
              </el-button>
              <el-popconfirm
                @confirm="deleteSchedule(item)"
                v-show="item.created_id == user_id"
                title="确认删除?"
              >
                <el-button type="danger" size="mini" slot="reference" plain>删除</el-button>
              </el-popconfirm>
            </div>
            <div slot="reference" class="item-content">
              <div
                class="item-icon"
                :style="{
                  'background-color': !!item.color ? item.color : '#030303',
                  'flex-shrink': 0
                }"
              ></div>
              <div class="item-name">{{ item.title }}</div>
              <div class="item-time">{{ item.start_time }}</div>
            </div>
          </el-popover>
        </div>
      </div>
      <el-empty class="bottom-body" v-else :image="placeholderImage" style="padding: 0" :image-size="30"></el-empty>
    </div>

    <div class="dialog-di">
      <add-schedule-event
        ref="scheduleEvent"
        :title="'编辑日程'"
        @save-add-edit="saveScheduleEvent"
        :dialogBool.sync="addScheduleEventVisible"
      ></add-schedule-event>
      <schedule-detail-dialog
        ref="scheduleDetail"
        :user_id="user_id"
        :dialogBool.sync="scheduleDetailVisible"
      ></schedule-detail-dialog>
      <el-dialog title="编辑日程或计划" :visible.sync="dialogVisible" width="300px">
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
      <el-dialog title="删除日程或计划" :visible.sync="delVisible" width="300px">
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
import { getUser } from "@/utils/auth";
import {getDate, formatTime} from '@/utils/index'
import placeholderImage from '@/assets/home-image/placeholder-2.png'
import scheduleDetailDialog from "../../../main-Interface-entrance/schedule-todo/component/schedule-detail-dialog"
import addScheduleEvent from "../../../main-Interface-entrance/schedule-todo/component/add-schedule-event"
export default {
  name: 'schedule-message',
  components: {
    addScheduleEvent,
    scheduleDetailDialog
  },
  data() {
    return {
      placeholderImage: placeholderImage,
      value: new Date(),
      user_id: 0,
      type: '',
      date: '',
      form: {
        start_time: '',
        end_time: '',
        schedule_type: 0,
      },
      monthData: {},
      dayData: [],
      refNamePopover: 'popover-', // popover ref名称前缀
      addScheduleEventVisible: false,
      scheduleDetailVisible: false,
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
  mounted() {
    let userInfo = JSON.parse(getUser());
    this.user_id = Number(userInfo.user_id)
    this.setDateTime()
    this.getScheduleData()
    this.$nextTick(() => {
      // 点击前一个月
      let prevBtn = document.querySelector(`#homeCalendar .el-calendar__button-group .el-button-group>button:nth-child(1)`);
      prevBtn.addEventListener('click', () => {
        this.changeSelectMonth()
      });

      //点击下一个月
      let nextBtn = document.querySelector(`#homeCalendar .el-calendar__button-group .el-button-group>button:nth-child(3)`);
      nextBtn.addEventListener('click', () => {
        this.changeSelectMonth()
      });

      //点击今天
      let todayBtn = document.querySelector(`#homeCalendar .el-calendar__button-group .el-button-group>button:nth-child(2)`);
      todayBtn.addEventListener('click', () => {
        this.changeSelectMonth()
      });
    });
  },
  watch: {
    value(val) {
      setTimeout(() => {
        // console.log(val);
        let year = val.getFullYear()
        let month = val.getMonth() + 1
        let day = val.getDate()
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;
        this.date = year + '-' + month + '-' + day;
        this.dayData = !!this.monthData[this.date] ? JSON.parse(JSON.stringify(this.monthData[this.date])) : []
        // console.log(this.date, this.dayData,'11111111111111111111111111');
      }, 300);
    }
  },
  methods: {
    // 查看全部
    lookRouter() {
      this.$router.push({
        path: '/schedule-todo'
      })
    },
    // 初始化时间
    setDateTime() {
      let time = getDate('thisMonth');
      let today =  getDate('today');
      this.date = today.startTime
      this.form.start_time = time.startTime
      this.form.end_time = time.endTime + ' 23:59:59'
    },
    // 切换月份
    changeSelectMonth() {
      let year = this.value.getFullYear()
      let month = this.value.getMonth() + 1
      let lastDay = new Date(year, month, 0)
      this.form.start_time = year + '-' + month + '-01'
      this.form.end_time = formatTime(lastDay) + ' 23:59:59'
      this.getScheduleData()
    },
    // 获取日程
    getScheduleData() {
      let params = {context: {}}
      params.context = this.form
      this.$client.GetUserScheduleScheduleManage(params)
        .then(res => {
          if (res.head.result == "200") {
            this.monthData = res.context
            this.dayData = !!this.monthData[this.date] ? JSON.parse(JSON.stringify(this.monthData[this.date])) : []
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
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
            this.scheduleDetailVisible = true
            this.closeRefPopover(row.id)
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
            this.getScheduleData()
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

<style lang="scss" rel="stylesheet/scss" scoped>
$NumWidth: 100vw / 1920px;
.schedule-message {
  margin-top: 10px;
  /deep/ .el-card__header {
    padding: 12px 20px * $NumWidth;
    .clearfix {
      display: flex;
      justify-content: space-between;
      .header-left {
        display: flex;
        align-items: center;
        .el-image {
          flex-shrink: 0;
          margin-right: 10px * $NumWidth;
        }
      }
      .header-right {
        justify-content: end;
      }
    }
    .clearfix:after {
      content: none;
    }
  }
  /deep/ .el-card__body {
    padding: 12px 20px * $NumWidth;
  }
  .center-top {
    width: 100%;
    /deep/ .el-calendar__header {
      padding: 0 0 8px;
    }
    /deep/ .el-calendar__body {
      padding: 0;
    }
    /deep/ .el-calendar-day {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 30px;
      text-align: center;
      padding: 0;
      font-size: 14px;
      color: #666666;
      font-weight: bold;
    }
    /deep/ .el-calendar-table tr td {
      border: none;
    }
  }
  .center-bottom {
    width: 100%;
    .bottom-header {
      width: 100%;
      margin: 10px 0;
      display: flex;
      // justify-content: space-between;
      align-items: center;
      .el-button {
        padding: 0;
      }
      .bottom-title {
        font-size: 14px;
        font-weight: 500;
        color: #333333;
      }
    }
    .el-divider {
      margin: 10px 0;
    }
    .bottom-body {
      height: 91px;
      overflow-y: auto;
    }
  }
}
.home-popover {
  padding-bottom: 10px;
  p {
    font-size: 12px;
    line-height: 20px;
    white-space: nowrap; /* 规定文本是否折行 */
    overflow: hidden; /* 规定超出内容宽度的元素隐藏 */
    text-overflow: ellipsis;
  }
  div > p {
    font-size: 14px;
    line-height: 26px;
    font-weight: 600;
    color: #333;
  }
}
.item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0 8px 10px;
  overflow: hidden;
  &:hover {
    cursor: pointer;
    background: #f2f6fc;
    border-radius: 3px;
  }
  .item-icon {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin-right: 10px;
  }
  .item-time {
    width: 110px;
    font-size: 12px;
    font-weight: 400;
    color: #666666;
  }
  .item-name {
    flex: 1;
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    white-space: nowrap; /* 规定文本是否折行 */
    overflow: hidden; /* 规定超出内容宽度的元素隐藏 */
    text-overflow: ellipsis;
  }
}
</style>
