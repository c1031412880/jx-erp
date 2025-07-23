<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="工单状态:">
          <el-select v-model="form.order_state" placeholder="请选择处理状态" clearable>
            <el-option
              v-for="item in workOrderStatus"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工单编号或信访编号:">
          <el-input
            placeholder="请输入工单编号或信访编号"
            clearable
            v-model="form.content"
          ></el-input>
        </el-form-item>
        <el-form-item label="信息来源:">
          <get-select-dictionaries
            v-model="form.message_sources"
            :classKey="'乘客服务信息来源'"
            :placeholder="'请选择信息来源'"
            :isMultiple="true"
            :collapseTags="true"
          ></get-select-dictionaries>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="form.time_type" :clearable="false" style="width: 120px">
            <el-option
              v-for="item in timeType"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
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
        <el-form-item label="责任部门:">
          <get-department-select
            ref="personalTree"
            v-model="form.duty_departments"
            :isShowCheckbox="true"
            :placeholder="'请选择责任部门'"
            :isContainEmp="false"
            :show_all="true"
            :isExportMultiple="true"
          ></get-department-select>
        </el-form-item>
        <!-- <el-form-item label="反映人:">
          <el-input placeholder="请输入反映人" clearable v-model="form.call_name"></el-input>
        </el-form-item> -->
        <el-form-item label="反映人电话:">
          <el-input placeholder="请输入反映人电话" clearable v-model="form.call_phone"></el-input>
        </el-form-item>
        <el-form-item label="自行车号:">
          <el-input placeholder="请输入自行车号" clearable v-model="form.bicycle_number"></el-input>
        </el-form-item>
        <el-form-item label="是否有责:">
          <get-select-dictionaries
            v-model="form.is_duty"
            :classKey="'乘客服务是否有责'"
            :placeholder="'请选择是否有责'"
          ></get-select-dictionaries>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="form.content_reply_type" :clearable="false" style="width: 120px">
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
            v-model="form.content_reply"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="工单所属:">
          <el-checkbox-group v-model="form.order_affiliation" @change="form.order_type = []">
            <el-checkbox :label="1">公交车</el-checkbox>
            <el-checkbox :label="2">自行车</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item
          label="工单类型:"
          v-if="form.order_affiliation.length == 1 && form.order_affiliation[0] == 1"
        >
          <get-select-dictionaries
            v-model="form.order_type"
            :classKey="'乘客服务工单类型'"
            :placeholder="'请选择工单类型'"
            :isMultiple="true"
          ></get-select-dictionaries>
        </el-form-item>
        <el-form-item
          label="工单类型:"
          v-if="form.order_affiliation.length == 1 && form.order_affiliation[0] == 2"
        >
          <get-select-dictionaries
            v-model="form.order_type"
            :classKey="'乘客服务工单类型自行车'"
            :placeholder="'请选择工单类型'"
            :isMultiple="true"
          ></get-select-dictionaries>
        </el-form-item>
        <el-form-item label="超时状态:">
          <el-checkbox-group v-model="form.over_due">
            <el-checkbox :label="1">已逾期</el-checkbox>
            <el-checkbox :label="2">未逾期</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="是否需要回复:">
          <el-checkbox-group v-model="form.is_reply">
            <el-checkbox :label="1">是</el-checkbox>
            <el-checkbox :label="2">否</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="是否初重件:">
          <el-checkbox v-model="form.weight_degree" :true-label="1" false-label="">
            初件
          </el-checkbox>
          <el-checkbox v-model="form.weight_degree" :true-label="2" false-label="">
            重件
          </el-checkbox>
        </el-form-item>
        <!-- <el-form-item label="">
          <el-checkbox v-model="form.over_sort">是否根据逾期日期排序</el-checkbox>
        </el-form-item> -->
        <el-row>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="Reset" icon="el-icon-refresh-left">重置</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="onBtn('import')" type="primary" icon="el-icon-upload2">
              导入
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              @click="onBtn('export')"
              icon="el-icon-download"
              v-if="$isPowerShow('export')"
            >
              导出
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onBtn('add', 1)"
              icon="el-icon-plus"
              v-if="$isPowerShow('add')"
            >
              公交车添加
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onBtn('add', 2)"
              icon="el-icon-plus"
              v-if="$isPowerShow('add')"
            >
              自行车添加
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onBtn('delete')"
              icon="el-icon-delete"
              :disabled="isCanDelete"
              v-if="$isPowerShow('del')"
            >
              删除
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onBtn('setting')" v-if="$isPowerShow('setting')">
              设置超时级别
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onBtn('settingDuty')"
              v-if="$isPowerShow('setting-duty')"
            >
              设置责任部门经办人
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
      </el-row>
    </el-form>
  </div>
