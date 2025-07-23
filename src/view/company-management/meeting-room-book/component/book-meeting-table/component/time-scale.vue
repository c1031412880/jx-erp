<!--  -->
<template>
  <div class="time-scale-box">
     <el-popover
      placement="top"
      width="160"
      v-model="visible">
      <div class="show-flex-box-c" style="margin-bottom: 5px;">
        <p style="font-size: 13px; text-align:center; color: #303133;font-weight: 600">{{checkShowTimeText()}}</p>
        <span style="font-size: 12px; text-align:center; color: #909399">(再次点击确认时段)</span>
      </div>
      
      <div style="text-align: right; margin: 0">
        <el-button size="mini" type="text" @click="visible = false">取消</el-button>
        <el-button type="primary" size="mini" @click="sureSelectedTime()">确定</el-button>
      </div>
    </el-popover>
    <div class="time-scale show-flex-box-c swiper mySwiper">
      <ul class="time-scale-list show-flex-box-r swiper-wrapper" ref="timeScaleList">
        <li class="time-scale-item swiper-slide show-flex-box-r show-flex-center" :class="checkStatus(item)" v-for="(item,index) in timeScaleList" :key="index" @click.stop="selectTimeDate(item,index)">
          <el-tooltip class="item" effect="light" :content="item.showtext" placement="top" v-if="item.isBook">
            <span >{{item.name}}</span>
          </el-tooltip>
          <span v-else>{{item.name}}</span>
        </li>
      </ul>
    </div>
  </div>
  
</template>

