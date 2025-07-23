<template>
  <div class="page">
    <header class="page__header">
      <div class="page-actions">
        <div>{{ title }}</div>
      </div>
      <div>
        <el-form>
          <el-form-item label="表单名称：" class="fill-form-name" >
            <el-input
              placeholder="请输入表单名称"
              v-model="formName"
              clearable>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <el-button size="small" class="publish-btn" @click="publish">发布</el-button>
    </header>
    <section class="page__content">

      <DynamicForm
        ref="formDesign"
        :conf="mockData.formData"
        v-show="activeStep === 'formDesign'" 
        tabName="formDesign" />

    </section>
  </div>
</template>

<script>
import { add_new_form } from "@/api/erp";
import DynamicForm from "@/components/DynamicForm";
import MockData from './mockData.js'
const beforeUnload = function (e) {
  var confirmationMessage = '离开网站可能会丢失您编辑得内容';
  (e || window.event).returnValue = confirmationMessage;     // Gecko and Trident
  return confirmationMessage;                                // Gecko and WebKit
}

export default {
  name: "FrormDesign",
  data() {
    return {
      title:"自定义表单",
      mockData: MockData, // 可选择诸如 $route.param，Ajax获取数据等方式自行注入
      activeStep: "formDesign", // 激活的步骤面板
      formName:'',
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
    changeSteps(item) {
      this.activeStep = item.key;
    },
    publish() {
      const getCmpData = name => this.$refs[name].getData()
      // basicSetting  formDesign processDesign 返回的是Promise 因为要做校验
      // advancedSetting返回的就是值
      // const p1 = getCmpData('basicSetting') 
      const p2 = getCmpData('formDesign')
      // const p3 = getCmpData('processDesign')
      
      // Promise.all([p2])
      p2.then(res => {
        console.log(res)
        // const param = {
        //   basicSetting: res[0].formData,
        //   processData: res[2].formData,
        //   // formData: res[1].formData,
        //   // advancedSetting: getCmpData('advancedSetting')
        // }
        const param = res.formData;
        this.sendToServer(param)
      })
      .catch(err => {
        err.target && (this.activeStep = err.target)
        err.msg && this.$message.warning(err.msg)
      })
    },
    sendToServer(param){
      let formInfo = this.bulidForm(param);
      let content = {
            form_name:this.formName,
            source_data:JSON.stringify(param),
            info: formInfo,
            remark:'111'
          };

        add_new_form(content).then((req) => {
        if (req.head.result === "200") {
          this.$notify({
            title: '发布成功',
            message: '表单创建成功',
            position: 'top-right'
          });
          } else {
        }
      });
    },
    bulidForm(param) {
      const fieldsList = param.fields;
      // console.log(fieldsList);
      let formInfoList = [];
      fieldsList.forEach((item,index) => {
        let signalInfoObj = {
          form_id: item.formId,
          column_name: item.label,
          column_type: 1
        };
        formInfoList.push(signalInfoObj)
      });

      return formInfoList
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
    // Process,
    DynamicForm,
    // BasicSetting,
    // AdvancedSetting
  }
};
</script>
<style lang="stylus" scoped>
.box{
}
$header-height = 54px;
.page {
  // width: 100vw;
  height: 100vh;
  // padding-top: $header-height;
  box-sizing: border-box;

  .page__header {
    width: 100%;
    height: $header-height;
    flex-center()
    justify-content: space-between;
    box-sizing: border-box;
    color: white;
    background: #3296fa;
    font-size: 14px;
    // position: fixed;
    // top: 0;
    display flex;
    flex-direction row;
    align-items center


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

  }

  .page__content {
    width: 100%;
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;
    background #f5f5f7
  }
}

.publish-btn {
  margin-right: 20px;
  color: #3296fa;
  padding: 7px 20px;
  border-radius: 4px;
  font-size: 14px;
  height: 30px
}

.el-form-item{
  display flex !important
  margin-bottom: 0px
  padding-right 85px
 .el-form-item__label{
    color: #fff !important
  }
}
.el-form-item__content{
  width 400px !important
}

</style>
