<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="工单状态">
          <el-select v-model="form.i_order_state" clearable placeholder="请选择工单状态">
            <el-option label="已下发" :value="2"></el-option>
            <el-option label="已办结" :value="3"></el-option>
            <el-option label="草稿" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="自编号">
          <get-vehicle-select-tree
            ref="vehicleTree"
            width="200"
            :placeholder="'请选择自编号'"
            :isShowCheckbox="true"
            :isExportMultiple="true"
            v-model="form.i_vehicle_ids"
            clearable>
          </get-vehicle-select-tree>
        </el-form-item>
        <el-form-item label="所属组织">
          <get-department-select
            ref="deptTree"
            v-model="form.i_dept_ids"
            :placeholder="'请选择所属组织'"
            :isContainEmp="false"
            clearable>
          </get-department-select>
        </el-form-item>
        <el-form-item label="违章时间:">
          <el-date-picker
            v-model="date"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="selectedTime">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="驾驶员">
          <get-driver-select-tree
            ref="driverTree"
            v-model="form.i_driver_ids"
            :width="'220'"
            :isShowCheckbox="true"
            :placeholder="'请选择司机'"
            :isExportMultiple="true"
            clearable>
          </get-driver-select-tree>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="Reset" icon="el-icon-refresh-left">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onBtn('export')" icon="el-icon-download" v-if="$isPowerShow('export')">导出</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onBtn('add')" icon="el-icon-plus" v-if="$isPowerShow('add')">添加</el-button>
        </el-form-item>
        <el-form-item>
          <el-popconfirm
            @confirm="onBtn('delete')"
            title="确定删除选中的检查内容吗？"
            v-if="$isPowerShow('del')">
            <el-button slot="reference" type="primary" icon="el-icon-delete" size="mini">删除</el-button>
          </el-popconfirm>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onBtn('setting')" v-if="$isPowerShow('setting')">经办人设置</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";
import { getDate } from "@/utils/index";
export default {
  components: { 
    getDepartmentSelect,
    getVehicleSelectTree,
    getDriverSelectTree
     },
  data() {
    return {
      tpyeData: [],//物品分类下拉框
      date: [],
      form: {
        i_order_state: "",
        i_vehicle_ids: [],
        i_dept_ids: [],
        i_driver_ids: [],
        begin: "",
        end: "",
      }
    };
  },
  mounted() {
    this.onSetTime();
    this.onSubmit();
  },
  methods: {
    // 初始化时间
    onSetTime(type = 'thisMonth') {
      let timeObj = getDate(type)
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime])
      this.form.begin = this.date[0]
      this.form.end = this.date[1]
    },
    selectedTime: function() {
      if(this.date && this.date.length) {
        this.date = this.$addTime(this.date)
        this.form.begin = this.date[0];
        this.form.end = this.date[1];
      }else{
        this.form.begin = '';
        this.form.end = '';
      }
    },
    onSubmit() {
      let info = {};
      for (let i in this.form){
        if(this.form[i] !== ''){
          info[i] = this.form[i]
        }
      }
      this.$emit("on-ok", info);
    },
    // 重置
    Reset() {
      this.date = []
      Object.assign(this.$data.form, this.$options.data().form);
      this.$refs.vehicleTree.onClear();
      this.$refs.deptTree.onClear();
      this.$refs.driverTree.onClear();
      this.onSetTime();
      this.onSubmit();
    },
    onBtn(com) {
      this.$emit("on-" + com);
    },
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped></style>
