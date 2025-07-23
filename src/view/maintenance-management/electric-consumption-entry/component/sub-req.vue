<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="统计月份:">
          <!-- <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="选择开始日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            end-placeholder="选择结束日期"
            @change="selectedTime">
          </el-date-picker> -->
          <el-date-picker
            v-model="form.year_month"
            type="month"
            format="yyyy-MM"
            value-format="yyyy-MM"
            @change="selectedMonth"
            placeholder="选择月">
          </el-date-picker>
        </el-form-item>
        <!-- oil_type=1 是燃油车  2就是电车 -->
        <el-form-item label="车辆:">
          <!-- <get-vehicle-select-tree
            ref="vehicleTree"
            :placeholder="'选择车辆'"
            :width="'200'"
            :isShowCheckbox="true"
            :oilType="2"
            v-model="form.vehicle_ids"
          >
          </get-vehicle-select-tree> -->
          <get-vehicle-select-dialog
            ref="vehicleTree"
            :placeholder="'选择车辆'"
            :isShowCheckbox="true"
            v-model="form.vehicle_ids	"
          >
          </get-vehicle-select-dialog>
        </el-form-item>
        <el-form-item label="充电站:">
          <el-select v-model="form.station_id" placeholder="请选择充电站">
            <el-option
              v-for="item in stationDropList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
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
          <el-button @click="resetForm()" type="primary" icon="el-icon-refresh-right"
            >重置</el-button
          >
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item>
          <el-button @click="addInfo()" type="primary" icon="el-icon-plus" v-if="$isPowerShow('add')"
            >添加</el-button
          >
        </el-form-item>
        <el-form-item>
          <!-- <el-button type="primary"  @click="deleteInfo()" v-if="$isPowerShow('del')" icon="el-icon-delete" >删除</el-button> -->

          <el-popconfirm
            @confirm="deleteInfo()"
            v-if="$isPowerShow('del')"
            title="确定删除所勾选记录吗？">
            <el-button slot="reference" type="primary" size="mini" icon="el-icon-delete" v-if="$isPowerShow('del')">删除</el-button>
          </el-popconfirm>


        </el-form-item>
        <el-form-item>
          <el-button @click="importFile()" type="primary" icon="el-icon-upload2" v-if="$isPowerShow('import')"
            >导入</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="exportFile()" type="primary" icon="el-icon-download" v-if="$isPowerShow('export')"
            >导出</el-button
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
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getVehicleSelectDialog from "@/components/base/formModel/tree/get-vehicle-select-dialog";
import {getDate} from '@/utils/index'
export default {
   components: {getVehicleSelectTree,getVehicleSelectDialog},
  data() {
    return {
      date: "",
      form: {
        year_month: "",
        vehicle_ids:[],
        station_id:''
      },
      stationDropList:[]
    };
  },
  mounted() {
    this.reqStationDropList();
    this.setDate();
    this.onSubmit()
  },
  methods: {
    // 获取充电站列表
    reqStationDropList() {
      this.$client.getStationDropList().then(res => {
        if(res.head.result  == '200') {
          this.stationDropList = res.context
        }else{
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    // 设置默认日期为当天
    setDate() {
      let date = new Date();
      // date.setTime(new Date().getTime());
      let Y = date.getFullYear()
      let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
      this.form.year_month = Y + '-' + M
    },
    selectedMonth(val) {
      this.form.year_month = val;
    },
    // 查询
    onSubmit() {
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }
      this.$emit("on-ok", info);
    },
    // 重置
    resetForm() {
      Object.assign(this.$data, this.$options.data());
      this.reqStationDropList();
      // this.$refs.vehicleTree.onClear();
      this.setDate();
      this.onSubmit();
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 50);
    },
    // 添加编辑
    addInfo() {
      this.$emit("on-add", 'add');
    },
    // 导入
    importFile() {
      this.$emit("on-import");
    },
    // 导出
    exportFile() {
      this.$emit("on-export");
    },
    deleteInfo() {
      this.$emit("delete-batch");     
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$parent.openSettingPageEvent();
    },
    // 刷新列表
    refreshTableList() {
      this.$parent.restTableList();
      setTimeout(() => {
        this.$message({ message: "刷新成功", type: "success" });
      }, 50);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
