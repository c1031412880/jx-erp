<template>
  <div>
    <el-form ref="headForm" :inline="true" size="mini">
      <el-row>
        <el-form-item label="维修日期">
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="请选择日期范围"
            end-placeholder="请选择日期范围"
            @change="selectedTime"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="选择车辆">
          <get-vehicle-select-dialog
            ref="vehicleTree"
            :placeholder="'选择车辆'"
            :isShowCheckbox="true"
            v-model="form.vehicle_ids	"
          >
          </get-vehicle-select-dialog>
        </el-form-item>
        <el-form-item label="维修类别">
          <get-select-dictionaries ref="type_child" :accidentType="true" v-model="form.type_child" :classKey="'报修类别'" :placeholder="'请选择维修类别'"></get-select-dictionaries>
        </el-form-item>
        <el-form-item>
          <el-button 
          type="primary" 
          icon="el-icon-search"
          @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button 
            icon="el-icon-refresh-left"
            @click="Reset">重置</el-button>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="维修项目">
          <el-input v-model="form.item_name" placeholder="请输入维修项目"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary"
            icon="el-icon-plus"
            v-if="$isPowerShow('add')" 
            @click="onBtn('add')">添加</el-button>
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            icon="el-icon-delete"
            v-if="$isPowerShow('del')"
            @click="onBtn('del')">删除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            icon="el-icon-download"
            v-if="$isPowerShow('export')" 
            @click="onBtn('export')">导出</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="text" @click="onBtn('screen')">高级筛选</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onBtn(isSetHour ? 'set' : 'save')">{{isSetHour ? '编辑维修工时' : '保存维修工时'}}</el-button>
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
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import getVehicleSelectDialog from "@/components/base/formModel/tree/get-vehicle-select-dialog";
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
import { getDate } from "@/utils/index";
export default {
  components: {
    getVehicleSelectDialog,
    getSelectDictionaries
  },
  props: {
    isSetHour: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      date: [],
      form: {
        date_type: 1,
        start_date: '',
        end_date: '',
        vehicle_ids: [],
        type_child: '',
        item_name: '',
      }
    }
  },
  mounted() {
    this.onSetTime();
  },
  methods: {
    // 初始化时间
    onSetTime(type = "lastOneWeek") {
      let timeObj = getDate(type);
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime]);
      this.form.start_date = this.date[0];
      this.form.end_date = this.date[1];
    },
    // 修改时间
    selectedTime() {
      if (this.date && this.date.length > 0) {
        this.form.start_date = this.date[0];
        this.form.end_date = `${this.date[1]} 23:59:59`;
      } else {
        this.form.start_date = "";
        this.form.end_date = "";
      }
    },
    // 查询
    onSubmit() {
      let info = this.$outFormData(this.form)
      this.$emit("on-ok", info);
    },
    // 重置
    Reset(){
      this.onSetTime()
      this.form.item_name = ''
      this.form.type_child = null 
      // 清空车辆选中
      if(this.form.vehicle_ids.length) {
        this.$refs.vehicleTree.onClear()
      } 
      this.onSubmit()
    },
    // 添加、删除、导出
    onBtn(com) {
      this.$emit("on-" + com);
    },
    refreshTableList() {
      this.Reset();
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$parent.openSettingPageEvent();
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>