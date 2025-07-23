<template>
  <div class="install-info" style="height:400px;overflow-x:hidden">
    <el-form ref="elForm" :model="formData" size="mini" :rules="rules"  label-width="129px">
      <div v-if="status != 3">
        <el-form-item label="更换类型:" prop="type" v-if="curChangeType != 'detail'">
          <el-radio-group
            v-model="formData.type"
            @change="changeRadio"
            :disabled="curChangeType=='detail'"
          > 
          <!-- 1使用中 2闲置 3已报废 4 修理中 -->
            <el-radio :label="1" :disabled="status == 1 || status == 3">安装</el-radio>
            <el-radio
              :label="2"
              v-if="curChangeType == 'edit'"
              :disabled="status == 2  || status == 3"
            >拆卸</el-radio>
            <el-radio
              :label="3"
              v-if="curChangeType == 'edit'"
              :disabled="status == 2  || status == 3"
            >更换车辆</el-radio>
          </el-radio-group>
        </el-form-item>

        <div v-if="formData.type == 1">
          <el-form-item label="安装车辆:" prop="install_vehicle_id">
            <get-vehicle-select-tree
              ref="vehicleTree"
              :width="'380'"
              :disabled="curChangeType=='detail'"
              :placeholder="'选择车辆'"
              :isShowCheckbox="false"
              :isExportMultiple="false"
              v-model="formData.install_vehicle_id"
              @on-change="onSelectVehicleChange"
            ></get-vehicle-select-tree>
          </el-form-item>
          <el-form-item label="所属组织:" prop="department_id">
            <get-department-select
              ref="departmentTree"
              v-model="formData.department_id"
              :width="'420'"
              :isShowCheckbox="false"
              :placeholder="'请选择所属组织'"
              :isContainEmp="false"
              :isExportMultiple="false"
              :disabled="curChangeType=='detail'"
            ></get-department-select>
         </el-form-item>
          <el-form-item label="安装日期:" :prop="!!formData.install_vehicle_id? 'install_date':''">
            <el-date-picker
              v-model="formData.install_date"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              :disabled="curChangeType=='detail'"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="安装位置:" prop="position">
             <get-select-dictionaries
              v-model="formData.position"
              :classKey="'轮胎安装位置'"
              :placeholder="'请选择安装位置'"
              :isMultiple="false"
              :disabled="curChangeType=='detail'"
              ></get-select-dictionaries>
          </el-form-item>
          <el-form-item label="旧轮胎编号:" prop="old_code">
            <el-input
              placeholder="请输入旧轮胎唯一编号"
              v-model="formData.old_code"
              :disabled="curChangeType=='detail'"
            ></el-input>
          </el-form-item>  
          <el-form-item label="备注:" prop="remark">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8}"
            placeholder="请输入备注"
            v-model="formData.remark"
            :disabled="curChangeType=='detail'"
          ></el-input>
        </el-form-item>
        <el-form-item label="说明:">
          <span
            slot="label"
            style="font-size: 11px;font-weight: 400;font-style: normal;color: rgba(102, 102, 102, 0.5);"
          >说明:</span>
          <span
            style="font-size: 12px;font-weight: 400;font-style: normal;color: rgba(102, 102, 102, 0.5);"
          >每一次轮胎安装信息都将保存到轮胎使用记录中。</span>
        </el-form-item>
        </div>

        <div v-if="formData.type == 2">
          <el-form-item label="当前安装车辆:" prop="dismantle_vehicle_id">
             <el-input
                placeholder="选择车辆"
                v-model="curInfo.vehicle_code"
                disabled
              ></el-input>
          </el-form-item>
          <el-form-item label="当前安装位置:" prop="position">
            <el-input
              placeholder="选择安装的位置"
              v-model="curInfo.position_name"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="拆卸日期:" prop="dismantle_date" >
            <el-date-picker
              v-model="formData.dismantle_date"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              @change="selectedDismantleDate"
              :disabled="curChangeType=='detail'"
            ></el-date-picker>
          </el-form-item>
        <el-form-item label="拆卸原因:" prop="dismantle_reason">
          <el-input
            type="textarea"
            placeholder="请输入拆卸原因"
            v-model="formData.dismantle_reason"
            :disabled="curChangeType=='detail'"
          ></el-input>
        </el-form-item>
          <el-form-item label="备注:" prop="remark">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8}"
            placeholder="请输入备注"
            v-model="formData.remark"
            :disabled="curChangeType=='detail'"
          ></el-input>
        </el-form-item>
        <el-form-item label="说明:">
          <span
            slot="label"
            style="font-size: 11px;font-weight: 400;font-style: normal;color: rgba(102, 102, 102, 0.5);"
          >说明:</span>
          <span
            style="font-size: 12px;font-weight: 400;font-style: normal;color: rgba(102, 102, 102, 0.5);"
          >选择拆卸后 只需要填写拆卸时间和原因，保存后系统 会将轮胎状态变为闲置中。</span>
        </el-form-item>
        </div>

        <div v-if="formData.type == 3">
          <el-form-item label="当前安装车辆:" prop="dismantle_vehicle_id">
            <el-input
                placeholder="选择车辆"
                v-model="curInfo.vehicle_code"
                disabled
              ></el-input>
          </el-form-item>
          <el-form-item label="当前安装位置:" prop="position">
            <el-input
              placeholder="选择安装的位置"
              v-model="curInfo.position_name"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="新安装车辆:" prop="install_vehicle_id">
            <get-vehicle-select-tree
              ref="newVehicleTree"
              :width="'380'"
              :disabled="curChangeType=='detail'"
              :placeholder="'选择车辆'"
              :isShowCheckbox="false"
              :isExportMultiple="false"
              v-model="formData.install_vehicle_id"
              @on-change="onSelectVehicleChange"
            ></get-vehicle-select-tree>
          </el-form-item>
          <el-form-item label="新安装位置:" prop="position">
            <get-select-dictionaries
              v-model="formData.position"
              :classKey="'轮胎安装位置'"
              :placeholder="'请选择安装位置'"
              :isMultiple="false"
            ></get-select-dictionaries>
          </el-form-item>
          <el-form-item label="安装/拆卸日期:" :prop="!!formData.install_vehicle_id? 'install_date':''">
            <el-date-picker
              v-model="formData.install_date"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              @change="selectedDismantleAndInstallDate"
              :disabled="curChangeType=='detail'"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="备注:" prop="remark">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8}"
            placeholder="请输入备注"
            v-model="formData.remark"
            :disabled="curChangeType=='detail'"
          ></el-input>
        </el-form-item>
        <el-form-item label="说明:">
          <span
            slot="label"
            style="font-size: 11px;font-weight: 400;font-style: normal;color: rgba(102, 102, 102, 0.5);"
          >说明:</span>
          <span
            style="font-size: 12px;font-weight: 400;font-style: normal;color: rgba(102, 102, 102, 0.5);"
          >选择更换车辆后 会将轮胎从原车辆改为新车辆。</span>
        </el-form-item>
        </div>
        
      </div>
    </el-form>
    <div
      class="use-table-record show-flex-box-c"
      style="margin:0 20px;"
      v-if="curChangeType != 'add'"
    >
      <span style="font-size: 14px;color: #606266;font-weight: 700; margin-bottom:20px;">历史车辆使用记录:</span>
      <div class="table">
        <tr-table
          :selectionShow="false"
          :data="containerVehicleRecode"
          :tableHeaderList="canRendererTableHeader"
          :isShowBottomOptions="false"
          :TableHeight="TableHeight"
          :loading="loading"
          :frontFixedNum="frontFixedNum"
          :backFixedNum="backFixedNum"
        >
          <template slot-scope="scope" slot="c_lincense_plate_number">
            <span v-if="scope.data.vehicle_info">{{scope.data.vehicle_info.c_name}}</span>
          </template>
          <template slot-scope="scope" slot="c_vehicle_number">
            <span v-if="scope.data.vehicle_info">{{scope.data.vehicle_info.c_number}}</span>
          </template>
        </tr-table>
      </div>
    </div>
  </div>
