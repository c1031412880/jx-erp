<template>
  <tr-dialog
    :visible="dialogBool"
    :title="showTitle"
    @before-close="dialogClose"
    width="800px"
    top="80px"
  >
    <div class="el-dialog-div">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="140px"
        class="demo-ruleForm"
        :label-position="'right'" 
        size="mini"
      > 
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="工资条名称:" prop="slip_name">
              <el-input v-model="ruleForm.slip_name" placeholder="请输入工资条名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发放月份:" prop="month">
              <el-date-picker
                v-model="ruleForm.month"
                type="month"
                placeholder="选择月"
                value-format="yyyy-MM"
                style="width: 100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发放类别:" prop="type">
              <el-select v-model="ruleForm.type" placeholder="请选择" style="width: 100%;">
                <el-option
                  v-for="item in distributionType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="选择工资条模版:" prop="template_id">
              <el-select v-model="ruleForm.template_id" placeholder="请选择" style="width: 100%;" @change="reqOrgProjectList()" :disabled="curType == 'edit'">
                <el-option
                  v-for="item in payslipTemplate"
                  :key="item.id"
                  :label="item.template_name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" :disabled="!ruleForm.template_id" @click="onExport" size="mini">下载导入模板</el-button>
          </el-col>
          <el-col :span="24">
            <el-button type="primary" :disabled="!ruleForm.template_id && curType == 'add'" @click="filedialogVisible = true" size="mini">导入模板数据</el-button>
          </el-col>
          <el-col :span="24">
            <tr-table
              :data="data"
              :tableHeaderList="canRendererTableHeader"
              :TableHeight="300"
              :frontFixedNum="1"
            ></tr-table>
          </el-col>
          <el-col :span="24">
            <el-checkbox v-model="ruleForm.is_timing" @change="ruleForm.send_time = ''">定时发送</el-checkbox>
            <el-date-picker
              v-model="ruleForm.send_time"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm"
              format="yyyy-MM-dd HH:mm"
              >
            </el-date-picker>
          </el-col>
        </el-row> 
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose" size="mini">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('ruleForm',0)" size="mini">保 存</el-button>
      <el-button type="primary" v-if="!ruleForm.is_timing" @click="updatePlaybill('ruleForm',1)" size="mini">下 发</el-button>
    </span>

    <file-dialog
      :dialogBool.sync="filedialogVisible"
      :typeMessage="download_temp_name"
      :isShowImportState="false"
      :isShowDownload="false"
      @on-submit-excel="onSubmitExcel"
    ></file-dialog>
  </tr-dialog>
</template>

<script type="text/ecmascript-6">
import fileDialog from "@/components/fileDialog/file-dialog";
export default {
  components: {
    fileDialog
  },
  props: {
    dialogBool: Boolean,
    curType: [String],
  },
  data() {
    return {
      showTitle: "",
      ruleForm: {
        id: "",
        slip_name: "",
        month: '',
        type: '',
        template_id: '',
        send_time: '',
        state: 0,
        is_timing: false,
      },
      rules: {
        slip_name: [
          { required: true, message: "请输入工资条名称", trigger: "change" },
        ],
        month: [
          { required: true, message: "请选择发放月份", trigger: "change" },
        ],
        type: [
          { required: true, message: "请选择发放类别", trigger: "change" },
        ],
        template_id: [
          { required: true, message: "请选择工资条模版", trigger: "change" },
        ],
      },
      payslipTemplate: [],
      distributionType: [
        {
          value: 1,
          label: '工资'
        },
        {
          value: 2,
          label: '奖金'
        },
        {
          value: 3,
          label: '其他'
        },
      ],
      canRendererTableHeader: [],
      filedialogVisible: false,
      FileData: {},
      download_temp_name: '',   // 选择的工资条模版名称  和导入的做一下对比
      data: []
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      } else {
        this.loadOrganizationTree()
        this.configTitle();
      }
    },
  },
  methods: {
    setData(info) {
      for (const key in info) {
        if (Object.hasOwnProperty.call(this.ruleForm, key)) {
          this.ruleForm[key] = info[key]
        }
      }
      this.download_temp_name = info.template_name
      this.reqOrgProjectList(this.ruleForm.template_id)
      this.GetByPaySlipId(this.ruleForm.id)
    },
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    configTitle() {
      if (this.curType == "add") {
        this.showTitle = "添加工资条";
      } else{
        this.showTitle = "编辑工资条";
      }
    },
    // 获取模板列表
    loadOrganizationTree() {
      this.$client.GetPaySlipTemplates()
      .then(res => {
        if (res.head.result == "200") {
        this.payslipTemplate = res.context;
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    // 根据模板id 查询模板 
    reqOrgProjectList() {
      if (this.payslipTemplate.length > 0) {
        this.payslipTemplate.forEach(item => {
          if (item.id == this.ruleForm.template_id) {
            this.download_temp_name = `${item.template_name}`
          }
        })
      }

      let params = {
        id: this.ruleForm.template_id,
      }
      this.canRendererTableHeader = []
      this.$client.GetItemByTemplateId(params)
      .then(res => {
        if (res.head.result == "200") {
          let list = res.context
          list.forEach((item,index) => {
            let obj = {
              id: index + 1,
              label: item.item_name,
              prop: item.item_name,
              width: "120",
              align: "center",
              signIndex: index,
            }
            this.canRendererTableHeader.push(obj)
          })
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
      })
    },
    // 根据id下发工资 
    GetByPaySlipId(id) {
      this.$client.GetByPaySlipId({id})
        .then(res => {
          if (res.head.result == "200") {
            let list = res.context
            this.data = []
            list.forEach(item => {
              let obj = {}
              item.pay_slip_details.forEach(child => {
                obj[child.item_name] = child.value
              })
              this.data.push(obj)
            })
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
    },
    // 导出 
    onExport() {
      if (!this.ruleForm.template_id)  return
      this.$client.ExportTemplateFile({context: this.ruleForm.template_id}).then((res) => {
        if(res.head) {
          if (res.head.result == "200") {
            window.location.href = res.context;
            this.$message({ type: "success", message: "导出成功" });
          } else {
            this.$message({ type: "error", message: res.head.describle });
          }
        }else{
          this.$message({ type: "warning", message: "暂无可导出内容" });
        }
        
      });
    },
    // 导入
    onSubmitExcel(val,list) {
      let name = `${this.download_temp_name}.xlsx`
      if (name != list[0].name) {
        this.$message({ type: "warning", message: "导入模板名称要和选择的工资条模板名称一致"});
        return
      }
      let formData = new FormData();
      if (this.curType == 'edit') {
        formData.append("id", this.ruleForm.id);
      }
      formData.append("template_id", this.ruleForm.template_id);
      formData.append("file", val.file);
      let params = formData;
      this.$client.ImportPaySlip(params)
      .then(res => {
        if(res.head.result == "200") {
          this.filedialogVisible = false;
          let list = res.context.pay_slip_detail_dto
          this.data = []
          list.forEach(item => {
            let obj = {}
            item.pay_slip_details.forEach(child => {
              obj[child.item_name] = child.value
            })
            this.data.push(obj)
          })
          this.ruleForm.id = res.context.id

          this.$message({ message: res.head.describle, type: "success" });
        } else{
          this.filedialogVisible = false;
          this.$message({ message: res.head.detail, type: "error" });
        }
      })
    },
    updatePlaybill(formName,state) {
      if (this.data.length == 0) {
        this.$message({ message: '请导入模板数据', type: "warning" });
        return
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = {...this.ruleForm};
          info.state = state
          this.$emit("save-add-edit-organization",info);
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>


