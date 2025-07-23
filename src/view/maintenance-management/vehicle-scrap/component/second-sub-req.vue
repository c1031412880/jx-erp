<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item>
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始报废日期"
            end-placeholder="结束报废日期"
            @change="selectedTime"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="车辆:">
          <!-- <get-vehicle-select-tree
            ref="vehicleTree"
            :placeholder="'选择车辆'"
            :isShowCheckbox="true"
            v-model="form.ids"
            :isExportMultiple="true"
            :width="'180'">
          </get-vehicle-select-tree> -->
          <el-select v-model="form.vehicle_id" clearable filterable placeholder="选择车辆">
            <el-option
              v-for="item in secondVehicleData"
              :key="item.vehicle_id"
              :label="item.lp_num"
              :value="item.vehicle_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="燃料类别:" v-if="activeName == 'second'">
          <tr-select-dictionaries 
            v-model="form.fuel_type" 
            :classKey="'燃料类别'" 
            :placeholder="'请选择'">
          </tr-select-dictionaries>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm()" icon="el-icon-refresh-left">重置</el-button>
        </el-form-item>

        <el-form-item>
          <el-button @click="onBtn('export')" icon="el-icon-upload2" v-if="$isPowerShow('export')"
          >导出</el-button
          >
        </el-form-item>
      </el-row>
   
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
  export default {
    props:{
      activeName:[String],
      secondVehicleData:[Array]
    },
    components:{
      getVehicleSelectTree,
    },
    mounted() {
      // this.onSubmit();
    },
    data() {
      return {
        date: '',
        form: {
          dis_date_start: '',
          dis_date_end: "",
          vehicle_id: "",
          fuel: "",
          check_state: 1
        },
      };
    },
    methods: {
      selectedTime() {
        if(this.date && this.date.length>0) {
          this.data = this.$addTime(this.date)
          this.form.dis_date_start = this.data[0]
          this.form.dis_date_end = this.data[1]
        }else{
          this.form.dis_date_start = ''
          this.form.dis_date_end = ''
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
        this.onSubmit();
        setTimeout(() => {
          this.$message({ message: "重置成功", type: "success" });
        }, 50);
      },
      // 添加编辑
      onBtn(com) {
        this.$emit(`on-${com}`);
      },
      // 打开自定义表头设置
      openSettingPage() {
        this.$parent.openSettingPageEvent();
      },
      // 刷新列表
      refreshTableList() {
        this.onSubmit();
        setTimeout(() => {
          this.$message({ message: "刷新成功", type: "success" });
        }, 50);
      },
      // 打开高级筛选
      AdvancedSet() {
        this.$parent.openAdvancedFilterPage();
      },
    },
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
