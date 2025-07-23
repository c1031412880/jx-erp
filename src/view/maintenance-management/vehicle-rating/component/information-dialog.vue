<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="600px"
    
  >
    <div class="el-dialog-div">
      <el-form :model="form" :rules="basicRules" ref="form" label-width="140px" size="mini">
        <el-form-item label="自编号:" prop="vehicle_id">
          <get-carcode-select-tree
            ref="carcodeTree"
            :placeholder="'选择车辆自编号'"
            :isShowCheckbox="false"
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
            v-model="form.vehicle_id"
            @on-change="onSelectChange"
            :isExportMultiple="false"
            :width="'380'"
            :disabled="curSelecedType=='detail'"
          >
          </get-vehicle-select-tree>
        </el-form-item>
        <el-form-item label="所属组织:" prop="group_name">
          <el-input
            placeholder="请选择所属组织"
            v-model="form.group_name"
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
        <el-form-item label="登记证书日期:" prop="reg_cert_date">
          <el-date-picker
            v-model="form.reg_cert_date"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            disabled
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="评定等级:" prop="level">
          <!-- <el-select v-model="form.status" clearable placeholder="请选择评定等级">
            <el-option
              v-for="item in gradeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select> -->
          <tr-select-dictionaries v-model="form.level" :classKey="'车辆评定等级'" :placeholder="'请选择'" :disabled="curSelecedType=='detail'"></tr-select-dictionaries>
        </el-form-item>
        <el-form-item label="评定日期:" prop="eval_date">
          <el-date-picker
            v-model="form.eval_date"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            :disabled="curSelecedType=='detail'"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="评定单位:" prop="eval_unit">
          <el-input v-model="form.eval_unit" placeholder="请输入评定单位" :disabled="curSelecedType=='detail'"></el-input>
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
  },
  data() {
    return {
      date: [],
      gradeOptions: [
        {
          value: 1,
          label: '一级'
        }, {
          value: 2,
          label: '二级'
        }, {
          value: 3,
          label: '三级'
        }
      ],
      form: {
        id: "",
        vehicle_id: "",
        line_id: "",

        reg_cert_date: "",
        line_id: "",
        level: "",
        line_id: "",
        eval_date: "",
        eval_unit: "",
        remark: "",

        // 
        group_name: "",
      },
      basicRules: {
        vehicle_id: [
          { required: true, message: "请选择车辆", trigger: "change" },
        ],
        level: [
          { required: true, message: "请选择评定等级", trigger: "change" },
        ],
        eval_date: [
          { required: true, message: "请选择评定日期", trigger: "change" },
        ],
      },
      isFirstLoad: false,
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
        this.resetData();
      }else{
        this.setDate();
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
    // 设置默认日期为当天
    setDate() {
      let date = new Date();
      // date.setTime(new Date().getTime());
      let Y = date.getFullYear()
      let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
      let D = date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()
      this.form.reg_cert_date = Y + '-' + M + '-' + D
    },
    resetData() {
      this.$refs.carcodeTree.onClear();
      this.$refs.vehicleTree.onClear();
      this.$refs.lineTree.onClear();
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
            this.form.group_name = relationInfo.group_name;
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
    updatePlaybill(formName) {
       this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = {...this.form};
          this.$emit("save-add-edit", info);
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

