<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="收发日期:">
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
        <el-form-item label="物料编码/名称/规格型号:">
          <el-input
            v-model="form.like_query"
            placeholder="请输入物料编码/名称/规格型号"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="仓库:" prop="hourse_id">
          <el-select
            v-model="form.hourse_id"
            filterable
            clearable
            multiple
            :collapse-tags="true"
            placeholder="请选择">
            <el-option
              v-for="item in houseOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="过滤零值:" prop="is_filt_zero">
          <el-radio-group v-model="form.is_filt_zero">
            <el-radio :label="1">过滤</el-radio>
            <el-radio :label="0">不过滤</el-radio>
          </el-radio-group>
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
      date:[],
      form: {
        like_query: '',
        hourse_id: [],
        start_date: '',
        end_date: '',
        is_filt_zero: 0
      },
      houseOptions: [],
    };
  },
  mounted() {
    this.getWarehouse()
    this.onSetTime()
    this.onSubmit()
  },
  methods: {
    onSetTime(type = 'thisMonth') {
      let timeObj = getDate(type)
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime])
      this.form.start_date = this.date[0]
      this.form.end_date = this.date[1]
    },
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
        }
      });
    },
    // 查询
    onSubmit() {
      let info = {};
      for (let i in this.form) {
        if (this.form[i] !== '' && this.form[i] !== null && this.form[i] !== undefined) {
          info[i] = this.form[i];
        }
      }
      this.$emit("on-ok", info);
    },
    // 重置
    resetForm() {
      Object.assign(this.$data, this.$options.data());
      this.getWarehouse()
      this.onSetTime()
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
