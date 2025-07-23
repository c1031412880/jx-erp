<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="统计月份：">
          <el-date-picker
            v-model="form.month"
            type="month"
            format="yyyy-MM"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择月">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="车型：">
          <el-select v-model="form.kind_ids" clearable placeholder="车辆型号">
            <el-option
              v-for="item in vehTypeData"
              :key="item.id"
              :label="item.name"
              :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="维修类别：">
          <get-select-dictionaries 
            ref="type_child"
            v-model="form.repair_states"
            :accidentType="true"
            :collapseTags="true" 
            :classKey="'报修类别'" 
            :isMultiple="true"
            :placeholder="'请选择'">
          </get-select-dictionaries>
        </el-form-item>

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
import { formatDateTime } from '@/utils/index'
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
export default {
  components: { 
    getSelectDictionaries
  },

  data() {
    return {
      vehTypeData: [],
      form: {
        month: formatDateTime(new Date()),
        kind_ids: '',
        repair_states: []
      },
    }
  },
  created() {
    this.getVehType()       
    this.onSubmit()
  },
  methods: {
    // 获取车辆型号
    getVehType(){
      this.vehTypeData = []
      this.$client.GetCarModelVehicleManager({}).then(req => {
        if (req.head.result === '200') {
          this.vehTypeData = req.context.list
        }
      })
    },
    // 查询
    onSubmit () {
      let info = this.$outFormData(this.form)
      if(!this.form.kind_ids) {
        info.kind_ids = []
      }else {
        info.kind_ids = [
          this.form.kind_ids - 0
        ]
      }
      console.log(info);
      this.$emit("on-ok", info);
    },
    
    // 重置
    resetForm() {
      this.form.month = formatDateTime(new Date())
      this.form.kind_ids = ''
      this.form.repair_states = []
      this.onSubmit()
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 100);
    },

    // 导出Excel
    onBtn(type) {
      this.$emit(`on-btn-${type}`);
    },
  // watch: {
  //   value(val) {
  //     this.form.tyreCountState = val
  //   }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>