<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="日期:">
          <el-date-picker
            v-model="date"
            type="daterange"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end_date-placeholder="结束日期"
            @change="selectedTime">
        </el-date-picker>
        </el-form-item>
        <el-form-item label="配件:">
          <get-material-select
          v-model="form.material_id"
          ></get-material-select>
        </el-form-item>

        <el-form-item label="">
          <el-select v-model="form.type" placeholder="请选择" @change="selectedType">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
        <get-carcode-select-tree
          ref="carcodeTree"
          :placeholder="'选择自编号'"
          :isShowCheckbox="true"
          v-model="form.vehicle_ids"
          :isExportMultiple="true"
          :width="'180'"
          v-if="form.type == 1"
        >
        </get-carcode-select-tree>
        <get-vehicle-select-tree
          ref="vehicleTree"
          width="180"
          :placeholder="'选择车牌号'"
          :isShowCheckbox="true"
          v-model="form.vehicle_ids"
          v-if="form.type == 2"
        >
        </get-vehicle-select-tree>
        </el-form-item>
        <el-form-item label="仓库:" prop="house_id">
          <el-select
            v-model="form.house_id"
            filterable
            clearable
            placeholder="请选择">
            <el-option
              v-for="item in houseOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="领料类型:" prop="pick_type_ids">
          <tr-select-dictionaries
            v-model="form.pick_type_ids"
            :classKey="'维修领料类型'"
            :placeholder="'请选择维修领料类型'"
            :isMultiple="true"
            :collapseTags="true"
            :isShowDefaultValue="true"
          ></tr-select-dictionaries>
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
        <el-form-item>
          <el-button @click="onExport()" type="primary" icon="el-icon-download" v-if="$isPowerShow('export')"
            >导出</el-button
          >
        </el-form-item>
      </el-row>
      <!-- <el-row>
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
      </el-row> -->
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import {getDate} from '@/utils/index'
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getCarcodeSelectTree from "@/components/base/formModel/tree/get-carcode-select-tree";
import getMaterialSelect from "./get-material-select";
export default {
  components:{
    getMaterialSelect,
    getVehicleSelectTree,
    getCarcodeSelectTree
  },
  data() {
    return {
      date:[],
      options: [{
        value: 1,
        label: '自编号'
      }, {
        value: 2,
        label: '车牌号'
      }],
      form: {
        material_id:"",
        start_date: "",
        end_date: "",
        type: 1,
        house_id: '',
        vehicle_ids:[],
        pick_type_ids:[],
      },
      houseOptions: [],
    };
  },
  mounted() {
    this.getWarehouse()
    this.configSubmit();
  },
  methods: {
    selectedTime: function() {
      if(this.date && this.date.length>0) {
        this.date = this.$addTime(this.date)
        this.form.start_date = this.date[0];
        this.form.end_date = this.date[1];
      }else{
        this.form.start_date = '';
        this.form.end_date = '';
      }
    },
    //获取仓库
    getWarehouse() {
      this.$client.getRecord1Warehouse().then((req) => {
        if (req.head.result === "200") {
          this.houseOptions = req.context;
          // if (req.context.length > 0) {
          //   this.form.house_id = req.context[0].id;
          // }
        }
      });
    },
    configSubmit() {
      let timeObj = getDate('thisMonth')
      this.date = [timeObj.startTime + " 00:00:00", timeObj.endTime + " 23:59:59"];
      this.form.start_date = this.date[0];
      this.form.end_date = this.date[1];
      this.onSubmit();
    },
    // 选择类型
    selectedType(val) {
      this.form.vehicle_ids = []
      
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
      this.form.material_id = "";
      this.date = [];
      this.form.start_date = '';
      this.form.end_date = '';
      this.form.type = 1;
      this.form.house_id = '';
      this.form.vehicle_ids = [];
      this.form.pick_type_ids = [];
      this.configSubmit();
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
        if(this.form.type == 1) {
          this.$refs.carcodeTree.onClear()
        }
      }, 300);
    },
    // 添加编辑
    onExport() {
      this.$emit("on-export");
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
