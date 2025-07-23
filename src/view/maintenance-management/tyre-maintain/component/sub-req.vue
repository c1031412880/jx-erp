<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="日期:">
          <el-date-picker
            v-model="date"
            type="daterange"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="selectedTime">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="车辆：">
          <get-vehicle-select-dialog
            ref="vehicleTree"
            :placeholder="'选择车辆'"
            :isShowCheckbox="true"
            v-model="form.vehicle_id	"
          >
          </get-vehicle-select-dialog>
          <!-- <get-vehicle-select-tree
            ref="vehicleTree"
            width="200"
            :placeholder="'选择车辆'"
            :isShowCheckbox="true"
            v-model="form.vehicle_id"
          >
          </get-vehicle-select-tree> -->
        </el-form-item>
        <el-form-item label="轮胎编号：">
         <get-tyre-code
            v-model="form.tyre_id"
          ></get-tyre-code>
        </el-form-item>
        <el-form-item label="轮胎型号：">
         <get-tyre-model
          v-model="form.tyre_mode_id"
         ></get-tyre-model>
        </el-form-item>
        <el-form-item label="审核状态:" prop="state">
          <el-select
            v-model="form.state"
            clearable
            placeholder="请选择审核状态"
          >
            <el-option
              v-for="item in stateTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处理方式:" prop="treatment_method">
          <el-select
            v-model="form.treatment_method"
            clearable
            placeholder="请选择处理方式"
          >
            <el-option
              v-for="item in repairsTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm()" type="" icon="el-icon-refresh-right"
            >重置</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('export')" icon="el-icon-download" v-if="$isPowerShow('export')"
            >导出</el-button
          >
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="primary"  @click="deleteSelect()">删除</el-button>
        </el-form-item> -->
      </el-row>
      <el-row>
        <el-form-item>
          <el-button @click="onAdd()" type="primary" v-if="$isPowerShow('add')"
            >添加</el-button
        >
        </el-form-item>
        <el-form-item>
          <el-button @click="deleteSelect()" type="primary" v-if="$isPowerShow('del')"
            >删除</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="isCheck(1)" type="primary"
            >审核</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="isCheck(2)" type="primary"
            >反审核</el-button
          >
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
import getTyreModel from "@/components/base/formModel/select/get-tyre-model"
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getTyreCode from "@/components/base/formModel/select/get-tyre-code"
import getVehicleSelectDialog from "@/components/base/formModel/tree/get-vehicle-select-dialog";
import {getDate} from '@/utils/index'
export default {
  components:{
    getTyreModel,
    getVehicleSelectTree,
    getTyreCode,
    getVehicleSelectDialog
  },
  data() {
    return {
      date:[],
      repairsTypeOptions: [
        {
          value: 1,
          label: "报废",
        },
        {
          value: 2,
          label: "补修 ",
        },
        {
          value: 3,
          label: "翻新",
        },
      ],
      stateTypeOptions: [
        {
          value: 0,
          label: "未审核",
        },
        {
          value: 1,
          label: "已审核 ",
        },
        {
          value: 2,
          label: "取消审核",
        },
      ],
      form: {
        vehicle_id:[],
        tyre_mode_id: '',
        start_date:'',
        end_date: '',
        treatment_method: '',
        state:'',
      },
    };
  },
  mounted() {
    this.configDate();
    this.onSubmit();
  },
  methods: {
    configDate() {
      let timeObj = getDate('thisMonth')
      console.log(timeObj)
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime])
      this.form.start_date = this.date[0];
      this.form.end_date = this.date[1];
    },
    selectedTime: function() {
      if(this.date && this.date.length>0) {
        this.date = this.$addTime(this.date)
        this.form.start_date = this.date[0];
        this.form.end_date = this.date[1];
      }else{
        this.form.start_date = '';
        this.form.end_date = '';
      }
    },
    // 查询
    onSubmit() {
      // alert(111)
      if(!!this.date && this.date.length > 1) {
        this.form.start_date = this.date[0]
        this.form.end_date = this.date[1]
      }else{
        this.form.start_date = ''
        this.form.end_date = ''
      }
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }
      if(this.form.vehicle_id.length == 0) {
        delete info.vehicle_id
      }
      if(this.form.state === 0) {
        info.state = 0
      }
      if(this.form.treatment_method) {
        info.treatment_method = []
        info.treatment_method.push(this.form.treatment_method)
      }
      this.$emit("on-ok", info);
    },
    // 重置
    resetForm() {
      Object.assign(this.$data, this.$options.data());
      this.configDate();
      this.onSubmit();
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 50);
    },
    // 添加编辑
    onAdd() {
      this.$emit("on-add", 'add');
    },
    deleteSelect() {
      this.$emit("delete-select");     
    },
    isCheck(type) {
      this.$emit("is-check", type); 
    },
    onBtn(type) {
      this.$emit(`on-btn-${type}`);
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$parent.openSettingPageEvent();
    },
    // 刷新列表
    refreshTableList() {
      this.onSubmit();
      setTimeout(() => {
        this.$message({ message: "刷新成功", type: "success" });
      }, 50);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
