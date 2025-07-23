<template>
  <div class="sub-req-box">
    <el-form :inline="true" size="mini" :model="form" ref="form">
      <el-row>
        <el-form-item prop="begin">
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
        <el-form-item prop="vehicle_ids" v-if="activeName == 'second'">
          <get-vehicle-select-tree
            ref="vehicleTree"
            :placeholder="'选择车辆'"
            :isShowCheckbox="true"
            v-model="form.vehicle_ids"
          >
          </get-vehicle-select-tree>
        </el-form-item>
        <el-form-item prop="line_ids">
          <get-line-select-tree
              ref="lineTree"
              :placeholder="'选择线路'"
              :isShowCheckbox="true"
              v-model="form.line_ids"
            >
            </get-line-select-tree>
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
          <el-button @click="onBtn('export')" icon="el-icon-download" v-if="$isPowerShow('export')"
            >导出</el-button
          >
        </el-form-item>

        <el-form-item >
          <el-radio-group  v-model="form.type" @change="changeRadioType">
            <el-radio :label="1"><span style="color:#606266">整合类型</span></el-radio>
            <el-radio :label="2"><span style="color:#606266">原始类型</span></el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
      <!-- <el-row>
        <div style="float: right; height: 47px; display: flex;align-items: center;">
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
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getLineSelectTree from "@/components/base/formModel/tree/get-line-select-tree";
import {formatDateTime} from '@/utils/index'
import {getDate} from '@/utils/index'

export default {
  components: {getVehicleSelectTree,getLineSelectTree},
  data() {
    return {
      date:[],
      form: {
        type: 1,
        begin: '',
        end: '',
        vehicle_ids: [],
        line_ids: [],
      },
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
    this.onSubmitReqHeader()
    this.onSubmit();
  },
  watch:{
    activeName() {
      // this.form.type = 1;
      Object.assign(this.$data.form, this.$options.data().form)
      this.reqNextTime()
      this.onSubmitReqHeader()
      this.onSubmit();
    }
  },
  methods: {
    reqNextTime() {
      let time = getDate('lastOneDay');
      // console.log(time)
      let day1 = new Date();
      this.date = [time.startTime, time.startTime];
      this.date = this.$addTime(this.date)
      this.form.begin = this.date[0]
      this.form.end = this.date[1]
      this.minDate = new Date(day1.getTime() - 86400000 * 366)
      // console.log(this.date)
    },
    selectedTime() {
      if(this.date && this.date.length>0) {
        let date = this.$addTime([this.date[0], this.date[1]])
        this.form.begin = date[0];
        this.form.end = date[1];
      }else{
        this.form.begin = ''
        this.form.end = ''
      }
    },
    // 提交获取头部
    onSubmitReqHeader() {
      this.$emit("on-submit-reqheader",this.form.type)
    },
    changeRadioType(type) {
      // alert(type)
      this.onSubmitReqHeader()
      this.onSubmit()
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
      this.$refs[formName].resetFields();
      this.date = [];
      if(this.activeName == 'second') {
        // 清空车辆选中
        // this.$refs.vehicleTree.onClear()
        this.form.vehicle_ids = []
      }
      // 清空线路选中
      this.$refs.lineTree.onClear()
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
