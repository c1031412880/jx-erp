<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item>
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="选择违法开始日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            end-placeholder="选择违法结束日期"
            @change="selectedTime"
            >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <!-- <get-vehicle-select-tree
            ref="vehicleTree"
            width="360"
            :placeholder="'选择车辆'"
            :isShowCheckbox="true"
            :isExportMultiple="true"
            v-model="form.i_vehicle_id"
          >
          </get-vehicle-select-tree> -->
          <get-vehicle-select-dialog
            ref="vehicleTree"
            :placeholder="'选择车辆'"
            :isShowCheckbox="true"
            v-model="form.i_vehicle_id	"
          >
          </get-vehicle-select-dialog>
        </el-form-item>
        <el-form-item>
          <get-driver-select-tree
            ref="driverTree"
            v-model="form.i_driver_id"
            :isShowCheckbox="true"
            :placeholder="'请选择所事故驾驶员'"
            :isExportMultiple="true"
          ></get-driver-select-tree>
        </el-form-item>
        <el-form-item>
          <get-select-dictionaries v-model="form.i_state" :classKey="'交警处理结果'" :placeholder="'请选择交警处理结果'"></get-select-dictionaries>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button  @click="Reset" icon="el-icon-refresh-left"
            >重置</el-button
          >
        </el-form-item>
      </el-row>
      <el-row>
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
          <el-button type="primary" @click="onBtn('import')" icon="el-icon-upload2" v-if="$isPowerShow('import')"
            >导入</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('export')" icon="el-icon-download" v-if="$isPowerShow('export')"
            >导出</el-button
          >
        </el-form-item>
        <el-form-item>
          <span style="margin-bottom:20px; color:#33333385; font-size: 12px;">说明：违法数据可对接交警系统，若需要请联系相关技术人员</span>
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
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getVehicleSelectDialog from "@/components/base/formModel/tree/get-vehicle-select-dialog";
import {getDate} from '@/utils/index'
export default {
  components: { getDriverSelectTree, getSelectDictionaries, getVehicleSelectTree,getVehicleSelectDialog},
  data() {
    return {
      isContainEmp: false, //是否显示部门下的人员
      date:[], //日期
      form: {
        begin: '',
        end: '',
        i_vehicle_id: [],
        i_driver_id:[],
        i_state: "",
      },
    };
  },
  activated() {
    if (this.$route.params.date) {
      this.setRouterForm()
      this.onSubmit()
    }
  },
  mounted() {
    if (this.$route.params.date) {
      this.setRouterForm()
      this.onSubmit()
    }else {
      this.onSetTime()
    }
  },
  methods: {
    // 接受跳转路由参数
    setRouterForm() {
      let params = this.$route.params
      console.log(params)
      let keyArr = Object.keys(params)
      if (keyArr.length) {
        this.date = params.hasOwnProperty('date') ? params['date'] : []
        Object.assign(this.$data.form, this.$options.data().form)
        // 清空驾驶员
        this.$refs.driverTree.onClear()
        // 清空车辆选中
        // this.$refs.vehicleTree.onClear()
      }
      keyArr.forEach(key => {
        if (this.form.hasOwnProperty(key)) {
          this.form[key] = params[key]
        }
      })
      // 时间参数置上
      if(this.date.length > 0) {
        this.form.begin = this.date[0]
        this.form.end = this.date[1]
      }else{
        this.form.begin = '';
        this.form.end = '';
      }
      console.log(this.$data, params, keyArr)
    },
    selectedTime: function() {
      if(this.date && this.date.length>0) {
        this.date = this.$addTime(this.date)
        this.form.begin = this.date[0];
        this.form.end = this.date[1];
      }else{
        this.form.begin = '';
        this.form.end = '';
      }
    },
    onSetTime(type = 'lastOneMonth') {
      let timeObj = getDate(type)
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime])
      this.form.begin = this.date[0]
      this.form.end = this.date[1]
      this.onSubmit()
      // console.log(this.date)
    },
    onSubmit() {
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }
      if(info.i_vehicle_id.length == 0) {
        delete info.i_vehicle_id
      }
      if(info.i_driver_id.length == 0) {
        delete info.i_driver_id
      }
      this.$emit("on-ok", info);
    },
    // 重置
    Reset(){
      this.date = [];
      this.form.begin = '',
      this.form.end = '',
      this.form.i_vehicle_id = [],
      this.form.i_driver_id = [],
      this.form.i_state = '',
      // 清空驾驶员选中
      this.$refs.driverTree.onClear()
      // 清空车辆选中
      // this.$refs.vehicleTree.onClear()
      this.onSetTime()
    },
    onBtn(com) {
      this.$emit("on-" + com);
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$parent.openSettingPageEvent();
    },
    // 刷新
    refreshTableList() {
      this.Reset()
    }
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped></style>
