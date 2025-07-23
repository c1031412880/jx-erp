<template>
  <div>
    <el-form inline size="mini">
      <el-row>
        <el-form-item label="领料日期:">
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
        <el-form-item>
          <el-select slot="label" v-model="queryForm.associated_type">
            <el-option
              v-for="(item,index) in options"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input v-model="queryForm.relate_id" placeholder="请输入关联单号" clearable></el-input>
        </el-form-item> 
        <el-form-item label="物料编号:">
          <el-input v-model="queryForm.material_code" placeholder="请输入物料编号" clearable></el-input>
        </el-form-item>
        <el-form-item label="物料名称:">
          <el-input v-model="queryForm.material_name" placeholder="请输入物料名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="规格型号:">
          <el-input v-model="queryForm.specification" placeholder="请输入规格型号" clearable></el-input>
        </el-form-item>          
                
        <el-form-item v-if="showCar" label="车辆：">
          <get-vehicle-select-tree
            ref="vehicleTree"
            width="360"
            :placeholder="'请选择车辆'"
            :isShowCheckbox="true"
            v-model="queryForm.vehicle_ids">
          </get-vehicle-select-tree>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" @click="onBtn('query')" type="primary">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-refresh-left" @click="resetForm()" type="primary">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-download" @click="onBtn('export')" type="primary">导出</el-button>
        </el-form-item>
        <el-form-item v-if="showCar && $isPowerShow('searchWarehouse')">
          <el-button  @click="openWarehouseManagement()" type="primary">出库管理</el-button>
        </el-form-item>
        <el-form-item v-if="!showCar && $isPowerShow('searchReturnStockManage')">
          <el-button  @click="openReturnStockManage()" type="primary">退料入库</el-button>
        </el-form-item>
        <div style="float: right; height: 47px; display: flex" v-if="pageType == 'first'">
          <i
            class="el-icon-s-tools"
            style="cursor: pointer"
            @click="openSettingPage()"
          ></i>
        </div>
          <!-- <el-form-item>
            <el-button icon="el-icon-delete" @click="onBtn('del')" type="primary">删除</el-button>
          </el-form-item> -->
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { getDate } from "@/utils/index"
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree"
export default {
  components: {
    getVehicleSelectTree
  },
  props: {
    showCar: {
      type: Boolean,
      default: true
    },
    options: {
      type: Array,
      default: () => {
        return [
          { value: '1', label: '关联工单' },
          { value: '2', label: '关联出库单' }
        ]
      }
    },
    pageType:{
      type: String,
      default: 'first'
    }
  },
  data () {
    return {
      queryForm: {
        material_code: '',
        material_name: '',
        specification: '',
        start_date: '',
        end_date: '',
        associated_type: '1',
        relate_id: '',
        vehicle_ids: ''
      },
      date: []
    }
  },
  activated () {
    let ids = this.$route.params.ids
    this.onSetTime()
  },
  mounted () {
    this.onSetTime()
    this.onBtn('query', this.queryForm)
  },
  methods: {
    onSetTime() {
      let time = getDate("lastOneWeek")
      this.date = this.$addTime([time.startTime, time.endTime])
      this.queryForm.start_date = this.date[0]
      this.queryForm.end_date = this.date[1]
    },
    selectedTime() {
      if (!!this.date && this.date.length > 0) {
        this.queryForm.start_date = this.$addTime(this.date)[0]
        this.queryForm.end_date = this.$addTime(this.date)[1]
      } else {
        this.date = []
        this.queryForm.start_date = ''
        this.queryForm.end_date = ''
      }
    },
    onBtn(method) {
      if (method == 'del') {
        this.$emit(`on-${method}`, false)
      } else {
        this.$emit(`on-${method}`, this.queryForm)
      }
    },
    // 打开出库管理页面
    openWarehouseManagement() {
      this.$router.push({
        name:'warehouse-management',
        params:{}
      })
    },
    // 打开退料入库管理页面
    openReturnStockManage() {
      this.$router.push({
        name:'return-stock-manage',
        params:{}
      })
    },
    // 重置
    resetForm() {
      Object.assign(this.$data, this.$options.data())
      if (this.showCar) this.$refs.vehicleTree.onClear()
      this.onSetTime()
      this.onBtn('query', this.queryForm)
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$emit("open-settingpage-event");
    },
  }
}
</script>
<style lang="scss" scoped>
</style>