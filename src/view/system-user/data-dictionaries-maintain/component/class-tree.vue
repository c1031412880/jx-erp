<template>
  <div class="dictionaries-tree">
    <div class="show-flex-box-r" style="margin-bottom: 20px; align-items:center;">
      <el-input :placeholder="placeholder" v-model="filterText" >
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <i class="el-icon-refresh-left" style="margin-left:15px; font-size:21px; cursor: pointer;" @click="refreshTreeList"></i>
    </div>
    <el-tree
      class="filter-tree"
      :check-strictly="true"
      ref="elTree"
      :data="data"
      node-key="i_id"
      :props="defaultProps"
      :show-checkbox="showCheckbox"
      :expand-on-click-node="isNodeExpanded"
      :highlight-current="true"
      :filter-node-method="filterNode"
      v-loading="loading"
      @node-click="handleNodeClick"
    >
      <span class="custom-tree-node" slot-scope="{ node }">
        <span>
          <i style="margin-right: 5px; color:#409EFF; font-weight: 800;" class="el-icon-folder" v-if="node.data.type === 1" ></i>
          <i style="margin-right: 5px; color:#409EFF; font-weight: 800;" class="el-icon-notebook-1" v-else ></i>
          {{ node.data.c_name }}
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "dictionaries-tree",
  watch: {
    filterText(val) {
      this.$refs.elTree.filter(val);
    },
    value(val) {
      if (val) {
        this.setSelectCheckedKeys(val)
      }
    }
  },
  props: {
    isNodeExpanded:{
      type: Boolean,
      default:false,
    },
    showCheckbox:{
      type: Boolean,
      default:false,
    },
    placeholder: [String],
    value: {}
  },
  data() {
    return {
      filterText: "",
      defaultProps: {
        children: "children",
        label: "c_name",
      },
      currentKey: null,
      data: [],
      loading: false
    };
  },
  mounted() {
    this.$nextTick(()=> {
      this.lodData();
    })
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.c_name.indexOf(value) !== -1;
    },
    handleNodeClick(data) {
      console.log(data, "选中");
      //   this.currentKey = data.id
      this.$emit("on-tree", data);
      this.$emit('input', data.i_id)
    },
    // 获取数据
    lodData() {
      this.loading = true;
      this.$client.getClassifyGroupDictionaryManage()
        .then(res => {
          this.loading = false;
          if (res.head.result == "200") {
            this.data = [{
              i_id: 0,
              c_name: '分类树',
              type: 1,
              children: [...res.context]
            }];
          } else {
            this.data = []
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
          if (this.value !== '') {
            this.setSelectCheckedKeys(this.value)
          }
        }).catch(err => {
        this.data = []
        this.loading = false;
      })
    },
    setSelectCheckedKeys(id) {
      setTimeout(() => {
        this.$refs.elTree.setCurrentKey(id)
        let node = this.$refs.elTree.getCurrentNode(id)
        if (node) {
          this.handleNodeClick(node)
        }
      }, 60)
    },
    outNode(node) {
      if (node.i_id === this.defaultKeys[0]) {
        this.handleNodeClick(node)
        return false
      }
      if (!!node.children && node.children.length > 0) {
        node.children.forEach(item => {
          this.outNode(item)
        })
      }
    },
    // 刷新树结构
    refreshTreeList() {
      this.$emit("refresh-tree")
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
