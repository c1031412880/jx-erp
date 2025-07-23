<template>
  <div class="page">
    <header class="page__header">
      <div class="page-actions">
        <div style="border-right:1px solid #c5c5c5;cursor: pointer;" @click="exit">
          <i class="el-icon-arrow-left"></i>
        </div>
        <div>{{ title }}</div>
      </div>
      <div class="step-tab">
        <div
          v-for="(item, index) in steps"
          :key="index"
          class="step"
          :class="[activeStep==item.key?'active':'']"
          @click="changeSteps(item)"
        >
          <span class="step-index">{{index+1}}</span>
          {{item.label}}
        </div>
        <div class="ghost-step step" :style="{transform: translateX}"></div>
      </div>
      <el-button size="small" class="publish-btn" @click="publish">发布</el-button>
    </header>

    <!-- style="margin-left:80%" -->
    <!-- <el-button size="small" class="publish-btn" @click="publish">发布</el-button> -->
    <section class="page__content">
      <BasicSetting
        ref="basicSetting" 
        :conf="mockData.basicSetting"
        v-show="activeStep === 'basicSetting'" 
        tabName="basicSetting"
        @initiatorChange="onInitiatorChange"
        @on-change ="changeFormMockData(arguments)" /> 
        <!-- v-show="activeStep === 'processDesign'"  -->
      <Process  
        ref="processDesign"
        :conf="mockData.processData"
        tabName="processDesign" 
        
        v-show="activeStep === 'processDesign'" 
        @startNodeChange="onStartChange"/>

      <!-- <AdvancedSetting
        ref="advancedSetting"
        :conf="mockData.advancedSetting"
        v-show="activeStep === 'advancedSetting'" /> -->

    </section>
  </div>
</template>

<script>
import Process from "@/components/Process";
import BasicSetting from '@/components/BasicSetting'
// import AdvancedSetting from '@/components/AdvancedSetting'
import MockData from './mockData.js'
import {add_flow_data,update_flow_data} from '@/api/erp'
import {removeDrawingList,saveDrawingList} from '@/components/DynamicForm/utils/db'
const beforeUnload = function (e) {
  var confirmationMessage = '离开网站可能会丢失您编辑得内容';
  (e || window.event).returnValue = confirmationMessage;     // Gecko and Trident
  return confirmationMessage;                                // Gecko and WebKit
}

