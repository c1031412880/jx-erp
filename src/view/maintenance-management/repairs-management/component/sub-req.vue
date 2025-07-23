<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="报修日期：">
            <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="selectedTime"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="报修车辆：">
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
            v-model="form.vehicle_ids	"
          >
          </get-vehicle-select-dialog>
        </el-form-item>
        <el-form-item label="报修类别：">
          <!-- <el-select v-model="form.type_child" placeholder="请选择" clearable>
            <el-option
              v-for="item in Options"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select> -->
          <get-select-dictionaries ref="type_child" v-model="form.type_child" :accidentType="true" :classKey="'报修类别'" :placeholder="'请选择'"></get-select-dictionaries>
        </el-form-item>
        <el-form-item label="维修车间：">
          <getmaintaindep v-model="form.department_id" :init="false" placeholder="选择维修车间"></getmaintaindep>
        </el-form-item>
        <el-form-item label="检验状态：">
          <el-select v-model="form.check_state" placeholder="请选择" clearable>
            <el-option
              v-for="item in stateOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
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
        <el-form-item>
          <el-button @click="onBtn('export')" v-if="$isPowerShow('export')" icon="el-icon-upload2">导出</el-button>
        </el-form-item>
         <el-form-item>
          <el-button type="primary" @click="onBtn('add')" v-if="$isPowerShow('add')" icon="el-icon-plus" >报修登记</el-button
          >
        </el-form-item>
        <el-form-item>
        <el-button type="primary" @click="onBtn('addtrue')" v-if="$isPowerShow('add')" icon="el-icon-plus" >事故关联登记</el-button
        >
        </el-form-item>
        <el-form-item>
        <el-button type="primary" @click="onBtn('delete')" icon="el-icon-delete" v-if="$isPowerShow('del')"
            >删除</el-button
          >
        </el-form-item>
        <el-form-item>
        <el-button type="primary" v-if="$isPowerShow('print')" @click="onBtn('print')">打印报修单</el-button
        >
        </el-form-item>
        <div style="float: right; height: 20px; display: flex">
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
        <!-- <el-form-item>
          <el-button type="text" @click="onBtn('screen')"
            >高级筛选</el-button
          >
        </el-form-item> -->
      </el-row>
      <el-row>
        <!-- <el-form-item>
          <el-button type="primary" @click="onBtn('add')" icon="el-icon-plus" v-if="$isPowerShow('add')"
            >添加</el-button
          >
        </el-form-item> -->
        <!-- <el-form-item>
          <el-button type="primary" @click="onBtn('delete')" icon="el-icon-delete" v-if="$isPowerShow('del')"
            >删除</el-button
          >
        </el-form-item> -->
        <!-- <el-form-item>
          <el-button @click="onBtn('import')" icon="el-icon-download" v-if="$isPowerShow('import')">导入</el-button>
        </el-form-item> -->
        <!-- <el-form-item>
          <el-button @click="onBtn('export')" icon="el-icon-upload2" v-if="$isPowerShow('export')">导出</el-button>
        </el-form-item> -->
        <!-- <el-form-item>
          <el-button type="text" @click="onBtn('screen')"
            >高级筛选</el-button
          >
        </el-form-item>    -->

        
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getTyreModel from "@/components/base/formModel/select/get-tyre-model";
import getTyreBrand from "@/components/base/formModel/select/get-tyre-brand";
import { getDate } from "@/utils/index";
import getmaintaindep from "@/components/base/formModel/select/get-maintain-dep";
import getVehicleSelectDialog from "@/components/base/formModel/tree/get-vehicle-select-dialog";
export default {
  components: { getDepartmentSelect, getSelectDictionaries, getVehicleSelectTree,getTyreModel,getTyreBrand,getmaintaindep,getVehicleSelectDialog},
  data() {
    return {
      isContainEmp: false, //是否显示部门下的人员
      departmentList:[], //部门
      pressureVesselStatusOptions:[ //状态
        { value: "container_1", name: "使用中" },
        { value: "container_2", name: "闲置" },
        { value: "container_3", name: "已报废" },
        // { value: "修理中", name: "修理中" },
      ],
      Options:[ //状态
        { value: 1, name: "普通报修" },
        { value: 2, name: "事故报修" },
        { value: 3, name: "外修" },
        // { value: "修理中", name: "修理中" },
      ],
      stateOptions:[ //状态
        { value: '0', name: "未检验" },
        { value: '1', name: "已检验" },
        { value: '2', name: "检验未通过" },
        // { value: "修理中", name: "修理中" },
      ],
      form: {
        code: "",
        brand: "",
        mode_id: "",
        department_ids: "",
        vehicle_ids:[],
      },
      date:'',
      vehsData:[],  //选中的车辆数据
      vehsKeys:[], //选中的车辆key
    };
  },
  mounted() {
    this.onSetTime()
  },
  methods: {
    onSelectChange(vehs, nodes) {
      // alert(JSON.stringify(nodes))
      if (nodes && nodes.length > 0) {
        // nodes.forEach((item, index) => {
        //   delete item.children;
        // });
        // this.ruleForm.reminders = nodes;
      } else {
        // this.ruleForm.reminders = [];
      }
    },
    onSubmit() {
      let info = this.$outFormData(this.form)
      this.$emit("on-ok", info);
    },
    // 重置
    Reset(){
      this.onSetTime()
      this.form.code = '',
      this.form.department_id = '',
      this.form.brand = '',
      this.form.state = '',
      this.form.type = '',
      this.form.type_child = null ,
      this.form.check_state = '' ,
      // 清空组织选中
      // this.$refs.tree.onClear()
      // 清空车辆选中
      this.$refs.vehicleTree.onClear()
      this.onSubmit()
    },
      selectedTime() {
      if (this.date && this.date.length > 0) {
        this.form.start_date = this.date[0];
        this.form.end_date = `${this.date[1]} 23:59:59`
      } else {
        this.form.start_date = "";
        this.form.end_date = "";
      }
      console.log(this.form.end_date)
    },
    //  selectedTime() {
    //     if(this.date && this.date.length>0) {
    //       // this.data = this.$addTime(this.date)
    //       console.log(this.data)
    //       this.form.dis_range = `${this.date[0]}~${this.date[1]} 23:59:59`
    //       console.log(this.form.dis_range)
    //     }else{
    //       this.form.dis_range = ''
    //     }
    //   },
   onSetTime(type = 'lastOneWeek') {
      let timeObj = getDate(type)
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime])
      this.form.start_date = this.date[0]
      this.form.end_date = this.date[1]
      console.log(this.date)
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
