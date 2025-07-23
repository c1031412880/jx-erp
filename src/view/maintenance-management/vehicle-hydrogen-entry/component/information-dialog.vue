<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="600px"
  >
    <div class="el-dialog-div">
      <el-form
        :model="form"
        :rules="basicRules"
        ref="form"
        label-width="140px"
        size="mini"
      >
        <el-form-item label="日期:" prop="month">
          <el-date-picker
            v-model="form.month"
            type="date"
            format="yyyy/MM/dd"
            value-format="yyyy-MM-dd"
            placeholder="年/月/日"
            :disabled="curSelecedType == 'detail'"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="自编号(车牌号):" prop="vehicle_id">
          <get-vehicle-select-tree
            ref="vehicleTree"
            :placeholder="'选择车辆自编号'"
            :isShowCheckbox="false"
            :oilType="1"
            v-model="form.vehicle_id"
            @on-change="onSelectChange"
            :isExportMultiple="false"
            :width="'380'"
            :disabled="curSelecedType == 'detail'"
          >
          </get-vehicle-select-tree>
        </el-form-item>
        <el-form-item label="线路:" prop="line_id">
          <get-line-select-tree
            ref="lineTree"
            :isShowCheckbox="false"
            v-model="form.line_id"
            :isExportMultiple="false"
            :width="'380'"
            :disabled="true"
          >
          </get-line-select-tree>
        </el-form-item>
        <!-- <el-form-item label="所属组织:" prop="ex_department_name">
          <el-input
            placeholder="请选择所属组织"
            v-model="form.ex_department_name"
            disabled
          ></el-input>
        </el-form-item> -->

        <el-form-item label="氢气(kg):" prop="val">
          <el-input
            v-model="form.val"
            placeholder="请输入氢气消耗，保留两位小数"
            oninput="value=value.replace(/[^\d.-]/g,'')"
            @blur="form.val = $event.target.value"
            @change="changeValvue"
            :disabled="curSelecedType == 'detail'"
          ></el-input>
        </el-form-item>
        <el-form-item label="金额(元):" prop="amount">
          <el-input
            v-model="form.amount"
            placeholder="请输入金额，保留两位小数"
            oninput="value=value.replace(/[^\d.-]/g,'')"
            @blur="form.amount = $event.target.value"
            @change="changeAmount"
            :disabled="curSelecedType == 'detail'"
          ></el-input>
        </el-form-item>
        <el-form-item label="签名司机:" prop="driver_id">
          <get-driver-select-tree
            ref="driverTree"
            :isShowCheckbox="false"
            v-model="form.driver_id"
            :placeholder="'选择签名司机'"
            :isExportMultiple="false"
            :width="'380'"
            :disabled="curSelecedType == 'detail'"
          >
          </get-driver-select-tree>
        </el-form-item>
        <el-form-item label="加气员:" prop="addgas_person">
          <el-input
            v-model="form.addgas_person"
            placeholder="请输入"
            :disabled="curSelecedType == 'detail'"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注:" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            maxlength="200"
            :rows="4"
            show-word-limit
            placeholder="请输入备注"
            :disabled="curSelecedType == 'detail'"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer" v-if="curSelecedType != 'detail'">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button
        type="primary"
        @click="updatePlaybill(1)"
        v-if="curSelecedType == 'add'"
        >保存并继续添加</el-button
      >
      <!-- @keydown.ctrl="updatePlaybill(1)" -->
      <el-button type="primary" @click="updatePlaybill(2)"
        >保存并关闭</el-button
      >
      <!-- @keydown.enter="updatePlaybill(2)" -->
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getLineSelectTree from "@/components/base/formModel/tree/get-line-select-tree";
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";
import { formatDate} from '@/utils/index'
export default {
  components: {
    getVehicleSelectTree,
    getLineSelectTree,
    getDriverSelectTree
  },
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "编辑",
    },
    curSelecedType: [String],
  },
  mounted() {},
  data() {
    return {
      form: {
        id: 0,
        vehicle_id: "",
        line_id: "",
        month: "",
        val: "",
        amount: "",
        remark: "",
        driver_id: "",
        addgas_person: "",
      },
      basicRules: {
        month: [
          { required: true, message: "请选择氢气消耗月份", trigger: "change" },
        ],
        vehicle_id: [
          { required: true, message: "请选择车辆", trigger: "change" },
        ],
        val: [{ required: true, message: "请输入氢气消耗", trigger: "change" }],
        amount: [{ required: true, message: "请输入金额", trigger: "change" }],
      },
      isFirstLoad: false,
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
        this.resetData();
      } else {
        if (this.curSelecedType == "add") {
          this.setDate();
        }
        this.$nextTick(() => {
          this.$refs["form"].resetFields();
        });
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 设置默认日期为当天
    setDate() {
      this.form.month = formatDate(new Date(),'yyyy-MM-dd');
    },
    resetData() {
      this.$refs.vehicleTree.onClear();
      this.$refs.lineTree.onClear();
      this.$refs.driverTree.onClear();
    },
    // 保存继续添加  置空
    clear() {
      this.form.id = 0;
      this.form.vehicle_id = "";
      this.form.line_id = "";
      this.form.val = "";
      this.form.amount = "";
      this.form.remark = "";
      this.form.driver_id = "";
      this.form.addgas_person = "";
    },
    // 车辆选择
    onSelectChange(vehs, nodes) {
      //根据车牌号或自编号绑定线路
      if (this.form.vehicle_id) {
        this.form.line_id = nodes[0].parent_id;
      } else {
        this.$refs.lineTree.onClear();
      }
    },
    changeValvue(val) {
      if (!!val) {
        this.form.val = Number(val).toFixed(2);
      }
    },
    changeAmount(val) {
      if (!!val) {
        this.form.amount = Number(val).toFixed(2);
      }
    },
    updatePlaybill(type) {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let info = { ...this.form };
          // delete info.ex_department_name;
          this.$emit("verify-data-exists", info, type);
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

