<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="报修日期:">
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="selectedTime"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="报修车辆：">
          <!-- <get-vehicle-select-tree
            ref="vehicleTree"
            width="200"
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

        <el-form-item label="维修类别：">
          <get-select-dictionaries
            ref="type_child"
            v-model="form.type_child" 
            :accidentType="true"
            :classKey="'报修类别'" 
            :placeholder="'请选择'"></get-select-dictionaries>
        </el-form-item>

        <!-- <el-form-item label="车型：">
          <el-select v-model="veh_type" clearable placeholder="车辆型号">
            <el-option
              v-for="item in vehTypeData"
              :key="item.id"
              :label="item.name"
              :value="item.id"></el-option>
          </el-select>
        </el-form-item> -->

        <el-form-item>
          <el-button 
            type="primary" 
            @click="onSubmit"
            icon="el-icon-search" 
            >查询</el-button>
        </el-form-item>

        <el-form-item>
          <el-button
            type="" 
            @click="resetForm"
            icon="el-icon-refresh-right"
            >重置</el-button>
        </el-form-item>

        <el-form-item>
          <el-button
            @click="onBtn('export')" 
            icon="el-icon-download" 
            >导出</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>
<script type="text/ecmascript-6">
import { getDate } from "@/utils/index";
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
import getVehicleSelectDialog from "@/components/base/formModel/tree/get-vehicle-select-dialog";
export default {
  components: { 
    getVehicleSelectTree,
    getSelectDictionaries,
    getVehicleSelectDialog
  },

  data() {
    return {
      date: [],
      // veh_type: '',
      // vehTypeData: [],
      form: {
        start_date: '',
        end_date: '',
        vehicle_ids: [],
        type_child: '',
        date_type: 1
      },
    }
  },
  activated() {
    if(!!this.$route.params && !!this.$route.params.end_date) {
      this.form.type_child = this.$route.params.type_child
      this.date = this.$addTime([this.$route.params.start_date, this.$route.params.end_date])
      this.form.start_date = this.date[0]
      this.form.end_date = this.date[1]
      // console.log(this.date, this.form)
      // this.getVehType()
      this.onSubmit()
    }
  },
  mounted() {
    if(!!this.$route.params && !!this.$route.params.end_date) {
      this.form.type_child = this.$route.params.type_child
      this.date = this.$addTime([this.$route.params.start_date, this.$route.params.end_date])
      this.form.start_date = this.date[0]
      this.form.end_date = this.date[1]
      // this.getVehType()
      this.onSubmit()
    } else{
      this.onSetTime()
      this.onSubmit()
    }
  },
  methods: {
    // 获取车辆型号
    // getVehType(){
    //   this.vehTypeData = []
    //   this.$client.GetCarModelVehicleManager({}).then(req => {
    //     if (req.head.result === '200') {
    //       this.vehTypeData = req.context.list
    //     }
    //   })
    // },
  // 设置初始日期
  onSetTime(type = 'lastSevenDay') {
    let timeObj = getDate(type)
    this.date = this.$addTime([timeObj.startTime, timeObj.endTime])
    if(!this.form.start_date && !this.form.end_date) {
      this.form.start_date = this.date[0]
      this.form.end_date = this.date[1]
    }
  },
  // 改变日期
  selectedTime() {
    if(this.date && this.date.length>0) {
      this.date = this.$addTime(this.date)
      this.form.start_date = this.date[0]
      this.form.end_date = this.date[1]
    }else{
      this.form.start_date = ''
      this.form.end_date = ''
    }
  },
    // 查询
    onSubmit () {
      let info = this.$outFormData(this.form)
      if(info.vehicle_ids.length == 0) {
        delete info.vehicle_ids
      }
      // console.log(info);
      this.$emit("on-ok", info);
    },
    
    // 重置
    resetForm() {
      Object.assign(this.$data, this.$options.data())
      // this.$refs.vehicleTree.onClear()
      this.onSetTime()
      // this.getVehType()
      this.onSubmit()
      // setTimeout(() => {
      //   this.$message({ message: "重置成功", type: "success" });
      // }, 1000);
    },

    // 导出Excel
    onBtn(type) {
      this.$emit(`on-btn-${type}`);
    },
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>