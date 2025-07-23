<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="日期:">
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="选择开始日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            end-placeholder="选择结束日期"
            @change="selectedTime">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="轮胎:">
          <el-select v-model="form.material_ids" clearable multiple collapse-tags placeholder="请选择物料轮胎">
            <el-option
              v-for="item in tireMaterialList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <!-- <el-input v-model="form.c_name" placeholder="搜索轮胎" clearable></el-input> -->
        </el-form-item>
      <el-form-item label="">
          <el-select v-model="type" placeholder="请选择" @change="selectType">
            <el-option label="自编号" :value="1"></el-option>
            <el-option label="车牌号" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="vehicle_ids" v-if="type == 1">
          <get-carcode-select-tree
            ref="carcodeTree"
            :placeholder="'选择车辆自编号'"
            :isShowCheckbox="true"
            v-model="form.vehicle_ids"
            :isExportMultiple="true"
            :width="'180'"
          >
          </get-carcode-select-tree>
        </el-form-item>
        <el-form-item label="" prop="vehicle_ids" v-if="type == 2">
          <get-vehicle-select-tree
              ref="vehicleTree"
              :placeholder="'选择车辆'"
              :isShowCheckbox="true"
              v-model="form.vehicle_ids"
              :isExportMultiple="true"
              :width="'180'"
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
          <el-button v-if="$isPowerShow('export')" @click="onBtn('export')" icon="el-icon-download"
            >导出</el-button
          >
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import {getDate} from '@/utils/index'
import getCarcodeSelectTree from "@/components/base/formModel/tree/get-carcode-select-tree";
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
export default {
  components:{
    getCarcodeSelectTree,
    getVehicleSelectTree
  },
  data() {
    return {
      type: 1,
      date:[],
      form: {
        house_id: '',
        vehicle_ids: [],
        material_ids: [],
        leave_date_start: '',
        leave_date_end: '',
      },
      tireMaterialList:[], //轮胎物料信息
      houseOptions: [],
    };
  },
  mounted() {
    this.reqTireMaterial()
    this.getWarehouse()
    this.onSetTime()
    this.onSubmit()
  },
  methods: {
    onSetTime(type = 'thisMonth') {
      let timeObj = getDate(type)
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime])
      this.form.leave_date_start = this.date[0]
      this.form.leave_date_end = this.date[1]
      // console.log(this.date)
    },
    selectedTime: function() {
      if(this.date && this.date.length>0) {
        this.date = this.$addTime(this.date)
        // console.log(this.date)
        this.form.leave_date_start = this.date[0];
        this.form.leave_date_end = this.date[1];
      }else{
        this.form.leave_date_start = '';
        this.form.leave_date_end = '';
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
    // 选择查询类型
    selectType(val) {
      if(val == 1) {
        this.$refs.vehicleTree.onClear();
      }
      if(val == 2) {
       this.$refs.carcodeTree.onClear(); 
      }
    },
    // 获取轮胎物料
    reqTireMaterial() {
      let params = {
        main_name:"轮胎"
      }
      this.$client.getMaterialPage(params)
        .then(res => {
          if (res.head.result == "200") {
            this.tireMaterialList = res.context.list;
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch(err => {
           this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
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
      this.$emit("on-ok", info);
    },
    // 重置
    resetForm() {
      // 清空树选中
      if(this.type == 1) {
        this.$refs.carcodeTree.onClear();
      }
      if(this.type == 2) {
        this.$refs.vehicleTree.onClear();
      }
      Object.assign(this.$data, this.$options.data());
      this.reqTireMaterial();
      this.onSetTime('thisMonth');
      this.onSubmit();
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 50);
    },
    // 导出
    onBtn(com) {
      this.$emit("on-" + com);
    }
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
