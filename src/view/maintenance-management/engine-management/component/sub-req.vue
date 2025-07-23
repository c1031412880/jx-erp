<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item>
          <el-input v-model="form.c_code" placeholder="请输入发动机编号" clearable>
          </el-input>
        </el-form-item>
        <el-form-item>
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
        <el-form-item>
          <get-engine-type-list v-model="form.i_model_id"></get-engine-type-list>
        </el-form-item>
        <el-form-item>
          <el-select v-model="form.i_state" clearable placeholder="请选择发动机状态">
            <el-option
              v-for="item in engineStatusOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >
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
          <el-button type="text" @click="onBtn('screen')"
            >高级筛选</el-button
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
          <el-button type="primary" @click="onBtn('scrap')" icon="el-icon-thumb" v-if="$isPowerShow('scrap')"
            >批量报废</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onBtn('export')" icon="el-icon-download" v-if="$isPowerShow('export')"
            >导出</el-button
          >
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
// import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import getEngineTypeList from "@/components/base/formModel/select/get-engine-type-list";
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getVehicleSelectDialog from "@/components/base/formModel/tree/get-vehicle-select-dialog";
export default {
  components: { getEngineTypeList, getVehicleSelectTree,getVehicleSelectDialog},
  data() {
    return {
      // isContainEmp: false, //是否显示部门下的人员
      departmentList:[], //部门
      engineStatusOptions:[ //状态
        { value: "1", name: "使用中" },
        { value: "2", name: "闲置" },
        { value: "3", name: "已报废" },
        { value: "4", name: "修理中" },
      ],
      form: {
        c_code:"",
        i_model_id: "",
        // department_ids: [],
        vehicle_ids:[],
        i_state: "",
      },
      vehsData:[],  //选中的车辆数据
      vehsKeys:[], //选中的车辆key
    };
  },
  mounted() {
  },
  methods: {
    onSubmit() {
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }
      
      if(info.vehicle_ids.length == 0) {
        delete info.vehicle_ids
      }
      this.$emit("on-ok", info);
    },
    // 重置
    Reset(){
      this.form.c_code = '',
      // this.form.department_ids = [],
      this.form.i_model_id = '',
      this.form.vehicle_ids = [],
      this.form.i_state = '',
      // // 清空组织选中
      // this.$refs.tree.onClear()
      // 清空车辆选中
      // this.$refs.vehicleTree.onClear()
      this.onSubmit()
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
