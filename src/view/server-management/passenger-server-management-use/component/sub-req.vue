<template>
  <!-- 乘客服务使用管理查询条件组件 -->
  <el-form :inline="true" size="mini">
    <!-- 时间类型和日期范围选择区域 -->
    <el-form-item label="">
      <!-- 时间类型下拉选择器：受理时间/事发时间/回复时间 -->
      <el-select v-model="form.time_type" :clearable="false" style="width: 120px">
        <el-option
          v-for="item in timeType"
          :key="item.value"
          :label="item.name"
          :value="item.value"
        ></el-option>
      </el-select>
      <!-- 日期范围选择器 -->
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
    <!-- 信息来源多选下拉框 -->
    <el-form-item label="信息来源:">
      <tr-select-dictionaries
        v-model="form.message_sources"
        :classKey="'乘客服务信息来源'"
        :placeholder="'请选择信息来源'"
        :isMultiple="true"
        :collapseTags="true"
      ></tr-select-dictionaries>
    </el-form-item>
    <!-- 责任部门/车队选择树形组件 -->
    <el-form-item label="责任部门/车队:">
      <get-department-select
        ref="personalTree"
        v-model="form.duty_departments"
        :isShowCheckbox="true"
        :placeholder="'请选择责任部门/车队'"
        :isContainEmp="false"
        :show_all="true"
        :isExportMultiple="true"
      ></get-department-select>
    </el-form-item>
    <!-- 反映人电话输入框 -->
    <el-form-item label="反映人电话:">
      <el-input placeholder="请输入反映人电话" clearable v-model="form.call_phone"></el-input>
    </el-form-item>
    <!-- 驾驶员选择树形组件 -->
    <el-form-item label="驾驶员:">
      <get-driver-select-tree
        ref="driverTree"
        v-model="form.driver_id"
        :isShowCheckbox="true"
        :placeholder="'请选择驾驶员'"
        :isExportMultiple="true"
      ></get-driver-select-tree>
    </el-form-item>
    <!-- 车辆选择树形组件 -->
    <el-form-item label="车辆:">
      <get-vehicle-select-tree
        ref="vehicleTree"
        v-model="form.vehicle_id"
        :isShowCheckbox="true"
        :placeholder="'请选择车辆'"
        :isExportMultiple="true"
      ></get-vehicle-select-tree>
    </el-form-item>
    <!-- 类别多选下拉框 -->
    <el-form-item label="类别:">
      <tr-select-dictionaries
        v-model="form.category"
        :classKey="'乘客服务类别'"
        :placeholder="'请选择类别'"
        :isMultiple="true"
        :collapseTags="true"
      ></tr-select-dictionaries>
    </el-form-item>
    <!-- 类型多选下拉框 -->
    <el-form-item label="类型:">
      <tr-select-dictionaries
        v-model="form.subtype"
        :classKey="'乘客服务类型'"
        :placeholder="'请选择类型'"
        :isMultiple="true"
        :collapseTags="true"
      ></tr-select-dictionaries>
    </el-form-item>
    <!-- 工单编号或信访编号输入框 -->
    <el-form-item label="工单编号或信访编号:">
      <el-input
        placeholder="请输入工单编号或信访编号"
        clearable
        v-model="form.content"
      ></el-input>
    </el-form-item>
    <!-- 是否有责下拉选择器 -->
    <el-form-item label="是否有责:">
      <tr-select-dictionaries
        v-model="form.is_duty"
        :classKey="'乘客服务是否有责'"
        :placeholder="'请选择是否有责'"
      ></tr-select-dictionaries>
    </el-form-item>
    <!-- 工单所属类型复选框组：公交车/自行车 -->
    <el-form-item label="工单所属:">
      <el-checkbox-group v-model="form.order_affiliation" @change="form.order_type = []">
        <el-checkbox :label="1">公交车</el-checkbox>
        <el-checkbox :label="2">自行车</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <!-- 公交车工单类型选择器（仅当选择公交车时显示） -->
    <el-form-item
      label="工单类型:"
      v-if="form.order_affiliation.length == 1 && form.order_affiliation[0] == 1">
      <tr-select-dictionaries
        v-model="form.order_type"
        :classKey="'乘客服务工单类型'"
        :placeholder="'请选择工单类型'"
        :isMultiple="true"
      ></tr-select-dictionaries>
    </el-form-item>
    <!-- 自行车工单类型选择器（仅当选择自行车时显示） -->
    <el-form-item
      label="工单类型:"
      v-if="form.order_affiliation.length == 1 && form.order_affiliation[0] == 2">
      <tr-select-dictionaries
        v-model="form.order_type"
        :classKey="'乘客服务工单类型自行车'"
        :placeholder="'请选择工单类型'"
        :isMultiple="true"
      ></tr-select-dictionaries>
    </el-form-item>
    <!-- 归档时间月份选择器 -->
    <el-form-item label="归档时间:">
      <el-date-picker
        v-model="form.archiving_time"
        type="month"
        placeholder="选择月份"
        value-format="yyyy-MM"
      ></el-date-picker>
    </el-form-item>
    <!-- 超时状态复选框组：已逾期/未逾期 -->
    <el-form-item label="超时状态:">
      <el-checkbox-group v-model="form.over_due">
        <el-checkbox :label="1">已逾期</el-checkbox>
        <el-checkbox :label="2">未逾期</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <!-- 是否需要回复复选框组：是/否 -->
    <el-form-item label="是否需要回复:">
      <el-checkbox-group v-model="form.is_reply">
        <el-checkbox :label="1">是</el-checkbox>
        <el-checkbox :label="2">否</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <!-- 是否初重件选择：初件/重件 -->
    <el-form-item label="是否初重件:">
      <el-checkbox v-model="form.weight_degree" :true-label="1" false-label="">
        初件
      </el-checkbox>
      <el-checkbox v-model="form.weight_degree" :true-label="2" false-label="">
        重件
      </el-checkbox>
    </el-form-item>
    <el-row>
      <!-- 查询按钮 -->
      <el-form-item>
        <el-button @click="onSubmit" type="primary" icon="el-icon-search">查询</el-button>
      </el-form-item>
      <!-- 重置按钮 -->
      <el-form-item>
        <el-button @click="Reset" icon="el-icon-refresh-left">重置</el-button>
      </el-form-item>
      <!-- 导出按钮 -->
      <el-form-item v-if="$isPowerShow('export')">
        <el-button @click="onBtn('export')" icon="el-icon-download">导出</el-button>
      </el-form-item>
      <!-- 公交车添加按钮 -->
      <el-form-item v-if="$isPowerShow('add')">
        <el-button type="primary" @click="onBtn('add', 1)" icon="el-icon-plus">公交车添加</el-button>
      </el-form-item>
      <!-- 自行车添加按钮 -->
      <el-form-item v-if="$isPowerShow('add')">
        <el-button type="primary" @click="onBtn('add', 2)" icon="el-icon-plus">自行车添加</el-button>
      </el-form-item>
      <!-- 删除按钮 -->
      <el-form-item v-if="$isPowerShow('del')">
        <el-button type="primary" @click="onBtn('delete')" icon="el-icon-delete">删除</el-button>
      </el-form-item>
      <!-- 设置超时级别按钮 -->
      <el-form-item v-if="$isPowerShow('setting-timeout')">
        <el-button type="primary" @click="onBtn('setting-timeout')" icon="el-icon-setting">设置超时级别</el-button>
      </el-form-item>
      <!-- 设置责任部门经办人按钮 -->
      <el-form-item v-if="$isPowerShow('setting-duty')">
        <el-button type="primary" @click="onBtn('setting-duty')" icon="el-icon-setting">设置责任部门经办人</el-button>
      </el-form-item>
      <!-- 提醒设置按钮 -->
      <el-form-item v-if="$isPowerShow('setting-reminder')">
        <el-button type="primary" @click="onBtn('setting-reminder')" icon="el-icon-setting">提醒设置</el-button>
      </el-form-item>
      <!-- 回复模板设置按钮 -->
      <el-form-item v-if="$isPowerShow('setting-reply-template')">
        <el-button type="primary" @click="onBtn('setting-reply-template')" icon="el-icon-setting">回复模板设置</el-button>
      </el-form-item>
      <!-- 管理员编辑按钮 -->
      <el-form-item v-if="$isPowerShow('admin-edit')">
        <el-button type="primary" @click="onBtn('admin-edit')" icon="el-icon-edit">管理员编辑</el-button>
      </el-form-item>
      <!-- 右侧操作图标区域 -->
      <div style="float: right; height: 47px; display: flex">
        <!-- 刷新图标 -->
        <i class="el-icon-refresh" style="margin-right: 15px; cursor: pointer" @click="refreshTableList()"></i>
        <!-- 设置图标 -->
        <i class="el-icon-s-tools" style="cursor: pointer" @click="openSettingPage()"></i>
      </div>
    </el-row>
    <!-- 工单状态切换水平菜单 -->
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="0">全部</el-menu-item>
      <el-menu-item index="8" >部门待受理 ({{ num }})</el-menu-item>
      <el-menu-item index="13">部门核实中</el-menu-item>
      <el-menu-item index="10" >车队待受理</el-menu-item>
      <el-menu-item index="11" >车队核实中</el-menu-item>
      <el-menu-item index="15" >待部门领导审核</el-menu-item>
      <el-menu-item index="17" >待分管领导审核</el-menu-item>
      <el-menu-item index="1" >草稿</el-menu-item>
      <el-menu-item index="5" >退回</el-menu-item>
    </el-menu>
  </el-form>
