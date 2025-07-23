<template>
  <div class="schedule-type-tree">
    <el-input v-show="isFilter" placeholder="请输入关键字"  v-model="filterText" style="margin-bottom: 20px;" size="mini">
       <i slot="prefix" class="el-input__icon el-icon-search"></i>
    </el-input>
    <el-tree
      ref="elTree"
      :data="data"
      node-key="id"
      v-loading="loading"
      :props="defaultProps"
      :highlight-current="true"
      :expand-on-click-node="isNodeExpanded"
      :filter-node-method="filterNode"
      :default-expanded-keys="defaultKeys"
      :current-node-key="currentNodeKey"
      @node-click="handleNodeClick">
      <div class="custom-tree-node" slot-scope="{ node, data }">
        <el-tooltip class="item" effect="dark" :content="node.data.schedule_type" placement="top">
          <span>
            <i style="margin-right: 5px; color:#409EFF" :class="!data.type ? 'el-icon-date':'el-icon-collection'"></i>
            {{ node.data.schedule_type }}({{node.data.count}})
          </span>
        </el-tooltip>
      </div>
    </el-tree>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    isFilter:{
      type: Boolean,
      default:false,
    },
    isNodeExpanded:{
      type: Boolean,
      default:false,
    },
  },
  watch: {
    filterText(val) {
      // this.$refs.elTree.filter(val);
    },
  },
  data() {
    return {
      filterText: '',
      data: [],
      defaultProps: {
        children: "sysSchedules",
        label: "schedule_type",
      },
      defaultKeys:[],
      currentNodeKey: '',
      loading: false,
    }
  },
  mounted() {
    // this.$nextTick(() => {
      this.getScheduleTypeList()
    // })
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.schedule_type.indexOf(value) !== -1;
    },
    // 获取日程类型列表
    getScheduleTypeList() {
      this.loading = true
      this.$client.GetTypeScheduleManage({})
        .then(res => {
          this.loading = false; 
          if (res.head.result == "200") {
            // this.data = [{ id: 999999, schedule_type: '我的日程', count: 33, type: 0, children: res.context }]
            this.data = res.context
            // this.data[0].id = 999999
            this.defaultKeys = [res.context[0].id]
            this.currentNodeKey = res.context[0].id
            setTimeout(() => {
              this.$refs['elTree'].setCurrentKey(res.context[0].id);
            }, 30);
            this.handleNodeClick(res.context[0])
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
    },

    handleNodeClick(data) {
      // console.log(data, "选中");
      this.$emit("on-tree", data);
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.schedule-type-tree {
  height: calc(100% - 38px);
  width: 100%;
  margin-top: 10px;
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