export default {
  name: "Home",
  props: {
    title: {
      type: String,
      default: '新建'
    }
  },
  data() {
    return {
      mockData: MockData, // 可选择诸如 $route.param，Ajax获取数据等方式自行注入
      activeStep: "basicSetting", // 激活的步骤面板
      steps: [
        { label: "基础设置", key: "basicSetting" },
        // { label: "表单设计", key: "formDesign" },
        { label: "流程设计", key: "processDesign" },
        // { label: "高级设置", key: "advancedSetting" }
      ]
    };
  },
  beforeRouteEnter(to, from, next){
    window.addEventListener('beforeunload', beforeUnload)
    next()
  },
  beforeRouteLeave(to, from, next){
    window.removeEventListener('beforeunload', beforeUnload)
    next()
  },
  computed:{
    translateX(){
      return `translateX(${this.steps.findIndex(t => t.key === this.activeStep) * 100}%)`
    }
  },
  methods: {
    // 选择的表单变化时  获取表单绑定的流程信息 回显到流程图上
    changeFormMockData(msg){
      this.mockData.formData = JSON.parse(msg[0])
      // this.mockData.processData = JSON.parse(msg[1])
      if(msg[1]){
        this.mockData.processData = JSON.parse(msg[1])
      }
      removeDrawingList()
      saveDrawingList(this.mockData.formData.fields)  // 将表单列存放到 localStorage 里 流程条件里会用到
      let condition = []
      this.mockData.formData.fields.forEach(element => {
        if(element.proCondition == true){
          condition.push(element)
        }
      });
      this.$store.commit("initPConditions", condition); // 将表单中是作为流程条件的数据放到vuex里 流程里可以选择条件作用到流程
    },
    // 上方tab切换触发事件
    changeSteps(item) {
      this.activeStep = item.key;
    },
    // 发布流程信息
    publish() {
      const getCmpData = name => this.$refs[name].getData()
      const p1 = getCmpData('basicSetting')   // 获取基础信息页面的数据
      const p3 = getCmpData('processDesign')  // 获取流程信息页面的数据
      Promise.all([p1,p3])
      .then(res => {
        const param = {
          basicSetting: res[0].formData,
          processData: res[1].formData,
        }
        this.sendToServer(param)
        console.log( JSON.stringify(param.processData))

        let label = ''
        // 发布时如果是新建时
        if(param.basicSetting.isNew === '1' ){
          label = '确认新建流程吗？'
        }
        // 发布时如果是修改时
        else{
          label = '确认修改流程吗？'
        }
        this.$confirm(label, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 发布时如果是新建则调用添加接口
          if(param.basicSetting.isNew === '1' ){
            this.addProcessData(param)
          }
          // 发布时如果是修改则调用修改接口
          else{
            this.updateProcessData(param)
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });

      })
      .catch(err => {
        err.target && (this.activeStep = err.target)
        err.msg && this.$message.warning(err.msg)
      })
      
    },

    //添加流程数据
    addProcessData(val){
      let dataObj = {
        form_id: '',
        source_data: '',
        flow_name: '',
        remark: ''
      }
      dataObj.form_id = val.basicSetting.contactForm
      let sd = JSON.stringify(val.processData)
      dataObj.source_data = sd.replace(/\\n/gm,"")
      // dataObj.source_data = JSON.stringify(val.processData)
      dataObj.flow_name = val.basicSetting.flowName
      dataObj.remark  = val.basicSetting.flowRemark
      console.log(dataObj)
      console.log(dataObj.source_data)
      add_flow_data(dataObj).then(req => {
        console.log(req)
        if (req.content.result === '200') {
          this.$message({ message: "操作成功", type: "success" });
        } else {
          this.$message({ message: "操作失败", type: "error" });
        }
      })
    },

    //修改流程数据
    updateProcessData(val){
      let dataObj = {
        form_id: '',
        source_data: '',
        flow_name: '',
        remark: ''
      }
      dataObj.form_id = val.basicSetting.contactForm
      let sd = JSON.stringify(val.processData)
      dataObj.source_data = sd.replace(/\\n/gm,"")
      dataObj.flow_name = val.basicSetting.flowName
      dataObj.remark  = val.basicSetting.flowRemark
      update_flow_data(dataObj).then(req => {
        console.log(req)
        if (req.content.result === '200') {
          this.$message({ message: "操作成功", type: "success" });
        } else {
          this.$message({ message: "操作失败", type: "error" });
        }
      })
    },


    sendToServer(param){
      this.$notify({
        title: '数据已整合完成',
        message: '请在控制台中查看数据输出',
        position: 'bottom-right'
      });
      console.log('配置数据', param)
    },
    exit() {
      this.$confirm('离开此页面您得修改将会丢失, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '模拟返回!'
          });
        }).catch(() => { });
    },
    /**
     * 同步基础设置发起人和流程节点发起人
     */
    onInitiatorChange (val, labels) {
      const processCmp = this.$refs.processDesign
      const startNode = processCmp.data
      startNode.properties.initiator = val['dep&user']
      startNode.content =  labels  || '所有人'
      processCmp.forceUpdate()
    },
    /**
     * 监听 流程节点发起人改变 并同步到基础设置 发起人数据
     */
    onStartChange(node){
      const basicSetting = this.$refs.basicSetting
      basicSetting.formData.initiator = { 'dep&user': node.properties.initiator }
    }
  },
  components: {
    Process,
    // DynamicForm,
    BasicSetting,
    // AdvancedSetting
  }
};

// .publish-btn {
//   position:fixed;
//   top:13%;
//   margin-right: 20px;
//   color: #3296fa;
//   padding: 7px 20px;
//   border-radius: 4px;
//   font-size: 18px;
// }
</script>
<style lang="stylus" scoped>
$header-height = 54px;
.app-main{
  overflow-y: hidden;
}
.page {
  width: 100%;
  height: 90%;
  box-sizing: border-box;
  .page__header {
    width: 100%;
    display: flex;
    box-sizing: border-box;
    color: white;
    background: #3296fa;
    font-size: 14px;
    top: 0;

    .publish-btn {
      margin: auto;
      margin-right: 20px;
      color: #3296fa;
      padding: 7px 20px;
      border-radius: 4px;
      font-size: 14px;
    }

    .page-actions {
      height: 100%;
      text-align: center;
      line-height: $header-height;

      > div {
        height: 100%;
        padding-left: 20px;
        padding-right: 20px;
        display: inline-block;
      }

      i {
        font-size: 22px;
        vertical-align: middle;
      }
    }

    .step-tab {
      display: flex;
      justify-content: center;
      height: 100%;
      position: relative;

      >.step {
        width: 140px;
        line-height: $header-height;
        padding-left: 30px;
        padding-right: 30px;
        cursor: pointer;
        position: relative;

        &.ghost-step{
          position: absolute;
          height: $header-height;
          left: 0;
          z-index: -1;
          background: #4483f2;
          transition: transform .5s;

          &::after {
            content: '';
            border-width: 6px 6px 6px;
            border-style: solid;
            border-color: transparent transparent white;
            position: absolute;
            bottom: 0;
            left: 50%;
            margin-left: -6px;
          }
        }

        &.active >.step-index  {
          background: white;
          color: #4483f2;
        }

        >.step-index {
          display: inline-block;
          width: 18px;
          height: 18px;
          border: 1px solid #fff;
          border-radius: 8px;
          line-height: 18px;
          text-align: center;
          box-sizing: border-box;
        }
      }
    }
  }

  .page__content {
    width: 100%;
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;
    background #f5f5f7
  }
}




</style>

