<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="600px"
    
  >
    <div class="el-dialog-div">
      <el-form :model="form" :rules="basicRules" :label-position="'top'" ref="form" label-width="140px" size="mini">
        <el-form-item label="会议内容:" prop="content">
          <el-input
            v-model="form.content" 
            type="textarea"
            maxlength="100"
            :rows="4"
            show-word-limit
            placeholder="请输入会议内容"></el-input>
        </el-form-item>

        <el-form-item label="会议室名称:" prop="meeting_id">
          <el-input v-model="meeting_name" placeholder="请输入会议室名称" disabled></el-input>
        </el-form-item>
        <el-form-item label="预定时间:" prop="">
          <el-select v-model="selectedTime" multiple placeholder="请选择" @change="selectTimeRange">
              <el-option
                v-for="item in timeScaleList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                :disabled="item.disabled">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="会议室申请人:" prop="apply_id">
          <get-department-select
            ref="applyPersonalTree"
            v-model="form.apply_id"
            :width="'500'"
            :isShowCheckbox="false"
            :placeholder="'请选择会议室申请人'"
            :isContainEmp="true"
            :isExportMultiple="false"
            :show_all="true"
            :disabled="true"
          ></get-department-select>
        </el-form-item>
        <el-form-item label="参会人:" prop="ex_person_ids">
          <get-department-select
              ref="personalTree"
              v-model="form.ex_person_ids"
              :width="'500'"
              :isShowCheckbox="true"
              :placeholder="'请选择参会人'"
              :isContainEmp="true"
              :show_all="true"
              :isExportMultiple="true"
              :isCheckStrictly="false"
            ></get-department-select>
        </el-form-item>
        <el-form-item label="审批人:" prop="check_person" v-if="!need_check">
          <el-input v-model="check_person" placeholder="请输选择审批人" disabled></el-input>
        </el-form-item>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import {getUser} from '@/utils/auth'
