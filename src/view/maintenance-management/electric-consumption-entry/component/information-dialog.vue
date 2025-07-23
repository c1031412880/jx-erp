<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="600px"
    
  >
    <div class="el-dialog-div">
      <el-form :model="form" :rules="basicRules" ref="form" label-width="140px" size="mini">
        <el-form-item label="" prop="">
          <span style="font-size:13px; color:#33333376">说明：仅载入燃料类别为纯电动的车辆信息</span>
        </el-form-item>
        <el-form-item label="自编号:" prop="vehicle_id">
          <get-carcode-select-tree
            ref="carcodeTree"
            :placeholder="'选择车辆自编号'"
            :isShowCheckbox="false"
            :oilType="2" 
            v-model="form.vehicle_id"
            @on-change="onSelectChange"
            :isExportMultiple="false"
            :width="'380'"
            :disabled="curSelecedType=='detail'"
          >
          </get-carcode-select-tree>
        </el-form-item>
        <el-form-item label="车牌号:" prop="vehicle_id">
          <get-vehicle-select-tree
            ref="vehicleTree"
            :placeholder="'选择车辆'"
            :isShowCheckbox="false"
            :oilType="2"
            v-model="form.vehicle_id"
            @on-change="onSelectChange"
            :isExportMultiple="false"
            :width="'380'"
            :disabled="curSelecedType=='detail'"
          >
          </get-vehicle-select-tree>
        </el-form-item>
        <el-form-item label="所属组织:" prop="ex_department_name">
          <el-input
            placeholder="请选择所属组织"
            v-model="form.ex_department_name"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="线路:" prop="line_id">
          <get-line-select-tree
            ref="lineTree"
            :placeholder="'选择线路'"
            :isShowCheckbox="false"
            v-model="form.line_id"
            :isExportMultiple="false"
            :width="'380'"
            :disabled="curSelecedType=='detail'"
          >
          </get-line-select-tree>
        </el-form-item>
        <el-form-item label="电耗月份:" prop="month">
          <el-date-picker
            v-model="form.month"
            type="month"
            format="yyyy-MM"
            value-format="yyyy-MM-dd"
            placeholder="选择月"
            :disabled="curSelecedType=='detail'">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="电耗(kwh):" prop="val">
          <el-input v-model="form.val" placeholder="请输入电耗，保留两位小数" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="form.val = $event.target.value" @change="changeValvue" :disabled="curSelecedType=='detail'"></el-input>
        </el-form-item>
        <el-form-item label="所属充电站:" prop="station_id">
          <el-select v-model="form.station_id" placeholder="请选择充电站" :disabled="curSelecedType=='detail'">
            <el-option
              v-for="item in stationDropList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注:" prop="remark">
          <el-input
            v-model="form.remark" 
            type="textarea"
            maxlength="200"
            :rows="4"
            show-word-limit
            placeholder="请输入备注"
            :disabled="curSelecedType=='detail'"></el-input>
        </el-form-item>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer" v-if="curSelecedType != 'detail'">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('form','add')" v-if="curSelecedType == 'add'">保存并继续添加</el-button>
      <el-button type="primary" @click="updatePlaybill('form','addClose')">{{curSelecedType == 'add'?'保存并关闭':'保存'}} </el-button>
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
  },
  data() {
    return {
      form: {
        id: '',
        vehicle_id: '',
        line_id: '',
        month: '',
        val: '',
        station_id:'',
        remark: '',
        source: 1,
        // 
        ex_department_name: '',
      },
      basicRules: {
        vehicle_id: [
          { required: true, message: "请选择车辆", trigger: "change" },
        ],
        ex_department_name: [
          { required: true, message: "请选择所属组织", trigger: "change" },
        ],
        month: [
          { required: true, message: "请选择电耗月份", trigger: "change" },
        ],
        val: [
          { required: true, message: "请输入电耗", trigger: "change" },
        ],
        station_id: [
          { required: true, message: "请选择所属充电站", trigger: "change" },
        ],
      },
      stationDropList:[], //充电站列表
      isFirstLoad: false,
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
        this.resetData();
      }else{
        this.reqStationDropList();
        if(this.curSelecedType == 'add') {
          this.setDate();
        }
        this.$nextTick( () => {
          this.$refs["form"].resetFields();
        })
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 设置默认日期为上一个月
    setDate() {
      let date = new Date();
      // date.setTime(new Date().getTime());
      let Y = date.getFullYear()
      // let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
      let M = date.getMonth()
      if(M == 0) {
        Y = Y - 1 
        M = 12
      }
      M = M < 10?'0' + M : M 
      let D = date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()
      this.form.month = Y + '-' + M + '-' + D
    },
    resetData(type) {
      this.$refs.carcodeTree.onClear();
      this.$refs.vehicleTree.onClear();
      this.$refs.lineTree.onClear();
      if(type == 'reset') {
        this.form.vehicle_id = ''
        this.form.line_id = ''
        this.form.val = ''
        this.form.remark = ''
        this.form.station_id = ''
        this.form.ex_department_name = ''
        this.$nextTick( () => {
          this.$refs["form"].resetFields();
        })
      }
    },
    // 获取充电站列表
    reqStationDropList() {
      this.$client.getStationDropList().then(res => {
        if(res.head.result  == '200') {
          this.stationDropList = res.context
        }else{
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
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
            this.form.ex_department_name = relationInfo.group_name;
            if(!!relationInfo.line_id) {
              this.form.line_id = relationInfo.line_id
            }else{
              this.form.line_id = "";
              setTimeout(() => {
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
    changeValvue(val) {
      if(!!val) {
        this.form.val = Number(val).toFixed(2)
      }
    },
    updatePlaybill(formName,type) {
       this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = {...this.form};
          delete info.ex_department_name
          this.$emit("save-add-edit", info,type);
        } else {
          return false;
        }
      });
    },
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div /deep/ .el-input {
  width: 420px;
}
</style>

