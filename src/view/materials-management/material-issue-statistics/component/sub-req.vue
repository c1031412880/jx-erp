<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="出库日期:">
          <el-date-picker
            ref="datePicker"
            size="mini"
            v-model="date"
            type="daterange"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changeDate"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="分公司:">
          <el-select v-model="form.dept_id" placeholder="请选择分公司" clearable>
            <el-option
              v-for="item in branchOffice"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车辆:">
          <get-vehicle-select-tree
            v-model="form.vehicle_id"
            ref="vehicleTree"
            :placeholder="'选择车辆'"
            :isExportMultiple="false"
            :isShowCheckbox="true"
            clearable
          />
        </el-form-item>
        <el-form-item label="物料编码/名称/规格型号:">
          <el-input
            clearable
            v-model="form.material_code"
            placeholder="请输入物料编码/名称/规格型号"
            @input="handleSearchInput"
          ></el-input>
        </el-form-item>
<!--        <el-form-item label="物料名称:">-->
<!--          <el-input-->
<!--            clearable-->
<!--            v-model="form.material_name"-->
<!--            placeholder="请输入物料名称"-->
<!--          ></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="规格型号:">-->
<!--          <el-input-->
<!--            clearable-->
<!--            v-model="form.specification"-->
<!--            placeholder="请输入规格型号"-->
<!--          ></el-input>-->
<!--        </el-form-item>-->
        <el-form-item label="供应商:">
          <el-select
            v-model="form.provider_ids"
            filterable
            clearable
            multiple
            collapse-tags
            placeholder="请选择供应商">
            <el-option
              v-for="item in gongysOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物料分类:" >
          <get-materials-select
            ref="driverTree1"
            v-model="form.material_group_id"
            :width="'390'"
            :isShowCheckbox="false"
            :placeholder="'请选择分组'"
            :isExportMultiple="false"
          ></get-materials-select>
        </el-form-item>
        <el-form-item label="是否分组:">
          <el-select v-model="form.is_material_group" clearable placeholder="请选择">
            <el-option label="分组" :value="1"></el-option>
            <el-option label="不分组" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit"
          >查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm()"  icon="el-icon-refresh-right"
          >重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="onExport()"  type="primary">导出</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>
<script type="text/ecmascript-6">
import {getDate} from '@/utils/index'
import getMaterialsSelect from 'components/base/formModel/tree/get-materials-select'
import getVehicleSelectTree from "../../../../components/base/formModel/tree/get-vehicle-select-tree.vue";
export default {
  components: {
    getMaterialsSelect,
    getVehicleSelectTree
  },
  data() {
    return {
      form: {
        begin: "",
        end: "",
        provider_ids:[],
        material_code:'',
        material_name:'',
        specification:'',
        vehicle_id:[],
        dept_id:'',
        material_group_id:'',
        is_material_group:'',
      },
      //vehicle:[],
      //dept:[],
      date: [],
      branchOffice: [],
      gongysOptions: [], // 供应商选项
    }
  },
  watch: {
    // vehicle(newVal) {
    //   console.log('车辆', newVal);
    //   if (typeof newVal === 'string') {
    //     this.form.vehicle_id = [newVal]
    //   } else if (Array.isArray(newVal)) {
    //     this.form.vehicle_id = [...newVal];
    //   }
    // }
  },
  mounted() {
    this.$nextTick(() => {
      this.GetDeptInfoCaches()
      this.getGinsang()
      this.onSetTime()
      this.onSubmit()
    })
  },
  methods: {
    handleSearchInput(value) {
      this.form.material_code = value
      this.form.material_name = value
      this.form.specification = value
    },
    onSetTime(type = 'thisMonth') {
      let timeObj = getDate(type)
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime])
      this.form.begin = this.date[0]
      this.form.end = this.date[1]
    },
    // 查询
    onSubmit() {
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }
      console.log('查询',this.form)
      this.$emit("on-ok", info);
    },
    // 重置
    resetForm() {
      Object.assign(this.$data.form, this.$options.data().form)
      this.date=[]
      this.vehicle=[]
      this.form.provider_ids = [] // 确保供应商选择被重置为空数组
      this.$refs.vehicleTree.onClear();
      this.$refs.driverTree1.onClear();
      this.onSetTime()
      this.onSubmit()
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 50);
      console.log('重置',this.form)
    },
    //导出
    onExport(){
      let info = this.$outFormData(this.form)
      console.log(this.form, info)
      this.$emit("on-export", info);
    },
    GetDeptInfoCaches() {
      this.$client.GetDeptInfoCaches({}).then(res => {
        if (res.head.result === '200') {
          this.branchOffice = res.context
        }
      })
    },
    changeDate(date) {
      if (date == null || date == []) {
        this.form.begin = ''
        this.form.end = ''
      } else {
        this.form.begin = date[0]
        this.form.end = `${date[1]} 23:59:59`
      }
    },
    /**
     * 获取供应商列表
     */
    getGinsang() {
      this.$client.GetProviderPage().then((req) => {
        if (req.head.result === "200") {
          this.gongysOptions = req.context.list;
        }
      });
    },
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
