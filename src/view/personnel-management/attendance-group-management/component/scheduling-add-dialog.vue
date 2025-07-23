<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    :close-on-click-modal="false"
    append-to-body
    fullscreen
    center
  >
    <div class="el-dialog-div">
      <el-card>
        <el-row>
          <el-col :span="24" class="flex-center" style="margin-bottom: 15px;">
            <span class="title">班次说明:</span>
            <div class="flex-center" style="overflow-x: auto">
              <div v-for="(item,index) in bc_illustrate" :key="index">
                <div :style="{background: item.id == -1 ? '#f2f2f2' : item.color}" class="box">{{item.cycle_name}}</div>
              </div>

              <div style="background:#f2f2f2;color:#333" class="box">休息</div>
            </div>
          </el-col>
          <el-col :span="24" class="flex-center" style="margin-bottom: 15px;">
            <span class="title">排班周期:</span>
            <div class="flex-center" style="overflow-x: auto">
              <div v-for="(item,index) in scheduling_cycles" :key="index">
                <el-tooltip placement="top">
                  <div slot="content" style="text-align:center" v-html="item.cycle_bc"></div>
                  <div style="background: #169bd5" class="box">{{item.cycle_name}}</div>
                </el-tooltip>
              </div>
            </div>
          </el-col>
          <el-col :span="24">
            <div class="search">
              <div class="search-month">
                <el-date-picker
                  v-model="month"
                  type="month"
                  style="width:250px"
                  value-format="yyyy-MM"
                  :clearable="false"
                  :picker-options="pickerOptions"
                  @change="changeDate()"
                  placeholder="选择月">
                </el-date-picker>
                <span style="margin-left:15px" class="title">未排班时： {{userSelectInfo[user_select]}}</span>
              </div>
              <div class="search-button">
                <el-button type="primary" size='small' @click="add()">保存</el-button>
                <el-button size='small' @click="restore()">恢复</el-button>
                <el-button size='small' @click="copy()" v-show="showCopy">复制上月排班</el-button>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-card>

      <el-card>
        <div style="overflow:auto;max-height:600px">
          <table cellpadding="0" v-loading="loading" style="min-width:1700px">
            <thead>
              <tr>
                <th style="width:150px;height:50px;border:1px solid #333;font-size:18px;position: relative;">
                  <p style="position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);">姓名</p>
                </th>
                <template  v-for="(item,index) in daysList">
                  <th :key="index" style="width:50px;height:50px;border:1px solid #333">
                    <p style="margin:3px 0;font-size:18px">{{item.day}}</p>
                    <p style="font-size:18px">{{item.weekDay}}</p>
                  </th>
                </template>
              </tr>
            </thead>
            <tbody >
              <template v-for="(item,index) in user_scheduling_detail">
                <tr :key="index">
                  <th style="width:150px;height:50px;border:1px solid #333;font-size:18px;position: relative;">
                    <div style="position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);width:100%">
                      {{item.user_name}}
                      <el-popover
                        placement="top"
                        width="200"
                        :ref="'popover'+index"
                        trigger="click">
                        <div style="max-height:200px;overflow:auto">
                          <div style="text-align:center;font-size: 14px;margin-bottom: 10px;">
                            <div style="display:flex;justify-content: center;align-items: center;">从<el-input-number v-model="num" style="width:60px" :controls="false" :step="1" :min="1" :max="31"></el-input-number>号开始</div>
                            <p>周期排班至月底</p>
                          </div>
                          <div v-for="(c,c_i) in scheduling_cycles" :key="c_i">
                            <div style="background:#5e90ff" class="schedulingBox" @click="choice(c,index)">{{c.cycle_name}}</div>
                          </div>
                        </div>
                        <span slot="reference" style="color:#409EFF;font-size:12px;cursor: pointer;">周期排班</span>
                      </el-popover>
                    </div>
                  </th>
                  <template v-for="(t,i) in item.schedulings">
                    <th :key="i" style="width:50px;height:50px;border:1px solid #333;position: relative">
                      <el-popover
                        placement="top"
                        width="200"
                        :ref="'popover'+ index + i"
                        trigger="click">
                        <div style="max-height:200px;overflow:auto">
                          <div style="text-align:center;font-size: 16px;margin-bottom: 10px;">修改员工当天班次</div>
                          <div v-for="(c,c_i) in bc_illustrate" :key="c_i">
                            <div :style="{background:c.color}" class="schedulingBox" @click="choiceChild(c,index,i)">{{c.kqbc_name}}</div>
                          </div>
                          <div style="background:#f2f2f2;color:#59d0ad" class="schedulingBox" @click="choiceChild(-1,index,i)">休息</div> 
                          <div style="background:#f2f2f2;color:#faa29b" class="schedulingBox" @click="choiceChild(0,index,i)">清空</div>
                        </div>
                        <!-- <span slot="reference" style="color:red;font-size:12px;cursor: pointer;">周期排班</span> -->
                        <div slot="reference" :style="{background:t.color}" class="child">
                          <div class="child-box" :style="{color:t.kqbc_id === -1 ? '#000' : '#fff'}">{{t.kqbc_name}}</div>
                        </div>
                      </el-popover>
                    </th>
                  </template>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </el-card>

      <el-card>
        <div style="overflow:auto;max-height:600px">
          <table style="min-width:1700px">
            <thead>
              <tr>
                <th style="width:150px;height:50px;border:1px solid #333;font-size:14px;position: relative;">
                  <p style="position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);">排班人次</p>
                </th>
                <template  v-for="(item,index) in daysList">
                  <th :key="index" style="width:50px;height:50px;border:1px solid #333;line-height:50px">
                    <div style="font-size:14px">{{item.day}}</div>
                  </th>
                </template>
              </tr>
            </thead>
            <tbody>
              <template v-for="(item,index) in statisticsData">
                <tr :key="index">
                  <th style="width:150px;height:50px;border:1px solid #333;font-size:14px;position: relative;">
                    <div style="position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);width:100%">
                      <div :style="{background: item.color,color:item.kqbc_id > 0 ? '#fff' : '#000'}" class="statistics-box">{{item.kqbc_name}}</div>
                    </div>
                  </th>
                  <template v-for="(t,i) in item.children">
                    <th :key="i" style="width:50px;height:50px;border:1px solid #333;line-height:50px">
                      <div>{{t}}</div>
                    </th>
                  </template>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </el-card>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import { getDaysInMonth, oneDay, deepCopy, formatDate } from "@/utils/index";
