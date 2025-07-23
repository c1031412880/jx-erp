<template>
  <div>
    <el-form v-model="form" :inline="true" size="mini">
      <el-row>
        <el-form-item label="车辆:">
          <get-vehicle-select-dialog
            ref="vehicleTree"
            :placeholder="'选择车辆'"
            :isShowCheckbox="true"
            v-model="form.vehicle_ids	">
          </get-vehicle-select-dialog>
        </el-form-item>
        <el-form-item>
          <el-button 
            @click="onSubmit"
            type="primary" 
            icon="el-icon-search" 
            >查询</el-button>
        </el-form-item>

        <el-form-item>
          <el-button
            @click="resetForm()"
            type="" 
            icon="el-icon-refresh-right"
            >重置</el-button>
        </el-form-item>

        <!-- <el-form-item>
          <el-button
            @click="onBtn('export')"
            icon="el-icon-download" 
            v-if="$isPowerShow('export')"
          >导出</el-button>
        </el-form-item> -->
      </el-row>
    </el-form>
  </div>
</template>
<script type="text/ecmascript-6">
  import getVehicleSelectDialog from "@/components/base/formModel/tree/get-vehicle-select-dialog";
export default {
  components: { 
    getVehicleSelectDialog
  },
  data() {
    return {
      form: {
        vehicle_ids: [],
      },
    }
  },
  mounted() {
    this.onSubmit()
  },

  methods: {
    // 查询
    onSubmit () {
      this.$emit("on-ok", this.form);
    },
    
    // 重置
    resetForm() {
      this.form.vehicle_ids = [];
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 100);
    },

    // 导出Excel
    onBtn(type) {
      this.$emit(`on-${type}`);
    },
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped></style>