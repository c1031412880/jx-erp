<template>
  <el-popover
    placement="bottom"
    trigger="click"
    v-model="visible"
    :disabled="disabled"
  >
    <div
      style="max-height: 300px; overflow: auto"
      :style="`${!!width ? `min-width: ${width}px;` : ''}`"
    >
      <department-tree
        v-model="id"
        ref="tree"
        :isShowCheckbox="isShowCheckbox"
        @on-check="departmentCheck"
        :isContainEmp="isContainEmp"
        :funcType="funcType"
        :isCheckStrictly="isCheckStrictly"
      ></department-tree>
    </div>
    <el-input
      clearable
      slot="reference"
      @clear="onClear"
      @input="inputOut"
      :disabled="disabled"
      :placeholder="
        placeholder ? placeholder : `请选择${isContainEmp ? '车间' : '班组'}`
      "
      prefix-icon="el-icon-search"
      v-model="input_names"
      class="popover-input-box"
    >
    </el-input>
  </el-popover>
</template>

<script type="text/ecmascript-6">
import departmentTree from "./department-tree";
export default {
  name: "get-driver-select-tree",
  components: { departmentTree },
  props: {
    value: {},
    placeholder: [String],
    // 是否包含人员(默认不包含)
    isContainEmp: {
      type: Boolean,
      default: false,
    },
    // 是否显示多选框
    isShowCheckbox: {
      type: Boolean,
      default: true,
    },
    // 功能类别(1:营运单元 2:维修单元 3:仓储单元)
    funcType: [Number, String],
    width: {
      type: [String, Number],
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    // 是否多选
    isExportMultiple: {
      type: Boolean,
      default: true,
    },
    // 多选时子父是否关联
    isCheckStrictly: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    value(newVal) {
      this.id = newVal;
      // alert(JSON.stringify(newVal))
      // this.$refs.tree.findSelectedNode()
    },
    visible(vaule) {
      if (vaule) {
        this.$refs.tree.inputFocus();
      }
    },
  },
  data() {
    return {
      id: "",
      input_names: "",
      input_names_old: "",
      visible: false,
    };
  },
  mounted() {
    this.id = this.value;
  },
  methods: {
    departmentCheck(node) {
      // alert(JSON.stringify(node))
      let nodes = [];
      let vehs = [];
      let names = [];
      node.forEach((item) => {
        if (!this.isContainEmp) {
          if (item.type==4||item.type==5) {
            nodes.push(item);
            vehs.push(item.i_id);
            names.push(item.c_name);
          }else{
            this.$message({
            showClose: true,
            message: '请选择班组或车间',
            type: "error",
          });
          }
        } else {
          if (!item.type) {
            nodes.push(item);
            vehs.push(item.i_id);
            names.push(item.c_name);
          }
        }
      });
      this.input_names_old = names.toString();
      this.input_names = names.toString();
      if (this.isExportMultiple) {
        this.$emit("input", vehs);
      } else {
        this.$emit("input", vehs[0]);
        this.visible = false;
      }
      this.$emit("on-change", vehs, nodes);
      // 回显人员tree选中
      this.$refs.tree.setCheckedNodes(node);
      this.$refs.tree.setCurrentKey(vehs);
    },
    inputOut() {
      console.log("inputout");
      this.input_names = this.input_names_old.toString();
    },
    onClear() {
      // alert(1111)
      this.input_names_old = "";
      this.input_names = "";
      // this.$refs.tree.resetChecked();
      // this.$refs.tree.setCheckedNodes([]);
      // this.$refs.tree.setCurrentKey([]);
      if (this.isExportMultiple) {
        this.$emit("input", []);
      } else {
        this.$emit("input", "");
      }
      this.$emit("on-change", []);
    },
    // 回显
    setCheckedKeys(keys) {
      this.$refs.tree.setCheckedkeys(keys);
    },
    // 设置当前的key
    setCurrentKey(keys) {
      this.$refs.tree.setCurrentKey(keys);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.popover-input-box {
  // width 300px
}
</style>