<script>
import Swiper from 'swiper';
import 'swiper/css/swiper.min.css'
import 'swiper/js/swiper.esm.bundle.js'
export default {
  components: {},
  props:{
    searchDate:[String],
    alreadyBooks:[Object]
  },
  data() {
    return {
      visible: false,
      timeScaleCell: 48, //时间刻度
      timeMap:{},
      timeScaleList:[],
      swiper: null,
      firstSelectTimeNum: -1,
      secondSelectTimeNum: -1,
      bookStartTime:'',
      bookEndTime:'',
      curDate: '', //当前日期
      curTime: '', //当前日期 
      bookTimeInt:[], //已经预定的时间段
      curTimeIntervalIndex:0, //当前时间段的index
      bookPersonalMap:{},
    };
  },
  created() {},
  mounted() {
    this.bulidTimeMap();
    this.bulidTimeScale();
    // this.reqcurTime();
    this.$nextTick(() =>  {
      this.initSwiper();
      this.reqcurTime();
      this.bulidBookMeettingInfo()
    })
  },
  methods: {
    // 初始化swipers
    initSwiper() {
      this.swiper = new Swiper(".mySwiper", {
        slidesPerView: 'auto',
      });
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
      //  console.log(this.searchDate)
      if(this.searchDate == this.curDate) {
        let disableGridNum = hours*2;

        if(minutes <= 30) {
          disableGridNum = disableGridNum + 1
        } else{
          disableGridNum = disableGridNum + 2
        }
        this.curTimeIntervalIndex = disableGridNum
        // console.log(this.swiper)
        // 跳转到指定的单元格
        // console.log(this.swiper)
        // return
        if(this.swiper.length > 0) {
          this.swiper.forEach(item => {
            item.slideTo(this.curTimeIntervalIndex);
          });
        }else{
          this.swiper.slideTo(this.curTimeIntervalIndex);
        }
        // 置灰
        for (let index = 0; index < disableGridNum; index++) {
          this.timeScaleList.forEach(item =>{
            if((index + 1) == item.id) {
              item.isDisable = true
            }
          })
        }
      }else{
        this.curTimeIntervalIndex = 0
        if(this.swiper.length > 0) {
          this.swiper.forEach(item => {
            item.slideTo(14);
          });
        }else{
          this.swiper.slideTo(14);
        }
        // this.swiper.forEach(item => {
        //   item.slideTo(14);
        // });
      }
    },
    //构建已预订信息 
    bulidBookMeettingInfo() {
      if(this.alreadyBooks.books && this.alreadyBooks.books.length > 0) {
      
        this.alreadyBooks.books.forEach(item => {

          if(item.book_time_int && item.book_time_int.length > 0) {
            item.book_time_int.forEach(obj => {
              this.bookPersonalMap[obj] = item.apply_name;
              // this.bookStatusMap[obj] = item.ex_state
            })
            // this.bookPersonalMap[item] = item.apply_name;
            this.bookTimeInt = [...this.bookTimeInt,...item.book_time_int]
          }
        });
        if(this.bookTimeInt.length > 0) {
          this.bookTimeInt.forEach(obj => {
            this.timeScaleList.forEach(item =>{
              if((obj + 1) == item.id) {
                item.isBook = true;
                item.showtext = `已被${this.bookPersonalMap[obj]}预定`
              }
            })
          });
        }
        // console.log(this.timeScaleList)
      }
      // console.log(this.timeScaleList)
    },
    // 构建时间段显示
    bulidTimeMap() {
      for (let index = 0; index < this.timeScaleCell; index++) {
        // console.log(index)
        let timeStr = "";
        if(index % 2 == 0) {
          if((index / 2) < 10) {
            timeStr = `0${Math.floor(index / 2)}:00~0${Math.floor(index / 2)}:30`
          }else{
            timeStr = `${Math.floor(index / 2)}:00~${Math.floor(index / 2)}:30`
          }
        }else{
          if((index / 2) < 10) {
            timeStr = `0${Math.floor(index / 2)}:30~0${Math.floor(index / 2)+1}:00`
          }else{
            timeStr = `${Math.floor(index / 2)}:30~${Math.floor(index / 2)+1}:00`
          }
        }
        this.timeMap[index] = timeStr
        this.$forceUpdate()
      }
      // console.log(this.timeMap)
    },
    // 构建时间刻度尺
    bulidTimeScale() {
      for (let index = 0; index < this.timeScaleCell; index++) {
        let obj = {
          id: index +1,
          name: this.timeMap[index],
          isSeleced: false,
          isDisable: false,
          isBook: false
        }
        this.timeScaleList.push(obj)
      }
    },
    // 显示提示选中时间区间
    checkShowTimeText() {
      let showtext = '';
      // 只选择单个时间段
      if(this.firstSelectTimeNum > -1 && this.secondSelectTimeNum < 0) {
        let timeRange = this.timeMap[this.firstSelectTimeNum];
        let signIndex = timeRange.indexOf('~');
        this.bookStartTime = timeRange.slice(0,signIndex);
        this.bookEndTime = timeRange.slice(signIndex+1);
        showtext = `${timeRange} 30分钟`
      }
      // 选择两个时间区间
      if(this.firstSelectTimeNum > -1 && this.secondSelectTimeNum > -1) {
        let num = this.secondSelectTimeNum - this.firstSelectTimeNum;
        let needForNum = Math.abs(num);
        let strStartIndex = -1;
        let strEndIndex = -1;
        let startTime = '';
        let endTime = '';
        // 两次选中一个时间段
        if(num == 0) {
          startTime = this.timeMap[this.firstSelectTimeNum];
          strStartIndex = startTime.indexOf('~');
          this.bookStartTime = startTime.slice(0,strStartIndex);
          this.bookEndTime = startTime.slice(strStartIndex+1);
          showtext = `${startTime} 30分钟`
        }
        // 正向选择
        if(num < 0) {
            startTime = this.timeMap[this.secondSelectTimeNum];
            endTime = this.timeMap[this.firstSelectTimeNum];
            strStartIndex = startTime.indexOf('~');
            strEndIndex = endTime.indexOf('~');
            this.bookStartTime = startTime.slice(0,strStartIndex);
            this.bookEndTime = endTime.slice(strEndIndex+1);
            // console.log(strStartIndex)
            showtext = `${this.bookStartTime}~${this.bookEndTime} ${(needForNum+1)*30}分钟`
        }
        // 反向选择
        if(num > 0) {
            startTime = this.timeMap[this.firstSelectTimeNum];
            endTime = this.timeMap[this.secondSelectTimeNum];
            strStartIndex = startTime.indexOf('~');
            strEndIndex = endTime.indexOf('~');
            this.bookStartTime = startTime.slice(0,strStartIndex);
            this.bookEndTime = endTime.slice(strEndIndex+1);
            // console.log(strStartIndex)
            showtext = `${this.bookStartTime}~${this.bookEndTime} ${(needForNum+1)*30}分钟`
        }
      }
      return showtext
    },
    // 检查状态
    checkStatus(item) {
      let status = '';
      if(!item.isDisable) {
        if(!item.isBook) {
          if(item.isSeleced) {
            status = 'selected-active';
          }else{
            status = '';
          }
        }else{
          status = 'books-active';
        }
        
      }else{
        status = 'disable-active';
      }
      
      return status
    },
    // 选择时间区间
    selectTimeDate(item,index) {
      console.log(item,index);
      
      if(item.isDisable) {
        return
      }
      if(item.isBook) {
        return
      }
      this.visible = true
      // console.log(item,index)
      // item.isSeleced = !item.isSeleced;
      // 只选择一个时间段
      if(this.firstSelectTimeNum < 0) {
        this.firstSelectTimeNum = index;
        this.timeScaleList[this.firstSelectTimeNum].isSeleced = true
        // console.log(this.firstSelectTimeNum)
        return
      }
      
      // 选择两个区间时间段
      if(this.firstSelectTimeNum > -1 && this.secondSelectTimeNum < 0) {
        this.secondSelectTimeNum = index;

        let num = this.secondSelectTimeNum - this.firstSelectTimeNum;
        let needForNum = Math.abs(num);
        // console.log(num)
        if(!needForNum) {
          return
        }
        for (let index = 0; index < needForNum; index++) {
          // console.log(index)
          if(num > 0) {
            if(this.judgeHaveBook(this.firstSelectTimeNum + index)) {
              this.remindWaring();
              return
            }
            
          }else{
            if(this.judgeHaveBook(this.firstSelectTimeNum - index)) {
               this.remindWaring();
              return
            }
          }
        }
        this.timeScaleList[this.secondSelectTimeNum].isSeleced = true
        // console.log(this.secondSelectTimeNum)
        this.timeSectionSelected()
        return
      }
      // 选择两个时间段 再次选择时间段
      if(this.firstSelectTimeNum > -1 && this.secondSelectTimeNum >-1) {
        // 重置选中
        this.resetSelected();
        this.firstSelectTimeNum = -1;
        this.secondSelectTimeNum = -1;
        this.firstSelectTimeNum = index;
        this.timeScaleList[this.firstSelectTimeNum].isSeleced = true
        console.log(this.firstSelectTimeNum)
        console.log(this.secondSelectTimeNum)
        return
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
    // 不能夸区间提示并重置
    remindWaring() {
      this.secondSelectTimeNum = -1
      this.firstSelectTimeNum = -1
      this.resetSelected()
      this.visible = false
      this.$message({
        message: '中间不能有其他已经预定过的时间段',
        type: 'warning'
      });
    },
    // 回显示选中状态
    timeSectionSelected() {
       if(this.firstSelectTimeNum > -1 && this.secondSelectTimeNum >-1) {
        // console.log(this.firstSelectTimeNum)
        // console.log(this.secondSelectTimeNum)
        let num = this.secondSelectTimeNum - this.firstSelectTimeNum;
        let needForNum = Math.abs(num);
        // console.log(num)
        if(!needForNum) {
          return
        }
        for (let index = 0; index < needForNum; index++) {
          // console.log(index)
          if(num > 0) {
            this.timeScaleList[this.firstSelectTimeNum + index].isSeleced = true;
          }else{
            this.timeScaleList[this.firstSelectTimeNum - index].isSeleced = true;
          }
        }
      }
    },
    // 重置选中
    resetSelected() {
      // 重置选中
      this.timeScaleList.forEach(item => {
        if(item.isSeleced) {
          item.isSeleced = !item.isSeleced
        }
      });
      this.secondSelectTimeNum = -1;
      this.firstSelectTimeNum = -1;
      this.bookStartTime = '';
      this.bookEndTime = '';
    },
    // 重置所有
    resetInfo() {
      // 重置选中
      this.timeScaleList.forEach(item => {
        if(item.isSeleced) {
          item.isSeleced = !item.isSeleced
        }
        if(item.isDisable) {
          item.isDisable = !item.isDisable
        }
        if(item.isBook) {
          item.isBook = !item.isBook
        }
      });
    },
    // 确定时间段选择
    sureSelectedTime() {
      let date = [];
      if(this.bookStartTime && this.bookEndTime) {
        date = [this.bookStartTime, this.bookEndTime]
      }
      this.$emit('sure-selected-time',date,this.alreadyBooks)
      setTimeout(() => {
        this.visible = false
      })
    },

    reqSetSwiper() {
      if(!this.swiper) {
        this.reqSetSwiper();
      }else{
        console.log(this.swiper)
      }
    }

  },
  watch: {
    visible() {
      if(!this.visible) {
        this.resetSelected()
      }
    },
    searchDate() {
      this.resetInfo()
      this.reqcurTime()
      this.bulidBookMeettingInfo()
    },
    alreadyBooks() {
      this.resetInfo()
      this.reqcurTime()
      this.bulidBookMeettingInfo()
    },
    curTimeIntervalIndex() {
      // if(this.swiper) {
      //   this.swiper.forEach(item => {
      //     item.slideTo(0);
      //   });
      // }
      // this.reqSetSwiper()
      // console.log(this.swiper)
    }
  },
};
</script>
<style lang='stylus' rel='stylesheet/stylus' scoped>
  .time-scale-box{
    width: 100%;
    height: 30px;
    position: relative;
    .time-scale {
      width: 100%;
      height: 30px;
      border: 1px solid #9999;
      cursor: pointer;
      z-index: 0;
      overflow-x: hidden;
      .time-scale-list{
        width: 100%;
        height: 30px;
        align-items: center;
        // flex-wrap: wrap;
        .time-scale-item{
          width: 75px;
          height: 100%;
          border-right: 1px solid #9999;
          >span{
            font-size: 12px;
            // position: absolute;
            // bottom: -5px;
            // left: -5px;
            // z-index: 99;
          }
        }
        >li:nth-last-child(1) {
          // background: red;
          border-right: none;
        }
        .selected-active{
          background: #409EFF;
          color: #fff;
        }
        .disable-active{
          background: #EDEDEE;
          // color: #fff;
          cursor: auto
        }
        .books-active{
          background: #E6A23C;
          color: #fff;
          cursor: auto
        }
        
      }
    }
  }
  .time-scale-box /deep/ .el-popover {
    top: -95px !important;
    right 45% !important;
  }
</style>