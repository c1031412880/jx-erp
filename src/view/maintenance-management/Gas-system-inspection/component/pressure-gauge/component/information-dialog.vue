<template>
  <tr-dialog
    :visible="dialogBool"
    :title="title"
    @before-close="dialogClose"
    width="800px"
  >
    <div class="el-dialog-div">
      <el-form
        :model="form"
        :rules="basicRules"
        ref="form"
        label-width="160px"
        size="mini"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="自编号(车牌号):" prop="vehicle_id">
              <get-vehicle-select-tree
                ref="vehicleTree"
                :placeholder="'选择车辆'"
                :isShowCheckbox="false"
                :oilType="1"
                v-model="form.vehicle_id"
                @on-change="onSelectChange"
                @on-clear="clearVehicle"
                :isExportMultiple="false"
                :disabled="curSelecedType != 'add'"
              >
              </get-vehicle-select-tree>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="组织:" prop="vehicle_dept">
              <el-input v-model="form.vehicle_dept" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车辆型号:" prop="vehicle_model">
              <el-input v-model="form.vehicle_model" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="压力表型号:" prop="gage_model">
              <el-input v-model="form.gage_model" clearable placeholder="请输入" :disabled="curSelecedType == 'detail'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="制造商" prop="produce">
              <get-select-dictionaries
                style="width: 100%"
                v-model="form.produce"
                :classKey="'制造商'"
                :placeholder="'请选择制造商'"
                clearable
                :disabled="curSelecedType == 'detail'"
              ></get-select-dictionaries>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="压力表编号:" prop="gage_code">
              <el-input v-model="form.gage_code" clearable placeholder="请输入" :disabled="curSelecedType == 'detail'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="初始校准日期:" prop="initial_date">
              <el-date-picker
                v-model="form.initial_date"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="年-月-日"
                :disabled="curSelecedType == 'detail'"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最近一次检验日期:" prop="recently_check_date">
              <el-date-picker
                v-model="form.recently_check_date"
                type="date"
                @change="changeRecently"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                :disabled="curSelecedType == 'detail'"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检验报告编号:" prop="last_check_code">
              <el-input v-model="form.last_check_code" placeholder="请输入" :disabled="curSelecedType == 'detail'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="下次检验日期:" prop="next_check_date">
              <el-date-picker
                :disabled="curSelecedType == 'detail'"
                v-model="form.next_check_date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="curSelecedType == 'detail'">
            <div style="float:left;width: 6px;height: 18px; background: #409EFF;"></div>
            <p style="margin-left:15px;margin-bottom:15px;color:#409EFF;font-size:16px;font-weight:bold">气瓶检验记录</p>
          </el-col>
          <el-col :span="24" v-if="curSelecedType == 'detail'">
            <tr-table
              :data="form.check_records"
              :TableHeight="300"
              :tableHeaderList="customSettingList"
            ></tr-table>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer" v-if="curSelecedType != 'detail'">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill()">保 存</el-button>
    </span>
  </tr-dialog>
</template>

