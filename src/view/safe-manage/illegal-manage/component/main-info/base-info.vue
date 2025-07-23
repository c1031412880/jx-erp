<template>
  <div class="base-info" style="height: 440px; overflow-x: hidden">
    <el-form
      size="mini"
      :model="formData"
      :rules="rules"
      ref="formData"
      label-width="120px"
    >
    <el-form-item label="车牌号:" prop="i_vehicle_id">
      <get-vehicle-select-tree
        ref="vehicleTree"
        :placeholder="'选择车辆'"
        :isShowCheckbox="false"
        :isExportMultiple="false"
        :width="'390'"
        @on-change="vehicleChange"
        v-model="formData.i_vehicle_id"
        :disabled="curChangeType=='detail'"
      >
      </get-vehicle-select-tree>
    </el-form-item>
    <el-form-item label="所属组织:" prop="i_vehicle_id">
      <el-input
        placeholder="所属组织"
        v-model="department_name"
        disabled
      ></el-input>
    </el-form-item>
    <el-form-item label="线路:" prop="i_line_id">
      <get-line-select-tree
        ref="lineTree"
        :placeholder="'选择线路'"
        :isShowCheckbox="false"
        v-model="formData.i_line_id"
        :isExportMultiple="false"
        :width="'390'"
        :disabled="curChangeType=='detail'"
      >
      </get-line-select-tree>
    </el-form-item>
    <el-form-item label="驾驶员:" prop="i_driver_id">
      <get-driver-select-tree
        ref="driverTree"
        v-model="formData.i_driver_id"
        :width="'390'"
        :isShowCheckbox="false"
        :placeholder="'请选择所事故驾驶员'"
        :isExportMultiple="false"
        :disabled="curChangeType=='detail'"
      ></get-driver-select-tree>
    </el-form-item>
    <el-form-item label="违法日期:" prop="d_violation_date">
      <el-date-picker
        v-model="formData.d_violation_date"
        type="datetime"
        placeholder="选择日期"
        format="yyyy-MM-dd HH:mm:ss"
        value-format="yyyy-MM-dd HH:mm:ss"
        :disabled="curChangeType=='detail'">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="违法地点:" prop="c_place">
      <el-input
        placeholder="请输入违法地点"
        v-model="formData.c_place"
        :disabled="curChangeType=='detail'"
      ></el-input>
    </el-form-item>
    <el-form-item label="违法项目:" prop="i_violation_id">
      <get-violation-project-select
        v-model="formData.i_violation_id"
        @change="violationProjectChange"
        :placeholder="'选择违法项目'"
        :disabled="curChangeType=='detail'"
        >
      </get-violation-project-select>
    </el-form-item>
    <el-form-item label="违法扣分" prop="i_score">
      <el-input
        placeholder="请输入违法扣分"
        v-model="i_score"
        disabled
      ></el-input>
    </el-form-item>
    <el-form-item label="违法罚款:" prop="n_money">
      <el-input
        placeholder="请输入违法罚款"
        v-model="n_money"
        disabled
      ></el-input>
    </el-form-item>
    <el-form-item label="处理结果:" prop="i_state">
      <get-select-dictionaries v-model="formData.i_state" :classKey="'交警处理结果'" :placeholder="'请选择交警处理结果'" :disabled="curChangeType=='detail'"></get-select-dictionaries>
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
import getLineSelectTree from "@/components/base/formModel/tree/get-line-select-tree";
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";
import getViolationProjectSelect from '@/components/base/formModel/select/get-violation-project-select'
import getSelectDictionaries from '@/components/base/formModel/select/get-select-dictionaries'
export default {
  components: {
    getLineSelectTree,
    getVehicleSelectTree,
    getDriverSelectTree,
    getViolationProjectSelect,
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
        i_vehicle_id: '',
        i_line_id: '',
        i_driver_id: '',
        d_violation_date: '',
        c_place: '',
        i_violation_id: '',
        i_state: '',
        c_remark: '',
      },
      rules: {
        i_vehicle_id: [
          {
            required: true,
            message: "请选择车辆:",
            trigger: "blur",
          },
        ],
        i_line_id: [
          {
            required: true,
            message: "请选择线路",
            trigger: "blur",
          },
        ],
        i_driver_id: [
          {
            required: true,
            message: "请选择驾驶员",
            trigger: "blur",
          },
        ],
        d_violation_date: [
          {
            required: true,
            message: "请选择违法日期",
            trigger: "blur",
          },
        ],
        i_violation_id: [
          {
            required: true,
            message: "请选择违法项目",
            trigger: "blur",
          },
        ],
      },
      department_name: '',//部门名称
      i_score: '', //违法扣分
      n_money: '',//违法罚款
      isFirstLoad: false
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 车辆选中回调
    vehicleChange(vehs,nodes) {
      console.log(vehs,nodes, '车辆选中')

      if (vehs && vehs.length > 0) {
        this.reqVehicleRelationInfo(vehs[0])  
      } 
    },
    // 违法项目change事件
    violationProjectChange(item) {
      this.i_score = item.i_score
      this.n_money = item.n_money
    },
    // 获取车辆相关信息
    reqVehicleRelationInfo(car_id) {

      let params = {
        id: car_id
      };
      this.$client.getVehicleRelationInfo(params).then(res => {
        if(res.head.result == '200') {
            let relationInfo = res.context;
            this.department_name = relationInfo.department_name;
            if(!!relationInfo.line && relationInfo.line.length > 0) {
              // this.$refs.lineTree.lineCheck(relationInfo.line)
              this.formData.i_line_id = relationInfo.line[0].i_id
            }else{
              setTimeout(() => {
                this.formData.i_line_id = "";
                this.$refs.lineTree.onClear()
              }, 60);
          }

        }else{
          this.$message({
            type: 'error',
            message: res.head.describle,
            showClose: true
          })
        }
      }).catch(err => {

      })
    },
    // 初始化数据
    resetData() {
      // 清空部门选中
      this.$refs.vehicleTree.onClear();
      this.$refs.lineTree.onClear();
      this.$refs.driverTree.onClear();
      this.$refs["formData"].resetFields();
      this.department_name = '';
      this.i_score = '';
      this.n_money = '';
    },
    // 数据回显
    setData(val) {
      for (const key in this.formData) {
        if (Object.hasOwnProperty.call(val, key)) {
          this.formData[key] = val[key];
        }
      }
      this.department_name = val.department_name;
      this.i_score = val.score;
      this.n_money = val.money;
      // this.formData.c_code = val.c_code;
      // this.formData.i_model_id = val.i_model_id;
      // this.formData.d_buy = val.d_buy;
      // this.formData.d_repair = val.d_repair;
      // this.formData.n_price = val.n_price;
      // this.formData.c_remark = val.c_remark;
      // setTimeout(() => {
      //   this.$refs.tree.departmentCheck(val.orgs);
      // }, 60);
    },
    // 给父级页面提供得获取本页数据
    getData() {
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
  width: 420px;
}
.base-info /deep/.el-select,.el-select--mini {
  width: 420px;
}
.base-info /deep/ .el-input,.el-input--mini{
  width: 420px;
}

.base-info /deep/ .el-textarea {
  // width: 620px;
}


</style>
