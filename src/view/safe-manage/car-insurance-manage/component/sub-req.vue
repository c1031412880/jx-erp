<template>
  <div class="sub-req-box">
    <el-form :inline="true" size="mini" :model="form" ref="form">
      <el-row>
        <el-form-item prop="vehicle_ids" label="车辆：">
          <!-- <get-vehicle-select-tree
            ref="vehicleTree"
            width="200"
            :placeholder="'选择车辆'"
            :isShowCheckbox="true"
            v-model="form.vehicle_ids"
          >
          </get-vehicle-select-tree> -->
          <get-vehicle-select-dialog
            ref="vehicleTree"
            :placeholder="'选择车辆'"
            :isShowCheckbox="true"
            v-model="form.vehicle_ids"
          >
          </get-vehicle-select-dialog>
        </el-form-item>
        <!-- <el-form-item prop="type" label="保险种类：">
          <get-select-dictionaries v-model="form.type" :classKey="'车辆保险种类'" :placeholder="'请选择保险种类'"></get-select-dictionaries>
        </el-form-item>
        <el-form-item prop="company" label="保险公司：">
          <get-select-dictionaries v-model="form.company" :classKey="'车辆保险公司'" :placeholder="'请选择保险公司'"></get-select-dictionaries>
        </el-form-item> -->
      <!-- </el-row> -->
      <!-- <el-row> -->
        <!-- <el-form-item prop="insurance_code" label="保险单号：">
          <el-input placeholder="请输入保险单号" v-model="form.insurance_code"></el-input>
        </el-form-item> -->
        <el-form-item prop="date_type" label="日期类型：">
          <el-select v-model="form.date_type" clearable placeholder="请选择">
            <el-option
              v-for="item in checkOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="start_date">
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
      </el-row>
      <el-row>
        
        <el-form-item>
          <el-button type="primary" @click="onBtn('remind')" icon="el-icon-bell"
            >到期提醒</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onBtn('add')" icon="el-icon-plus" v-if="$isPowerShow('add')"
            >添加</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onBtn('delete')" icon="el-icon-delete" v-if="$isPowerShow('del')"
            >删除</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('import')" icon="el-icon-download" v-if="$isPowerShow('import')"
            >导入</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('export')" icon="el-icon-upload2" v-if="$isPowerShow('export')"
            >导出</el-button
          >
        </el-form-item>

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
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getVehicleSelectDialog from "@/components/base/formModel/tree/get-vehicle-select-dialog";
export default {
  components: {getSelectDictionaries, getVehicleSelectTree, getVehicleSelectDialog},
  data() {
    return {
      isContainEmp: false, //是否显示部门下的人员
      departmentList:[], //部门
      checkOptions:[ //状态
        { value: 1, name: "投保日期" },
        { value: 2, name: "保险到期日期" }
      ],
      insuranceOptions:[
        { value: "1", name: "交强险" },
        { value: "2", name: "商业险" },
        { value: "3", name: "承运险" },
        { value: "4", name: "车损险" },
      ],
      date:[],
      form: {
        date_type: 1,
        start_date: '',
        end_date: '',
        vehicle_ids: [],
        type:'',
        company: '',
        insurance_code: ''
      },
      vehsData:[],  //选中的车辆数据
      vehsKeys:[], //选中的车辆key
    };
  },
  mounted() {
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
    onSubmit() {
      let info = this.$outFormData(this.form)
      if(info.vehicle_ids.length == 0) {
        delete info.vehicle_ids
      }
      if(!this.date) {
        delete info.date_type
      }
      this.$emit("on-ok", info);
    },
    // 重置
    Reset(formName){
      this.$refs[formName].resetFields();
      this.date = '',
      // 清空车辆选中
      // this.$refs.vehicleTree.onClear()
      this.onSubmit()
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
