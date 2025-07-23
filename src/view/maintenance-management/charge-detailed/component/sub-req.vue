<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="充电开始时间:">
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="selectedTime"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <!-- <get-vehicle-select-tree width="200" ref="vehicleTree" placeholder="选择车辆" :isShowCheckbox="true" v-model="form.vehicle_id"></get-vehicle-select-tree> -->
          <get-vehicle-select-dialog
            ref="vehicleTree"
            :placeholder="'选择车辆'"
            :isShowCheckbox="true"
            v-model="form.vehicle_id	"
          >
          </get-vehicle-select-dialog>
        </el-form-item>
        <el-form-item>
          <get-charge-station-select-tree ref="getChargeStationSelectTree" placeholder="选择充电站或充电桩" :isShowCheckbox="true" v-model="form.charge_id"></get-charge-station-select-tree>
        </el-form-item>
        <el-form-item label="分公司:">
          <get-branch-office v-model="form.dept_ids" :multiple="true"></get-branch-office>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm()" icon="el-icon-refresh-left">重置</el-button>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item>
          <el-button @click="onBtn('import')" icon="el-icon-upload2" v-if="$isPowerShow('import')"
          >导入</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('export')" icon="el-icon-download" v-if="$isPowerShow('export')"
          >导出</el-button
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
import getVehicleSelectTree from 'components/base/formModel/tree/get-vehicle-select-tree'
 import getChargeStationSelectTree from './get-charge-station-select-tree.vue'
 import getVehicleSelectDialog from "@/components/base/formModel/tree/get-vehicle-select-dialog";
import getBranchOffice from "@/components/base/formModel/select/get-branch-office";
import {getDate} from '@/utils/index'
export default {
  components: { getVehicleSelectTree,getChargeStationSelectTree,getVehicleSelectDialog,getBranchOffice},
  data() {
    return {
      date: '',
      form: {
        vehicle_id: [],
        charge_id: [],
        begin: '',
        end: '',
        dept_ids: []
      },
    };
  },
  watch: {
    $route() {
      this.onSetTime()
      this.setRouterForm()
      this.onSubmit()
    }
  },
  mounted() {
    this.onSetTime()
    this.setRouterForm()
    this.onSubmit()
  },
  methods: {
    // 接受跳转路由参数
    setRouterForm() {
      let params = this.$route.params
      let keyArr = Object.keys(params)
      if (keyArr.length) {
        this.date = params.hasOwnProperty('date') ? params['date'] : []
        Object.assign(this.$data.form, this.$options.data().form)
        // 清空车辆选中
        this.$refs.vehicleTree.onClear()
      }
      keyArr.forEach(key => {
        if (this.form.hasOwnProperty(key)) {
          this.form[key] = params[key]
        }
      })
      console.log(this.$data, params, keyArr)
    },
    onSetTime(type = 'lastOneMonth') {
      let timeObj = getDate(type)
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime])
      this.form.begin = this.date[0]
      this.form.end = this.date[1]
    },
    selectedTime() {
      if(this.date && this.date.length>0) {
        this.date = this.$addTime(this.date)
        this.form.begin = this.date[0]
        this.form.end = this.date[1]
      }else{
        this.form.begin = ''
        this.form.end = ''
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
      this.$refs.getChargeStationSelectTree.onClear();
      this.form.charge_id = []

      this.onSetTime()
      this.onSubmit()
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
      // alert("刷新成功")
      this.$parent.informationDialogOk();
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
