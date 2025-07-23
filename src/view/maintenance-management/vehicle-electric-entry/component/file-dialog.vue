<template>
  <div class="file-dialog" v-loading="loading">
    <el-dialog
      title="批量导入"
      :visible.sync="dialogBool"
      :before-close="dialogClose"
      style="width:100%"
      
    >
      <el-form :model="form">
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
          <div class="show-flex-box-r">
            <el-form :inline="true" size="mini" :model="form" :rules="rules" ref="form">
              <el-form-item label="月份：" prop="month">
                <el-date-picker
                  v-model="form.month"
                  type="month"
                  format="yyyy-MM"
                  value-format="yyyy-MM"
                  placeholder="选择月"
                  :clearable="false">
                </el-date-picker>
              </el-form-item>
              <!-- <el-form-item label="单位：" prop="org_id">
                <get-department-select
                  ref="baseTree"
                  :isContainEmp="false"
                  :isShowCheckbox="false"
                  :funcType="1"
                  :placeholder="'分公司'"
                  :isExportMultiple="false"
                  v-model="form.org_id"
                ></get-department-select>
              </el-form-item> -->
            </el-form>
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

        <el-card style="background-color: #FFF4E9">
          <span>
            导入过程中若发现系统中已存在该{{this.typeMessage}}，则
            <el-radio v-model="radio" label="1">覆盖</el-radio>
            <el-radio v-model="radio" label="0">保持</el-radio>原数据
          </span>
          <br />
        </el-card>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogClose()">取 消</el-button>
        <el-button type="primary" @click="submit('form')" :disabled="flag === 0">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  components: { getDepartmentSelect },
  props: {
    dialogBool: Boolean,
    typeMessage: {
      type: String,
      default: ''
    },
    fileData: {}
  },
  data() {
    return {
      radio: "0",
      fileList: [],
      form: {
        month:'',
      },
      rules:{
        month: [
          {
            required: true,
            message: "请选择导入的月份",
            trigger: "change",
          },
        ],
      },
      loading: false,
      loseNameList: [],
      unFindDepartmentIdList: [],
      sameCardIdList: [],
      sameNameList: [],
      flag: 0,
      disabled: false
    };
  },
  watch: {
    dialogBool(value) {
      if (!value) {
        Object.assign(this.$data, this.$options.data());
      }else{
        this.setDate();
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
    // 设置默认为当前月份
    setDate() {
      let date = new Date();
      let Y = date.getFullYear()
      let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
      this.form.month = Y + '-' + M
    },
    download() {
      console.log(this.fileData.url);
      window.location.href = this.fileData.url;
      this.$message({
        message: "下载成功",
        type: "success"
      });
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let subObj = {
            file: this.file,
            radio: this.radio,
            month: this.form.month,
          }
          this.$emit('on-submit-excel',subObj)
          
        } else {
          return false;
        }
      });
    },
    handleRemove(file, fileList) {
      this.file = null
      this.fileList = []
      this.flag = 0
    },
    handelOnChange(res, file) {
      console.log(file)
      this.fileList.push(res);
      this.file = file[0].raw
      this.flag = 1;
    },
    successUpload(response, file, fileList) {
      this.fileList.push(file);
      this.file = file.raw;
      this.flag = 1;
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

<style lang="stylus" rel="stylesheet/stylus" scoped></style>
