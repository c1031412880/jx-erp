<template>
  <div class="base-info" style="height: 400px; overflow-x: hidden">
    <el-form
      size="mini"
      :model="formData"
      :rules="rules"
      ref="formData"
      label-width="120px"
    >
      <el-form-item label="压力容器编号:" prop="code">
        <el-input
          placeholder="请输入发动机编号"
          v-model="formData.code"
          :disabled="curChangeType=='detail'"
        ></el-input>
      </el-form-item>
      <el-form-item label="容器类型:" prop="type">
        <get-select-dictionaries v-model="formData.type" :classKey="'压力容器类型'" :placeholder="'请选择压力容器类型'" :disabled="curChangeType=='detail'"></get-select-dictionaries>
      </el-form-item>
      <el-form-item label="所属组织:" prop="department_id">
        <get-department-select
          ref="tree"
          v-model="formData.department_id"
          :width="'420'"
          :isShowCheckbox="false"
          :placeholder="'请选择所属组织'"
          :isContainEmp="isContainEmp"
          :isExportMultiple="false"
          @on-change="onSelectChange"
          :disabled="curChangeType=='detail'"
        ></get-department-select>
      </el-form-item>
      <el-form-item label="生产厂家:" prop="made">
        <get-select-dictionaries v-model="formData.made" :classKey="'压力容器生产厂家'" :placeholder="'请选择生产厂家'"></get-select-dictionaries>
      </el-form-item>
      <el-form-item label="生产日期:" prop="made_date">
        <el-date-picker
          v-model="formData.made_date"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          :disabled="curChangeType=='detail'"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="购买日期:" prop="buy_date">
        <el-date-picker
          v-model="formData.buy_date"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          :disabled="curChangeType=='detail'"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="容积(L):" prop="volume">
        <el-input
          placeholder="请输入容积(L)"
          v-model="formData.volume"
          oninput="value=value.replace(/[^\d.-]/g,'')"
          @blur="formData.volume = $event.target.value"
          :disabled="curChangeType=='detail'"
        ></el-input>
      </el-form-item>
      <el-form-item label="质量(KG):" prop="quality">
        <el-input
          placeholder="请输入质量(KG)"
          v-model="formData.quality"
          oninput="value=value.replace(/[^\d.-]/g,'')"
          @blur="formData.quality = $event.target.value"
          :disabled="curChangeType=='detail'"
        ></el-input>
      </el-form-item>
      
      <el-form-item label="单价(元):" prop="price">
        <el-input
          placeholder="请输入单价(元)"
          v-model="formData.price"
          oninput="value=value.replace(/[^\d.-]/g,'')"
          @blur="formData.price = $event.target.value"
          :disabled="curChangeType=='detail'"
        ></el-input>
      </el-form-item>
      <el-form-item label="备注:" prop="remark">
        <el-input
          type="textarea"
          :disabled="curChangeType=='detail'"
          :autosize="{ minRows: 4, maxRows: 8}"
          placeholder="请输入备注"
          v-model="formData.remark"
        ></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
export default {
  components: {
    getDepartmentSelect,
    getSelectDictionaries,
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
        // i_id: '',
        code: "",
        type: "",
        department_id: "",
        made: "",
        // vehicle_id: [],
        made_date: "",
        buy_date: "",
        volume: "",
        quality: "",
        price: "",
        remark: "",
      },
      rules: {
        code: [
          {
            required: true,
            message: "请输入登记证编号",
            trigger: "blur",
          },
        ],
        type: [
          {
            required: true,
            message: "请选择压力容器类型",
            trigger: "blur",
          },
        ],
        department_id: [
          {
            required: true,
            message: "请选择所属组织",
            trigger: "blur",
          },
        ],
      },
      manufacturerOptions:[],//生产厂家
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
      this.$refs["formData"].resetFields();
    },
    // 所属组织选择
    onSelectChange(vehs, nodes) {
      // alert(JSON.stringify(nodes))
      // if (nodes && nodes.length > 0) {
      //   nodes.forEach((item, index) => {
      //     delete item.children;
      //   });
      //   this.formData.department = nodes;
      // } else {
      //   this.formData.department = [];
      // }
    },
    // 数据回显
    setData(val) {
      // this.formData.remark = val.remark;

      for (const key in this.formData) {
        if (Object.hasOwnProperty.call(this.formData, key)) {
          // const element = this.formData[key];
          this.formData[key] = val[key]
        }
      }
      setTimeout(() => {
        this.$refs.tree.departmentCheck(val.department_info);
      }, 60);
    },
    // 给父级页面提供得获取本页数据
    getData() {
      return new Promise((resolve, reject) => {
        this.$refs["formData"].validate((valid) => {
          if (!valid) {
            reject({
              result: 400,
              msg: "获取失败,带星号的为必填项",
            });
            return;
          }
          resolve({
            formData: this.formData,
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
