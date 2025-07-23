<template>
  <div class="sub-req-box">
    <el-form :inline="true" size="mini" :model="form" ref="form">
      <el-row>
        <el-form-item prop="leave_start" label="日期" >
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="选择开始日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            end-placeholder="选择结束日期"
            :picker-options="pickerOptions"
            @change="selectedTime">
          </el-date-picker>
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
        <el-form-item  v-if="activeName == 'second'">
          <el-select v-model="car_type" style="width: 100px">
            <el-option
              v-for="(item, index) in carOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="vehicle_ids" v-if="activeName == 'second'">
          <get-vehicle-select-tree
            v-if="car_type == 1"
            ref="vehicle_id"
            width="360"
            :placeholder="'自编号/车牌号'"
            :isShowCheckbox="true"
            v-model="form.vehicle_ids"
          >
          </get-vehicle-select-tree>
          <get-carcode-select-tree
            v-else
            ref="vehicle_id1"
            width="360"
            :placeholder="'自编号/车牌号'"
            :isShowCheckbox="true"
            v-model="form.vehicle_ids"
          >
          </get-carcode-select-tree>
        </el-form-item>
        <el-form-item  label="供应商:">
          <el-select style="width: 200px" filterable multiple collapse-tags clearable v-model="form.ids">
            <el-option
              v-for="(item, index) in supplier"
              :key="index"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="line_ids" v-if="activeName == 'first'"> 
          <get-line-select-tree
              ref="lineTree"
              :placeholder="'选择线路'"
              :isShowCheckbox="true"
              v-model="form.line_ids"
            >
            </get-line-select-tree>
        </el-form-item>
        <el-form-item>
           <el-checkbox v-model="form.type" true-label="1" false-label="2" @change="changeRadioType"	>按供应商分组</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button  @click="Reset('form')" icon="el-icon-refresh-left"
            >重置</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('export')" icon="el-icon-download" 
            >导出</el-button
          >
        </el-form-item>
        <!-- <el-form-item >
          <el-radio-group  v-model="form.type" @change="changeRadioType">
            <el-radio :label="1"><span style="color:#606266">整合类型</span></el-radio>
            <el-radio :label="2"><span style="color:#606266">原始类型</span></el-radio>
          </el-radio-group>
        </el-form-item> -->
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getLineSelectTree from "@/components/base/formModel/tree/get-line-select-tree";
import getCarcodeSelectTree from "@/components/base/formModel/tree/get-carcode-select-tree";
import {formatDateTime} from '@/utils/index'
import {getDate} from '@/utils/index'

export default {
  components: {getVehicleSelectTree,getLineSelectTree,getCarcodeSelectTree},
  data() {
    return {
      date:[],
      form: {
        type: "2",
        leave_start: '',
        leave_end: '',
        vehicle_ids: [],
        line_ids: [],
        house_id: '',
        ids:[],
      },
      supplier:[],
      houseOptions: [],
      car_type: "1",
      carOptions: [
        { value: "1", label: "车牌号" },
        { value: "2", label: "自编号" },
      ],
      minDate: new Date(),
      maxDate: new Date(),
      pickerOptions: {
        disabledDate:(time)=> {
          let front = new Date(this.minDate.getTime() - 86400000 * 366)
          let end = new Date(this.maxDate.getTime() + 86400000 * 366)
          // console.log(!(front < time && time < end), formatDateTime(front),formatDateTime(time),formatDateTime(end))
          return !(front < time && time < end);
        },
        onPick:(obj)=> {
          console.log(obj)
          this.minDate = (!!obj && obj.minDate) || new Date()
          this.maxDate = (!!obj && obj.maxDate) || this.minDate
        }
      },
    };
  },
  props: {
    activeName:{
      type: String,
      default:'first'
    }
  },
  mounted() {
    this.reqNextTime()
    this.getWarehouse()
    this.onSubmitReqHeader()
    // this.onSubmit();
    this.loadData()
  },
  watch:{
    activeName() {
      // this.form.type = 1;
      Object.assign(this.$data.form, this.$options.data().form)
      this.reqNextTime()
      this.onSubmitReqHeader()
      // this.onSubmit();
    }
  },
  methods: {
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
   // 数据加载
      loadData() {
        this.$client.GetProviderPage(
         {usable:1}
        ).then(req => {
          if (req.head.result === '200') {
            this.supplier = req.context.list
          }else{
            this.$message({
              showClose: true,
              message: req.head.describle,
              type: "error",
            });
          }
        }).catch(err => {
        })
      }, 
    reqNextTime() {
      let time = getDate('lastOneMonth');
      // console.log(time)
      let day1 = new Date();
      this.date = [time.startTime, time.endTime];
      this.date = this.$addTime(this.date)
      this.form.leave_start = this.date[0]
      this.form.leave_end = this.date[1]
      this.minDate = new Date(day1.getTime() - 86400000 * 366)
      // console.log(this.date)
    },
    selectedTime() {
      if(this.date && this.date.length>0) {
        let date = this.$addTime([this.date[0], this.date[1]])
        this.form.leave_start = date[0];
        this.form.leave_end = date[1];
      }else{
        this.form.leave_start = ''
        this.form.leave_end = ''
      }
    },
    // 提交获取头部
    onSubmitReqHeader() {
      this.$emit("on-submit-reqheader",this.form.type)
    },
    changeRadioType(type) {
      // alert(this.form.type)
      this.form.type = type
      this.onSubmitReqHeader()
      // this.onSubmit()
    },
    onSubmit() {
      let info = this.$outFormData(this.form)
      if(info.vehicle_ids.length == 0 || this.activeName == 'first') {
        delete info.vehicle_ids
      }
      if(info.line_ids.length == 0) {
        delete info.line_ids
      }
      this.$emit("on-ok", info);
    },
    // 重置
    Reset(formName){
      // this.$refs[formName].resetFields();
      this.reqNextTime()
      if(this.activeName == 'second') {
        // 清空车辆选中
        if(this.car_type == 1){
          this.$refs.vehicle_id.onClear()
        }else{
          this.$refs.vehicle_id1.onClear()
        }
        // this.$refs.vehicle_id.onClear()
        this.form.vehicle_ids = []
      }else{
        this.$refs.lineTree.onClear()
      }
      this.form.ids = []
      // 清空线路选中
      this.reqNextTime()
      this.onSubmitReqHeader()
      this.onSubmit();
    },
    onBtn(com) {
      this.$emit("on-" + com);
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$emit("open-setting-Page")
    },
    // 刷新
    refreshTableList() {
      this.Reset('form')
    }
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.sub-req-box /deep/ .el-date-editor,.el-range-editor {
  width: 250px;
}
.sub-req-box /deep/ .el-date-editor .el-range-separator {
  padding: 0;
}
</style>
