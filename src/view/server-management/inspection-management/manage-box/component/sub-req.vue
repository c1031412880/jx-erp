<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="检查日期:">
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="选择开始日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            end-placeholder="选择结束日期"
            @change="selectedTime"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="工单所属:">
          <el-select v-model="form.order_affiliation" placeholder="请选择工单所属" clearable>
            <el-option
              v-for="item in orderList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车牌号(自编号)">
          <get-vehicle-select-tree
            ref="vehicleTree"
            width="200"
            :placeholder="'请选择自编号'"
            :isShowCheckbox="true"
            :isExportMultiple="true"
            v-model="form.vehicle_ids"
            clearable
          ></get-vehicle-select-tree>
        </el-form-item>
        <el-form-item label="当班驾驶员:">
          <get-driver-select-tree
            ref="driverTree"
            v-model="form.driver_ids"
            :width="'220'"
            :isShowCheckbox="true"
            :placeholder="'请选择当班驾驶员'"
            :isExportMultiple="true"
            clearable
          ></get-driver-select-tree>
        </el-form-item>
        <el-form-item label="稽查方式:">
          <get-select-dictionaries
            v-model="form.check_type"
            :classKey="'稽查方式'"
            :placeholder="'请选择稽查方式'"
            :isMultiple="true"
            :collapseTags="true"
          ></get-select-dictionaries>
        </el-form-item>
        <el-form-item label="工单状态:">
          <el-select v-model="form.order_state" placeholder="请选择工单状态" clearable>
            <el-option
              v-for="item in workOrderStatus"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备状态:">
          <el-select v-model="form.device_state" placeholder="请选择设备状态" clearable>
            <el-option label="正常" :value="1"></el-option>
            <el-option label="异常" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="form.query_type" :clearable="false" style="width: 120px">
            <el-option
              v-for="item in replyType"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-input
            placeholder="请输入"
            clearable
            v-model="form.query_content"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="Reset" icon="el-icon-refresh-left">重置</el-button>
        </el-form-item>
        <!-- v-if="$isPowerShow('import')" -->
        <el-form-item>
          <el-button @click="onBtn('import')" icon="el-icon-upload2">导入</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('export')" icon="el-icon-download">导出</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onBtn('add')" icon="el-icon-plus">
            添加稽查记录
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
import { getDate } from '@/utils/index'
import getVehicleSelectTree from '@/components/base/formModel/tree/get-vehicle-select-tree'
import getDepartmentSelect from '@/components/base/formModel/tree/get-department-select-tree'
import getDriverSelectTree from '@/components/base/formModel/tree/get-driver-select-tree'
import getSelectDictionaries from '@/components/base/formModel/select/get-select-dictionaries'
export default {
  components: {
    getVehicleSelectTree,
    getDepartmentSelect,
    getDriverSelectTree,
    getSelectDictionaries
  },

  data() {
    return {
      date: [],
      form: {
        order_affiliation: '',
        vehicle_ids: [],
        driver_ids: [],
        check_type: '',
        order_state: '',
        device_state: '',
        query_type: 1,
        query_content: '',
        start_time: '',
        end_time: ''
      },
      orderList: [
        {
          value: 1,
          label: '监控稽查'
        },
        {
          value: 2,
          label: '定点稽查'
        },
        {
          value: 3,
          label: '随车动态稽查'
        }
      ],
      workOrderStatus: [
        { value: 1, name: '审核中' },
        { value: 2, name: '审核通过' },
        { value: 3, name: '审核拒绝' },
        { value: 4, name: '已撤销' },
        { value: 5, name: '草稿' },
        { value: 6, name: '已下发' },
        { value: 7, name: '已办结' },
        { value: 8, name: '待维修' }
      ],
      replyType: [
        { value: 1, name: '检查主要内容' },
        { value: 2, name: '备注' }
      ]
    }
  },
  mounted() {
    this.onSetTime()
    this.onSubmit()
  },
  methods: {
    onSetTime(type = 'thisMonth') {
      let timeObj = getDate(type)
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime])
      this.form.start_time = this.date[0]
      this.form.end_time = this.date[1]
    },
    selectedTime() {
      if (this.date && this.date.length > 0) {
        this.form.start_time = this.date[0]
        this.form.end_time = this.date[1] + ' 23:59:59'
      } else {
        this.form.start_time = ''
        this.form.end_time = ''
      }
    },
    // 查询
    onSubmit() {
      let info = this.$outFormData(this.form)
      this.$emit('on-ok', info)
    },

    // 重置
    Reset() {
      this.$refs.vehicleTree.onClear()
      this.$refs.driverTree.onClear()
      Object.assign(this.$data, this.$options.data())
      this.onSubmit()
      setTimeout(() => {
        this.$message({ message: '重置成功', type: 'success' })
      }, 100)
    },
    // 导出Excel
    onBtn(type) {
      this.$emit(`on-${type}`)
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$parent.openSettingPageEvent()
    },
    // 刷新列表
    refreshTableList() {
      this.$parent.loadData()
      setTimeout(() => {
        this.$message({ message: '刷新成功', type: 'success' })
      }, 50)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped></style>