</template>

<script>
import getDriverSelectTree from '@/components/base/formModel/tree/get-driver-select-tree'
import getSelectDictionaries from '@/components/base/formModel/select/get-select-dictionaries'
import getVehicleSelectTree from '@/components/base/formModel/tree/get-vehicle-select-tree'
import getDepartmentSelect from '@/components/base/formModel/tree/get-department-select-tree'
import { getDate } from '@/utils/index'
export default {
  components: {
    getDriverSelectTree,
    getSelectDictionaries,
    getVehicleSelectTree,
    getDepartmentSelect
  },
  props: {
    isCanDelete: [Boolean]
  },
  data() {
    return {
      workOrderStatus: [
        { value: 1, name: '草稿' },
        { value: 2, name: '已下发' },
        { value: 3, name: '已受理' },
        { value: 4, name: '已办结' },
        { value: 5, name: '已驳回' },
        { value: 6, name: '审核中' },
        { value: 7, name: '审核完成' }
      ],
      timeType: [
        { value: 1, name: '受理时间' },
        { value: 2, name: '事发时间' },
        { value: 3, name: '回复时间' }
      ],
      replyType: [
        { value: 1, name: '事件简述' },
        { value: 2, name: '办理结果' },
        { value: 3, name: '备注' },
        { value: 4, name: '调查及处理结果描述' }
      ],
      form: {
        order_state: '',
        content: '',
        order_affiliation: [],
        message_sources: [],
        order_type: [],
        call_time_start: '',
        call_time_end: '',
        duty_departments: [],
        call_name: '',
        call_phone: '',
        is_reply: [],
        weight_degree: '',
        is_duty: '',
        over_due: [],
        bicycle_number: '',
        time_type: 1,
        content_reply_type: 1,
        content_reply: '',
        over_sort: false
      },
      date: []
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        console.log('------', route)
        // 如果走 id 查询    清空所有查询
        if (route.params.ids) {
          let info = {
            id: route.params.ids
          }
          this.$emit('on-detail', info)
        }
        if (route.query.ids) {
          let info = {
            id: route.query.ids
          }
          this.$emit('on-detail', info)
        }
      },
      immediate: true
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
      this.form.call_time_start = this.date[0]
      this.form.call_time_end = this.date[1]
    },
    selectedTime() {
      if (this.date && this.date.length > 0) {
        this.form.call_time_start = this.date[0]
        this.form.call_time_end = this.date[1] + ' 23:59:59'
      } else {
        this.form.call_time_start = ''
        this.form.call_time_end = ''
      }
    },
    onSubmit() {
      let info = {}
      for (let i in this.form) {
        if (this.form[i] || this.form[i] === 0) {
          info[i] = this.form[i]
        }
      }
      this.$emit('on-ok', info)
    },
    // 重置
    Reset() {
      Object.assign(this.$data.form, this.$options.data().form)
      this.$refs.personalTree.onClear()
      this.onSetTime()
      this.onSubmit()
    },
    onBtn(com, type) {
      this.$emit('on-' + com, type)
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
