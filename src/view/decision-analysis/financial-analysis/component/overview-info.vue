<!-- 财务数字概览信息 -->
<template>
  <div style="width: calc(100% - 10px);overflow: hidden;margin: 0 5px">
    <el-row :gutter="20" type="flex">
      <el-col   v-for="(item,i) in data" :key="i" >
        <div class="card-panel">
          <div class="card-panel-icon-wrapper">
            <img :src= item.img_src class="img-box" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">{{item.labelTxt}}</div>
            <count-to :start-val="0" :end-val="$props.toolData[i][item.key1] || 0" :duration="2600" class="card-panel-num"/>
            <div class="card-panel-bottom show-flex-box-r">
              <span>{{checkShowText($props.toolData[i][item.key2]).showText}}</span>
              &nbsp;
              <em :style="`color:${checkShowText($props.toolData[i][item.key2]).showColor}` ">{{checkShowText($props.toolData[i][item.key2]).showNumber}}</em>
            </div>
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
import countTo from 'vue-count-to'
export default {
  components: {countTo},
  props: {
    toolData:[Array]
  },
  data () {
    return {
      data1:[],
      data:[
        {
          img_src: p1,
          numberCount: 896,
          labelTxt: '本月收入总额(元)',
          key1: 'total',
          key2: 'rate',
        },
        {
          img_src: p2,
          numberCount: 78,
          labelTxt: '本月支出金额(元)',
          key1: 'total',
          key2: 'rate',
        },
        {
          img_src: p3,
          numberCount: 15,
          labelTxt: '本月营业外收支(元)',
          key1: 'total',
          key2: 'rate',
        },
        {
          img_src: p4,
          numberCount: 135,
          labelTxt: '利润总额(元)',
          key1: 'total',
          key2: 'rate',
        },
      ],
      gutterWidth: 4,
      state:'',
      form: {
        state: 2
      },
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
    checkShowText(num) {
      let showContent = {
        showText: '',
        showNumber:'',
        showColor:''
      };
      if(num == 0) {
        showContent.showText = '同比持平'
        showContent.showNumber = 0;
      }
      if(num > 0) {
        showContent.showText = '同比增长'
        showContent.showNumber = `${num}%↑`;
        showContent.showColor = '#19BE6B';
      }
      if(num < 0) {
        showContent.showText = '同比降低'
        showContent.showNumber = `${Math.abs(num)}%↓`;
        showContent.showColor = '#F56C6c';
      }
      return showContent
    },
    // onSubmit(i){
    //   if(i == 3){
    //     let info = this.$outFormData(this.form)
    //     console.log(this.form, info)
    //     this.$emit("on-ok", info);
    //   }
    // },
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
      height: 134px * $NumWidth;
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
        margin: 35px * $NumWidth;
        width: 62px * $NumWidth;
        height: 62px * $NumWidth;
        .img-box{
          width: 100%;
          height: 100%;
        }
      }
      .card-panel-description{
        float: right;
        font-weight: bold;
        margin: 10px * $NumWidth 50px * $NumWidth;
        margin-left: 0;
        .card-panel-text{
          line-height: 18px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 16px * $NumWidth;
          margin-top: 12px * $NumWidth;
          margin-bottom: 5px * $NumWidth;
        }
        .card-panel-num{
          font-size: 30px * $NumWidth;
          font-weight: 600;
        }
        .card-panel-bottom {
          color: rgba(0, 0, 0, 0.45);
          font-size: 14px * $NumWidth;
          margin-top: 12px * $NumWidth;
        }
      }
    }
  }
}
</style>

