<template>
  <div class="flow-chart-box show-flex-box-r">
    <el-card class="box-card left-box">
      <div style="margin-bottom: 20px;">
        <el-card shadow="always" :body-style="{'background':'#F9F9F9','color':'#606266',}">
          <ul class="show-flex-box-c">
            <li class="show-flex-box-r" style="margin-bottom: 10px;">
              <strong style="margin-right: 15px;white-space: nowrap">发展阶段：</strong>
              <span style="">{{curSelectedInfo.title}}</span>
            </li>
            <li class="show-flex-box-r" style="margin-bottom: 10px;">
              <strong style="margin-right: 15px;white-space: nowrap">相关人员：</strong>
              <span style="">{{curSelectedInfo.related_personnel}}</span>
            </li>
            <li class="show-flex-box-r" style="margin-bottom: 10px;">
              <strong style="margin-right: 15px;white-space: nowrap">工作描述：</strong>
              <span style="">{{curSelectedInfo.describe}}</span>
            </li>
            <li class="show-flex-box-r" style="margin-bottom: 10px;">
              <strong style="margin-right: 15px;white-space: nowrap">下一阶段：</strong>
              <span style="">{{curSelectedInfo.next_phase}}</span>
            </li>
            <li class="show-flex-box-r" style="margin-bottom: 10px;">
              <strong style="margin-right: 15px;white-space: nowrap">相关人员：</strong>
              <span style="">{{curSelectedInfo.next_phase_related_personnel}}</span>
            </li>
            <li class="show-flex-box-r" style="margin-bottom: 10px;">
              <strong style="margin-right: 15px;white-space: nowrap">工作描述：</strong>
              <span style="">{{curSelectedInfo.next_phase_describe}}</span>
            </li>
          </ul>
        </el-card>
      </div>
      
      <el-card shadow="always" :body-style="{'background':'#F9F9F9','color':'#606266'}" v-if="isShowNeedSubmitInfo">
        <submit-form-com ref="submitFormCom" :nodeType="curSelectedInfo.id"></submit-form-com>
      </el-card>

    </el-card>
    <el-card class="box-card center-box" ref="centerBox">
      <div class="show-flex-box-c" v-for="(item,index) in flowChartList" :key="index">
        <h3 class="show-flex-box-r" style="margin-bottom: 20px;">
          <strong style="font-size:15px; color:#FF4F4F; padding: 10px 15px; border: 1px solid #DCDFE6;border-radius: 15px; line-height: 21px;">{{item.flowTitle}}</strong>
        </h3>
        <ul class="flow-chart-list show-flex-box-r">
          <li class="show-flex-box-r" :class="{'pass-selected-active': flowObj.is_pass}"  v-for="(flowObj, flowIndex) in item.sectionFlowChartList" :key="flowIndex">
            <span :class="{'selected-active': selectedIds == flowObj.id}" @click="checkFlowInfo(flowObj,flowIndex)">{{flowObj.id}}、{{flowObj.title}}</span>
            <i class="el-icon-arrow-right" v-if="flowObj.id != 25 && flowObj.id != 16 && flowObj.id != 11 && flowObj.id != 6 && flowObj.id != 2"></i>
          </li>
        </ul>
        <el-divider v-if="index != 4"></el-divider>
      </div>
    </el-card>
  </div>
</template>

