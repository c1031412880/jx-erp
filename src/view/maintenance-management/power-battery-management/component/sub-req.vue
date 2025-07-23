<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item v-if="paneType == 'scrap'" label="日期:">
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="选择开始日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            end-placeholder="选择结束日期"
            clearable
            @change="selectedTime"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="车型：">
          <get-veh-model-select v-model="form.vehicle_model_type_id" />
        </el-form-item>
        <el-form-item label="动力类别:">
          <tr-select-dictionaries
            v-model="form.power_type_id"
            :classKey="'动力类别'"
            :isMultiple="true"
            :placeholder="'请选择动力类别'"
          ></tr-select-dictionaries>
        </el-form-item>
        <el-form-item label="车辆:">
          <get-vehicle-select-tree
            ref="vehicleTree"
            :placeholder="'选择车辆'"
            :isShowCheckbox="true"
            v-model="form.vehicle_ids"
          ></get-vehicle-select-tree>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm()" icon="el-icon-refresh-right">重置</el-button>
        </el-form-item>
        <el-form-item v-if="paneType == 'entry' && $isPowerShow('add')">
          <el-button @click="onBtn('add')" type="primary" icon="el-icon-plus">添加</el-button>
        </el-form-item>
        <el-form-item v-if="paneType == 'scrap' && $isPowerShow('edit')">
          <el-button @click="onBtn('edit')" type="primary" icon="el-icon-edit">编辑</el-button>
        </el-form-item>
        <el-form-item v-if="$isPowerShow('del')">
          <el-button type="danger" icon="el-icon-delete" @click="onBtn('delete-batch')">
            删除
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('export')" type="primary" icon="el-icon-upload2">导出</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { getDate } from '@/utils/index'
import getVehicleSelectTree from '@/components/base/formModel/tree/get-vehicle-select-tree'
import getVehModelSelect from '@/components/base/formModel/select/get-veh-model-select'
export default {
  components: {
    getVehicleSelectTree,
    getVehModelSelect
  },
  data() {
    return {
      date: '',
      form: {
        query_date_start: '',
        query_date_end: '',
        power_type_id: [],
        vehicle_model_type_id: [],
        vehicle_ids: []
      }
    }
  },
  props: {
    paneType: {
      type: String,
      default: 'entry'
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
      this.form.query_date_start = this.date[0]
      this.form.query_date_end = this.date[1]
    },

    selectedTime: function () {
      if (this.date && this.date.length > 0) {
        this.date = this.$addTime(this.date)
        this.form.query_date_start = this.date[0]
        this.form.query_date_end = this.date[1]
      } else {
        this.form.query_date_start = ''
        this.form.query_date_end = ''
      }
    },
    // 查询
    onSubmit() {
      let info = {}
      for (let i in this.form) {
        if (this.form[i]) {
          if (
            this.paneType == 'scrap' ||
            (this.paneType == 'entry' && i != 'query_date_start' && i != 'query_date_end')
          ) {
            info[i] = this.form[i]
          }
        }
      }
      this.$emit('on-ok', info)
    },
    // 重置
    resetForm() {
      Object.assign(this.$data, this.$options.data())
      this.$refs.vehicleTree.onClear()
      this.onSetTime()
      this.onSubmit()
      setTimeout(() => {
        this.$message({ message: '重置成功', type: 'success' })
      }, 50)
    },
    onBtn(com) {
      this.$emit('on-' + com)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped></style>
