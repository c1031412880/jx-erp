<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="统计月份：">
          <el-date-picker
            v-model="form.year_month"
            type="month"
            value-format="yyyy-MM"
            placeholder="选择月份"
            :clearable="false">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="车辆：">
         <get-vehicle-select-tree
            ref="vehicleTree"
            :placeholder="'选择车辆'"
            :isShowCheckbox="true"
            v-model="form.vehicle_ids">
          </get-vehicle-select-tree>
        </el-form-item>
        <el-form-item>
          <div class="show-flex-box-r">
            <el-select v-model="type" style="width: 100px;" placeholder="请选择部门类型">
              <el-option
                v-for="item in tyreOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <get-department-select
              ref="baseEnterTree"
              :isShowCheckbox="true"
              :funcType="1"
              v-model="target_dept_id"
              :isExportMultiple="true"
            ></get-department-select>
          </div>
        </el-form-item>
        <el-form-item label="分公司">
          <el-select v-model="form.dept_ids" v-loading="deptLoading" placeholder="请选择" multiple>
            <el-option
              v-for="item in branchOffice"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button 
            type="primary" 
            @click="onSubmit"
            icon="el-icon-search" 
            >查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="" 
            @click="resetForm"
            icon="el-icon-refresh-right"
            >重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="$isPowerShow('export')"
            @click="onBtn('export')" 
            icon="el-icon-download" 
            >导出</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>
<script type="text/ecmascript-6">
import { getDate } from "@/utils/index";
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  components: { 
    getVehicleSelectTree,
    getDepartmentSelect
  },
  data() {
    return {
      form: {
        year_month: '',
        vehicle_ids: [],
        dept_ids: []
      },
      type: 1,
      target_dept_id: [],
      tyreOptions: [
        {value: 1, label: '原部门'},
        {value: 2, label: '调入部门'},
      ],
      deptLoading: false,
      branchOffice: []
    }
  },
  mounted() {
    this.GetDeptInfoCaches()
    this.onSetTime()
    this.onSubmit()
  },
  methods: {
    onSetTime(type = 'lastOneMonth') {
      let timeObj = getDate(type)
      this.form.year_month = timeObj.startTime.slice(0,7)
    },
    // 查询
    onSubmit () {
      let info = Object.assign({}, this.form)
      if(this.type == 1) {
        info.old_dept_ids = this.target_dept_id
      }else {
        info.target_dept_ids = this.target_dept_id
      }
      this.$emit("on-ok", info);
    },
    // 重置
    resetForm() {
      Object.assign(this.$data, this.$options.data())
      this.$refs.vehicleTree.onClear()
      this.$refs.baseEnterTree.onClear()
      this.onSubmit()
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 100);
    },
    GetDeptInfoCaches() {
      this.deptLoading = true
      this.$client.GetDeptInfoCaches({}).then(res => {
        this.deptLoading = false
        if (res.head.result === '200') {
          this.branchOffice = res.context 
        }
      })
    },
    // 导出Excel
    onBtn(type) {
      this.$emit(`on-btn-${type}`);
    },
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>