<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item>
          <el-select v-model="form.date_type" placeholder="安装日期" style="width:100px">
            <el-option
              v-for="(item,index) in options"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-date-picker
            v-model="date"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="selectedTime"
            :picker-options="pickerOptions"
            :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
        </el-form-item>

        <el-form-item  label="轮胎编号:">
            <get-tyre-code
              v-model="form.tyre_id"
            ></get-tyre-code>
        </el-form-item>

        <el-form-item label="车辆:">
          <!-- <get-vehicle-select-tree
            ref="vehicleTree"
            width="200"
            :placeholder="'选择车辆'"
            :isShowCheckbox="true"
            v-model="form.vehicle_ids"
          ></get-vehicle-select-tree> -->
          <get-vehicle-select-dialog
            ref="vehicleTree"
            :placeholder="'选择车辆'"
            :isShowCheckbox="true"
            v-model="form.vehicle_ids	"
          >
          </get-vehicle-select-dialog>
        </el-form-item>

        <el-form-item label="轮胎型号:">
          <get-tyre-model
            v-model="form.tyre_model_id"
          ></get-tyre-model>
        </el-form-item>

        <el-form-item>
          <el-button 
            @click="onSubmit"
            type="primary" 
            icon="el-icon-search" 
            >查询</el-button>
        </el-form-item>

        <el-form-item>
          <el-button
            @click="resetForm()"
            type="" 
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
  import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
  import getTyreModel from "@/components/base/formModel/select/get-tyre-model"
  import getTyreCode from "@/components/base/formModel/select/get-tyre-code"
  import getVehicleSelectDialog from "@/components/base/formModel/tree/get-vehicle-select-dialog";
export default {

  components: { 
    getVehicleSelectTree,
    getTyreModel,
    getTyreCode,
    getVehicleSelectDialog
  },

  props: [

  ],

  data() {
    return {
      date: [],
      form: {
        date_type: '',
        end_date: '',
        begin_date: '',
        tyre_id: '',
        vehicle_ids: [],
        tyre_model_id: ''
      },
      options: [{
        value: '1',
        label: '安装日期'
      }, {
        value: '2',
        label: '拆卸日期'
      }],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一年',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
            picker.$emit('pick', [start, end]);
          }
        }]
      }
    }
  },

  methods: {

    selectedTime: function() {
      if(this.date && this.date.length>0) {
        this.form.begin_date = this.date[0];
        this.form.end_date = this.date[1];
      }else{
        this.form.begin_date = '';
        this.form.end_date = '';
      }
    },

    // 查询
    onSubmit () {
      let info = this.$outFormData(this.form)
      if(this.form.vehicle_ids.length == 0) {
        delete info.vehicle_ids
      }
      // console.log(info);
      this.$emit("on-ok", info);
    },
    
    // 重置
    resetForm() {
      this.date = [];
      this.form.date_type = '';
      this.form.tyre_id = '';
      this.form.vehicle_ids = [];
      this.form.tyre_model_id = '';
      this.onSubmit()
      // 清空车辆选中
      // this.$refs.vehicleTree.onClear()
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 100);
    },

    // 导出Excel
    onBtn(type) {
      this.$emit(`on-btn-${type}`);
    },
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped></style>