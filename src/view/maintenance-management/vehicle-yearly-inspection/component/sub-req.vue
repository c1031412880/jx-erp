<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="年检截止月份：">
          <el-date-picker
            v-model="form.year_months "
            type="months"
            range-separator="至"
            start-placeholder="开始年检日期"
            end-placeholder="结束年检日期"
            value-format="yyyy-MM"
          >
            <!-- @change="selectedTime" -->
          </el-date-picker>
        </el-form-item>
        <el-form-item label="分公司">
          <el-select v-model="form.dept_ids" placeholder="请选择" multiple>
            <el-option
              v-for="item in branchOffice"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车辆：">
          <!-- <get-vehicle-select-tree placeholder="选择车辆" v-model="form.vehicle_id" :isShowCheckbox="true" :isExportMultiple="true"></get-vehicle-select-tree> -->
          <get-vehicle-select-dialog
            ref="vehicleTree"
            :placeholder="'选择车辆'"
            :isShowCheckbox="true"
            v-model="form.vehicle_id"
          >
          </get-vehicle-select-dialog>
        </el-form-item>
        <el-form-item label="年检状态：">
          <el-select v-model="form.check_state" clearable placeholder="年检状态">
            <el-option label="全部" :value="0"></el-option>
            <el-option label="已年检" :value="1"></el-option>
            <el-option label="未年检" :value="2"></el-option>
            <el-option label="已超期" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm()" icon="el-icon-refresh-left">重置</el-button>
        </el-form-item>
         <el-form-item>
          <el-button @click="onBtn('export')" icon="el-icon-upload2" v-if="$isPowerShow('export')"
            >导出</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="text" @click="AdvancedSet">高级筛选</el-button>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item v-if="$isPowerShow('rule-setting')">
          <el-button type="primary" @click="$router.push({
            name:'maintenance-rules-setting',
            params:{
              ruleType:'first'
          }
          })">年检规则设置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-if="$isPowerShow('patch')" 
          @click="onBtn('patch')">重新生成计划</el-button>
          <!-- <el-button type="primary" v-if="$isPowerShow('patch')" @click="$router.push({
            name:'maintenance-rules-setting',
            params:{
              ruleType:'first'
          }
          })">重新生成计划</el-button> -->
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onBtn('batch-set')" v-if="$isPowerShow('patch')">批量年检</el-button>
        </el-form-item>
        <el-form-item>
          <p style="color:#B5B5B5">说明：年检提交后，将更新车辆信息中的最近年检日期。</p>
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
import { getDate } from "@/utils/index";
import getVehicleSelectTree from 'components/base/formModel/tree/get-vehicle-select-tree'
import getVehicleSelectDialog from "@/components/base/formModel/tree/get-vehicle-select-dialog";
export default {
  components: { getVehicleSelectTree,getVehicleSelectDialog},
  data() {
    return {
      date: [],
      form: {
        check_range: '',
        vehicle_id: [],
        year_months: [],
        check_state: 0,
        dept_ids: []
      },
      branchOffice: []
    };
  },
  activated() {
    let ids = this.$route.params.ids
    if (ids) {
      Object.assign(this.$data, this.$options.data())
      this.form.ids = ids.split(',')
      this.onSubmit()
    }
  },
  mounted() {
    // this.onSetTime();
    this.GetDeptInfoCaches()
    let ids = this.$route.params.ids
    if (ids) {
      Object.assign(this.$data, this.$options.data())
      this.form.ids = ids.split(',')
    }
    this.onSubmit();
  },
  methods: {
    onSetTime() {
      let timeObj = getDate("thisMonth");
      this.form.check_range = `${timeObj.startTime}~${timeObj.endTime}`
      this.date = timeObj.startTime.substring(0, 7);
    },
    selectedTime(value) {
      if(this.date && this.date.length>0) {
        let date = new Date(value);
        let month = (date.getMonth() + 1).toString().padStart(2,'0');
        let year = date.getFullYear();
        let startTime = year + '-' + month +'-' + '01';
        let day = new Date(year,month,0);
        let endTime = year + '-' + month + '-' + day.getDate();
        console.log(startTime,'startTime');
        console.log(endTime ,'endTime ');
        this.form.check_range = `${startTime}~${endTime}`
      }else{
        this.form.check_range = ''
      }
    },
    GetDeptInfoCaches() {
      this.$client.GetDeptInfoCaches({}).then(res => {
        if (res.head.result === '200') {
          this.branchOffice = res.context 
        }
      })
    },
    // 查询
    onSubmit() {
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }
      console.log(info, this.form);
      this.$emit("on-ok", info);
    },
    // 重置
    resetForm() {
      Object.assign(this.$data, this.$options.data());
      // this.onSetTime();
      this.onSubmit();
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 50);
    },
    // 添加编辑
    onBtn(com) {
      this.$emit(`on-${com}`);
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
    // 打开高级筛选
    AdvancedSet() {
      this.$parent.openAdvancedFilterPage();
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
