<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="事故日期:">
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="选择事故开始日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            end-placeholder="选择事故结束日期"
            @change="selectedTime"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="部门:">
          <get-department-select
            ref="personalTree"
            v-model="form.dept_ids"
            :isShowCheckbox="true"
            :placeholder="'请选择部门'"
            :isContainEmp="false"
            :show_all="true"
            :isExportMultiple="true"
          ></get-department-select>
        </el-form-item>
        <el-form-item label="车辆:">
          <!-- <get-vehicle-select-tree
            ref="vehicleTree"
            :placeholder="'选择车辆'"
            :width="'200'"
            :isShowCheckbox="true"
            v-model="form.i_vehicle_id"
          >
          </get-vehicle-select-tree> -->
          <get-vehicle-select-dialog
            ref="vehicleTree"
            :placeholder="'选择车辆'"
            :isShowCheckbox="true"
            v-model="form.i_vehicle_id"
          ></get-vehicle-select-dialog>
        </el-form-item>
        <el-form-item label="驾驶员:">
          <get-driver-select-tree
            ref="driverTree"
            v-model="form.i_driver_id"
            :width="'160'"
            :isShowCheckbox="true"
            :placeholder="'请选择所事故驾驶员'"
            :isExportMultiple="true"
          ></get-driver-select-tree>
        </el-form-item>
        <el-form-item label="事故责任:">
          <get-select-dictionaries
            v-model="form.i_accident_duty"
            :isMultiple="true"
            :classKey="'事故责任'"
            :placeholder="'事故责任类型'"
          ></get-select-dictionaries>
        </el-form-item>
        <el-form-item label="事故类型:">
          <get-select-dictionaries
            v-model="form.i_accident_lx"
            :isMultiple="true"
            :classKey="'事故类型'"
            :placeholder="'事故类型类型'"
          ></get-select-dictionaries>
        </el-form-item>
        <el-form-item label="事故类别:" prop="i_accident_type_category">
          <get-select-dictionaries
            v-model="form.i_accident_type_category"
            :isMultiple="true"
            :classKey="'事故类别'"
            :placeholder="'请选择事故类别'"
          ></get-select-dictionaries>
        </el-form-item>
        <!-- <el-form-item label="是否私了:" prop="is_compounding">
          <el-select v-model="form.is_compounding" clearable placeholder="请选择是否私了">
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="2"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="客伤评定无责事故:" prop="is_responsibility">
          <el-select
            v-model="form.is_responsibility"
            clearable
            placeholder="请选择客伤评定无责事故"
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处理流程状态:">
          <el-select v-model="form.status" clearable placeholder="请选择处理流程状态">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit('sub')">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="Reset" icon="el-icon-refresh-left">重置</el-button>
        </el-form-item>
        <el-form-item v-if="$isPowerShow('import_acc')">
          <el-button @click="onBtn('import')" icon="el-icon-upload2">导入</el-button>
        </el-form-item>
        <el-form-item v-if="$isPowerShow('export_acc')">
          <el-button @click="onBtn('export')" icon="el-icon-download">导出</el-button>
        </el-form-item>
        <el-form-item v-if="$isPowerShow('add_acc')">
          <el-button type="primary" @click="onBtn('add')" icon="el-icon-plus">添加</el-button>
        </el-form-item>
        <el-form-item v-if="$isPowerShow('del_acc')">
          <el-button
            type="primary"
            @click="onBtn('delete')"
            icon="el-icon-delete"
            :disabled="!isCanDelete"
          >
            删除
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onBtn('scrap')" icon="el-icon-thumb">
            打印事故报告单
          </el-button>
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="primary" @click="onBtn('scrap')" icon="el-icon-thumb"
            >打印事故等级表</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onBtn('scrap')" icon="el-icon-thumb"
            >打印事故赔偿扣款通知单</el-button
          >
        </el-form-item> -->

        <!-- <div style="float: right; height: 47px; display: flex">
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
        </div> -->
      </el-row>
    </el-form>
  </div>
</template>

