<template>
  <el-form :inline="true" size="mini">
    <el-form-item label="车辆：">
      <get-vehicle-select-tree
        ref="vehicleTree"
        :placeholder="'请选择车辆'"
        :isShowCheckbox="true"
        v-model="form.vehicle_ids"
        :isExportMultiple="true">
      </get-vehicle-select-tree>
    </el-form-item>
    <el-form-item label="状态:">
      <el-select v-model="form.data_state" clearable placeholder="请选择状态">
        <el-option
          v-for="item in stateOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="受检部门：">
      <get-department-select-tree
        ref="personalTree1"
        v-model="form.dept_ids"
        :isShowCheckbox="true"
        :placeholder="'请选择受检部门'"
        :isContainEmp="false"
        :show_all="false"
        :isExportMultiple="true"
      ></get-department-select-tree>
    </el-form-item>
    <el-form-item>
      <div class="show-flex-box-r">
        <el-select v-model="form.user_type" style="width: 140px;" placeholder="请选择">
          <el-option
            v-for="item in userOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <get-department-select-tree
          ref="personalTree2"
          v-model="form.persons"
          :isShowCheckbox="true"
          :placeholder="'请选择受检部门经办人'"
          :isContainEmp="true"
          :isExportMultiple="true"
          :isCheckStrictly="false"
        ></get-department-select-tree>
      </div>
    </el-form-item>
    <el-form-item>
      <div class="show-flex-box-r">
        <el-select v-model="form.date_type" style="width: 140px;" placeholder="请选择">
          <el-option
            v-for="item in dateOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-date-picker
          v-model="date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="selectedTime"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </div>
    </el-form-item>
    <el-form-item>
      <div class="show-flex-box-r">
        <el-select v-model="form.content_type" style="width: 240px;" placeholder="请选择">
          <el-option
            v-for="item in contentOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input v-model="form.content" clearable placeholder="请输入关键词"></el-input>
      </div>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="onSubmit"
        >查询</el-button>
    </el-form-item>
    <el-form-item>
      <el-button @click="resetForm()" type="primary" icon="el-icon-refresh-right"
        >重置</el-button>
    </el-form-item>
    <el-form-item>
      <el-button @click="onBtn('export')" v-if="$isPowerShow('export')" type="primary" icon="el-icon-download">导出</el-button>
    </el-form-item>
    <el-form-item>
      <el-button @click="onBtn('add')" v-if="$isPowerShow('add')" type="primary">添加</el-button>
    </el-form-item>
    <el-form-item>
      <el-button @click="onBtn('del')" v-if="$isPowerShow('del')" type="primary">删除</el-button>
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
  </el-form>
</template>

<script type="text/ecmascript-6">
import {getDate} from '@/utils/index'
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getDepartmentSelectTree from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  components: {
    getDepartmentSelectTree,
    getVehicleSelectTree,
  },
  data() {
    return {
      date: [],
      form: {
        vehicle_ids: [],
        data_state: '',
        dept_ids: [],
        user_type: 1, // 1:制表人 2:检查单位人员 3:受检部门经办人
        persons: [],
        date_type: 1, //1:检查日期 2:反馈日期
        start_date: '',
        end_date: '',
        content_type: 1, //1:监督检查主要内容 2:检查中出现的问题 3:整改结果
        content: '',
      },
      userOptions: [
        {label: '制表人', value: 1},
        {label: '检查单位人员', value: 2},
        {label: '受检部门经办人', value: 3},
      ],
      stateOptions: [
        {label: '审批撤回', value: -2},
        {label: '审批拒绝', value: -1},
        {label: '草稿', value: 1},
        {label: '审批中', value: 2},
        {label: '待整改', value: 3},
        {label: '整改完成', value: 4},
      ],
      dateOptions: [
        {label: '检查日期', value: 1},
        {label: '反馈日期', value: 2},
      ],
      contentOptions: [
        {label: '监督检查主要内容', value: 1},
        {label: '检查中出现的问题', value: 2},
        {label: '整改结果', value: 3},
      ],
    };
  },
  mounted() {
    this.onSetTime()
    this.onSubmit()
  },
  methods: {
    onSetTime(type = 'thisMonth') {
      let timeObj = getDate(type)
      this.form.start_date = timeObj.startTime
      this.form.end_date = timeObj.endTime + ' 23:59:59'
      this.date = [timeObj.startTime, timeObj.endTime]      
    },
    selectedTime() {
      if(this.date && this.date.length>0) {
        this.form.start_date = this.date[0]
        this.form.end_date = this.date[1] + ' 23:59:59'
      } else {
        this.form.start_date = ''
        this.form.end_date = ''
      }
    },
    // 查询
    onSubmit() {
      let obj = {
        vehicle_ids: this.form.vehicle_ids && this.form.vehicle_ids.length ? this.form.vehicle_ids : null
        ,
        dept_ids: this.form.dept_ids && this.form.dept_ids.length ? this.form.dept_ids : null,
        data_state: this.form.data_state,
      }
      // 选择人员类型赋值
      switch (this.form.user_type) {
        case 1:
          obj.user_ids = this.form.persons && this.form.persons.length > 0 ? this.form.persons : null
          break;
        case 2:
          obj.check_person_ids = this.form.persons && this.form.persons.length > 0 ? this.form.persons : null
          break;
        case 3:
          obj.modify_person_ids = this.form.persons && this.form.persons.length > 0 ? this.form.persons : null
          break;
      
        default:
          break;
      }
      // 选择日期类型赋值
      switch (this.form.user_type) {
        case 1:
          obj.request_date_start = this.form.start_date
          obj.request_date_end = this.form.end_date
          break;
        case 2:
          obj.feedback_date_start = this.form.start_date
          obj.feedback_date_end = this.form.end_date
          break;
      
        default:
          break;
      }
      // 选择内容类型赋值
      switch (this.form.content_type) {
        case 1:
          obj.contents_main = this.form.content
          break;
        case 2:
          obj.contents_problem = this.form.content
          break;
        case 3:
          obj.contents_result = this.form.content
          break;
      
        default:
          break;
      }
      let info = {};
      for (let i in obj) {
        if (!!obj[i]) {
          info[i] = obj[i];
        }
      }
      this.$emit("on-ok", info);
    },
    // 重置
    resetForm() {
      Object.assign(this.$data.form, this.$options.data().form)
      this.$refs.personalTree1.onClear();
      this.$refs.personalTree2.onClear();
      this.$refs.vehicleTree.onClear();
      this.onSetTime()
      this.onSubmit()
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 50);
    },
    // 按钮事件
    onBtn(type) {
      this.$emit(`on-${type}`);
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$parent.openSettingPageEvent();
    },
    // 刷新列表
    refreshTableList() {
      this.resetForm()
      setTimeout(() => {
        this.$message({ message: "刷新成功", type: "success" });
      }, 50);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