</template>
<script>
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import {compareDate} from '@/utils/index'
export default {
  components: { 
    getVehicleSelectTree,
    getSelectDictionaries,
    getDepartmentSelect },
  props: {
    curChangeType: {
      type: String,
      default: "add"
    },
    containerVehicleRecode: [Array,Object] //历史车辆使用记录
  },
  data() {
    return {
      formData: {
        type: 1, //1安装 2拆除 3更换车辆
        install_vehicle_id: '',
        install_date: "",
        position: "",
        dismantle_date: "",
        dismantle_reason:"",
        old_code:"",
        remark: "",
        department_id: ''
      },
      rules: {
        install_date: [
          {
            required: true,
            message: "请选择安装/拆卸日期",
            trigger: "change",
          },
        ],
      },
      frontFixedNum: 0, //前几行固定
      backFixedNum: 0, //后几行固定
      canRendererTableHeader: [
        {
          id: 1,
          label: "自编号",
          prop: "vehicle_number",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false
        },
        {
          id: 2,
          label: "车牌号",
          prop: "vehicle_code",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false
        },
        {
          id: 3,
          label: "安装日期",
          prop: "install_date",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false
        },
        {
          id: 4,
          label: "安装位置",
          prop: "position_name",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false
        },
        {
          id: 5,
          label: "拆卸日期",
          prop: "dismantle_date",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false
        },
        {
          id: 6,
          label: "拆卸原因",
          prop: "dismantle_reason",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false
        },
        {
          id: 7,
          label: "随车行驶里程(KM)",
          prop: "mileage",
          width: "165",
          align: "center",
          signIndex: 6,
          sortable: false
        },
        {
          id: 8,
          label: "备注",
          prop: "remark",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: false
        }
      ],
      data: [], //历史车辆使用记录
      TableHeight: 350,
      loading: false,
      vehicleName: "",
      status: 2, //发动机状态 1使用中 2闲置 3已报废 4 修理中 1使用中 2闲置 3已报废 4 修理中
      curInfo: {}, //当前轮胎信息
    };
  },
  computed: {},
  watch: {},

  methods: {
    // 初始化数据
    resetData() {
      this.formData.type = 1
      this.formData.install_vehicle_id = ''
      this.formData.install_date = ''
      this.formData.position = ''
      this.formData.remark = ''
      this.formData.dismantle_date = ''
      this.formData.dismantle_reason = ''
      this.formData.department_id = ''
      this.formData.old_code = ''
      this.$refs.departmentTree.onClear();
      // if (
      //   this.formData.type == 1 ||
      //   this.formData.type == 2 ||
      //   this.formData.type == 3
      // ) {
      //   // 清空当前车辆选中
        setTimeout(() => {
         this.formData.type = 1
        }, 60);
      // }
      // if (this.formData.type == 3) {
      //   // 清空新车辆选中
      //   this.$refs.newVehicleTree.onClear();
      // }

      // this.$refs['elForm'].resetFields()
      Object.assign(this.$data, this.$options.data());
      this.formData.type = 1;


    },
    // 选择拆卸日期
    selectedDismantleDate(val) {
      // console.log(this.curInfo.tyre_vehicle_info.install_date,val)
      if(val && this.curInfo.tyre_vehicle_info && this.curInfo.tyre_vehicle_info.install_date) {
        if(!compareDate(this.curInfo.tyre_vehicle_info.install_date,val)) {
          this.formData.dismantle_date = '';
          this.$message({ type: "warning", message: "拆卸日期不能在安装日期之前" });
        }
      }
    },
    // 安装/拆卸日期
    selectedDismantleAndInstallDate(val) {
       if(val && this.curInfo.tyre_vehicle_info && this.curInfo.tyre_vehicle_info.install_date) {
        if(!compareDate(this.curInfo.tyre_vehicle_info.install_date,val)) {
          this.formData.install_date = '';
          this.$message({ type: "warning", message: "安装/拆卸日期不能在安装日期之前" });
        }
      }
    },
    // 选择车辆
    onSelectVehicleChange(keys, nodes) {
      console.log(keys, nodes)
      if (nodes && nodes.length > 0) {
        this.rules.install_date[0].message = `${this.formData.type == 1? '请选择安装日期': this.formData.type == 3?'请选择安装/拆卸日期':''}`
        console.log(this.rules.install_date[0].message)
        this.$refs.elForm.validateField("install_date");
      }
    },
    // 数据回显
    setData(val) {
      console.log(this.containerVehicleRecode,'cgq')
      this.curInfo = val;
      this.status = val.state;
      if(!!val) {
        // 1使用中 2闲置 3已报废 4 修理中
        if(this.curChangeType == 'edit') {
          if(this.status == 1) {
            this.formData.type = 2
            this.formData.install_vehicle_id = val.vehicle_id
            this.formData.position = val.position? Number(val.position) : ''
          }

            // 如果存在 则表示从出库单带出  默认为安装  
          if (val.repair_code) {
            this.formData.type = 1
            this.formData.install_date = val.buy_date
            this.formData.old_code = val.old_code
            if (val.tyre_vehicle_info) {
              this.formData.install_vehicle_id = val.tyre_vehicle_info.vehicle_id
              this.formData.department_id = val.tyre_vehicle_info.department_id
            }
            if (val.code) {
              this.formData.type = 2
            }
          }
        }
        if(this.curChangeType == 'detail') {
          if(this.status == 1) {
            this.formData.type = 1
            this.formData.old_code = val.old_code
            this.formData.install_vehicle_id = val.vehicle_id
            this.formData.install_date = val.tyre_vehicle_info &&　val.tyre_vehicle_info.install_date
            this.formData.position = val.position? Number(val.position) : ''
            this.formData.remark = val.tyre_vehicle_info &&　val.tyre_vehicle_info.remark
          }
        }
      }
    },
    // 选择类型给表单赋值
    changeRadio(type) {
      switch (type) {
        case 2:
          this.formData.dismantle_date = "";
          this.formData.dismantle_reason = "";
          this.formData.remark = "";
          break;
        case 3:
          this.formData.install_vehicle_id = "";
          this.formData.install_date = "";
          this.formData.position = "";
          this.formData.remark = "";
          this.$refs.newVehicleTree.onClear();
          break;
      }
    },
    // 给父级页面提供得获取本页数据
    getData() {
      // 检查判断关联参数
      if (this.formData.type == 1 && !!this.formData.install_vehicle_id && !this.formData.install_date) {
        this.$message({ type: "warning", message: "请选择安装日期" });
        return;
      }
      if (this.formData.type == 1 && !!this.formData.install_vehicle_id && !!this.formData.install_date && !this.formData.position) {
        this.$message({ type: "warning", message: "请选择安装位置" });
        return;
      }

      if (this.formData.type == 3 && !!this.formData.install_vehicle_id && !this.formData.install_date) {
        this.$message({ type: "warning", message: "安装/拆卸日期" });
        return;
      }

      let info = {
        type: this.formData.type
      };
      // 组合传递参数
      if(this.formData.type == 1) {
        info.install_date = this.formData.install_date
        info.department_id = this.formData.department_id
        info.old_code = this.formData.old_code
        if(info.install_date) {
          info.install_vehicle_id = this.formData.install_vehicle_id
          info.position = this.formData.position
          info.remark = this.formData.remark
        }else{
          info = {}
        }
      }
      if(this.formData.type == 2) {

        info.dismantle_date = this.formData.dismantle_date
        if(info.dismantle_date) {
          info.dismantle_vehicle_id = this.curInfo.vehicle_id
          // info.position = this.formData.position
          info.dismantle_reason = this.formData.dismantle_reason
          info.remark = this.formData.remark
        }else{
          info = {}
        }
        // info.dismantle_date = this.formData.dismantle_date
        // info.dismantle_vehicle_id = this.curInfo.vehicle_id
        //   // info.position = this.formData.position
        //   info.dismantle_reason = this.formData.dismantle_reason
        //   info.remark = this.formData.remark
        
      }
      if(this.formData.type == 3) {

        info.install_date = this.formData.install_date
        if(info.install_date) {
          info.dismantle_vehicle_id = this.curInfo.vehicle_id
          info.dismantle_date = this.formData.install_date
          info.install_vehicle_id = this.formData.install_vehicle_id
          info.position = this.formData.position
          info.install_date = this.formData.install_date
          info.remark = this.formData.remark
        }else{
          info = {}
        }
        // info.dismantle_vehicle_id = this.curInfo.vehicle_id
        // info.dismantle_date = this.formData.install_date
        // info.install_vehicle_id = this.formData.install_vehicle_id
        // info.position = this.formData.position
        // info.install_date = this.formData.install_date
        // info.remark = this.formData.remark
      }

      // console.log(this.formData,info, 'ccccc')
      // return
      return new Promise((resolve, reject) => {
        this.$refs["elForm"].validate(valid => {
          if (!valid) {
            reject({
              result: 400,
              msg: "获取失败,带星号的为必填项"
            });
            return;
          }
          resolve({
            formData: info,
            result: 200,
            msg: "获取成功"
          });
        });
      });
    }
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>

.install-info  /deep/ .el-date-editor {
    width: 420px;
  }
.install-info  /deep/.el-select,.el-select--mini {
  width: 420px;
}
.install-info  /deep/ .el-input,.el-input--mini{
  width: 420px;
}


</style>

