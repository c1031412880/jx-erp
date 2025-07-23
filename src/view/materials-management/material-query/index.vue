<template>
  <div class="collect-and-return-material-query">
    <el-tabs @tab-click="setHead" v-model="activeName">
      <el-tab-pane label="领料单" name="1">
        <material-collection-list ref="materialCollectionList"></material-collection-list>
      </el-tab-pane>
      <el-tab-pane label="退料单" name="2">
        <material-return-list ref="materialReturnList"></material-return-list>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import materialCollectionList from "./component/material-collection-list"
import materialReturnList from "./component/material-return-list"
export default {
  name: 'material-query',
  components: {
    materialCollectionList,
    materialReturnList
  },
  data () {
    return {
      activeName: '1',
      viewHeight: 500
    }
  },
  activated() {
    this.reqRouterQuery();
  },
  mounted() {
      this.reqRouterQuery();
     this.$nextTick(() => {
      this.setHead()
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    })
  },
  methods: {
    reqRouterQuery() {
      this.activeName = this.$route.params.activeName || '1';
    },
    setHead() {
      this.$refs.materialCollectionList.setHead()
      this.$refs.materialReturnList.setHead()
    }
  }
}
</script>
<style lang="scss" scoped>
.collect-and-return-material-query {
  width: 100%;
  height: 100%;
  /deep/ .el-tabs {
    height: 100%;
  }
  /deep/ .el-tabs__content {
    height: calc(100% - 54px);
  }
  /deep/ .el-tab-pane {
    height: 100%;
  }
}
</style>