</template>

<script>
import { getDate } from '@/utils/index'
import getDepartmentSelect from '@/components/base/formModel/tree/get-department-select-tree'
import getDriverSelectTree from '@/components/base/formModel/tree/get-driver-select-tree'
import getVehicleSelectTree from '@/components/base/formModel/tree/get-vehicle-select-tree'

/**
 * 乘客服务使用管理查询条件组件
 * 提供多种查询条件筛选功能，包括时间范围、信息来源、责任部门、驾驶员、车辆等
 * 支持工单状态切换、数据导出、添加、删除等操作功能
 * 与passenger-server-management-new组件相比，使用了tr-select-dictionaries组件
 */
export default {
  components: {
    getDepartmentSelect, // 部门选择树形组件
    getDriverSelectTree, // 驾驶员选择树形组件
    getVehicleSelectTree // 车辆选择树形组件
  },
  data() {
    return {
      // 时间类型选项配置
      timeType: [
        { value: 1, name: '受理时间' },
        { value: 2, name: '事发时间' },
        { value: 3, name: '回复时间' }
      ],
      date: [], // 日期范围数组
      // 查询表单数据对象
      form: {
        order_state: 0, // 工单状态：0-全部 2-部门待受理 7-部门核实中 4-车队待受理 5-车队核实中 9-待部门领导审核 11-待分管领导审核 1-草稿 15-退回
        time_type: 1, // 时间类型：1-受理时间 2-事发时间 3-回复时间
        call_time_start: '', // 查询开始时间
        call_time_end: '', // 查询结束时间
        message_sources: [], // 信息来源数组
        duty_departments: [], // 责任部门数组
        call_phone: '', // 反映人电话
        driver_id: [], // 驾驶员ID数组
        vehicle_id: [], // 车辆ID数组
        category: [], // 类别数组
        subtype: [], // 类型数组
        content: '', // 工单编号或信访编号
        is_duty: '', // 是否有责
        order_affiliation: [], // 工单所属：1-公交车 2-自行车
        order_type: [], // 工单类型数组
        over_due: [], // 超时状态：1-已逾期 2-未逾期
        is_reply: [], // 是否需要回复：1-是 2-否
        weight_degree: '' // 是否初重件：1-初件 2-重件
      },
      activeIndex: '0', // 当前激活的菜单项索引
      num: 0 // 部门待受理数量统计
    }
  },
  watch: {
    $route: {
      handler: function (route) {
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
    // 组件挂载后初始化时间范围
    this.onSetTime()
    // 注意：这里注释掉了自动查询，需要手动触发
    this.onSubmit()
  },
  methods: {
    /**
     * 设置时间范围
     * @param {string} type - 时间类型，默认为'thisMonth'（本月）
     * 可选值：today, yesterday, thisWeek, lastWeek, thisMonth, lastMonth等
     */
    onSetTime(type = 'thisMonth') {
      let timeObj = getDate(type)
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime])
      this.form.call_time_start = this.date[0]
      this.form.call_time_end = this.date[1]
    },

    /**
     * 日期选择器变化事件处理函数
     * 当用户选择日期范围时，自动更新表单中的开始时间和结束时间
     */
    selectedTime() {
      if (this.date && this.date.length > 0) {
        this.form.call_time_start = this.date[0]
        this.form.call_time_end = this.date[1] + ' 23:59:59' // 结束时间设置为当天的最后一秒
      } else {
        this.form.call_time_start = ''
        this.form.call_time_end = ''
      }
    },

    /**
     * 提交查询表单
     * 过滤掉空值，只传递有效的查询条件给父组件
     */
    onSubmit() {
      let info = {}
      // 遍历表单数据，过滤掉空值
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i]
        }
      }
      // 向父组件发送查询事件
      this.$emit('on-ok', info)
    },

    /**
     * 重置查询条件
     * 恢复所有表单项到初始状态，清空选择器，重新设置时间范围
     */
    Reset() {
      // 重置表单数据到初始状态
      Object.assign(this.$data.form, this.$options.data().form)
      // 清空各个选择器的选中状态
      this.$refs.personalTree.onClear() // 清空部门选择器
      this.$refs.driverTree.onClear() // 清空驾驶员选择器
      this.$refs.vehicleTree.onClear() // 清空车辆选择器
      // 重新设置时间范围为本月
      this.onSetTime()
      // 执行查询
      this.onSubmit()
    },

    /**
     * 操作按钮事件处理函数
     * @param {string} type - 操作类型（export/add/delete/setting-timeout等）
     * @param {number} affiliation - 工单所属类型（1-公交车，2-自行车）
     */
    onBtn(type, affiliation) {
      // 向父组件发送操作事件，传递操作类型和相关参数
      this.$emit('on-' + type, type, affiliation)
    },

    /**
     * 刷新表格列表
     * 重置所有查询条件并重新查询数据
     */
    refreshTableList() {
      this.Reset()
    },

    /**
     * 打开自定义表头设置页面
     * 调用父组件的表头设置方法
     */
    openSettingPage() {
      this.$parent.openSettingPageEvent()
    },

    /**
     * 菜单选择事件处理函数
     * @param {string} key - 选中的菜单项索引值
     * 处理工单状态切换，更新当前激活菜单项并重新查询
     */
    handleSelect(key) {
      this.activeIndex = key // 更新当前激活的菜单项
      this.form.order_state = key
      this.onSubmit() // 重新执行查询
    }
  }
}
</script>

<style>
/* 组件样式（当前为空，可根据需要添加自定义样式） */
</style>