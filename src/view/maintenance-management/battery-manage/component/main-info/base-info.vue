<template>
  <div class="base-info" style="height: 400px; overflow-x: hidden">
    <el-form
      size="mini"
      :model="formData"
      :rules="rules"
      ref="formData"
      label-width="120px"
    >
      <el-form-item label="电瓶机编号:" prop="code">
        <el-input
          placeholder="请输入电瓶机编号"
          v-model="formData.code"
          :disabled="curChangeType=='detail'"
        ></el-input>
      </el-form-item>
      <el-form-item label="电瓶机类型:" prop="model_id">
        <get-battery-type-list v-model="formData.model_id" :disabled="curChangeType=='detail'"></get-battery-type-list>
      </el-form-item>
      <el-form-item label="所属组织:" prop="dept_id">
        <get-department-select
          ref="tree"
          v-model="formData.dept_id"
          :width="'420'"
          :isShowCheckbox="false"
          :isExportMultiple="false"
          :placeholder="'请选择所属组织'"
          :isContainEmp="isContainEmp"
          :disabled="curChangeType=='detail'"
          @on-change="selectedDepartment"
        ></get-department-select>
      </el-form-item>
      <el-form-item label="放置位置:" prop="position">
         <get-select-dictionaries v-model="formData.position" :classKey="'电瓶管理放置位置'" :placeholder="'请选择放置位置'" :disabled="curChangeType=='detail'"></get-select-dictionaries>
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
      <el-form-item label="混合动力类型:" prop="type">
        <get-select-dictionaries v-model="formData.type" :classKey="'混合动力类型'" :placeholder="'请选混合动力类型'" :disabled="curChangeType=='detail'"></get-select-dictionaries>
        <!-- <el-select v-model="formData.type" clearable placeholder="请选混合动力类型" :disabled="curChangeType=='detail'">
          <el-option
            v-for="item in mixedTypeOptions"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          >
          </el-option>
        </el-select> -->
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
import getBatteryTypeList from "@/components/base/formModel/select/get-battery-type-list";
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
export default {
  components: {
    getDepartmentSelect,
    getBatteryTypeList,
    getSelectDictionaries
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
      locationOptions:[ //放置位置
        { value: "顶置", name: "顶置" },
        { value: "后置", name: "后置" },
      ],
      mixedTypeOptions:[ //混合动力类型
        { value: "气电", name: "气电" },
        { value: "油电", name: "油电" },
      ],
      formData: {
        // i_id: "",
        code: "",
        model_id: "",
        dept_id: "",
        position: "",
        buy_date: "",
        type: "",
        price: "",
        remark: ""
      },
      rules: {
        code: [
          {
            required: true,
            message: "请输入电瓶编号",
            trigger: "blur",
          },
        ],
        model_id: [
          {
            required: true,
            message: "请选择电瓶类型",
            trigger: "blur",
          },
        ],
        dept_id: [
          {
            required: true,
            message: "请选择所属组织",
            trigger: "blur",
          },
        ]
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
      this.$refs["formData"].resetFields();
    },

    // 数据回显
    setData(val) {
      for (const key in this.formData) {
        if (Object.hasOwnProperty.call(this.formData, key)) {
          // const element = this.formData[key];
          this.formData[key] = val[key]
        }
      }
      setTimeout(() => {
        this.$refs.tree.departmentCheck(val.dept_info);
      }, 60);
    },
    selectedDepartment() {
      this.$nextTick(() => {
        this.$refs.formData.clearValidate();
      })
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
