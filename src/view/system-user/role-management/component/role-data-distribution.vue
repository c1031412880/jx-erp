<template>
  <div class="role-data-distribution show-flex-box-c">
    <el-form ref="ruleForm" label-width="100px" class="demo-ruleForm" size="mini">
      <el-form-item label="数据类型:" prop="type" label-width="90px">
        <el-select v-model="type" clearable placeholder="请选择">
          <el-option
            v-for="item in dataTypeOptionsFirst"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="data-tree">
      <organization-tree
        v-show="type == '1'"
        ref="organizationTree"
        :placeholder="placeholder"
        :curType="curType"
        :showCheckbox="showCheckbox"
        @on-check="selectDepartment"
      ></organization-tree>
      <vehicle-tree
        v-show="type == '2'"
        ref="vehicleTree"
        :placeholder="'搜索'"
        :showCheckbox="showCheckbox"
        @on-check="selectVehicle"
      ></vehicle-tree>
      <line-tree
        v-show="type == '3'"
        ref="lineTree"
        :placeholder="'搜索'"
        :showCheckbox="showCheckbox"
        @on-check="selectLine"
      ></line-tree>
    </div>

    <span class="show-flex-box-r show-flex-center" style="margin-top: 100px" v-if="$isPowerShow('save_data')">
      <el-button type="primary" size="mini" @click="updatePlaybill()"
        >保 存</el-button
      >
    </span>
  </div>
</template>

<script type="text/ecmascript-6">
import organizationTree from "@/components/base/formModel/tree/organization-tree";
import vehicleTree from "@/components/base/formModel/tree/vehicle-tree";
import lineTree from "@/components/base/formModel/tree/line-tree";
export default {
  props: {
    curRoleOrgIds: [Array],
    curRoleGroupOrgIds: [Array],
    curRoleCarIds: [Array],
    curRoleCircuitIds: [Array],
    curType: {
      type: String,
      default: "group",
    },
  },
  components: {
    organizationTree,
    vehicleTree,
    lineTree
  },
  data() {
    return {
      dataTypeOptionsFirst: [
        {
          value: "1",
          label: "组织架构",
        },
        {
          value: "2",
          label: "车辆",
          disabled: true
        },
        {
          value: "3",
          label: "线路",
          disabled: true
        },
      ],
      dataTypeOptionsSecond: [
        {
          value: "1",
          label: "组织架构",
        },
        {
          value: "2",
          label: "车辆",
        },
        {
          value: "3",
          label: "线路",
        },
      ],
      type: "1",
      organizationloading: false,
      placeholder: "搜索",
      showCheckbox: true,
      organizationTreeList: [],
      selectedOrganizationIds: [],
      selectedRoleCarIds: [],
      selectedRoleCircuitIds: [],
      isCanSave: false,
    };
  },
  methods: {
    selectDepartment(organizationInfoList, organizationIds) {
      // alert(organizationIds)
      this.selectedOrganizationIds = organizationIds;
    },
    selectVehicle(vehicleList) {
      this.selectedRoleCarIds = [];
      vehicleList.forEach(item => {
      if (item.type == 3) {
          this.selectedRoleCarIds.push(item.i_id)
        }
      })
    },
    selectLine(lineList) {
      this.selectedRoleCircuitIds = [];
      lineList.forEach(item => {
      if (item.type == 2) {
          this.selectedRoleCircuitIds.push(item.i_id)
        }
      })
    },
    setTreeData(val) {
      setTimeout(() => {
        this.$refs.organizationTree.setSelectData(val)
      }, 300);
    },
    // 保存
    updatePlaybill() {
      let selecedResourceId = [];
      switch (this.type) {
        case '1':
          if(this.selectedOrganizationIds.length < 1) {
             this.$message({
             showClose: true,
              message: "请选择组织架构",
              type: "warning",
            });
            return
          }
          selecedResourceId = this.selectedOrganizationIds
          break;
        case '2':
          if(this.selectedRoleCarIds.length < 1) {
             this.$message({
             showClose: true,
              message: "请选择车辆",
              type: "warning",
            });
            return
          }
          selecedResourceId = this.selectedRoleCarIds
          break;
        case '3':
          if(this.selectedRoleCircuitIds.length < 1) {
             this.$message({
             showClose: true,
              message: "请选择线路",
              type: "warning",
            });
            return
          }
          selecedResourceId = this.selectedRoleCircuitIds
          break;
      }
      let context = {
        i_subject_type: this.type,
        i_subject_id: selecedResourceId,
      };
      this.$emit("save-role-data", context);
    },
  },
  watch: {
    curRoleOrgIds: {
      handler(newVal, oldVal) {
        this.$refs.organizationTree.resetChecked()
        setTimeout(() => {
          this.$refs.organizationTree.setSelecedCheckedKeys(this.curRoleOrgIds)
        }, 60);
      },
      deep: true,
    },
    curRoleCarIds: {
      handler(newVal, oldVal) {
        this.$refs.vehicleTree.resetChecked()
        setTimeout(() => {
          this.$refs.vehicleTree.setCheckedkeys(this.curRoleCarIds)
        }, 60);
      },
      deep: true,
    },
    curRoleCircuitIds: {
      handler(newVal, oldVal) {
       this.$refs.lineTree.resetChecked()
        setTimeout(() => {
          this.$refs.lineTree.setCheckedkeys(this.curRoleCircuitIds)
        }, 60);
      },
      deep: true,
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.role-data-distribution {
}
</style>
