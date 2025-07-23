<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item>
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="选择违法开始日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            end-placeholder="选择违法结束日期"
            @change="selectedTime"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="部门:">
          <get-department-select
            ref="deptTree"
            v-model="form.i_depts"
            :isShowCheckbox="true"
            :placeholder="'请选择部门'"
            :isContainEmp="false"
            :show_all="true"
            :isExportMultiple="true"
          ></get-department-select>
        </el-form-item>
        <el-form-item label="线路:">
          <get-line-select-tree
            ref="lineTree"
            placeholder="请选择线路"
            :isShowCheckbox="true"
            :isExportMultiple="true"
            v-model="form.line_ids"
            clearable
          ></get-line-select-tree>
        </el-form-item>
        <el-form-item>
          <get-vehicle-select-dialog
            ref="vehicleTree"
            :placeholder="'选择车辆'"
            :isShowCheckbox="true"
            v-model="form.i_vehicle_ids"
          ></get-vehicle-select-dialog>
        </el-form-item>
        <el-form-item>
          <get-department-select
            ref="personalTree"
            v-model="form.dept_handle"
            :isShowCheckbox="false"
            :placeholder="'所属组织经办人'"
            :isContainEmp="true"
            :isExportMultiple="false"
          ></get-department-select>
        </el-form-item>
        <el-form-item>
          <get-driver-select-tree
            ref="driverTree"
            v-model="form.i_driver_ids"
            :isShowCheckbox="true"
            :placeholder="'请选择所事故驾驶员'"
            :isExportMultiple="true"
          ></get-driver-select-tree>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="form.i_order_state"
            placeholder="工单状态"
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="item in stateData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="Reset" icon="el-icon-refresh-left">重置</el-button>
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
          <el-popconfirm
            @confirm="onBtn('delete')"
            title="是否确删除选中的记录？"
            v-if="$isPowerShow('del')"
          >
            <el-button slot="reference" type="primary" size="mini" icon="el-icon-delete">
              删除
            </el-button>
          </el-popconfirm>
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('export')" icon="el-icon-download" v-if="$isPowerShow('export')">
            导出
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('import')" icon="el-icon-upload2" v-if="$isPowerShow('import')">
            导入
          </el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import getDriverSelectTree from '@/components/base/formModel/tree/get-driver-select-tree'
import getVehicleSelectDialog from '@/components/base/formModel/tree/get-vehicle-select-dialog'
import getDepartmentSelect from '@/components/base/formModel/tree/get-department-select-tree'
import getLineSelectTree from '@/components/base/formModel/tree/get-line-select-tree'
import { getDate } from '@/utils/index'
export default {
  components: {
    getDriverSelectTree,
    getVehicleSelectDialog,
    getDepartmentSelect,
    getLineSelectTree
  },
  data() {
    return {
      date: [], //日期
      form: {
        begin: '',
        end: '',
        i_vehicle_ids: [],
        i_driver_ids: [],
        i_depts: [],
        line_ids: [],
        dept_handle: '',
        i_order_state: ''
      },
      stateData: [
        {
          value: 1,
          label: '草稿'
        },
        {
          value: 2,
          label: '处理中'
        },
        {
          value: 3,
          label: '处理完成'
        }
      ]
    }
  },
  watch: {
    $route(val) {
      let params = val.params
      if (Object.keys(params).length) {
        Object.assign(this.form, params)
        this.date = params.date
        this.selectedTime()
        this.onSubmit()
      }
    }
  },
  created() {
    this.onSetTime()
    let params = this.$route.params
    if (Object.keys(params).length) {
      Object.assign(this.form, params)
      this.date = params.date
      this.selectedTime()
    }
    this.onSubmit()
  },
  methods: {
    selectedTime() {
      if (this.date && this.date.length > 0) {
        this.date = this.$addTime(this.date)
        this.form.begin = this.date[0]
        this.form.end = this.date[1]
      } else {
        this.form.begin = ''
        this.form.end = ''
      }
    },
    onSetTime(type = 'thisMonth') {
      let timeObj = getDate(type)
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime])
      this.form.begin = this.date[0]
      this.form.end = this.date[1]
      // console.log(this.date)
    },
    onSubmit() {
      let info = {}
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i]
        }
      }
      if (info.i_vehicle_ids.length == 0) {
        delete info.i_vehicle_ids
      }
      if (info.i_driver_ids.length == 0) {
        delete info.i_driver_ids
      }
      this.$emit('on-ok', info)
    },
    // 重置
    Reset() {
      this.date = []
      this.form.begin = ''
      this.form.end = ''
      this.form.i_vehicle_ids = []
      this.form.i_driver_ids = []
      this.form.i_order_state = ''
      this.form.dept_handle = ''
      // 清空驾驶员选中
      this.$refs.driverTree.onClear()
      this.$refs.personalTree.onClear()
      this.$refs.deptTree.onClear()
      this.onSetTime()
    },
    onBtn(com) {
      this.$emit('on-' + com)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped></style>