<script type="text/ecmascript-6">
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
export default {
  components: {
    getVehicleSelectTree,
    getSelectDictionaries
  },
  props: {
    dialogBool: Boolean,
    curSelecedType: [String],
  },
  mounted() {},
  data() {
    return {
      inspection: [],
      form: {
        id: 0,
        vehicle_id: "",
        vehicle_dept: "",
        vehicle_model: "",
        gage_model: "",
        produce: "",
        gage_code: "",
        initial_date: "",
        discontinued_record: "",
        recently_check_date: "",
        last_check_code: "",
        next_check_date: "",
        check_records: [],
      },
      basicRules: {
        vehicle_id: [
          { required: true, message: "请选择车辆", trigger: "change" },
        ],
        vehicle_dept: [
          { required: true, message: "请选择组织", trigger: "change" },
        ],
        gage_model: [
          { required: true, message: "请输入压力表型号", trigger: "change" },
        ],
        produce: [
          { required: true, message: "请选择制造商", trigger: "change" },
        ],
        gage_code: [
          { required: true, message: "请输入压力表编号", trigger: "change" },
        ],
        initial_date: [
          { required: true, message: "请选择初始校准日期", trigger: "change" },
        ],
        recently_check_date: [
          { required: true, message: "请选择最近一次检验日期", trigger: "change" },
        ],
        next_check_date: [
          { required: true, message: "请选择下次检验日期", trigger: "change" },
        ],
      },
      title: '添加压力表',
      customSettingList: [
        {
          id: 1,
          label: "自编号",
          prop: "vehicle_number",
          width: "120",
          align: "center",
          signIndex: 0,
        },
        {
          id: 2,
          label: "车牌号",
          prop: "vehicle_code",
          width: "120",
          align: "center",
          signIndex: 1,
        },
        {
          id: 3,
          label: "组织",
          prop: "vehicle_dept",
          width: "160",
          align: "center",
          signIndex: 2,
        },
        {
          id: 4,
          label: "检查日期",
          prop: "date",
          width: "150",
          align: "center",
          signIndex: 3,
        },
        {
          id: 5,
          label: "检验报告编号",
          prop: "check_code",
          width: "150",
          align: "center",
          signIndex: 4,
        },
      ],
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
        this.resetData();
      } else {
        this.$nextTick(() => {
          this.GetListGasManage()
        });
      }
    },
    curSelecedType(type){
      switch (type) {
        case 'edit':
          this.title = '编辑压力表'
          break;
        case 'detail':
          this.title = '压力表详情'
          break;
        default:
          this.title = '添加压力表'
          break;
      }
    }
  },
  methods: {
    setData(info) {
      this.$refs["form"].resetFields();
      if(!!info){
        for (const key in this.form) {
          if (Object.hasOwnProperty.call(info, key)) {
            this.form[key] = info[key];
          }
        }
      }
    },
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    resetData() {
      this.$refs.vehicleTree.onClear();
    },
    // 车辆选择
    onSelectChange(veh, node) {
      this.$client.GetVehicleInfoById({ id: veh }).then((res) => {
          if (res.head.result == "200") {
            let carInfo = res.context
              this.form.vehicle_dept = carInfo.dept_name
              this.form.vehicle_model = carInfo.vehicle_model ? carInfo.vehicle_model.name : ''
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
    //清空车辆
    clearVehicle(){
      this.form.vehicle_dept = ""
      this.form.vehicle_model = ""
    },
    // 获取 下次检验日期  
    changeRecently() {
      if (!this.form.recently_check_date) {
        this.form.next_check_date = ''
        return
      }

      let year = new Date(this.form.recently_check_date).getFullYear()
      let month = new Date(this.form.recently_check_date).getMonth() + 1
      let day = (new Date(this.form.recently_check_date).getDate()).toString().padStart(2, '0')

      if (this.inspection.length > 0) {
        let condition_type = this.inspection[0].condition_type
        let time = ''
        switch (condition_type) {
          case 1:
            month = month + 6
            if (month > 12) {
              year = year + 1
              month = month - 12
            }
            month = month.toString().padStart(2, '0')
            break;
          case 2:
            year = year + 1
            month = month.toString().padStart(2, '0')
            break;
          case 3:
            year = year + 2
            month = month.toString().padStart(2, '0')
            break;
          case 4:
            year = year + 3
            month = month.toString().padStart(2, '0')
            break;
        }
        this.form.next_check_date = `${year}-${month}-${day}`
      }
    },
    // 获取 检验规则 
    GetListGasManage() {
      this.$client.GetListGasManage().then((res) => {
          if (res.head.result == "200") {
            this.inspection = res.context.filter(item => {
              return item.rule_type == 3
            })
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
        .catch((err) => {
          this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        });
    },
    updatePlaybill() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let info = { ...this.form };
          this.$emit("on-save", info);
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

