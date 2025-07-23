<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item>
          <el-input v-model="form.code" placeholder="请输入登记证编号" clearable>
          </el-input>
        </el-form-item>
        <!-- 压力容器类型 -->
        <el-form-item>
          <get-select-dictionaries v-model="form.type" :classKey="'压力容器类型'" :placeholder="'请选择压力容器类型'"></get-select-dictionaries>
        </el-form-item>
        <el-form-item>
          <get-department-select
            ref="tree"
            v-model="form.department_ids"
            :placeholder="'请选择所属组织'"
            :isContainEmp="isContainEmp"
          ></get-department-select>
        </el-form-item>
        <el-form-item>
          <!-- <get-vehicle-select-tree
            ref="vehicleTree"
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
          <el-select v-model="form.state" clearable placeholder="请选择压力容器状态">
            <el-option
              v-for="item in pressureVesselStatusOptions"
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
          <el-button type="primary" @click="onBtn('checkout')" icon="el-icon-thumb" v-if="$isPowerShow('bath-checkout') && false"
            >批量检验</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onBtn('scrap')" icon="el-icon-thumb" v-if="$isPowerShow('bath-checkout')"
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
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getVehicleSelectDialog from "@/components/base/formModel/tree/get-vehicle-select-dialog";
export default {
  components: { getDepartmentSelect, getSelectDictionaries, getVehicleSelectTree,getVehicleSelectDialog},
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
      form: {
        code: "",
        type: "",
        department_ids: [],
        vehicle_ids:[],
        state: "",
      },
      vehsData:[],  //选中的车辆数据
      vehsKeys:[], //选中的车辆key
    };
  },
  mounted() {
  },
  methods: {
    onSubmit() {
      let info = this.$outFormData(this.form)
      this.$emit("on-ok", info);
    },
    // 重置
    Reset(){
      this.form.code = '',
      this.form.type = '',
      this.form.department_ids = [],
      this.vehicle_ids = [],
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
      this.Reset()
    }
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped></style>
