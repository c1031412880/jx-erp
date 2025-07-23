<template>
  <div ref="organizationTree" class="organization-tree">
    <el-input :placeholder="placeholder" v-model="filterText" style="margin-bottom: 20px;" size="mini">
       <i slot="prefix" class="el-input__icon el-icon-search"></i>
    </el-input>

    <el-tree
      class="filter-tree"
      :check-strictly="true"
      ref="elTree"
      :data="data"
      node-key="i_id"
      :default-expanded-keys="defaultKeys"
      :default-checked-keys="defaultKeys"
      :props="defaultProps"
      :show-checkbox="showCheckbox"
      :expand-on-click-node="isNodeExpanded"
      :highlight-current="true"
      :filter-node-method="filterNode"
      v-loading="loading"
      @node-click="handleNodeClick"
      @check-change="showCheckbox && handleNodeClick"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>
          <i style="margin-right: 5px; color:#409EFF" :class="!data.type ? 'el-icon-s-promotion' : 'el-icon-s-custom'"></i
          >{{ node.label }}
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  watch: {
    filterText(val) {
      this.$refs.elTree.filter(val);
    },
  },
  props: {
    // defaultKeys: {
    //   type: Array,
    //   default: () => [1],
    // },
    isNodeExpanded:{
      type: Boolean,
      default:false,
    },
    showCheckbox:{
      type: Boolean,
      default:false,
    },
    // loading: {
    //   type: Boolean,
    //   default: false,
    // },
    placeholder: [String],
    organizationTreeList: [Array],
  },
  data() {
    return {
      filterText: "",
      defaultKeys:[],
      loading: false,
      data: [],
      defaultProps: {
        children: "children",
        label: "c_name",
      },
      currentKey: null,
      isFirstLoad: true,
    };
  },
  mounted() {
    this.lodData();
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.c_name.indexOf(value) !== -1;
    },
    handleNodeClick(data) {
      // console.log(data, "选中");
      let node
      if(!data.children) {
        node = this.$refs.elTree.getNode(data.i_group_id);
      }
      console.log(data, node, '选中');
      //   this.currentKey = data.id
      this.$emit("on-tree", data);
    },
    // 获取数据
    lodData() {
      this.loading = true;
      this.$client.getRoleTree()
      .then(res => {
        // console.log(JSON.stringify(res))
        if (res.head.result == "200") {
          this.data = res.context;
          this.bulidRoleGroupOptions(res.context);
          // this.currentKey = this.data[0].id;
          // this.$refs.elTree.setCurrentKey(this.currentKey);
          if(this.isFirstLoad) {
            this.handleNodeClick(this.data[0])
            this.setSelecedCheckedKeys([this.data[0].i_id])
          }
          this.isFirstLoad = false;
          this.loading = false;
          } else {
            this.loading = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
      }).catch(err => {

      })
    },
    setSelecedCheckedKeys(ids) {
      // alert(JSON.stringify(ids))
      setTimeout(() => {
        this.defaultKeys = ids;
        this.$refs.elTree.setCurrentKey(ids[0]);
      },50)
    },
    // 构建角色组选项
    bulidRoleGroupOptions(roleGroupList) {
      let roleGroupOptions = [];
      roleGroupList.forEach((item,index) => {
        let obj = {
          value: item.i_id,
          label: item.c_name
        };
        roleGroupOptions.push(obj)
      });

      this.$emit('bulid-rolegroup-options', roleGroupOptions)
    }
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.organization-tree {
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
    width: calc(100% - 24px);
    overflow: hidden;

    .el-button--mini.is-circle {
      padding: 5px;
    }
  }
}
</style>