<script>
import getDriverSelectTree from '@/components/base/formModel/tree/get-driver-select-tree'
import getSelectDictionaries from '@/components/base/formModel/select/get-select-dictionaries'
import getVehicleSelectTree from '@/components/base/formModel/tree/get-vehicle-select-tree'
import getVehicleSelectDialog from '@/components/base/formModel/tree/get-vehicle-select-dialog'
import getDepartmentSelect from '@/components/base/formModel/tree/get-department-select-tree'
import { getDate } from '@/utils/index'
export default {
  components: {
    getDriverSelectTree,
    getSelectDictionaries,
    getVehicleSelectTree,
    getVehicleSelectDialog,
    getDepartmentSelect
  },
  props: {
    isCanDelete: [Boolean]
  },
  data() {
    return {
      statusOptions: [
        {
          value: 1,
          label: '未发起处理'
        },
        {
          value: 2,
          label: '处理中'
        },
        {
          value: 3,
          label: '处理完成'
        },
        {
          value: 4,
          label: '已驳回'
        },
        {
          value: 5,
          label: '已作废'
        }
      ],
      date: [],
      form: {
        begin: '',
        end: '',
        i_vehicle_id: [],
        i_driver_id: [],
        dept_ids: [],
        i_accident_duty: [],
        i_accident_lx: [],
        accident_duty: '',
        accident_hour: '',
        state: '',
        status: '', //处理状态
        i_accident_type_category: '',
        is_responsibility: ''
      },
      vehsData: [], //选中的车辆数据
      vehsKeys: [] //选中的车辆key
    }
  },
  activated() {
    if (this.$route.params.date) {
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
      console.log(params)
      let keyArr = Object.keys(params)
      if (keyArr.length) {
        this.date = params.hasOwnProperty('date') ? params['date'] : []
        if (this.form.i_vehicle_id.length) {
          // 清空车辆选中
          this.$refs.vehicleTree.onClear()
        }
        if (this.form.i_driver_id.length) {
          // 清空驾驶员
          this.$refs.driverTree.onClear()
        }
        Object.assign(this.$data.form, this.$options.data().form)
      }
      keyArr.forEach(key => {
        if (this.form.hasOwnProperty(key)) {
          this.form[key] = params[key]
        }
      })
      // 时间参数置上
      if (this.date.length > 0) {
        this.form.begin = this.date[0]
        this.form.end = this.date[1]
      } else {
        this.form.begin = ''
        this.form.end = ''
      }
      if (typeof this.form.i_accident_duty == 'number' && this.form.i_accident_duty) {
        this.form.i_accident_duty = [this.form.i_accident_duty]
      }
      console.log(this.$data, params, keyArr)
    },
    onSetTime(type = 'thisMonth') {
      let timeObj = getDate(type)
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime])
      this.form.begin = this.date[0]
      this.form.end = this.date[1]
      // console.log(this.date)
    },
    selectedTime: function () {
      if (this.date && this.date.length > 0) {
        this.date = this.$addTime(this.date)
        // console.log(this.date)
        this.form.begin = this.date[0]
        this.form.end = this.date[1]
      } else {
        this.form.begin = ''
        this.form.end = ''
      }
    },
    onSubmit(a) {
      if (a) {
        this.form.accident_duty = ''
      }
      let info = {}
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i]
        }
      }
      if (info.i_accident_duty.length == 0) {
        delete info.i_accident_duty
      }
      if (info.i_vehicle_id.length == 0) {
        delete info.i_vehicle_id
      }
      if (info.i_driver_id.length == 0) {
        delete info.i_driver_id
      }
      // console.log(info)
      // return
      this.$emit('on-ok', info)
    },
    // 重置
    Reset() {
      // this.date = []
      Object.assign(this.$data.form, this.$options.data().form)
      this.onSetTime()
      if (this.form.i_vehicle_id.length) {
        // 清空车辆选中
        this.$refs.vehicleTree.onClear()
      }
      if (this.form.i_driver_id.length) {
        // 清空驾驶员
        this.$refs.driverTree.onClear()
      }
      if (this.form.dept_ids.length) {
        // 清空组织
        this.$refs.personalTree.onClear()
      }
      this.onSubmit()
    },
    onBtn(com) {
      this.$emit('on-' + com)
    }
    // // 打开自定义表头设置
    // openSettingPage() {
    //   this.$parent.openSettingPageEvent();
    // },
    // // 刷新
    // refreshTableList() {
    //   this.Reset()
    // }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped></style>
