<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="日期:">
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="选择违规开始日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            end-placeholder="选择违规结束日期"
            @change="selectedTime"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="责任部门:">
          <get-department-select
            ref="personalTree"
            v-model="form.department_ids"
            :isShowCheckbox="true"
            :placeholder="'请选择责任部门'"
            :isContainEmp="false"
            :show_all="true"
            :isExportMultiple="true"
          ></get-department-select>
        </el-form-item>
        <el-form-item label="车辆:">
          <!-- <get-vehicle-select-tree
            ref="vehicleTree"
            width="200"
            :placeholder="'请选择车辆'"
            :isShowCheckbox="true"
            :isExportMultiple="true"
            v-model="form.vehicle_id"
          ></get-vehicle-select-tree> -->
          <get-vehicle-select-dialog
            ref="vehicleTree"
            :placeholder="'选择车辆'"
            :isShowCheckbox="true"
            v-model="form.vehicle_id"
          ></get-vehicle-select-dialog>
        </el-form-item>
        <el-form-item label="所属组织:">
          <get-department-select
            ref="departmentTree"
            v-model="form.dept_ids"
            :isShowCheckbox="true"
            :placeholder="'请选择所属组织'"
            :isContainEmp="false"
            :show_all="true"
            :isExportMultiple="true"
          ></get-department-select>
        </el-form-item>
        <el-form-item label="驾驶员:">
          <get-driver-select-tree
            ref="driverTree"
            v-model="form.driver_id"
            :isShowCheckbox="true"
            :placeholder="'请选择驾驶员'"
            :isExportMultiple="true"
          ></get-driver-select-tree>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="Reset" icon="el-icon-refresh-left">重置</el-button>
        </el-form-item>
        <el-form-item v-if="$isPowerShow('export')">
          <el-dropdown @command="handleCommand">
            <el-button type="primary">
              导出
              <i class="el-icon-arrow-down el-icon-upload2"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="1">有图导出</el-dropdown-item>
              <el-dropdown-item command="2">无图导出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- <el-button @click="onBtn('export')" icon="el-icon-upload2" v-if="$isPowerShow('export')">导出</el-button> -->
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="处理状态:">
          <el-select v-model="form.state" placeholder="请选择处理状态" clearable>
            <el-option
              v-for="item in disposeConditionOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="violation_item" label="违规项目:">
          <get-select-dictionaries
            v-model="form.violation_item"
            :classKey="'违规项目'"
            :placeholder="'违规项目选择'"
          ></get-select-dictionaries>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            @click="onBtn('add')"
            icon="el-icon-plus"
            v-if="$isPowerShow('add')"
          >
            添加
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="onBtn('delete')"
            icon="el-icon-delete"
            v-if="$isPowerShow('del')"
            :disabled="!isCanDelete"
          >
            批量删除
          </el-button>
        </el-form-item>

        <div style="float: right; height: 47px; display: flex">
          <i
            class="el-icon-refresh"
            style="margin-right: 15px; cursor: pointer"
            @click="refreshTableList()"
          ></i>
          <i class="el-icon-s-tools" style="cursor: pointer" @click="openSettingPage()"></i>
        </div>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import getDriverSelectTree from '@/components/base/formModel/tree/get-driver-select-tree'
import getVehicleSelectTree from '@/components/base/formModel/tree/get-vehicle-select-tree'
import getSelectDictionaries from '@/components/base/formModel/select/get-select-dictionaries'
import getVehicleSelectDialog from '@/components/base/formModel/tree/get-vehicle-select-dialog'
import getDepartmentSelect from '@/components/base/formModel/tree/get-department-select-tree'
export default {
  components: {
    getDriverSelectTree,
    getVehicleSelectTree,
    getSelectDictionaries,
    getVehicleSelectDialog,
    getDepartmentSelect
  },
  props: {
    isCanDelete: [Boolean]
  },
  data() {
    return {
      isContainEmp: false, //是否显示部门下的人员
      date: [], //日期
      disposeConditionOptions: [
        //处理状态
        { value: 1, name: '未发起处理' },
        { value: 2, name: '处理中' },
        { value: 3, name: '处理完成' },
        { value: 4, name: '已驳回' },
        { value: 5, name: '已作废' }
      ],
      form: {
        violation_date_start: '',
        violation_date_end: '',
        vehicle_id: [],
        driver_id: [],
        dept_ids: [],
        department_ids: [],
        violation_item: '',
        state: ''
      },
      vehsData: [], //选中的车辆数据
      vehsKeys: [] //选中的车辆key
    }
  },
  mounted() {},
  methods: {
    selectedTime: function () {
      if (this.date && this.date.length > 0) {
        this.date = this.$addTime(this.date)
        this.form.violation_date_start = this.date[0]
        this.form.violation_date_end = this.date[1]
      } else {
        this.form.violation_date_start = ''
        this.form.violation_date_end = ''
      }
    },
    onSubmit() {
      let info = {}
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i]
        }
      }
      if (info.vehicle_id.length == 0) {
        delete info.vehicle_id
      }
      if (info.driver_id.length == 0) {
        delete info.driver_id
      }
      this.$emit('on-ok', info)
    },

    // 重置
    Reset() {
      this.date = []
      this.form.violation_date_start = ''
      this.form.violation_date_end = ''
      this.form.vehicle_id = []
      this.form.driver_id = []
      this.form.department_ids = []
      this.form.dept_ids = []
      this.form.violation_item = ''
      this.form.state = ''
      // 清空驾驶员选中
      this.$refs.driverTree.onClear()
      this.$refs.personalTree.onClear()
      this.$refs.departmentTree.onClear()
      // 清空车辆选中
      // this.$refs.vehicleTree.onClear();
      this.onSubmit()
    },
    onBtn(com) {
      this.$emit('on-' + com)
    },
    // 选择有图无图导出
    handleCommand(command) {
      this.$emit('on-export', command)
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$parent.openSettingPageEvent()
    },
    // 刷新
    refreshTableList() {
      this.Reset()
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped></style>
