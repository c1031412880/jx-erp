<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="日期:">
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="选择开始日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            end-placeholder="选择结束日期"
            :clearable="paneType == 'entry'"
            @change="selectedTime"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="车辆:">
          <get-vehicle-select-tree
            ref="vehicleTree"
            :placeholder="'选择车辆'"
            :isShowCheckbox="true"
            v-model="form.vehicle_ids"
          >
          </get-vehicle-select-tree>
        </el-form-item>
        <!-- <el-form-item label="线路:">
          <get-line-selec-tree
            ref="lineTree"
            :placeholder="'选择线路'"
            :isShowCheckbox="true"
            v-model="form.line_ids"
          >
          </get-line-selec-tree>
        </el-form-item> -->
        <el-form-item label="录入人:" v-if="paneType == 'entry'">
          <get-user-select
            ref="personTree"
            :placeholder="'请选择录入人'"
            :isShowCheckbox="true"
            v-model="form.created_ids"
          >
          </get-user-select>
        </el-form-item>
        <el-form-item label="分公司:">
          <get-branch-office v-model="form.dept_ids" :multiple="true"></get-branch-office>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm()" icon="el-icon-refresh-right"
            >重置</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button
            @click="onBtn('import')"
            type="primary"
            icon="el-icon-download"
            v-if="$isPowerShow('import') && paneType == 'entry'"
            >导入</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button
            @click="onBtn('export')"
            type="primary"
            icon="el-icon-upload2"
            v-if="$isPowerShow('export')"
            >导出</el-button
          >
        </el-form-item>
      </el-row>
      <el-row v-if="paneType == 'entry'">
        <el-form-item>
          <el-button
            @click="onBtn('add')"
            type="primary"
            icon="el-icon-plus"
            v-if="$isPowerShow('add')"
            >添加</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-popconfirm
            @confirm="onBtn('delete-batch')"
            title="确定删除选中的所有记录吗？"
            v-if="$isPowerShow('del')"
          >
            <el-button slot="reference" type="primary" icon="el-icon-delete"
              >删除</el-button
            >
          </el-popconfirm>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="onBtn('batch')"
            v-if="$isPowerShow('add')"
            icon="el-icon-plus"
            >批量录入</el-button
          >
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import { getDistanceDays } from "@/utils/index";
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getVehicleSelectDialog from "@/components/base/formModel/tree/get-vehicle-select-dialog";
import getLineSelecTree from "@/components/base/formModel/tree/get-line-select-tree";
import getUserSelect from "@/components/base/formModel/tree/get-user-select-tree";
import getBranchOffice from "@/components/base/formModel/select/get-branch-office";
import { getDate } from "@/utils/index";
export default {
  components: {
    getVehicleSelectTree,
    getVehicleSelectDialog,
    getLineSelecTree,
    getUserSelect,
    getBranchOffice
  },
  data() {
    return {
      date: "",
      form: {
        date_start: "",
        date_end: "",
        vehicle_ids: [],
        line_ids: [],
        created_ids: [],
        dept_ids: []
      },
    };
  },
  props: {
    paneType: {
      type: String,
      default: "entry",
    },
  },
  mounted() {
    this.onSetTime();
    this.onSubmit();
  },
  methods: {
    onSetTime(type = "thisMonth") {
      let timeObj = getDate(type);
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime]);
      this.form.date_start = this.date[0];
      this.form.date_end = this.date[1];
      // this.generateDateArray();
    },

    selectedTime: function () {
      // this.generateDateArray();
      let maxDate =
        this.paneType == "details"
          ? getDistanceDays(this.date[0], this.date[1])
          : 0;
      if (maxDate + 1 > 31 && this.paneType == "details") {
        this.$message({
          showClose: true,
          message: "日期最多选31天！",
          type: "error",
        });
        this.onSetTime();
      }
      if (this.date && this.date.length > 0) {
        this.date = this.$addTime(this.date);
        this.form.date_start = this.date[0];
        this.form.date_end = this.date[1];
      } else {
        this.form.date_start = "";
        this.form.date_end = "";
      }
    },
    // 查询
    onSubmit() {
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }
      this.$emit("on-ok", info);
    },
    // 重置
    resetForm() {
      Object.assign(this.$data, this.$options.data());
      this.$refs.lineTree.onClear();
      if (this.paneType == "entry") {
        this.$refs.personTree.onClear();
      }
      this.onSetTime();
      this.onSubmit();
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 50);
    },
    onBtn(com) {
      this.$emit("on-" + com);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped></style>
