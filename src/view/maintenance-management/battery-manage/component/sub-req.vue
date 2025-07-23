<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item>
          <el-input v-model="form.code" placeholder="请输入电瓶编号" clearable>
          </el-input>
        </el-form-item>
        <el-form-item>
          <get-battery-type-list v-model="form.model_id"></get-battery-type-list>
        </el-form-item>
        <el-form-item>
          <get-department-select
            ref="tree"
            v-model="form.dept_id"
            :placeholder="'请选择所属组织'"
            :isContainEmp="isContainEmp"
            @on-change="onSelectChange"
          ></get-department-select>
        </el-form-item>
        <el-form-item>
          <!-- <get-vehicle-select-tree
            ref="vehicleTree"
            width="200"
            :placeholder="'选择车辆'"
            :isShowCheckbox="true"
            v-model="form.vehicle"
            @on-change="onSelectVehicleChange"
          >
          </get-vehicle-select-tree> -->
          <get-vehicle-select-dialog
            ref="vehicleTree"
            :placeholder="'选择车辆'"
            :isShowCheckbox="true"
            v-model="form.vehicle	"
          >
          </get-vehicle-select-dialog>
        </el-form-item>
        <el-form-item>
          <el-select v-model="form.state" clearable placeholder="请选择电瓶状态">
            <el-option
              v-for="item in batteryStatusOptions"
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
          <el-button @click="onBtn('export')" icon="el-icon-download" v-if="$isPowerShow('export')"
            >导出</el-button
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
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import getBatteryTypeList from "@/components/base/formModel/select/get-battery-type-list";
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getVehicleSelectDialog from "@/components/base/formModel/tree/get-vehicle-select-dialog";
export default {
  components: { getDepartmentSelect, getBatteryTypeList, getVehicleSelectTree,getVehicleSelectDialog},
  data() {
    return {
      isContainEmp: false, //是否显示部门下的人员
      departmentList:[], //部门
      batteryStatusOptions:[ //状态
        { value: 1, name: "使用中" },
        { value: 2, name: "闲置" },
        { value: 3, name: "已报废" },
        // { value: "修理中", name: "修理中" },
      ],
      form: {
        code:"",
        dept_id: [],
        model_id: "",
        vehicle: [],
        state: "",
      },
      vehsData:[],  //选中的车辆数据
      vehsKeys:[], //选中的车辆key
    };
  },
  mounted() {
  },
  methods: {
    // 选择组织
    onSelectChange(keys, nodes) {
      // alert(JSON.stringify(nodes))
      if (nodes && nodes.length > 0) {

      }
    },
    // 选择车辆
    onSelectVehicleChange(keys, nodes) {
      if (nodes && nodes.length > 0) {

      }
    },
    onSubmit() {
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }
      if(this.form.dept_id.length == 0) {
        delete info.dept_id
      }
      if(this.form.vehicle.length == 0) {
        delete info.vehicle
      }
      this.$emit("on-ok", info);
    },
    // 重置
    Reset(){
      this.form.code = '',
      this.form.dept_id = [],
      this.form.model_id = '',
      this.form.vehicle = [],
      this.form.state = '',
      // 清空组织选中
      this.$refs.tree.onClear()
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

    }
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped></style>
