<template>
  <div class="file-dialog" v-loading="loading">
    <el-dialog
      title="批量导入"
      :visible.sync="dialogBool"
      :before-close="dialogClose"
      style="width:100%"
      
    >
      <el-form :model="form" :rules="ruleForm" ref="ruleForm" label-width="100px">
        <el-card style="margin-bottom:20px">
          <i
            class="el-icon-download"
            style="font-size:80px; float:left; color:#409EFF; margin-right:10px"
          ></i>
          <div style="font-size: 16px;font-weight:bold; margin: 10px 10px 10px">填入导入数据信息</div>
          <div style="font-size: 13px;margin-left: 10px">请按照模板格式准备导入数据,模板中的表头名称不可更改,表头行不得删除</div>
          <br />
          <el-button
            size="mini"
            type="primary"
            style="font-size: 13px;font-weight:bold; margin: 10px 10px"
            @click="download()"
          >下载模板</el-button>
        </el-card>

        <el-card>
          <div>
            <i
              class="el-icon-upload"
              style="font-size:80px; float:left; color:#409EFF; margin-right:10px"
            ></i>
          </div>
          <div style="font-size: 16px;font-weight:bold; margin: 10px 10px 10px">上传填好的信息表</div>
          <div style="font-size: 13px;margin-left: 10px">文件名后缀必须为xlsx或xls，文件大小不得大于10M,最多支持导入3000条数据</div>
          <br />
          <!-- :on-success="successUpload" -->
          <el-upload
            class="upload-demo"
            accept=".xls,.xlsx"
            action=""
            :on-remove="handleRemove"
            :auto-upload="false"
            :on-change="handelOnChange"
            :before-remove="beforeRemove"
            :limit="1"
            :on-exceed="handleExceed"
            :file-list="fileList"
          >
            <el-button
              size="mini"
              type="primary"
              style="font-size: 13px;font-weight:bold; margin: 10px 10px"
            >点击上传</el-button>
          </el-upload>
        </el-card>

        <el-row style="margin-top: 20px">
          <el-col :span="12">
            <el-form-item label="发放月份:" prop="month">
              <el-date-picker
                v-model="form.month"
                type="month"
                value-format="yyyy-MM"
                style="width:160px"
                placeholder="选择月">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发放类别:" prop="type">
              <el-select
                clearable
                v-model="form.type"
                style="120px">
                <el-option
                  v-for="(item, index) in payrollType"
                  :key="index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogClose()">取 消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
// import { on } from "@/utils/dom";
// import { upload_driver_excel } from "@/api/information-manage-api";
export default {
  props: {
    dialogBool: Boolean,
    fileData: {}
  },
  data() {
    return {
      fileList: [],
      form: {
        month: '',
        type: '1'
      },
      loading: false,
      loseNameList: [],
      unFindDepartmentIdList: [],
      sameCardIdList: [],
      sameNameList: [],
      disabled: false,
      payrollType: [ //发放类型
        { value: '1', label: '工资' },
        // { value: '2', label: '奖金' },
        // { value: '3', label: '其他' },
      ],
      ruleForm: {
        month: [
          { required: true, message: '请选择月份', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择发放类型', trigger: 'change' }
        ]
      }
    };
  },
  watch: {
    dialogBool(value) {
      if (!value) {
        Object.assign(this.$data, this.$options.data());
      }
    },
    fileData: function(newVal, oldVal) {
      this.fileData = newVal;
    },
    deep: true
  },
  mounted() {},
  methods: {
    // 修饰符回调
    dialogClose() {
      // element组件的修饰符关闭方法(使用自己的)
      this.$emit("update:dialogBool", false);
    },
    download() {
      console.log(this.fileData.url);
      window.location.href = this.fileData.url;
      this.$message({
        message: "下载成功",
        type: "success"
      });
    },
    submit() {
      this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            let subObj = {
            file: this.file,
            ...this.form
          }
          // console.log(subObj);
          this.$emit('on-submit-excel',subObj)
          } else {
            // console.log('error submit!!');
            return false;
          }
      });
    },
    handleRemove(file, fileList) {
      this.file = null
      this.fileList = []
    },
    handelOnChange(res, file) {
      console.log(file)
      this.fileList.push(res);
      this.file = file[0].raw
    },
    successUpload(response, file, fileList) {
      this.fileList.push(file);
      this.file = file.raw;
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    }
    // uploadfile(file,fileList){
    //   upload_driver_excel(this.form)
    // }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
/deep/.el-form-item__error {
  right: 0;
}
</style>
