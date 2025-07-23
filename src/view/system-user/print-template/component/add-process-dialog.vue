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
            style="width:180px"
            :class="[activeStep==item.key?'active':'']"
            @click="changeSteps(item)"
          >
            <span class="step-index">{{index+1}}</span>
            {{item.label}}
          </div>
          <div class="ghost-step step" :style="{transform: translateX}"></div>
        </div>
        <!-- <el-button size="small" class="publish-btn" @click="publish">保存</el-button> -->
      </header>
      <section class="page__content" v-if="dialogBool">
        <BasicSetting
          ref="basicSetting"
          v-show="activeStep === 'basicSetting'"
          :processType="processType"
          :disabled="disabled"
          @on-change="BasicChange"
          tabName="basicSetting" />
        <PrintTemplate
          :url="url"
        />
      </section>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import BasicSetting from './formData'
import PrintTemplate from './print-template'
import { getSession } from '@/utils/auth'
const beforeUnload = function (e) {
  var confirmationMessage = '离开网站可能会丢失您编辑得内容';
  (e || window.event).returnValue = confirmationMessage;     // Gecko and Trident
  return confirmationMessage;                                // Gecko and WebKit
}
export default {
  components: {BasicSetting, PrintTemplate},
  props: {
    dialogBool: Boolean,
    disabled: Boolean,
    suffix: {
      type: String,
      default: "/designer/designer"
    },
    title: {
      type: String,
      default: '新增打印模板'
    },
    processType: {
      type: String,
      default: 'add'
    },
    fieidList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      activeStep: "basicSetting", // 激活的步骤面板
      steps: [
        { label: "基础设置", key: "basicSetting" },
        { label: "打印模板设计", key: "printTemplate" },
      ],
      url:"",
      formTypeKey: '',
      address:window.newHttpConfig.printUrl
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
      }
    }
  },
  methods: {
    // 表单切换
    BasicChange(formTypeKey) {
      this.formTypeKey = formTypeKey;
      if(formTypeKey) this.assembleUrl(this.$refs.basicSetting.formData);
    },
    changeSteps(item) {
      this.$refs.basicSetting.$refs["elForm"].validate((valid) => {
        if (valid) {
          this.activeStep = item.key;
          this.assembleUrl(this.$refs.basicSetting.formData)
        } else {
          return false;
        }
      });
    },
    assembleUrl(formData) {
      // console.log(formData,'formData');
      if (this.processType === "add") {
        if (this.formTypeKey) {
          this.url = `${this.address}${this.suffix}?appid=${window.newHttpConfig.printUrl_appid}&code=${encodeURIComponent(this.formTypeKey || '')}&saveinfo=${encodeURIComponent(JSON.stringify(formData))}&token=${encodeURIComponent(getSession())}`
        }else {
          this.url = this.address + this.suffix
        }
      } else {
        let obj = {
          temp_name: formData.temp_name,
          c_remark: formData.c_remark,
          id:formData.id
        }
        this.url = `${this.address}${this.suffix}&appid=${window.newHttpConfig.printUrl_appid}&code=${encodeURIComponent(this.formTypeKey || '')}&saveinfo=${encodeURIComponent(JSON.stringify(obj))}&token=${encodeURIComponent(getSession())}`
      }
    },
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    initData({formData = null}) {
      this.activeStep = 'basicSetting'
      setTimeout(() => {
        if (formData) {
          this.$refs.basicSetting.formData = formData
        }else {
          JSON.assign(this.$refs.basicSetting.formData, this.$refs.basicSetting.$options.data().formData)
        }
      }, 100);
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" >
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
          width: 180px;
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
