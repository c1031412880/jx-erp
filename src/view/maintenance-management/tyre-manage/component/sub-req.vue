<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="轮胎编号:">
          <el-input v-model="form.code" placeholder="请输入轮胎编号" clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="轮胎品牌:">
           <get-tyre-brand v-model="form.brand" placeholder="选择轮胎品牌"></get-tyre-brand>
        </el-form-item>
        <el-form-item label="轮胎型号:">
          <get-tyre-model v-model="form.mode_id" placeholder="选择轮胎型号"></get-tyre-model>
        </el-form-item>

        <el-form-item label="所属部门:">
          <get-department-select
            ref="tree"
            v-model="form.department_ids"
            :placeholder="'请选择所属组织'"
            :isContainEmp="isContainEmp"
          ></get-department-select>
        </el-form-item>
        <el-form-item label="安装车辆:">
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
          <el-button @click="onBtn('import')" icon="el-icon-download" v-if="$isPowerShow('import')">导入</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('export')" icon="el-icon-upload2" v-if="$isPowerShow('export')">导出</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="text" @click="onBtn('screen')"
            >高级筛选</el-button
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
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getTyreModel from "@/components/base/formModel/select/get-tyre-model";
import getTyreBrand from "@/components/base/formModel/select/get-tyre-brand";
import getVehicleSelectDialog from "@/components/base/formModel/tree/get-vehicle-select-dialog";
export default {
  components: { getDepartmentSelect, getVehicleSelectTree,getTyreModel,getTyreBrand,getVehicleSelectDialog},
  data() {
    return {
      isContainEmp: false, //是否显示部门下的人员
      form: {
        code: "",
        brand: "",
        mode_id: "",
        department_ids: [],
        vehicle_ids:[],
      },
    };
  },
  mounted() {
  },
  methods: {
    onSubmit() {
      let info = this.$outFormData(this.form)
      if(this.form.department_ids.length == 0) {
        delete info.department_ids
      }
      if(this.form.vehicle_ids.length == 0) {
        delete info.vehicle_ids
      }
      this.$emit("on-ok", info);
    },
    // 重置
    Reset(){
      this.form.code = '';
      this.form.department_ids = [];
      this.form.brand = '';
      this.form.vehicle_ids = [];
      this.form.mode_id = '';
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
