<!-- 车辆信息管理数字概览信息 -->
<template>
  <div style="width: calc(100% - 10px);overflow: hidden;margin: 0 5px">
    <el-row :gutter="20" type="flex">
      <el-col   v-for="(item,i) in data" :key="i" >
        <div class="card-panel"  @click="onSubmit(item)">
          <div class="card-panel-icon-wrapper">
            <img :src= item.img_src class="img-box" />
          </div>
          <div class="card-panel-description">
            <count-to :start-val="0" :end-val="$props[item.key] || 0" :duration="2600" class="card-panel-num"/>
            <div class="card-panel-text">{{item.labelTxt}}</div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import p1 from "../../../../assets/veh_svg/1.png";
import p2 from "../../../../assets/veh_svg/2.png";
import p3 from "../../../../assets/veh_svg/3.png";
import p4 from "../../../../assets/veh_svg/4.png";
import p5 from "../../../../assets/veh_svg/5.png";
import countTo from 'vue-count-to'
export default {
  components: {countTo},
  props: {
    check_num: {},
    car_num: {},
    maintenance_num: {},
    repair_num: {},
    scrap_num: {}
  },
  data () {
    return {
      data1:[],
      data:[
        {
          img_src: p1,
          numberCount: 896,
          labelTxt: '营运车辆数',
          key: 'car_num',
          state: 0
        },
        {
          img_src: p2,
          numberCount: 78,
          labelTxt: '待保养车辆',
          key: 'maintenance_num',
          state: 3
        },
        {
          img_src: p3,
          numberCount: 15,
          labelTxt: '待维修车辆',
          key: 'repair_num',
          state: 4
        },
        {
          img_src: p4,
          numberCount: 135,
          labelTxt: '待年检车辆',
          key: 'check_num',
          state: 2
        },
        {
          img_src: p5,
          numberCount: 38,
          labelTxt: '已报废车辆',
          key: 'scrap_num',
          state: 5
        },
      ],
      gutterWidth: 4,
      state:'',
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0
      },
    };
  },

  created() {
    // this.gutterWidth = parseInt(24 / this.data.length)
    this.gutterWidth = 24 / this.data.length
    console.log(this.gutterWidth)
  },

  methods: {

    onSubmit(item){
      let info = this.$outFormData({
        state: item.state
      })
      console.log(this.form, info)
      this.$emit("on-ok", info);
    },
  }
}

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
$NumWidth: 100vw / 1920px;
.el-row{
  .el-col{
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
      .card-panel-icon-wrapper{
        float: left;
        margin: 31px * $NumWidth;
        width: 46px * $NumWidth;
        height: 46px * $NumWidth;
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
        .card-panel-text{
          line-height: 18px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 16px * $NumWidth;
          margin-top: 12px * $NumWidth;
        }
        .card-panel-num{
          font-size: 30px * $NumWidth;
          font-weight: 600;
        }
      }
    }
  }
}
</style>

