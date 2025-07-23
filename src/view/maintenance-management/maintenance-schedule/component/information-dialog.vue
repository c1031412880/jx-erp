<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="800px"
    
  >
    <div class="el-dialog-div">
      <el-form :model="form" :rules="basicRules" ref="form" label-width="140px" size="mini">
        <div class="show-flex-box-r">
          <el-form-item label="自编号:" prop="vehicle_id">
            <get-carcode-select-tree
              ref="carcodeTree"
              :placeholder="'选择车辆自编号'"
              :isShowCheckbox="false"
              v-model="form.vehicle_id"
              @on-change="onSelectChange"
              :isExportMultiple="false"
              :width="'180'"
              :disabled="curSelecedType=='detail'"
            >
            </get-carcode-select-tree>
          </el-form-item>
          <el-form-item label="车牌号:" prop="vehicle_id">
            <get-vehicle-select-tree
              ref="vehicleTree"
              :placeholder="'选择车辆'"
              :isShowCheckbox="false"
              v-model="form.vehicle_id"
              @on-change="onSelectChange"
              :isExportMultiple="false"
              :width="'180'"
              :disabled="curSelecedType=='detail'"
            >
            </get-vehicle-select-tree>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="线路:" prop="line_id">
            <get-line-select-tree
              ref="lineTree"
              :placeholder="'选择线路'"
              :isShowCheckbox="false"
              v-model="form.line_id"
              :isExportMultiple="false"
              :width="'180'"
              :disabled="curSelecedType=='detail'"
            >
            </get-line-select-tree>
          </el-form-item>
          <el-form-item label="所属组织:" prop="group_name">
            <el-input
              placeholder="请选择所属组织"
              v-model="form.group_name"
              disabled
            ></el-input>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="燃料类型:" prop="fuel_kind">
            <el-input
              placeholder="请选择燃料类型"
              v-model="form.fuel_kind"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="车辆型号:" prop="name">
            <el-input
              placeholder="请选择车辆型号"
              v-model="form.name"
              disabled
            ></el-input>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="累积公里数:" prop="total_mile">
            <el-input
              placeholder="请选择累积公里数"
              v-model="form.total_mile"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item :label="`${form.upkeep_type === 1?'一保':form.upkeep_type === 2?'二保':''}周期公里数:`" prop="time_mile">
            <el-input
              placeholder="请选择周期公里数"
              v-model="form.time_mile"
              disabled
            ></el-input>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="里程更新日期:" prop="name">
            <span style="color: #D9001B; font-weight: 600">{{ form.odometer }} &nbsp;&nbsp;&nbsp;</span>
            <el-button type="primary" @click="updateMileage" style="margin-right: 30px;" :disabled="curSelecedType=='detail'">更新里程</el-button>
          </el-form-item>
          <el-form-item label="最近一保日期:" prop="last_keep_time">
            <el-date-picker
              v-model="form.last_keep_time"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              disabled
            >
            </el-date-picker>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="最近二保日期:" prop="last_keep_time2">
            <el-date-picker
              v-model="form.last_keep_time2"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              disabled
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="保养类型:" prop="upkeep_type">
            <el-select v-model="form.upkeep_type" placeholder="请选择保养类型" @change="selectedUpKeepType" :disabled="curSelecedType=='detail'">
              <el-option
                v-for="item in maintainOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

        </div>
        <div class="show-flex-box-r">
          <el-form-item label="计划保养日期:" prop="plan_date">
            <el-date-picker
              v-model="form.plan_date"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              :disabled="curSelecedType=='detail'"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="计划修理工:" prop="repair_person_ids">
            <el-select
              v-model="form.repair_person_ids"
              clearable
              filterable
              multiple 
              placeholder="请选择"
              :disabled="curSelecedType=='detail'"
            >
              <el-option
                v-for="item in repair_men"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="备注:" prop="remark">
            <el-input
              type="textarea"
              :disabled="curSelecedType=='detail'"
              :autosize="{ minRows: 4, maxRows: 8}"
              placeholder="请输入详细备注"
              v-model="form.remark"
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer" v-if="curSelecedType !=='detail'">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getCarcodeSelectTree from "@/components/base/formModel/tree/get-carcode-select-tree";
import getLineSelectTree from "@/components/base/formModel/tree/get-line-select-tree";
export default {
  components: {
    getCarcodeSelectTree,
    getVehicleSelectTree,
    getLineSelectTree
  },
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "编辑",
    },
    curSelecedType: [String],
  },
  mounted() {
    this.reqCurTimeDate();
  },
  data() {
    return {
      maintainOptions: [
        {
          value: 1,
          label: "一保",
        },
        {
          value: 2,
          label: "二保",
        },
      ],
      repair_men:[], //修理工
      form: {
        id: "",
        vehicle_id: "",
        line_id: "",
        upkeep_type: "",
        odometer: "",
        plan_date: "",
        repair_person_ids: [],
        remark: "",
        total_mile: "",
        time_mile: "",

        // 
        group_name: "",
        fuel_kind:"",
        name: "",
        last_keep_time: "",
        last_keep_time2: "",
      },
      basicRules: {
        vehicle_id: [
          { required: true, message: "请选择车牌号", trigger: "change" },
        ],
        upkeep_type: [
          { required: true, message: "请选择保养类型", trigger: "change" },
        ],
        plan_date: [
          { required: true, message: "请选择保养日期范围", trigger: "change" },
        ],
      },
      isFirstLoad: false,
      curVehiclePlanInfo: {}
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
        this.resetForm();
      }else{
        this.$nextTick( () => {
          this.getRepairMan();
          this.reqCurTimeDate();
          this.$refs["form"].resetFields();
        })
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 获取修理工
    getRepairMan() {
      this.$client
        .getPersonsMaintRepairReport()
        .then((res) => {
          // console.log(JSON.stringify(res))
          if (res.head.result == "200") {
            this.repair_men = res.context;
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
        .catch((err) => {});
    },
    reqCurTimeDate() {
      const date = new Date();
      const year = date.getFullYear(); //年 ,从 Date 对象以四位数字返回年份
      let month = date.getMonth() + 1; //月 ,从 Date 对象返回月份 (0 ~ 11) ,date.getMonth()比实际月份少 1 个月
      let day = date.getDate(); //日 ,从 Date 对象返回一个月中的某一天 (1 ~ 31)
      //修改月份格式
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      //修改日期格式
      if (day >= 0 && day <= 9) {
        day = "0" + day;
      }
      //获取当前系统时间  格式(yyyy-mm-dd hh:mm:ss)
      this.form.odometer = year + "-" + month + "-" + day;
    },
    selectedTime: function () {
      if (this.date && this.date.length > 0) {
        this.form.start = this.date[0];
        this.form.end = this.date[1];
      } else {
        this.form.start = "";
        this.form.end = "";
      }
    },
    // 车辆选择
    onSelectChange(vehs, nodes) {
      // console.log(vehs, nodes)
      // 编辑和详情需要加一层锁
      if(this.curSelecedType != 'add') {
        if(!this.isFirstLoad  && !!this.form.vehicle_id) {
          this.isFirstLoad = true
          return
        }
        if (this.isFirstLoad && vehs && vehs.length > 0) {
          this.reqVehicleRelationInfo(vehs[0])  
        } 
      }else{
        if (vehs && vehs.length > 0) {
          this.reqVehicleRelationInfo(vehs[0])  
        } 
      }
    },
     // 获取车辆相关信息
    reqVehicleRelationInfo(car_id) {
      let params = {
        vehicle_id: car_id
      };
      this.$client.GetVehiclePlanUpKeepPlan(params).then(res => {
        if(res.head.result == '200') {
            let relationInfo = res.context;
            this.curVehiclePlanInfo = relationInfo;
            this.form.group_name = relationInfo.group_name;
            if(!!relationInfo.line_id) {
              this.form.line_id = relationInfo.line_id
            }else{
              this.form.line_id = "";
              setTimeout(() => {
                this.$refs.lineTree.onClear()
              }, 60);
            }
            this.form.name = relationInfo.name;
            this.form.fuel_kind = relationInfo.fuel_kind;
            this.form.total_mile = relationInfo.total_mile;
            this.form.last_keep_time = relationInfo.last_keep_time;
            this.form.last_keep_time2 = relationInfo.last_keep_time2;
            this.form.time_mile = '';
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
    // 更新里程(目前只更新累计公里数)
    updateMileage() {
      if(!this.form.vehicle_id) {
        this.$message({
          message: '请先选择要更新里程的车辆',
          type: 'warning'
        });
        return
      }
      let params = {
        vehicle_id: this.form.vehicle_id,
      };
      this.$client.getBeforeDayDistance(params)
      .then(res => {
        console.log(res)
        if (res.head.result == "200") {
            // this.form.time_mile = res.context.time_distance;
            this.form.total_mile = res.context.total_distance;
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
      }).catch(err => {
          this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
      })
    },
    // 选择保养类型带出当前保养类型下的周期公里数
    selectedUpKeepType(val) {
      if(!this.form.vehicle_id) {
        this.form.upkeep_type = '';
        this.form.time_mile = '';
        this.$message({
          message: '请先选择要保养的车辆',
          type: 'warning'
        });
        return
      }
      if(val === 1) {
        this.form.time_mile = this.curVehiclePlanInfo.time_mile;
      }else{
        this.form.time_mile = this.curVehiclePlanInfo.time_mile2;
      }
    },
    updatePlaybill(formName) {
       this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit("save-add-edit-upKeep-plan", this.form);
        } else {
          return false;
        }
      });
    },

    resetForm() {
      // 清空树选中
      this.$refs.carcodeTree.onClear();
      this.$refs.vehicleTree.onClear();
      this.$refs.lineTree.onClear();
      this.isFirstLoad = false;
      this.$refs["form"].resetFields();
    },
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>

.el-dialog-div /deep/ .el-date-editor {
  width: 200px;
}

.el-dialog-div /deep/.el-select, .el-select--mini {
  width: 200px;
}

.el-dialog-div /deep/ .el-input, .el-input--mini {
  width: 200px;
}

.el-dialog-div /deep/ .el-textarea {
  width: 540px;
}
</style>

