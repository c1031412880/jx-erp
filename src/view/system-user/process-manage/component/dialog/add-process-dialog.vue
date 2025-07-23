<template>
  <el-dialog :fullscreen="true" class="add-process-dialog" :visible="dialogBool" :title="title" :before-close="dialogClose">
    <tr-page-header slot="title" :content="title" @back="dialogClose"></tr-page-header>
    <div class="page" style="height:calc(100vh - 67px);overflow:hidden">
      <header class="page__header">
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
      <section class="page__content" v-if="dialogBool">
        <BasicSetting
          ref="basicSetting"
          v-show="activeStep === 'basicSetting'"
          @on-change="BasicChange"
          tabName="basicSetting" />
        <Process
          ref="processDesign"
          :conf="processData"
          @changeData="processChange"
          tabName="processDesign"
          v-show="activeStep === 'processDesign'"
          :object_id="object_id"
          @startNodeChange="onStartChange"/>
        <AdvancedSetting
          ref="advancedSetting"
          v-show="activeStep === 'advancedSetting'"
          tabName="advancedSetting"
          :advancedInfo="advancedInfo"
          :object_id="object_id"
        />
      </section>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import processDesign from './process-design'
import Process from "@/components/Process";
import BasicSetting from './formData'
import AdvancedSetting from './advanced-setting'
import MockData from './mockData.js'
import formConfig from "./formConfig";
import { saveDrawingList } from "@/components/DynamicForm/utils/db.js";
const beforeUnload = function (e) {
  var confirmationMessage = '离开网站可能会丢失您编辑得内容';
  (e || window.event).returnValue = confirmationMessage;     // Gecko and Trident
  return confirmationMessage;                                // Gecko and WebKit
}
export default {
  components: {Process, BasicSetting, AdvancedSetting},
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: '编辑审核流程'
    },
    fieidList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      object_id: 0,
      processData: null,
      advancedInfo:{
        is_add_check: 0,
        write_sign: false,
        is_sign: 0,
        is_cancel: 0,
        cancel_time: 7,
        cancel_check: 0,
        return_back: true,
        is_again: 1,
        is_same_pass: 0,
        is_replace: 0,  //是否可代他人提交
        behalfs: {
          user: []
        },
        is_update_form: 0,  //是否可修改审批时间
        form_users : {
          user: []
        },
      },
      activeStep: "basicSetting", // 激活的步骤面板
      steps: [
        { label: "基础设置", key: "basicSetting" },
        // { label: "表单设计", key: "formDesign" },
        { label: "流程设计", key: "processDesign" },
        { label: "高级设置", key: "advancedSetting" }
      ],

      formConfig: {}
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
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data())
        // this.processData = null
        // this.activeStep = 'basicSetting'
      } else {
        this.GetFlowConditionDict()
      }
    }
  },
  methods: {
    GetFlowConditionDict() {
      this.$client.GetFlowConditionDict().then(res => {
        if (res.head.result === "200") {
          res.context.forEach(item =>{
            this.formConfig[item.object_id] = {fields : item.fields}
          })
        }
      })
    },
    // 表单切换
    BasicChange(formTypeKey) {
      this.object_id = formTypeKey
      this.getFormOperates(formTypeKey)
      this.$store.commit("clearPCondition")
      if (!this.formConfig[formTypeKey]) return false
      console.log('表单切换',this.formConfig[formTypeKey], formTypeKey)
      let drawingList = this.formConfig[formTypeKey].fields
      const vm = this
      // this.$store.commit('clearPCondition') // 清除所有条件 重新检测赋值
      const canUsedAsPCon = (conf, parent) => {
        const isRangeCmp = ['fc-date-duration','fc-time-duration'].includes(conf.tag)
        // if(isRangeCmp && !conf.showDuration) return false
        // if(isRangeCmp) return false
        if(parent && parent.rowType === 'table') return false
        // if(!conf.proCondition || !conf.required) return false
        // if((conf.tag === 'el-select' || conf.tag === 'select-dictionaries') && conf.multiple) return false
        return true
      }
      const loop = (data, parent) => {
        if(!data) return
        Array.isArray(data.children) && data.children.forEach(child => loop(child, data))
        if(Array.isArray(data)){
          data.forEach(loop)
        }else{
          if (data.dynamic) {
            this.getDynamicData(data)
          }
          canUsedAsPCon(data, parent)
            ? vm.$store.commit("addPCondition", data)
            : vm.$store.commit("delPCondition", data.formId)
        }
      }
      loop(drawingList)

    },
    // 添加动态数据
    getDynamicData(data) {
      if ([100121,100122,100123].indexOf(data.formId) != -1) {
        this.getByPageBusManage().then(res => {
          data.options = res
        })
      }
    },
    // 获取公车数据
    getByPageBusManage() {
      return new Promise((resolve,reject) => {
        let params = {
          page_index: 1,
          page_size: 0
        }
        this.$client.getByPageBusManage(params)
          .then(res => {
            if (res.head.result == "200") {
              let list = res.context.map(item => {
                let obj = {
                  label: item.code,
                  value: item.code
                }
                return obj
              })
              resolve(list)
            } else {
              reject([])
            }
          })
        })
    },
    getFormOperates(formTypeKey) {
      let formOperates = []
      let list = []
      this.fieidList.forEach(item => {
          if (item.code == formTypeKey) {
            list =  item.fieId
        }
      })
      list.forEach(item => {
        let obj = {
          fieid_id: item.fieid_code,
          label: item.fieid_name
        }
        formOperates.push(obj)
      })
      // saveDrawingList(formOperates)
      this.$store.commit('updateFormItemList', formOperates)
    },
    // 初始化参数
    initData({formData = null, processData = null}) {
      this.activeStep = 'basicSetting'
      setTimeout(() => {
        if (formData) {
          this.$refs.basicSetting.formData = formData
          this.advancedInfo.behalfs = formData.behalfs
          this.advancedInfo.is_replace = formData.is_replace
          this.advancedInfo.form_users = formData.form_users
          this.advancedInfo.is_update_form = formData.is_update_form
          this.advancedInfo.is_same_pass = !formData.is_same_pass ? 0 : 1
          this.advancedInfo.is_cancel = formData.is_cancel
          this.advancedInfo.cancel_time = formData.cancel_time !==0 ? formData.cancel_time : 7;
          this.advancedInfo.cancel_check = formData.cancel_check
          // 车辆的也要调用  
          // if (formData.type === 1 || [20,21,1340].indexOf(formData.object_id) != -1) {
            this.BasicChange(formData.object_id)
          // }
        } else {
          JSON.assign(this.$refs.basicSetting.formData, this.$refs.basicSetting.$options.data().formData)
        }
      }, 100)
      if (processData) {
        this.processData = processData
        if (processData.advancedSetting) {
          this.advancedInfo.is_add_check = processData.advancedSetting.is_add_check
          this.advancedInfo.write_sign = processData.advancedSetting.write_sign
          this.advancedInfo.is_sign = processData.advancedSetting.is_sign
          this.advancedInfo.return_back = processData.advancedSetting.return_back
          this.advancedInfo.is_again = processData.advancedSetting.is_again
          this.advancedInfo.is_cancel = processData.advancedSetting.is_cancel
          this.advancedInfo.cancel_time = processData.advancedSetting.cancel_time !==0 ? processData.advancedSetting.cancel_time : 7;
          this.advancedInfo.cancel_check = processData.advancedSetting.cancel_check
        }
      } else {
        this.processData = null
        this.advancedInfo = {
          is_add_check: 0,
          write_sign: false,
          is_sign: 0,
          is_same_pass: 0,
          is_replace: 0,
          behalfs: {
            user: []
          },
          is_update_form: 0,  //是否可修改审批时间
          form_users : {
            user: []
          },
          is_cancel: 0,
          cancel_time: 7,
          cancel_check: 0,
        }
      }
    },
    // 节点事件变化
    processChange(data) {
      // console.log('节点事件变化',data)
      this.processData = data
    },
    changeSteps(item) {
      this.$refs.basicSetting.$refs["elForm"].validate((valid) => {
        if (valid) {
          this.activeStep = item.key;
        } else {
          return false;
        }
      });
    },
    publish() {
      const getCmpData = name => this.$refs[name].getData()
      const p1 = getCmpData('basicSetting')
      const p3 = getCmpData('processDesign')
      const p4 = getCmpData('advancedSetting')
      Promise.all([p1,p3,p4])
        .then(res => {
          const param = {
            basicSetting: res[0].formData,
            processData: res[1].formData,
            advancedSetting: res[2].formData,
          }
          // select  单选转多选的 数据类型转换
          if (this.formConfig[param.basicSetting.object_id]) {
            let drawingList = this.formConfig[param.basicSetting.object_id].fields
            if (param.processData.conditionNodes) {
              param.processData.conditionNodes.forEach(item =>{
                if (item.properties && item.properties.conditions) {
                  item.properties.conditions.forEach(ele => {
                    drawingList.forEach(t => {
                      if (ele.formId === t.formId) {
                        if (t.tag === "el-select" || t.tag === "select-dictionaries") {
                          if (ele.conditionValue instanceof Array) {
                            ele.conditionValue = ele.conditionValue.join(",")
                          } else {
                            ele.conditionValue = ele.conditionValue.toString()
                          }
                        }
                      }
                    })
                  })
                }
              })
            }
          }
          console.log(JSON.parse(JSON.stringify(param)));
          this.$confirm('确认提交该流程吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$emit('on-publish', param)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            });
          });
        })
        .catch(err => {
          err.target && (this.activeStep = err.target)
          err.msg && this.$message.warning(err.msg)
        })
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
    },
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  $header-height = 67px;
  .add-process-dialog .el-dialog__body {
    padding: 0px
  }
  .app-main{
    overflow-y: hidden;
  }
  .page {
    width: 100%;
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
      height: calc(100% - 67px)
      overflow: hidden;
      box-sizing: border-box;
      background #f5f5f7
    }
  }
</style>