export default {
  components: {getDepartmentSelect},
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "编辑",
    },
    curSelecedType: [String],
    searchDate:[String],
    booksInfo:[Array],
    selectedTimeList:[Array]
  },
  mounted() {

  },
  data() {
    return {
      date: [],
      need_check:0, // 0需审批 1不需要
      meeting_name: '',
      check_person: '',
      form: {
        content: '',
        meeting_id: '',
        begin_time: '',
        end_time: '',
        apply_id: '',
        ex_person_ids: [],
      },
      basicRules: {
        content: [
          { required: true, message: "请输入会议内容", trigger: "change" },
        ],
        end_time: [
          { required: true, message: "请选择预约时间", trigger: "change" },
        ],
        apply_id: [
          { required: true, message: "请选择申请人", trigger: "change" },
        ],
        ex_person_ids: [
          { required: true, message: "请选择参会人", trigger: "change" },
        ],
      },
      timeScaleCell: 48, //时间刻度
      timeMap:{},
      timeScaleList:[],
      curDate: '', //当前日期
      curTime: '', //当前日期 
      bookTimeInt:[], //已经预定的时间段
      bookPersonalMap:{}, //预定人
      bookStatusMap: {}, //预定状态
      selectedTime: [], // 选择的时间数组
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
        this.resetFrom();
      }else{
        this.setSelectedTime();
        this.bulidTimeMap();
        this.bulidTimeScale();
        this.reqcurTime();
        if(!!this.booksInfo && this.booksInfo.length > 0) {
          this.bulidBookMeettingInfo(this.booksInfo)
        }
        let userInfo = JSON.parse(getUser());
        this.form.apply_id = Number(userInfo.user_id)
        this.$nextTick(() => {
          this.$refs["form"].resetFields();
        })
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 重置
    resetFrom() {
      this.selectedTime = [];
      this.$refs.personalTree.onClear();
      this.$refs.applyPersonalTree.onClear()
    },
    // 设置选择时间
    setSelectedTime() {
      console.log(this.selectedTimeList)
      let startTime = this.selectedTimeList[0];
      let endTime = this.selectedTimeList[1];
      let strIndex = startTime.indexOf(':');

      let curBookendTime = endTime.slice(0,strIndex);
      this.form.begin_time = `${this.searchDate} ${startTime}:00`
      this.form.end_time = `${this.searchDate} ${curBookendTime == 24? '23:59': endTime}:00`
      // console.log(strIndex)
      // 时间转换对应需要的index、数组集合
      let firstSelectTimeNum = startTime.slice(0,strIndex)*2;
      let secondSelectTimeNum = endTime.slice(0,strIndex)*2;

      if(Number(startTime.slice(strIndex +1)) >= 30) {
        firstSelectTimeNum = firstSelectTimeNum + 1;
      }
      if(Number(endTime.slice(strIndex+1)) < 30) {
        secondSelectTimeNum = secondSelectTimeNum - 1;
      }
      console.log(firstSelectTimeNum, secondSelectTimeNum)

      let indexAllList = []
      let num = secondSelectTimeNum - firstSelectTimeNum;
      // 选择多个时间段
      if(num > 0) {
        for (let index = 1; index < num; index++) {
          indexAllList.push((firstSelectTimeNum+index+1))
        }
        indexAllList.push(firstSelectTimeNum+1)
        indexAllList.push(secondSelectTimeNum+1)
        // 所选择的时间序列排序
        indexAllList.sort(function (a, b) {
          return a-b;
        });
      }else{
        indexAllList.push(firstSelectTimeNum+1)
      }
    
      this.selectedTime = indexAllList
    },

    // 构建时间段显示
    bulidTimeMap() {
      for (let index = 0; index < this.timeScaleCell; index++) {
        // console.log(index)
        let timeStr = "";
        if(index % 2 == 0) {
          if((index / 2) < 10) {
            timeStr = `${this.searchDate} 0${Math.floor(index / 2)}:00~0${Math.floor(index / 2)}:30`
          }else{
            timeStr = `${this.searchDate} ${Math.floor(index / 2)}:00~${Math.floor(index / 2)}:30`
          }
        }else{
          if((index / 2) < 10) {
            timeStr = `${this.searchDate} 0${Math.floor(index / 2)}:30~0${Math.floor(index / 2)+1}:00`
          }else{
            timeStr = `${this.searchDate} ${Math.floor(index / 2)}:30~${Math.floor(index / 2)+1}:00`
          }
        }
        this.timeMap[index] = timeStr
        this.$forceUpdate()
      }
    },
    // 构建时间刻度尺
    bulidTimeScale() {
      for (let index = 0; index < this.timeScaleCell; index++) {
        let obj = {
          id: index +1,
          name: this.timeMap[index],
          disabled: false,
        }
        this.timeScaleList.push(obj)
      }
    },
    // 获取当前时间判断禁用刻度
    reqcurTime() {
      let date = new Date()
      let Y = date.getFullYear()
      // console.log(Y)
      let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
      let D = date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()
      this.curDate = Y + '-' + M + '-' + D;
      let hours = date.getHours() 
      let minutes = date.getMinutes()
      this.curTime =  hours + ':' + minutes
       console.log(this.searchDate)
      if(this.searchDate == this.curDate) {
        let disableGridNum = hours*2;
        if(minutes <= 30) {
          disableGridNum = disableGridNum + 1
        } else{
          disableGridNum = disableGridNum + 2
        }
        for (let index = 0; index < disableGridNum; index++) {
          this.timeScaleList.forEach(item =>{
            if((index + 1) == item.id) {
              item.name = `${item.name}   已过期`
              item.disabled = true
            }
          })
        }
      }
      console.log(this.timeScaleList)
    },
     //构建已预订信息 
    bulidBookMeettingInfo(info) {
      console.log(info)
      if(info && info.length > 0) {
        info.forEach(item => {
          item.book_time_int.forEach(obj => {
              this.bookPersonalMap[obj] = item.apply_name;
              this.bookStatusMap[obj] = item.ex_state
          })
          
          if(item.book_time_int && item.book_time_int.length > 0) {
            this.bookTimeInt = [...this.bookTimeInt,...item.book_time_int]
          }
        });
        if(this.bookTimeInt.length > 0) {
          
          this.bookTimeInt.forEach(obj => {
            this.timeScaleList.forEach(item =>{
              if(!item.disabled) {
                 if((obj + 1) == item.id) {
                  item.name = `${item.name}  （${this.bookStatusMap[obj]}） 已被${this.bookPersonalMap[obj]}预定`
                  item.disabled = true
                }
              }
             
            })
          });
        }
        console.log(this.timeScaleList)
      }
    },

    // 判断是否区间有已被选时间段
    judgeHaveBook(num) {
      let isHaveBook = false
      if(this.bookTimeInt.indexOf(num) > -1) {
        isHaveBook = true
      }
      return isHaveBook
      
    },
    // 选择时间做判断
    selectTimeRange(val) {
      console.log(val);
      let max = Math.max.apply(null, val);
      let min = Math.min.apply(null, val);
      let num = max - min;
      for (let index = 1; index < num; index++) {
        if(this.judgeHaveBook(min + index)) {
          this.selectedTime = [];
          this.$message({
            message: '中间不能有其他已经预定过的时间段',
            type: 'warning'
          });
          return
        }
        if(val.indexOf(min+index) == -1) {
          this.selectedTime.push(min+index);
        } 
      }
      if(this.selectedTime.length > 0) {
        this.selectedTime.sort(function (a, b) {
          return a-b;
        });
        // id找对应数组要 减-1
        let startTime = this.timeMap[this.selectedTime[0]-1]
        let endTime = this.timeMap[this.selectedTime[this.selectedTime.length - 1] -1]

        let signIndex = startTime.indexOf('~');
        let bookStartTime = startTime.slice(0,signIndex); //2021-11-16 16:30
        let bookEndTime = endTime.slice(signIndex+1);  // 18:30
        // 单独处理24点 后端识别不了
        let strEndIndex = bookEndTime.indexOf(':');
        let curBookendTime = bookEndTime.slice(0,strEndIndex);

        console.log(bookStartTime, bookEndTime)
        this.form.begin_time = `${bookStartTime}:00`
        this.form.end_time = `${this.searchDate} ${curBookendTime == 24? '23:59': bookEndTime}:00`
      }
      
      // console.log(this.selectedTime)
    },

    updatePlaybill(formName) {
       this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = {...this.form};
          this.$emit("save-add-edit", info);
        } else {
          return false;
        }
      });
    },
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div {
  height: 500px;
  overflow-y: scroll; 
}
.el-dialog-div /deep/ .el-input {
  width: 540px;
}
</style>

