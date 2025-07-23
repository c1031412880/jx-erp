<template>
  <div ref="organizationTree" class="organization-tree">
    <el-input :placeholder="placeholder" v-model="filterText" clearable style="margin-bottom: 10px;" size="mini">
       <i slot="prefix" class="el-input__icon el-icon-search"></i>
    </el-input>

    <el-tree
      ref="tree"
      v-loading="loading"
      :default-expand-all="true"
      :show-checkbox="isShowCheckbox"
      :highlight-current="true"
      :check-on-click-node="isShowCheckbox"
      :check-strictly="false"
      :expand-on-click-node="true"
      :data="data"
      node-key="i_id"
      :props="defaultProps"
      :filter-node-method="filterNode"
      @check-change="onCheck"
      style="width: 100%;height: 500px;overflow: auto;"
    >
      <div class="custom-tree-node show-flex-box-r" slot-scope="{ node, data }">
        <span class="show-flex-box-r" style="align-items: center;">
          <!-- <i style="margin-right: 5px; color:#409EFF" :class="data.type == 1 ? 'el-icon-office-building' : data.type == 2 ? 'el-icon-s-unfold': 'el-icon-truck'"></i> -->
          <i class="show-flex-box-r" style="margin-right: 5px; width: 13px;height: 13px;flex-shrink: 0;">
            <img src="@/assets/components/org.png" alt="" style="flex-shrink: 0; height: 100%;width: 100%;object-fit: cover;" v-if="data.type == 1">
            <img src="@/assets/components/line.png" alt="" style="flex-shrink: 0; height: 100%;width: 100%;object-fit: cover;" v-if="data.type == 2">
            <img src="@/assets/components/car.png" alt="" style="flex-shrink: 0; height: 100%;width: 100%;object-fit: cover;" v-if="data.type == 3">
          </i>
          <span style="margin-right: 25px; margin-bottom: 3px;">{{node.label}}</span>
        </span>
      </div>
    </el-tree>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  props: {
    isShowCheckbox:{
      type: Boolean,
      default:true,
    },
    placeholder: [String],
  },
  data() {
    return {
      filterText: "",
      loading: false,
      data: [],
      defaultProps: {
        children: "children",
        label: "c_name",
      },
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.c_name.indexOf(value) !== -1;
    },
    // 获取车辆树数据
    loadData() {
      this.data = []
      this.loading = true;
      let params = {
        oil_type: 1
      }
      this.$client.getVehicleTree(params).then((res) => {
        if (res.head.result === "200") {
          this.loading = false;
          this.data = this.setLineId(res.context)          
        }
      })
      .catch((err) => {
        // this.data = [];
        this.loading = false;
      });
    },
    // 设置线路唯一id
    setLineId(list) {
      return list.forEach(item => {
        if(item.type === 2) {
          item.i_id = item.i_id + '_' + item.parent_id
        }
        if(item.children && item.children.length) {
          this.setLineId(item.children)
        }
      })
    },
    onCheck() {
      if(this.isShowCheckbox) {
        let curSelectNode = this.$refs.tree.getCheckedNodes();
        let nodes = []
        let ids = []
        for(let i = 0;i<curSelectNode.length;i++) {
          let item = curSelectNode[i]
          if (item.type === 3) {
            nodes.push(item)
            ids.push(item.i_id)
          } 
        }
        this.$emit("on-check",[...nodes],[...ids]);
      }
    },
    // 清空
    onVehicleClear() {
      this.filterText = ''
      this.$refs.tree.setCheckedKeys([]);
    },
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