export default {
  props: {
    dialogBool: Boolean,
    kqz_id: {
      type:Number,
      default: 0
    },
    title: {
      type: String,
      default: '排班'
    },
  },
  mounted() {
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          let year = new Date().getFullYear()
          let month = new Date().getMonth()
          if (month == 0) {
            year = year -1
            month = 12
          }
          return time.getTime() < new Date(year + '-' + month).getTime()
        }
      },
      bc_illustrate: [],
      scheduling_cycles: [],
      user_scheduling_detail: [],
      color: ['#5e90ff','#fc7a80','#ff943e','#00C9A7','#c9602e','#f992ec','#4DD12D','#01cfd9','#fb1543','#2da0c3'],
      month: '',
      user_select: null,
      userSelectInfo: {
        1: '可以随便打卡',
        2: '员工可选择班次打卡',
        3: '员工不可打卡',
      },

      daysList: [],
      // 将班次id 和 颜色组装一下 方便使用
      illustrateColor: {},
      statisticsData: [],

      isCopy: false,
      showCopy: true,
      num: 1,
      loading: false
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }else{
      }
    },
  },
  methods: {
    loadData(data) {
      let params = {
        kqz_id: this.kqz_id,
        year_month: data || formatDate(new Date(this.month), 'yyyy-MM')
      }
      this.loading = true
      this.$client.GetScheduling({context: params}).then(res => {
        if (res.head.result == "200") {
          if (this.isCopy) {
            let info  = res.context
            let list = deepCopy(this.user_scheduling_detail)
            let data = deepCopy(res.context.user_scheduling_detail)
            list.forEach(item => {
              data.forEach(child => {
                if (item.user_id == child.user_id) {
                  if (item.schedulings.length >= child.schedulings.length) {
                    let L = item.schedulings.length - child.schedulings.length
                    let supplementData = []
                    for (let index = 0; index < L; index++) {
                      supplementData.push({
                        day: child.schedulings.length + 1 + index,
                        kqbc_id: 0,
                        kqbc_name: ""
                      })
                    }
                    item.schedulings = [...child.schedulings,...supplementData]
                  }else {
                    item.schedulings = child.schedulings.slice(0,item.schedulings.length)
                  }
                }
              })
            })
            info.user_scheduling_detail = list
            info.year_month = this.month
            console.log('list------',JSON.parse(JSON.stringify(list)));

            this.setData(info)
          } else {
            this.setData(res.context)
          }
          this.loading = false
        } else { 
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
          this.loading = false
        }
      })
    },
    changeDate() {
      this.isCopy = false
      let now = formatDate(new Date(), 'yyyy-MM')
      let date = formatDate(new Date(this.month), 'yyyy-MM')

      if (new Date(date).getTime() < new Date(now).getTime()) {
        this.showCopy = false
      } else {
        this.showCopy = true
      }
      this.loadData()
    },
    //保持
    add() {
      let list = []
      let data = deepCopy(this.user_scheduling_detail)
      data.forEach(item => {
        item.schedulings.forEach(child => {
          child.sort = child.day
        })
        list.push({
          user_id: item.user_id,
          details: item.schedulings
        })
      })
      let params = { 
        month: this.month,
        kqz_id: this.kqz_id,
        users: list,
      }
      console.log('params',JSON.parse(JSON.stringify(params)));
      this.$client.AddOrUpdateScheduling({context: params}).then(res => {
        if (res.head.result == "200") {
          this.$message({
            showClose: true,
            message: '保存成功',
            type: "success",
          });
        } else { 
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    //恢复
    restore() {
      this.isCopy = false
      this.loadData()
    },
    //复制
    copy() {
      this.isCopy = true
      let year = new Date(this.month).getFullYear()
      let month = new Date(this.month).getMonth()

      if (month == 0) {
        year = year - 1
        month = 12
      }

      let data = year + '-' + month
      this.loadData(formatDate(new Date(data), 'yyyy-MM'))
    },
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 选择周期排班
    choice(info,index){
      let data = info.cycle_details.map(item => { return {
        kqbc_id: item.kqbc_id,
        kqbc_name: item.kqbc_name,
        color: item.kqbc_id === -1 ? '#f2f2f2' : this.illustrateColor[item.kqbc_id]
      }} )
      let list = []
      // 因为排班周期不会小于2  日期不会超过31   所以最多循环16次   然后再截取 日期长度
      for (let index = 0; index < 16; index++) {
        list = [...list,...data]
      }

      let start_data = this.user_scheduling_detail[index].schedulings.slice(0,this.num - 1)
      let end_data = this.user_scheduling_detail[index].schedulings.slice(this.num - 1,this.user_scheduling_detail[index].schedulings.length)
      let new_data = []
      end_data.forEach((item,i) => {
        item.kqbc_id = list[i].kqbc_id
        item.kqbc_name = list[i].kqbc_name
        item.color = list[i].color
      })
      new_data = [...start_data,...end_data]
      this.user_scheduling_detail[index].schedulings = new_data
      this.getStatisticsData()
      // 关闭弹窗
      this.$nextTick(() => {
        this.$refs[`popover${index}`][0].doClose()
      })
    },
    // 选择当天排班
    choiceChild(info,index,i) {
      let obj = info
      if (info === -1) {
        obj = {
          kqbc_id: -1,
          kqbc_name: '休息',
          color: '#f2f2f2'
        }
      } else if (info === 0) {
        obj = {
          kqbc_id: 0,
          kqbc_name: '',
          color: '#fff'
        }
      }
      // console.log('info',JSON.parse(JSON.stringify(info)));
      this.user_scheduling_detail[index].schedulings[i].kqbc_id = obj.kqbc_id
      this.user_scheduling_detail[index].schedulings[i].kqbc_name = obj.kqbc_name
      this.user_scheduling_detail[index].schedulings[i].color = obj.color
      // console.log('user_scheduling_detail',JSON.parse(JSON.stringify(this.user_scheduling_detail)));

      this.getStatisticsData()
      // 关闭弹窗
      this.$nextTick(() => {
        this.$refs[`popover${index}${i}`][0].doClose()
      })
    },
    // 获取统计数据
    getStatisticsData() {
      this.statisticsData = []
      let restList = [
        {
          kqbc_id: -1,
          kqbc_name: '休息',
          color: '#f2f2f2'
        }
      ]
      let emptyList = [
        {
          kqbc_id: 0,
          kqbc_name: '清空',
          color: '#fff'
        }
      ]
      this.statisticsData = [...this.bc_illustrate,...restList,...emptyList]
      this.statisticsData.forEach(item => {
        item.children = new Array(this.daysList.length).fill(0)
      })

      // 先降幂
      let list = []
      this.user_scheduling_detail.forEach(item => {
        list = [...list,...item.schedulings]
      })

      // console.log('list------',JSON.parse(JSON.stringify(list)));
      this.statisticsData.forEach(item => {
        list.forEach(t => {
          if (item.kqbc_id === t.kqbc_id) {
            item.children[t.day - 1] ++
          }
        })
      })

      // console.log('statisticsData------',JSON.parse(JSON.stringify(this.statisticsData)));
    },
    setData(info) {
      this.month = info.year_month
      this.bc_illustrate = info.bc_illustrate
      this.scheduling_cycles = info.scheduling_cycles
      this.user_scheduling_detail = info.user_scheduling_detail
      this.user_select = info.user_select

      this.bc_illustrate.forEach((item,index) => {
        item.color = this.color[index]

        this.illustrateColor[item.kqbc_id] = this.color[index]
      })

      console.log('illustrateColor',this.illustrateColor);
      this.getAllDays()

      this.getSchedulingData()

      this.getStatisticsData()
    },
    // 获取日期数组
    getAllDays() {
      let year = new Date(this.month).getFullYear()
      let month = new Date(this.month).getMonth() + 1
      let days = getDaysInMonth(year,month)
      this.daysList = []
      days.forEach(item => {
        let obj = {
          day: item,
          weekDay: oneDay(year,month,item)
        }
        this.daysList.push(obj)
      });

      console.log('daysList',JSON.parse(JSON.stringify(this.daysList)));
    },
    // 初始化排班数据
    getSchedulingData() {
      this.user_scheduling_detail.forEach(item => {
        if (item.schedulings.length === 0) {
          item.schedulings = Array.from({length: this.daysList.length}, (x, i) => {
            return {
              kqbc_id: 0,
              kqbc_name: '',
              day: i + 1,
              color:'#fff'
            }
          })
        } else {
          if (item.is_exist === 1) {
            if (item.schedulings.length < this.daysList.length) {
              let L = this.daysList.length - item.schedulings.length
              let array = Array.from({length: L}, (x, i) => {
                return {
                  kqbc_id: 0,
                  kqbc_name: '',
                  day: i + item.schedulings.length + 1,
                  color:'#fff'
                }
              })
              item.schedulings = [...item.schedulings,...array]
            }
          }
          item.schedulings.forEach(child => {
            child.color = child.kqbc_id === -1 ? '#f2f2f2' : this.illustrateColor[child.kqbc_id]
          })
        }
      })
      console.log('user_scheduling_detail',JSON.parse(JSON.stringify(this.user_scheduling_detail)));

    },

  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div {
  height: 100%;

  .flex-center {
    display: flex;
    align-items: center;
  }
  .title {
    color: #333;
    font-size: 18px;
    margin-right: 15px;
    white-space: nowrap;
  }
  .box { 
    margin-right: 10px;
    border-radius: 5px;
    padding: 5px 10px;
    color: #fff;
    font-size: 16px;
    min-width: 100px;
    text-align: center;
    border: 1px solid #e5e3e3;
    white-space: nowrap;
  }
  .search {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .daysBox {
    display: flex;
    align-items: center;
  }

  .child  {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    cursor: pointer;
    .child-box {
      display: -webkit-box;
      overflow:hidden; //超出的文本隐藏
      text-overflow:ellipsis; //溢出用省略号显示
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      cursor: pointer;
    }
  }
  .statistics-box {
    border-radius: 5px;
    width: fit-content;
    max-width: 150px;
    margin: 0px auto;
    padding: 5px 10px;
    overflow:hidden; //超出的文本隐藏
    text-overflow:ellipsis; //溢出用省略号显示
    white-space:nowrap; //溢出不换行
    font-size: 14px;
  }
}

</style>

<style lang="stylus" rel="stylesheet/stylus">
.schedulingBox {
  border-radius: 5px;
  padding: 5px 10px;
  color: #fff;
  font-size: 16px;
  min-width: 100px;
  text-align: center;
  border: 1px solid #e5e3e3;
  margin-bottom: 5px;
  cursor: pointer;
  overflow:hidden; //超出的文本隐藏
  text-overflow:ellipsis; //溢出用省略号显示
  white-space:nowrap; //溢出不换行
}
</style>