<script type="text/ecmascript-6">
  import flowChartListData from './flowChartListData'
  import submitFormCom from './component/submit-form-com.vue'
  export default {
    components: {submitFormCom},
    props: {
      isShowNeedSubmitInfo:{
        type: Boolean,
        default: true,
      },
      isCheckSchedule: {
        type: Boolean,
        default: false,
      },
      exStepsList:{
        type: [Array,Object],
        default:() => []
      }
    },
    data() {
      return {
        flowChartList:[],
        curSelectedInfo:{}, // 选中的当期流程
        selectedIds: -1, //选中的当前的流程id
      }
    },
    mounted() {
     this.configData();
    },
    methods: {
      // 清除数据
      resetData() {
        this.flowChartList = [];
        flowChartListData.forEach((item,index) => {
          item.is_pass = false
        })
        Object.keys(this.$refs.submitFormCom.form).forEach((item) => {
          this.$refs.submitFormCom.form[item].type = "";
        })
        this.selectedIds = -1;
      },
      // 初始化显示数据
      configData() {
       this.flowChartList = [];
       let newFlowChartList = [];
       flowChartListData.forEach((item,index) => {
         if(this.isCheckSchedule && this.exStepsList && this.exStepsList.length) {
          this.exStepsList.forEach(id => {
            if(id == item.id) {
              item.is_pass = true
            }
          });
         }
         let flowChartObj = {...item}
         if(index < 24) {
           flowChartObj.next_phase = flowChartListData[index+1].title
           flowChartObj.next_phase_related_personnel = flowChartListData[index+1].related_personnel
           flowChartObj.next_phase_describe = flowChartListData[index+1].describe
         }
         newFlowChartList.push(flowChartObj)
       });
       for (let index = 0; index < 5; index++) {
          let sectionFlowChartObj = {
            flowTitle:'',
            sectionFlowChartList:[]
          }
          switch (index) {
            case 0:
              sectionFlowChartObj.flowTitle = '一、入党申请'
              sectionFlowChartObj.sectionFlowChartList = newFlowChartList.slice(0,2)
              break;
            case 1:
              sectionFlowChartObj.flowTitle = '二、入党积极分子的确定和培养教育'
              sectionFlowChartObj.sectionFlowChartList = newFlowChartList.slice(2,6)
              break;
            case 2:
              sectionFlowChartObj.flowTitle = '三、发展对象的确定和考察' 
              sectionFlowChartObj.sectionFlowChartList = newFlowChartList.slice(6,11)
              break;
            case 3:
              sectionFlowChartObj.flowTitle = '四、预备党员的接收'
              sectionFlowChartObj.sectionFlowChartList = newFlowChartList.slice(11,16)
              break;
            case 4:
              sectionFlowChartObj.flowTitle = '五、预备党员的教育和转正'
              sectionFlowChartObj.sectionFlowChartList = newFlowChartList.slice(16,25)
              break;
        }
        this.flowChartList.push(sectionFlowChartObj)

        // 初始化才进来选中显示进度
        if(!this.isCheckSchedule) {
          this.curSelectedInfo = newFlowChartList[0]
          this.selectedIds = this.curSelectedInfo.id;
        }else{
          if(this.exStepsList && this.exStepsList.length) {
            let id = this.exStepsList.at(-1);
            newFlowChartList.forEach(element => {
              if(element.id == id) {
                this.curSelectedInfo = element
              }
            });
          }else{
            this.curSelectedInfo = newFlowChartList[0]
            this.selectedIds = this.curSelectedInfo.id;
          }
        }
       }
        // console.log(this.flowChartList)
      },
      //  查看流程内容
      checkFlowInfo(item,index) {
        this.curSelectedInfo = item;
        this.selectedIds = item.id;
      }
      // 获取流程填写内荣
    },
    watch:{
      isCheckSchedule() {
        if(this.isCheckSchedule) {
          this.configData();
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.flow-chart-box{
  width: 100%;
  .left-box {
    height: 100%;
      overflow: auto;
    // flex: 0 0 15vw;
    margin: 0 5px 0 0;
    width: 380px;
    height: 100%;
    flex-shrink: 0;
  }
  .center-box {
    height: 100%;
    overflow: auto;
    flex-grow: 1;
    height: 100%;
  }

}

.flow-chart-list{
  flex-wrap: wrap;
  align-items: center
  >li{
    margin-bottom: 15px;
    align-items: center;

    >span{
      font-size:13px;
      color:#606266; 
      padding: 8px 13px; 
      border: 1px solid #DCDFE6;
      border-radius: 15px; 
      line-height: 15px;
      // margin-right: 10px;
      cursor: pointer;

    }
    .selected-active{
      color: #ffffff;
      background: #FF4F4F;
    }
  }
  .pass-selected-active{
    >span{
      color: #ffffff;
      background: #70B603;
    }
    .selected-active{
      color: #ffffff;
      background: #FF4F4F;
    }
  }
}

.flow-chart-box /deep/ .el-divider--horizontal {
  margin: 5px 0 20px 0 !important;
}
</style>
