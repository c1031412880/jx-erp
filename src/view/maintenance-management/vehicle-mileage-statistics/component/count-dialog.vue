<template>
  <el-dialog
    :visible="dialogBool"
    title="重新计算车俩里程"
    :before-close="dialogClose"
    :close-on-click-modal="false"
    append-to-body
    width="820px"
    v-loading="loading"
  >
    <el-form :inline="true" size="mini" >
      <el-row>
        <el-form-item label="统计月份：">
          <el-date-picker
            v-model="month"
            type="daterange"
            @change="changeTime"
            :clearable="false"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="车辆：">
          <get-vehicle-select-tree
            ref="vehicleTree"
            width="200"
            :placeholder="'选择车辆'"
            :isShowCheckbox="true"
            :codeAndName="true"
            v-model="form.vehicle_ids">
          </get-vehicle-select-tree>
        </el-form-item>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="add">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
export default {
  components: { 
    getVehicleSelectTree,
  },
  props: {
    dialogBool:Boolean
  },
  data() {
    return {
      form: {
        start_time: '',
        end_time: '',
        vehicle_ids: [],
      },
      month: [],
      loading: false
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        this.$refs.vehicleTree.onClear()
        Object.assign(this.$data, this.$options.data());
      }else{
      }
    },
  },
  mounted() {
    
  },
  methods: {
    setData(form) {
      this.form = Object.assign({}, form);
      this.month = [this.form.start_time,this.form.end_time]
    },
    changeTime(data) {
      this.form.start_time = data[0] + ' 00:00:00'
      this.form.end_time = data[1] + ' 23:59:59'
    },
    add() {
      let params = Object.assign({}, this.form);
      this.loading = true
      this.$client.ReCountMileVehicleOilRecordSummary(params).then(res => {
        this.loading = false
        if (res.head.result == "200") {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "success",
          });
          this.dialogClose()
          this.$emit('on-load')
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
      }).catch(err => {
        this.loading = false
      })
    },
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>


