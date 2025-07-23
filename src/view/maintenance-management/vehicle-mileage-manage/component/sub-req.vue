<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item>
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="selectedTime"
            value-format="yyyy-MM-dd"
            :clearable="false"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <!-- <get-vehicle-select-tree
            ref="vehicleTree"
            :placeholder="'选择车辆'"
            :isShowCheckbox="true"
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
        <el-form-item>
          <el-select
            v-model="form.from_type"
            clearable
            placeholder="请选择车辆里程数据源类型"
          >
            <el-option
              v-for="item in enteringTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
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
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm('reset')" icon="el-icon-refresh-left"
            >重置</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('export')" icon="el-icon-upload2" v-if="$isPowerShow('export')"
            >导出</el-button
          >
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getVehicleSelectDialog from "@/components/base/formModel/tree/get-vehicle-select-dialog";
import {getDate} from '@/utils/index'
export default {
  components: { getVehicleSelectTree,getVehicleSelectDialog },
  data() {
    return {
      enteringTypeOptions: [
        {
          value: "0",
          label: "全部",
        },
        {
          value: "1",
          label: "人工录入",
        },
        {
          value: "2",
          label: "GPS推送",
        },
      ],
      date: [],
      form: {
        vehicle_ids: [],
        from:"",
        end:"",
        from_type: "",
        dept_ids: []
      },
      branchOffice: []
    };
  },
  mounted() {
    this.GetDeptInfoCaches()
    this.onSetTime()
    if(this.date.length> 0) {
      this.onSubmit()
    }
  },
  methods: {
    onSetTime(type = 'lastOneMonth') {
      let timeObj = getDate(type)
      // console.log(timeObj)
      this.form.from = timeObj.startTime
      this.form.end = timeObj.endTime
      this.date = [this.form.from, this.form.end]
    },
    selectedTime: function() {
      // alert(111)
      if(this.date && this.date.length>0) {
        this.form.from = this.date[0];
        this.form.end = this.date[1];
      }else{
        this.form.from = '';
        this.form.end = '';
      }
    },
    // 查询
    onSubmit() {
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }
      if(info.vehicle_ids.length == 0) {
        delete info.vehicle_ids
      }
      this.$emit("on-ok", info);
    },
    // 重置
    resetForm(type) {
      if(type == 'reset') {
        Object.assign(this.$data.form, this.$options.data().form)
        this.onSetTime()
        // this.$refs.vehicleTree.onClear()
        setTimeout(() => {
          this.$message({ message: "重置成功", type: "success" });
        }, 100);
      }

      if(this.date.length> 0) {
        this.onSubmit()
      }
      
    },
    GetDeptInfoCaches() {
      this.$client.GetDeptInfoCaches({}).then(res => {
        if (res.head.result === '200') {
          this.branchOffice = res.context 
        }
      })
    },
    // 导出
    onBtn(com) {
      this.$emit(`on-${com}`);
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$parent.openSettingPageEvent();
    },
    // 刷新列表
    refreshTableList() {
      // alert("刷新成功")
      this.$parent.informationDialogOk();
      setTimeout(() => {
        this.$message({ message: "刷新成功", type: "success" });
      }, 50);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>



// .csdd{



//   float: right;



//   display: flex;



//   justify-content: center;



//   align-items : center;



//   cursor:pointer;



//  }



</style>
