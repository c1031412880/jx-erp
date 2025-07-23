<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item>
          <el-date-picker
            v-model="date"
            type="daterange"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="选择开始日期"
            end-placeholder="选择结束日期"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <get-vehicle-select-tree
            ref="vehicleTree"
            :placeholder="'请选择车辆'"
            :isShowCheckbox="true"
            v-model="form.vehicle_ids"
          ></get-vehicle-select-tree>
        </el-form-item>
        <!-- <el-form-item>
          <get-vehicle-select-tree
            ref="vehicleTree"
            :placeholder="'请选择线路'"
            :isShowCheckbox="true"
            v-model="form.vehicle_id"
          ></get-vehicle-select-tree>
        </el-form-item> -->
        <el-form-item>
          <get-department-select
            ref="personalTree"
            v-model="form.created_id"
            :isShowCheckbox="false"
            :placeholder="'请选择录入人员'"
            :isContainEmp="true"
            :show_all="true"
            :isExportMultiple="false"
          ></get-department-select>
        </el-form-item>
        <el-form-item style="width:180px">
          <el-select v-model="form.state" clearable placeholder="审核状态">
            <el-option label="已审核" :value="1"></el-option>
            <el-option label="未审核" :value="0"></el-option>
            <el-option label="取消审核" :value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm('reset')" type icon="el-icon-refresh-right">重置</el-button>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item>
          <get-driver-select
            ref="driverTree"
            v-model="form.driver_ids"
            :isShowCheckbox="true"
            :placeholder="'请选择驾驶员'"
            :isContainEmp="true"
            :show_all="true"
            :isExportMultiple="false"
          ></get-driver-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="onAdd()" type="primary" v-if="$isPowerShow('add')">添加</el-button>
        </el-form-item>
        <el-form-item>
          <!-- <el-button @click="deleteSelect()" type="primary">批量删除</el-button> -->
          <el-popconfirm
            @confirm="deleteSelect()"
            title="确定批量删除吗？"
            v-if="$isPowerShow('del')">
            <el-button slot="reference" type="primary" size="mini">批量删除</el-button>
          </el-popconfirm>
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('import')" icon="el-icon-download" v-if="$isPowerShow('import')">导入</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('export')" icon="el-icon-upload2" v-if="$isPowerShow('export')">导出</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="isCheck('sure')" type="primary" v-if="$isPowerShow('check')">批量审核</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="isCheck('cancle')" type="primary" v-if="$isPowerShow('check')">取消审核</el-button>
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

<script type="text/ecmascript-6">
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import getDriverSelect from "@/components/base/formModel/tree/get-driver-select-tree";
import {formatDateTime} from '@/utils/index'
export default {
  components: {
    getVehicleSelectTree,
    getDepartmentSelect,
    getDriverSelect
  },
  data() {
    return {
      date: [],
      form: {
        begin_time:"",
        end_time: "",
        vehicle_ids: [],
        created_id: "",
        driver_ids: [],
        state: "",
      },
      minDate: new Date(),
      maxDate: new Date(),
      pickerOptions: {
        disabledDate:(time)=> {
          let front = new Date(this.minDate.getTime() - 86400000 * 62)
          let end = new Date(this.maxDate.getTime() + 86400000 * 62)
          // console.log(!(front < time && time < end), formatDateTime(front),formatDateTime(time),formatDateTime(end))
          return !(front < time && time < end);
        },
        onPick:(obj)=> {
          console.log(obj)
          this.minDate = (!!obj && obj.minDate) || new Date()
          this.maxDate = (!!obj && obj.maxDate) || this.minDate
        }
      },
    };
  },
  mounted() {
    this.setSearchtime()
  },
  methods: {
    setSearchtime() {
      let date = new Date();
      date.setTime(new Date().getTime()-24*60*60*1000);
      let Y = date.getFullYear()
      let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
      let D = date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()
      date = Y + '-' + M + '-' + D
      this.date =[`${date} 00:00:00`, `${date} 23:59:59`]
      this.minDate = new Date(new Date().getTime() - 86400000 * 62)
      console.log(this.date);
    },
    // 查询
    onSubmit() {
      if (this.date && this.date.length > 0) {
        this.date = this.$addTime(this.date);
        this.form.begin_time = this.date[0];
        this.form.end_time = this.date[1];
      }else{
        this.form.begin_time = '';
        this.form.end_time = '';
      }
      if(this.form.vehicle_ids && this.form.vehicle_ids.length == 0) {
        delete this.form.vehicle_ids
      }
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }
      if(this.form.state === 0) {
        info.state = 0;
      }

      if(this.form.state === '') {
        delete info.state
      }
      this.$emit("on-ok", info);
    },
    // 重置
    resetForm(type) {
      this.form.vehicle_ids = [];
      this.form.driver_ids = [];
      this.form.created_id = "";
      this.form.state = "";
      
      setTimeout(() => {
        this.$refs.personalTree.onClear();
      }, 60);
      if(type == 'reset') {
        this.form.begin_time = "";
        this.form.end_time = "";
        this.date = [];
        this.setSearchtime();
        this.onSubmit();
        setTimeout(() => {
          this.$message({ message: "重置成功", type: "success" });
        }, 50); 
      }
      
    },
    // 添加编辑
    onAdd() {
      this.$emit("on-add", "add");
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
      this.$emit('open-setting-page')
      // this.$parent.openSettingPageEvent();
    },
    // 刷新列表
    refreshTableList() {
      // this.form.vehicle_ids = [];
      // this.form.created_id = "";
      // this.form.begin_time = "";
      // this.form.end_time = "";
      // this.form.state = "";
      // this.date = [];
      // this.$parent.restTableList();
      this.onSubmit();
      setTimeout(() => {
        this.$message({ message: "刷新成功", type: "success" });
      }, 50);
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-form-item {
}
</style>
