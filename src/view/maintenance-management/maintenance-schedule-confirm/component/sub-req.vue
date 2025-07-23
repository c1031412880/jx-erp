<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item prop="date_type">
          <el-select v-model="form.date_type" placeholder="选择日期类型">
            <el-option label="计划保养日期" :value="1"></el-option>
            <el-option label="上次一保日期" :value="2"></el-option>
            <el-option label="上次二保日期" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="selectedTimeFirst"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="车辆">
          <get-vehicle-select-dialog
            ref="vehicleTree"
            :placeholder="'选择车辆'"
            :isShowCheckbox="true"
            v-model="form.vehicle_ids	"
          >
          </get-vehicle-select-dialog>
          <!-- <get-vehicle-select-tree
            ref="vehicleTree"
            :placeholder="'选择车辆'"
            :width="'200'"
            :isShowCheckbox="true"
            v-model="form.vehicle_ids	"
          >
          </get-vehicle-select-tree> -->
        </el-form-item>
        <el-form-item label="驾驶员">
          <get-driver-select-tree
            ref="driverTree"
            v-model="form.driver_ids"
            :isShowCheckbox="true"
            :placeholder="'请选择驾驶员'"
            :isExportMultiple="true"
          ></get-driver-select-tree>
        </el-form-item>
        <el-form-item label="保养计划状态">
          <el-select v-model="form.state" clearable placeholder="选择保养计划状态">
            <el-option
              v-for="item in planStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="保养类型">
          <el-select v-model="form.upkeep_type" clearable placeholder="选择车辆保养类型">
            <el-option
              v-for="item in maintainTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm()" icon="el-icon-refresh-left"
            >重置</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="text" @click="AdvancedSet">高级筛选</el-button>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item>
          <el-button type="primary" @click="onBtn('confirm')" icon="el-icon-wind-power" v-if="$isPowerShow('confirm')"
            >确认计划</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onBtn('export')" icon="el-icon-download" v-if="$isPowerShow('export')"
            >导出计划</el-button
          >
        </el-form-item>

        <div style="float: right; height: 47px; display: flex">
          <i
            class="el-icon-refresh"
            style="margin-right: 15px; cursor: pointer"
            @click="refreshTableList()"
          ></i>
          <i
            class="el-icon-s-tools"
            style="cursor: pointer"
            @click="openSettingPage()"
          ></i>
        </div>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getVehicleSelectDialog from "@/components/base/formModel/tree/get-vehicle-select-dialog";
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";
import {getDate} from '@/utils/index'
export default {
  components: {getVehicleSelectTree,getVehicleSelectDialog,getDriverSelectTree},
  data() {
    return {
      maintainTypeOptions: [
        {
          value: 0,
          label: "全部",
        },
        {
          value: 1,
          label: "一保",
        },
        {
          value: 2,
          label: "二保",
        }
      ],
      planStatusOptions: [
        // {
        //   value: 0,
        //   label: "未下发",
        // },
        {
          value: 2,
          label: "未确认",
        },
        {
          value: 3,
          label: "已确认",
        },
        {
          value: 4,
          label: "再次确认",
        },
        // {
        //   value: 1,
        //   label: "下发退回",
        // }
      ],
      form: {
        date_type: 1,
        start:"",
        end:"",
        vehicle_ids: [],
        driver_ids: [],
        upkeep_type: 0,
        state:"",
      },
      date: [],
    };
  },
  mounted() {
    this.onSetTime()
    this.onSubmit()
  },
  methods: {
    onSetTime(type = 'thisMonth') {
      let timeObj = getDate(type)
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime])
      this.form.start = this.date[0]
      this.form.end = this.date[1]
    },
    selectedTimeFirst() {
      if(this.date && this.date.length>0) {
        this.date = this.$addTime(this.date)
        this.form.start = this.date[0];
        this.form.end = this.date[1];
      }else{
        this.form.start = '';
        this.form.end = '';
      }

    },
    selectedTime: function() {
      if(this.date && this.date.length>0) {
        this.form.upkeep_start = this.date[0];
        this.form.upkeep_end = this.date[1];
      }else{
        this.form.upkeep_start = '';
        this.form.upkeep_end = '';
      }
    },

    // 查询
    onSubmit() {
      let info = {...this.form};
      // for (let i in this.form) {
      //   if (this.form[i]) {
      //     info[i] = this.form[i];
      //   }
      // }
      this.$emit("on-ok", info);
    },
    // 重置
    resetForm() {
      Object.assign(this.$data, this.$options.data());
      this.$refs.driverTree.onClear()
      this.form.name = '';
      this.form.kind = '';
      this.onSetTime('thisMonth');
      this.onSubmit();
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 50);
    },
    // 导出 下发计划
    onBtn(com) {
      this.$emit("on-add", com);
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
