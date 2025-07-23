<template>
  <div>
    <el-form ref="headForm" :inline="true" size="mini">
      <el-row>
        <el-form-item>
          <el-select
            v-model="form.date_type"
            placeholder="日期状态"
            style="width: 100px">
            <el-option
              v-for="(item, index) in dataOptions"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
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
        <el-form-item label="工单号码: ">
          <el-input
            v-model="form.order_code"
            @keyup.enter.native="onSubmit"
            placeholder="请输入工单号码"
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="维修项目: ">
          <el-input
            v-model="form.repair_item"
            @keyup.enter.native="onSubmit"
            placeholder="请输入维修项目"
            clearable>
          </el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item>
          <el-select v-model="form.money_type" style="width:100px" clearable>
            <el-option
              v-for="item in moneyOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input-number @keyup.enter.native="onSubmit"  v-model="form.money_start" :precision="2"  :controls="false" style="width:100px"></el-input-number>
        </el-form-item>
        <el-form-item  label="--">           
        <el-input-number @keyup.enter.native="onSubmit" v-model="form.money_end" :precision="2" :controls="false" style="width:100px"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-select v-model="count" style="width: 100px">
            <el-option
              v-for="(item, index) in carOptions"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <!-- <get-vehicle-select-tree
            v-if="count == 1"
            ref="vehicleTree"
            :width="240"
            :placeholder="'选择车辆'"
            :isShowCheckbox="true"
            v-model="form.vehicle_ids">
          </get-vehicle-select-tree>
          <get-carcode-select-tree
            v-else-if="count == 2"
            ref="vehicleTree"
            :width="240"
            :placeholder="'选择车辆'"
            :isShowCheckbox="true"
            v-model="form.vehicle_ids">
          </get-carcode-select-tree> -->
          <get-vehicle-select-dialog
            v-if="count == 1"
            ref="vehicleTree"
            :placeholder="'选择车辆'"
            :isShowCheckbox="true"
            v-model="form.vehicle_ids	"
          >
          </get-vehicle-select-dialog>
          <el-input
            v-else
            placeholder="选择输入车牌号"
            style="width: 207px" 
            v-model="form.vehicle_name"></el-input>
        </el-form-item>
        <el-form-item label="送修单位: ">
            <!-- <el-select
              v-model="form.repair_unit"
              clearable
              placeholder="请选择送修单位">
              <el-option
                v-for="item in repairUnitList"
                :key="item.repair_unit"
                :label="item.repair_unit_name"
                :value="item.repair_unit"></el-option>
            </el-select> -->
          <get-repair-unit v-model="form.repair_unit"></get-repair-unit>
        </el-form-item>
        
        <el-form-item>
          <el-button 
          type="primary" 
          icon="el-icon-search" 
          @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="Reset" icon="el-icon-refresh-left">重置</el-button>
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item>
          <el-button 
            type="primary" 
            icon="el-icon-plus" @click="onAdd()">添加</el-button>
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary"
            icon="el-icon-delete" 
            @click="onBtn('delete')">删除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button 
            icon="el-icon-download" 
            @click="onBtn('export')" >导出</el-button>
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
import getCarcodeSelectTree from "@/components/base/formModel/tree/get-carcode-select-tree";
import getRepairUnit from "@/components/base/formModel/select/get-repair-unit";
import getVehicleSelectDialog from "@/components/base/formModel/tree/get-vehicle-select-dialog";
// import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  components: {
    getVehicleSelectTree,
    getVehicleSelectDialog,
    getCarcodeSelectTree,
    getRepairUnit
    // getDepartmentSelect,
  },
  data() {
    return {
      dataOptions:[ //日期类型
        { value: '1', label: '报修日期' },
        { value: '2', label: '出厂日期' },
      ],
      moneyOptions:[ //费用类型
        { value: '1', label: '工时费' },
        { value: '2', label: '材料费' },
        { value: '3', label: '总费用' },
      ],
      carOptions: [ //车牌号
        { value: 1, label: '内部车辆' },
        { value: 2, label: '外部车辆' },
      ],
      // repairUnitList: [],
      count: 1,
      date: [],
      form: {
        repair_unit: '', //送修单位ID
        vehicle_ids: [],
        vehicle_name: '', //车牌号
        repair_item: '', //维修项目
        order_code: '', //工单号
        date_type: '1', //日期状态
        money_type: '1',
        money_start: '', //最小费用
        money_end: '', //最大费用
        date_start: '', //开始日期
        date_end: '', //结束日期
      }
    }
  },
  methods: {
    onAdd() {
      this.$emit("on-add", 'add');
    },
    onBtn(com) {
      this.$emit("on-" + com);
    },
    onSubmit() {
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }
      if(this.form.vehicle_ids.length == 0) {
        delete info.vehicle_ids
      }
      // console.log(info);
      this.$emit("on-ok", info);
    },

    // 重置
    Reset() {
      this.date = [],
      this.form.repair_unit = '',
      this.form.vehicle_ids = [],
      this.form.vehicle_name = '',
      this.form.repair_item = '',
      this.form.order_code = '',
      this.form.date_type = '1',
      this.form.money_type = '1',
      this.form.money_start = '',
      this.form.money_end = '',
      this.form.date_start = '',
      this.form.date_end = '',
      this.count = 1
      // 清空部门选中
      // this.$refs.vehicleTree.onClear();
      this.onSubmit() 
    },

    selectedTime() {
      if (this.date && this.date.length > 0) {
        this.form.date_start= this.date[0];
        this.form.date_end = `${this.date[1]} 23:59:59`;
      } else {
        this.form.date_start = "";
        this.form.date_end = "";
      }
      console.log(this.form.date_end);
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$parent.openSettingPageEvent();
    },
    // 刷新
    refreshTableList() {
      this.onSubmit()
    }
  },
  watch: {
    count() {
      this.form.vehicle_ids = []
      this.form.vehicle_name = ''
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>