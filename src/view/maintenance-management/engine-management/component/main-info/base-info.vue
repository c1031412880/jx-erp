<template>
  <div class="base-info" style="height: 400px; overflow-x: hidden">
    <el-form
      size="mini"
      :model="formData"
      :rules="rules"
      ref="formData"
      label-width="120px"
    >
      <el-form-item label="发动机编号:" prop="c_code">
        <el-input
          placeholder="请输入发动机编号"
          v-model="formData.c_code"
          :disabled="curChangeType=='detail'"
        ></el-input>
      </el-form-item>
      <el-form-item label="发动机类型:" prop="i_model_id">
        <get-engine-type-list v-model="formData.i_model_id" :disabled="curChangeType=='detail'"></get-engine-type-list>
      </el-form-item>
      <el-form-item label="所属组织:" prop="orgs">
        <get-department-select
          ref="tree"
          v-model="formData.orgs"
          :width="'420'"
          :isShowCheckbox="false"
          :placeholder="'请选择所属组织'"
          :isExportMultiple='false'
          :isContainEmp="isContainEmp"
          :disabled="curChangeType=='detail'"
        ></get-department-select>
        </el-form-item>
      <el-form-item label="购买日期:" prop="d_buy">
        <el-date-picker
          v-model="formData.d_buy"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          :disabled="curChangeType=='detail'"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="保修截止日期:" prop="d_repair">
        <el-date-picker
          v-model="formData.d_repair"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          :disabled="curChangeType=='detail'"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="单价(元):" prop="n_price">
        <el-input
          placeholder="请输入单价(元)"
          v-model="formData.n_price"
          :disabled="curChangeType=='detail'"
          oninput="value=value.replace(/[^\d.-]/g,'')"
          @blur="formData.n_price = $event.target.value"
        ></el-input>
      </el-form-item>
      <el-form-item label="备注:" prop="c_remark">
        <el-input
          type="textarea"
          :disabled="curChangeType=='detail'"
          :autosize="{ minRows: 4, maxRows: 8}"
          placeholder="请输入备注"
          v-model="formData.c_remark"
        ></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import getEngineTypeList from "@/components/base/formModel/select/get-engine-type-list";
export default {
  components: {
    getDepartmentSelect,
    getEngineTypeList,
  },
  props: {
    curChangeType: {
      type: String,
      default: "add",
    },
  },
  data() {
    return {
      isContainEmp: false, //是否显示部门下的人员
      formData: {
        // i_id: "",
        c_code: "",
        i_model_id: "",
        orgs: '',
        d_buy: "",
        d_repair: "",
        n_price: "",
        c_remark: "",
      },
      rules: {
        c_code: [
          {
            required: true,
            message: "请输入发动机编号",
            trigger: "change",
          },
        ],
        i_model_id: [
          {
            required: true,
            message: "请选择发动机型号",
            trigger: "change",
          },
        ],
        orgs: [
          {
            required: true,
            message: "请选择所属组织",
            trigger: "change",
          },
        ],
      },
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 初始化数据
    resetData() {
      // 清空部门选中
      this.$refs.tree.onClear();
      this.formData.orgs = '';
      this.$refs["formData"].resetFields();
    },
    // 数据回显
    setData(val) {
      // this.formData.i_id = val.i_id;
      this.formData.c_code = val.c_code;
      this.formData.i_model_id = val.i_model_id;
      this.formData.d_buy = val.d_buy;
      this.formData.d_repair = val.d_repair;
      this.formData.n_price = val.n_price;
      this.formData.c_remark = val.c_remark;
      this.formData.orgs = val.orgs[0].i_id;
      // setTimeout(() => {
      //   this.$refs.tree.departmentCheck(val.orgs);
      // }, 60);
    },
    // 给父级页面提供得获取本页数据
    getData() {
      let form = JSON.parse(JSON.stringify(this.formData))
      form.orgs = [this.formData.orgs];
      return new Promise((resolve, reject) => {
        this.$refs["formData"].validate((valid) => {
          if (!valid) {
            reject({
              result: 400,
              msg: '获取失败,带星号的为必填项'
            });
            return;
          }
          resolve({
            formData: form,
            result: 200,
            msg: "获取成功",
          });
        });
      });
    },
    
  },
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.base-info /deep/ .el-date-editor {
  width: 450px;
}
.base-info /deep/.el-select,.el-select--mini {
  width: 450px;
}
.base-info /deep/ .el-input,.el-input--mini{
  width: 450px;
}

</style>
