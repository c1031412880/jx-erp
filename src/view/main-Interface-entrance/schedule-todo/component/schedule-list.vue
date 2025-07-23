<template>
  <el-card class="schedule-list">
    <div slot="header" class="clearfix">
      <span>日程列表</span>
      <el-button @click="onBack" type="text">返回<i class="el-icon-arrow-right"></i><i style="margin-left: -5px" class="el-icon-arrow-right"></i></el-button>
    </div>
    <el-form :inline="true" size="mini">
      <el-form-item label="">
        <el-input @change="loadData" v-model="form.schedule_title" placeholder="搜索标题" clearable></el-input>
      </el-form-item>
      <el-form-item label="开始日期:">
        <el-date-picker
          v-model="date"
          type="daterange"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="选择开始日期"
          end-placeholder="选择结束日期"
          :clearable="false"
          @change="selectedTime"
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <ul class="content-list" v-if="data.length && !loading" v-loading="loading">
      <li class="content-list-item" @click="openScheduleDetail(item)" v-for="item in data" :key="item.id || item">
        <div class="list-item-left">
          <div class="item-title">
            <div style="height:16px;width:4px;background-color:#169BD5;margin: 0 5px 0 0;"></div>
            <p>{{item.title}}</p>
          </div>
          <div class="item-content">
            开始时间：{{item.start_time}},
            结束时间：{{item.end_time}}, 
            详情：{{item.detail}}
          </div>
        </div>
        <div class="list-item-right">{{item.create_name}}</div>
      </li>
    </ul>
    <el-empty v-else class="content-list" description="暂无数据"></el-empty>

    <schedule-detail-dialog 
      ref="scheduleDetail" 
      :user_id="user_id"
      @on-commit="loadData"
      :dialogBool.sync="scheduleDetailVisible">
      <!-- @save-add-edit="saveScheduleType" -->
    </schedule-detail-dialog>
  </el-card>
</template>

<script type="text/ecmascript-6">
import { getUser } from "@/utils/auth";
import {getDate, formatTime,getWeekDataList} from '@/utils/index'
import scheduleDetailDialog from "./schedule-detail-dialog"
export default {
  props: {
    type: {
      type: String,
      default: 'month'
    },
    value: '',
    schedule_type: '',
  },
  components: {
    scheduleDetailDialog
  },
  data() {
    return {
      user_id: 0,
      data: [],
      date: [],
      form: {
        start_time: '',
        end_time: '',
        schedule_type: '',
        schedule_title: '',
      },
      loading:false,
      scheduleDetailVisible: false,
    }
  },
  mounted() {
    this.$nextTick(() => {
      let userInfo = JSON.parse(getUser());
      this.user_id = Number(userInfo.user_id)
      switch (this.type) {
        case 'month':
          let timeObj = getDate('thisMonth', this.value)
          this.date = [timeObj.startTime, timeObj.endTime]
          this.form.start_time = timeObj.startTime
          this.form.end_time = timeObj.endTime + ' 23:59:59'
          // console.log(timeObj,this.value, this.date);
          break;
        case 'week':
          let weekObj = getWeekDataList(this.value)
          this.date = [weekObj['周一'], weekObj['周日']]
          this.form.start_time = weekObj['周一']
          this.form.end_time = weekObj['周日'] + ' 23:59:59'
          // console.log(weekObj,this.value, this.date);
          break;
        case 'today':
          let dayObj = formatTime(this.value)
          this.date = [dayObj, dayObj]
          this.form.start_time = dayObj
          this.form.end_time = dayObj + ' 23:59:59'
          // console.log(dayObj,this.value, this.date);
          break;
      
        default:
          break;
      }
      this.loadData()
    })
  },
  methods: {
    // 返回月周日日程
    onBack() {
      this.$emit('on-back')
    },
    // 切换时间
    selectedTime: function() {
      if(this.date && this.date.length>0) {
        this.date = this.$addTime(this.date);
        this.form.start_time = this.date[0];
        this.form.end_time = this.date[1];
      }else{
        this.form.start_time = '';
        this.form.end_time = '';
      }
      this.loadData()
    },
    // 加载列表
    loadData() {
      this.loading = true
      this.data = []
      let params = {context: {}}
      params.context = this.form
      this.$client.GetUserScheduleScheduleManage(params)
        .then(res => { 
          this.loading = false
          if (res.head.result == "200") {
            // this.data = res.context
            for(let key in res.context) {
              this.data.push(...res.context[key])
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
          this.loading = false
          this.$message({
            showClose: true,
            message: err.body.describle,
            type: "error",
          });
        })
    },
    openScheduleDetail(row) {
      this.scheduleDetailVisible = true
      let params ={
        id: row.id,
        type: 1
      }
      this.$client.GetScheduleByIDScheduleManage(params)
        .then(res => { 
          if (res.head.result == "200") {
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
    // 调已读接口
    setScheduleRead(id) {
      this.$client.ReadScheduleManage({context: id})
        .then(res => { 
          if (res.head.result == "200") {
            this.loadData()
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
.schedule-list {
  flex: 1;
  height: 100%;
  .content-list {
    height: calc(100% - 46px);
    width: 100%;
    overflow-y: auto;
    .content-list-item {
      border-bottom: 1px solid #ebeef5;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      line-height: 22px;
      color: #333333;
      font-weight: 400;
      padding: 5px;
      &:hover{
        cursor:pointer;
        background: #F2F6FC;
        border-radius: 3px;
      }
      .item-title {
        display: flex;
        align-items: center;
        p {
          font-size: 16px;
          font-weight: 600;
        }
      }
    }
  }
}
</style>