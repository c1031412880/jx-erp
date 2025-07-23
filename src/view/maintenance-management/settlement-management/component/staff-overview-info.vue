<!-- 车辆信息管理数字概览信息 -->
<template>
  <div class="staff-overview-info" style="width: calc(100% - 10px);overflow: hidden;margin: 0 5px">
    <!-- ;margin-left: 15%; -->
    <!-- <div>已离职</div> -->
    <el-row :gutter="20" type="flex">
      <el-col :xl="4" :lg="8" v-for="(item,index) in data" :key="index" style="height: 100%">
        <div class="show-flex-box-r card-panel">
          <div class="show-flex-box-r card-panel-icon-wrapper">
            <img :src= item.img_src>
          </div>
          <div class="card-panel-description">
            <p class="card-panel-text" style="margin-bottom:10px">{{item.numberCount}}</p>
            <p class="card-panel-num">{{item.labelTxt}}</p>
          </div>
        </div>

      </el-col>
    </el-row>
    <!-- <div class="leave-office-botton">
      <el-button type="text" @click="openLeaveOfficeUser">已离职</el-button>
    </div> -->
  </div>
</template>

<script>
import p1 from "../../../../assets/staff-manage-image/1_1.png";
import p2 from "../../../../assets/staff-manage-image/2_1.png";
import p3 from "../../../../assets/staff-manage-image/3_1.png";
import p4 from "../../../../assets/staff-manage-image/4_1.png";
import p5 from "../../../../assets/staff-manage-image/5_1.png";
import p6 from "../../../../assets/staff-manage-image/6.png";
export default {
  data () {
    return {
      data:[
        {
          img_src: p1,
          numberCount: 0,
          labelTxt: '今日新增工单',
          type:'0',
        },
        {
           type:'1',
          img_src: p2,
          numberCount: 0,
          labelTxt: '今日完结工单'
          
        },
        {
           type:'2',
          img_src: p3,
          numberCount: 0,
          labelTxt: '当前待修工单'
        },
        {
           type:'3',
          img_src: p4,
          numberCount: 0,
          labelTxt: '当前超时工单'
        },
        {
           type:'4',
          img_src: p5,
          numberCount: 0,
          labelTxt: "维修平均时长（小时）"
        },

      ],
      gutterWidth: 4,
    };
  },
  props:{
  },
  created() {
    // this.gutterWidth = parseInt(24 / this.data.length)
    this.gutterWidth = 24 / this.data.length
    // console.log(this.gutterWidth)
  },
  mounted() {
    this.reqStaffTypeCount()
  },
  methods: {
    // 获取员工统计
    reqStaffTypeCount() {
      this.$client.getOrderCount()
      .then(res => {
        // console.log(res)
        if(res.head.result == '200') {
          // this.staffTypeCountList = res.context;
          this.configStaffCount(res.context)
        }else {
          this.$message({type: 'error', message: res.head.describle})
        }
      })
    },
    configStaffCount(staffTypeCountList) {
      // alert(111)
      staffTypeCountList = staffTypeCountList
      console.log(staffTypeCountList,'123')
        let arr = []
        for(let i in staffTypeCountList){
            arr.push(staffTypeCountList[i])
           }
           console.log(arr,'123')
        arr.forEach((item,index) => {
        this.data.forEach((zItem,zIndex) => {
          if( index == zItem.type) {
            zItem.numberCount = item
          }
        });
      });
    },
    // openLeaveOfficeUser() {
    //   this.$emit('open-leave-office-user')
    // }
  }
}

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
$NumWidth: 100vw / 1920px;
.staff-overview-info{
  width: 100%;
  position: relative;
  overflow-x: hidden;
  padding-bottom: 10px * $NumWidth;
  .leave-office-botton{
    position: absolute;
    right: 0;
    top: -10px * $NumWidth;
    cursor: pointer;
  }
}

.el-row {
  .el-col {
    margin: 5px 0;
    flex: 1;

    .card-panel{
      height: 108px * $NumWidth;
      cursor: pointer;
      font-size: 12px * $NumWidth;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      border-radius: 5px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
      align-items: center;

      .card-panel-icon-wrapper{
        float: left;
        margin: 31px * $NumWidth;
        width: 60px * $NumWidth;
        height: 60px * $NumWidth;

        .img-box{
          width: 100%;
          height: 100%;
        }
      }

      .card-panel-description{
        float: right;
        font-weight: bold;
        margin: 26px * $NumWidth;
        margin-left: 0;

        .card-panel-text {
          line-height: 18px * $NumWidth;
          font-weight: 600;
          font-size: 25px * $NumWidth;
        }
        .card-panel-num{
          color: rgba(0, 0, 0, 0.45);
          font-size: 15px * $NumWidth;
          white-space: nowrap;
        }
      }
    }
  }
}


</style>
