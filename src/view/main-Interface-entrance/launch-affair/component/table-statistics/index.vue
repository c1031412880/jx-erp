<template>
  <div class="table-statistics">
    <div class="table-statistics-content">
        <el-card class="box-card left-box">
          <div
            slot="header"
            style="height: 10px; line-height: 10px; flex-wrap: nowrap; align-items:center;"
          >审批单分类</div>
          <approval-tree
            ref="approvalTree"
            :loading="approvalloading"
            :placeholder="'请输入审批单名称'"
            @on-tree="selectRoleTree"
          >
          </approval-tree>
        </el-card>
        <el-card class="box-card center-box">
          <statistics-form :model="model" :key="key"></statistics-form>
        </el-card>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import approvalTree from './approval-tree'
  import statisticsForm from './component/statistics-form'
  export default {
    name: "table-statistics",
    components:{
      approvalTree,
      statisticsForm,
    },
    data() {
      return {
        approvalloading: false,
        model: null,
        key: null
      }
    },
    created() {
    },
    methods: {
      selectRoleTree(data) {
        if (data.form_type ) {
          this.model = data.form_type
          console.log('model',this.model);
          this.key = new Date().getTime()
        }
      },
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.table-statistics{
  width 100%
  height 100%
  .table-statistics-content {
      width: 100%;
      height: 100%;
      display: flex;

    .box-card {
      height: 100%;
      overflow: auto;
    }

    .left-box {
      min-width: 260px
      margin: 0 5px 0 0;
      height: 100%;
    }

    .center-box {
      flex: 1;
      height: 100%;
      >>>.el-card__body{
        height: 100%;
      }
    }

  }
 
}
</style>
