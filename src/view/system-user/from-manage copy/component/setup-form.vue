<template>
  <el-dialog :title="changeType =='add'?'新建表单':'编辑表单'" :visible="dialogBool" :before-close="dialogClose" center fullscreen>
    <el-tabs
      v-model="activeName"
      type="border-card"
      :before-leave="beforeLeave"
    >
      <el-tab-pane label="基础设置" name="first">
        <div style="height: 100%" class="basic-info-content">
          <header class="page__header">
            <div class="page-actions">
              <div>{{ changeType=='add'?'新建表单':'编辑表单' }}</div>
            </div>
            <!-- <div>
              <el-form>
                <el-form-item label="表单名称：" class="fill-form-name" >
                  <el-input
                    placeholder="请输入表单名称"
                    v-model="formName"
                    clearable>
                  </el-input>
                </el-form-item>
              </el-form>
            </div> -->
            <!-- <el-button size="small" style="margin-right:20px" class="publish-btn" @click="nextStep()">下一步</el-button> -->
          </header>
          <div class="basic-info">
            <el-form
              ref="ruleForm"
              :model="ruleForm"
              label-width="80px"
              :label-position="'top'"
            >
              <el-form-item label="表单名称（最多50字）">
                <el-input
                  v-model="ruleForm.form_name"
                  maxlength="50"
                  placeholder="请输入表单名称"
                ></el-input>
              </el-form-item>
              <el-form-item label="所在分组">
                <el-select v-model="ruleForm.classify_id" placeholder="请选择所在分组"
                  ><el-option
                    v-for="item in fromGroupList"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="表单说明">
                <el-input
                  v-model="ruleForm.remark"
                  type="textarea"
                  :rows="4"
                  placeholder="请填写表单说明"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div style="float: right; margin:30px 20px 0px 0px">
          <el-button type="primary" @click="nextStep()">下一步</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="表单设计" name="second">
        <div>
          <form-design
            ref="formDesign"
            :changeType="changeType"
            :mockDataInfo="mockData"
            @send-form-info="sendFormInfo"
          ></form-design>
        </div>
        <span style="float: right; margin-right:20px;" class="dialog-footer">
          <el-button @click="dialogClose">取 消</el-button>
          <el-button type="primary" @click="upStep()">上一步</el-button>
          <el-button type="primary" icon="el-icon-check" @click="updatePlaybill('ruleForm')"
            >保存</el-button
          >
        </span>
      </el-tab-pane>
    </el-tabs>
    <!-- <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('ruleForm')"
        >保存</el-button
      >
    </span> -->
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import formDesign from "./dialog-component/form-design.vue";
import {removeDrawingList,saveDrawingList} from '@/components/DynamicForm/utils/db'
export default {
  props: {
    dialogBool: Boolean,
    changeType: [String],
    fromGroupList:[Array],
    formDataInfo:[Object],
    curFormInfo:[Object]
  },
  components: {
    formDesign,
  },
  mounted() {
    
  },
  data() {
    return {
      ruleForm: {
        form_name: "",
        classify_id: "",
        remark: "",
        source_data:"",
        info:[],
        id:"",
        form_classify_id:""
      },
      rules: {
        name: [
          { required: true, message: "请选择表单组名称", trigger: "blur" },
        ],
      },
      mockData:null,
      activeName: "first",
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
        this.$refs["ruleForm"].resetFields();
        removeDrawingList()
      }else{
        removeDrawingList()
      }
    },
    formDataInfo() {
      if(this.changeType == 'edit') {
        this.buildRuleForm();
      }
    }
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    beforeLeave(activeName, oldActiveName) {
      if (oldActiveName == "first") {
        if (this.ruleForm.form_name && this.ruleForm.classify_id && this.ruleForm.remark) {
          return true;
        } else {
          this.$message({
            message: "基础信息都为必填，请填写完整",
            type: "warning",
          });
          return false;
        }
      } else {
        return true;
      }
    },
    nextStep() {
      if (!this.ruleForm.form_name) {
        this.$message({ message: "请填写表单名称", type: "warning" });
        return;
      }
      if (!this.ruleForm.classify_id) {
        this.$message({ message: "请选择表单纳入的分组", type: "warning" });
        return;
      }
      if (!this.ruleForm.remark) {
        this.$message({ message: "请填写表单说明", type: "warning" });
        return;
      }
      this.activeName = "second";
    },
    upStep() {
      this.activeName = "first";
    },
    
    buildRuleForm() { 
      console.log(this.formDataInfo)
      this.ruleForm.form_name = this.formDataInfo.form_name;
      this.ruleForm.classify_id = this.formDataInfo.classify_id;
      this.ruleForm.remark = this.formDataInfo.remark;
      this.ruleForm.source_data = this.formDataInfo.source_data;
      this.ruleForm.id = this.curFormInfo.i_form_id;
      this.ruleForm.form_classify_id = this.curFormInfo.i_id;
      this.mockData = JSON.parse(this.formDataInfo.source_data)
      
        // removeDrawingList()
        // // alert(111)
        // saveDrawingList(this.mockData.fields)
    },
    updatePlaybill(formName) {
      this.$refs.formDesign.publish();
    },
    sendFormInfo(content) {
      this.ruleForm.source_data = content.source_data;
      this.ruleForm.info = content.info;
      if (!this.ruleForm.source_data) {
        this.$message({ message: "表单控件不能为空", type: "warning" });
        return;
      }

      if(this.changeType == 'add') {
        delete this.ruleForm.id;
        delete this.ruleForm.form_classify_id
      }




      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.$emit("submit-creat-form", this.ruleForm);
          this.dialogClose();
        } else {
          return false;
        }
      });
    }
    
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog__wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.el-dialog__wrapper /deep/ .el-dialog__body {
  padding: 0px 20px 20px;
}

.el-select {
  width: 100%;
}

.basic-info-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .basic-info {
    margin-top 3px;
    padding: 0 20px;
    width: 750px;
    // height 850px
    border: 1px #eeee solid;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
}

.el-dialog__wrapper /deep/ .el-tabs__content{
  padding 0px 0px 15px 0px !important;
}

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
      line-height: 54px;

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
</style>


<style>
</style>


