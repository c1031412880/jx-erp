<template>
  <div class="base-info" style="height: 400px; overflow-x: hidden">
    <el-form
      size="mini"
      :model="formData"
      :rules="rules"
      ref="formData"
      label-width="160px"
    >
      <el-form-item label="轮胎编号:" prop="code">
        <el-input
          placeholder="请输入轮胎唯一编号"
          v-model="formData.code"
          :disabled="curChangeType=='detail'"
          style="width: 100%;"
        ></el-input>
      </el-form-item>
      <el-form-item label="轮胎规格型号:" prop="model_id">
        <get-tyre-model v-model="formData.model_id" :disabled="curChangeType=='detail'" style="width: 100%;"></get-tyre-model>
      </el-form-item>

      <el-form-item label="关联维修审批单号:" prop="repair_code" v-if="curChangeType != 'add' || formData.repair_code">
        <el-input
          placeholder="请输入"
          v-model="formData.repair_code"
          :disabled="curChangeType=='detail'"
          style="width: 100%;"
        ></el-input>
      </el-form-item>
      <el-form-item label="物料编码:" prop="tire_code">
        <el-select
          v-model="formData.tire_code"
          size="mini"
          placeholder="请选择"
          style="width: 100%;"
          @change="changeCode"
        >
          <el-option
            v-for="item in wuziOptions"
            :key="item.code"
            :label="item.fullName"
            :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="物料名称:" prop="tire_name">
        <el-input
          placeholder="请输入"
          v-model="formData.tire_name"
          disabled
          style="width: 100%;"
        ></el-input>
      </el-form-item>
      <el-form-item label="规格型号:" prop="tire_model">
        <el-input
          placeholder="请输入"
          v-model="formData.tire_model"
          disabled
          style="width: 100%;"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item label="所属组织:" prop="department_id"> -->
        <!-- :func_type="3" -->
        <!-- <get-department-select
          ref="departmentTree"
          v-model="formData.department_id"
          :width="'420'"
          :isShowCheckbox="false"
          :placeholder="'请选择所属组织'"
          :isContainEmp="isContainEmp"
          :isExportMultiple="false"
          :disabled="curChangeType=='detail'"
        ></get-department-select>
      </el-form-item> -->

      <el-form-item label="轮胎类别:" prop="type">
        <!-- <get-select-dictionaries
          v-model="formData.type"
          :classKey="'轮胎类别'"
          :placeholder="'请选择轮胎类别'"
          :isMultiple="false"
          :disabled="curChangeType=='detail'"
        ></get-select-dictionaries> -->
        <el-select v-model="formData.type" placeholder="请选择轮胎类别" :disabled="curChangeType=='detail'" style="width: 100%;">
          <el-option label="新胎" :value="1"></el-option>
          <el-option label="翻新胎" :value="2"></el-option>
        </el-select>
      </el-form-item> 
      <el-form-item label="购买日期:" prop="buy_date">
        <el-date-picker
          v-model="formData.buy_date"
          style="width: 100%;"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="年/月/日"
          :disabled="curChangeType=='detail'"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="单价(元):" prop="price">
        <el-input placeholder="请输入单价" v-model="formData.price" style="width: 100%;" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="formData.price = $event.target.value" :disabled="curChangeType=='detail'"></el-input>
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
// import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import getTyreModel from "@/components/base/formModel/select/get-tyre-model";
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
export default {
  components: {
    // getDepartmentSelect,
    getTyreModel,
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
      formData: {
        // i_id: '',
        code: "",
        type: "",
        model_id: "",
        buy_date: "",
        price: "",
        remark: "",
        material_id: '',
        tire_name: '',
        tire_model: '',
        repair_code: '',
        tire_code: '',
      },
      rules: {
        code: [
          {
            required: true,
            message: "请输入轮胎唯一编号",
            trigger: "change",
          },
        ],
        // model_id: [
        //   {
        //     required: true,
        //     message: "请选择轮胎规格型号",
        //     trigger: "change",
        //   },
        // ],
        type: [
          {
            required: true,
            message: "请选择轮胎类别",
            trigger: "change",
          },
        ],
        department_id: [
          {
            required: true,
            message: "请选择所属组织",
            trigger: "change",
          },
        ],
      },
      wuziOptions: []
    };
  },
  computed: {},
  watch: {},
  mounted() {
    this.getwuzi()
  },
  methods: {
    // 清除必填项检测
    clearValidate() {
      this.$refs.formData.clearValidate();
    },
    // 初始化数据
    resetData() {
      // 清空部门选中
      setTimeout(() => {
          this.formData.type = ''
          this.formData.model_id = ''
          this.formData.code = ''
          this.formData.remark = ''
          this.formData.price = ''
          this.formData.buy_date= ''
        }, 60);
        // this.$refs["formData"].clear();
    },
    // 数据回显
    setData(val) {
      // this.formData.remark = val.remark;
      for (const key in this.formData) {
        if (Object.hasOwnProperty.call(val, key)) {
          // const element = this.formData[key];
          this.formData[key] = val[key]
        }
      }
      this.formData.model_id = val.tyre_mode &&　Number(val.tyre_mode.id)
      this.formData.type = val.type? Number(val.type): ''
      // setTimeout(() => {
      //   this.formData.model_id = val.tyre_mode &&　Number(val.tyre_mode.id)
      // },100)
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
    // 获取物资 
    getwuzi() {
      let params = {
        usable: 1,
        main_name: '轮胎'
      }
      this.$client.getMaterialPage(params).then((res) => {
        if (res.head.result === "200") {
          this.wuziOptions = res.context.list
          this.wuziOptions.forEach(item => {
            item.fullName = `${item.name}${item.specification}(${item.code})`
          })
        }
      })
    },
    changeCode() {
      this.wuziOptions.forEach(item => {
        if (item.code == this.formData.tire_code) {
          this.formData.tire_name = item.name
          this.formData.tire_model = item.specification
        }
      })
    },
  },
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
