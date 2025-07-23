<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="所属公司">
          <get-department-select
            ref="deptTree"
            :isShowCheckbox="true"
            :funcType="1"
            :placeholder="'请选择所属公司'"
            :isExportMultiple="true"
            v-model="form.dept_ids"
            clearable>
          </get-department-select>
        </el-form-item>
        <el-form-item label="自编号">
          <get-vehicle-select-tree
            ref="vehicleTree"
            width="200"
            :placeholder="'请选择自编号'"
            :isShowCheckbox="true"
            :isExportMultiple="true"
            :oilType="2"
            v-model="form.vehicle_ids"
            clearable>
          </get-vehicle-select-tree>
        </el-form-item>
        <el-form-item label="线路">
          <get-line-select-tree
            ref="lineTree"
            placeholder="请选择线路"
            :isShowCheckbox="true"
            :isExportMultiple="true"
            v-model="form.line_ids"
            clearable>
          </get-line-select-tree>
        </el-form-item>
        <el-form-item label="物品名称:">
          <el-input v-model="form.good_name" placeholder="请输入物品名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="上交人员:">
          <get-all-dept-user-tree
            ref="personTree"
            v-model="form.handle_users"
            :isShowCheckbox="true"
            :placeholder="'请选择上交人员'"
            :isContainEmp="true"
            :show_all="true"
            :isExportMultiple="true"
          ></get-all-dept-user-tree>
        </el-form-item>
        <el-form-item label="物品类别:">
          <el-select v-model="form.lost_type" clearable placeholder="请选择物品类别">
            <el-option v-for="(item,index) in tpyeData" :key="index" :label="item.type" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="签收人员:">
          <el-input v-model="form.receive_user" placeholder="请输入签收人员" clearable></el-input>
        </el-form-item>
        <el-form-item label="驾驶员:">
          <get-driver-select-tree
            ref="driverTree"
            v-model="form.driver_ids"
            :width="'220'"
            :isShowCheckbox="true"
            :placeholder="'请选择司机'"
            :isExportMultiple="true"
            clearable>
          </get-driver-select-tree>
        </el-form-item> 
        <el-form-item label="拾取时间:">
          <el-date-picker
            v-model="date"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="selectedTime">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="物品有效期">
          <el-select v-model="form.vaild_day" clearable placeholder="请选择物品有效期">
            <el-option label="无期限" :value="0"></el-option>
            <el-option label="有期限" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.state" clearable placeholder="请选择状态">
            <el-option label="待认领" :value="1"></el-option>
            <el-option label="已认领" :value="2"></el-option>
            <el-option label="已超时" :value="4"></el-option>
            <el-option label="草稿" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发布状态">
          <el-select v-model="form.publish_state" clearable placeholder="请选择发布状态">
            <el-option label="已发布" :value="1"></el-option>
            <el-option label="未发布" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="Reset" icon="el-icon-refresh-left">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onBtn('import')" icon="el-icon-upload2" v-if="$isPowerShow('import')">导入</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onBtn('export')" icon="el-icon-download" v-if="$isPowerShow('export')">导出</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onBtn('add')" icon="el-icon-plus" v-if="$isPowerShow('add')">添加</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onBtn('setting')" v-if="$isPowerShow('setting')">物品类别设置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onBtn('publish')">发布</el-button>
          <!-- v-if="$isPowerShow('publish')" -->
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onBtn('unpublish')">取消发布</el-button>
          <!-- v-if="$isPowerShow('unpublish')" -->
        </el-form-item>
        <div style="float: right; height: 47px; display: flex">
          <i
            class="el-icon-refresh"
            style="margin-right: 15px; cursor: pointer"
            @click="refreshTableList()"
          ></i>
          <i class="el-icon-s-tools" style="cursor: pointer" @click="openSettingPage()"></i>
        </div>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import getLineSelectTree from "@/components/base/formModel/tree/get-line-select-tree";
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";
import getAllDeptUserTree from "@/components/base/formModel/tree/get-all-dept-user-tree";
import { getDate } from "@/utils/index";
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
export default {
  components: { 
    getDepartmentSelect,
    getLineSelectTree,
    getVehicleSelectTree,
    getDriverSelectTree, 
    getDate, 
    getSelectDictionaries,
    getAllDeptUserTree },
  data() {
    return {
      tpyeData: [],//物品分类下拉框
      date: [],
      form: {
        dept_ids: [],
        vehicle_ids: [],
        line_ids: [],
        good_name: "",
        lost_type: "",
        handle_users: [],
        receive_user: "",
        driver_ids: [],
        lost_time_start: "",
        lost_time_end: "",
        vaild_day: "",
        state: "",
        publish_state: ""
      }
    };
  },
  mounted() {
    this.loadTypeData();
    this.onSetTime();
    this.onSubmit();
  },
  methods: {
    //加载物品类别信息
    loadTypeData(){
      let params = {
        context:{}
      };
      this.$client.getListLostType(params).then(res => {
        if (res.head.result == "200") {
          this.tpyeData = res.context.list;
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error"
          });
        }
      });
    },
    // 初始化时间
    onSetTime(type = 'thisMonth') {
      let timeObj = getDate(type)
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime])
      this.form.lost_time_start = this.date[0]
      this.form.lost_time_end = this.date[1]
    },
    selectedTime: function() {
      if(this.date && this.date.length) {
        this.date = this.$addTime(this.date)
        this.form.lost_time_start = this.date[0];
        this.form.lost_time_end = this.date[1];
      }else{
        this.form.lost_time_start = '';
        this.form.lost_time_end = '';
      }
    },
    onSubmit() {
      let info = {};
      for (let i in this.form){
        if(this.form[i] !== ''){
          info[i] = this.form[i]
        }
      }
      this.$emit("on-ok", info);
    },
    // 重置
    Reset() {
      this.date = []
      Object.assign(this.$data.form, this.$options.data().form);
      this.$refs.driverTree.onClear();
      this.$refs.lineTree.onClear();
      this.$refs.vehicleTree.onClear();
      this.$refs.deptTree.onClear();
      this.$refs.personTree.onClear();
      this.onSetTime();
      this.onSubmit();
    },
    onBtn(com) {
      this.$emit("on-" + com, com);
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$parent.openSettingPageEvent();
    },
    // 刷新
    refreshTableList() {
      this.Reset();
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped></style>
