<template>
  <div class="salary-management">
    <sub-req
      ref="head"
      @on-ok="onSubmit"
      @on-add="onAdd"
      @on-set="onSet"
      @on-import="onImport"
      :activeName="activeName"
    ></sub-req>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="集团员工" name="1" v-if="$isPowerShow('group')" >
        <group-table ref="group-table" :TableHeight="TableHeight"/>
      </el-tab-pane>
      <el-tab-pane label="驾驶员" name="2" v-if="$isPowerShow('driver')" >
        <driver-table ref="driver-table" :TableHeight="TableHeight"/>
      </el-tab-pane>
      <el-tab-pane label="修理工" name="3">
      </el-tab-pane>
      <el-tab-pane label="调用员、点钞员" name="4">
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import groupTable from "./component/group-table";
import driverTable from "./component/driver-table";
export default {
  name: "salary-management",
  components: {
    subReq,
    groupTable,
    driverTable
  },
  data() {
    return {
      activeName: "1",
      form: {},
      TableHeight: 500,

      refsInfo: {
        '1': 'group-table',
        '2': 'driver-table',
      }
    };
  },
  created() {
    
  },
  mounted() {
    setTimeout(() => {
      if (this.$isPowerShow('group')) {
        this.activeName = '1'
      } else if (this.$isPowerShow('driver')) {
        this.activeName = '2'
      } else {
        this.activeName = '3'
      }

      this.$refs.head.onSubmit()
      this.$nextTick(() => {
        this.setHead()
      })
    }, 1000);
  },
  methods: {
    handleClick(tab, event) {
      this.$nextTick(() => {
        this.$refs.head.resetForm()
      })
    },
    // 计算表格高度 和初始化表头
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight
        this.TableHeight = maxh - th - 50 - 40;
      }, 60);
    },
    // 查询
    onSubmit(info) {
      this.$refs[this.refsInfo[this.activeName]].onSubmit(info)
    },
    // 新增工资
    onAdd() {
      this.$refs[this.refsInfo[this.activeName]].showSalarynDialog()
    },
    // 打开薪资设定
    onSet() {
      this.$refs[this.refsInfo[this.activeName]].showSettingDialog()
    },
    // 导入
    onImport() {
      this.$refs[this.refsInfo[this.activeName]].showFileDialog()
    },

  },
  watch:{
    activeName() {
      this.setHead();
    },
    
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.salary-management {
  width: 100%;
  height: 100%;
}
.salary-management /deep/ .el-tabs__item {
  width: 160px;
  text-align: center;
}

.salary-management /deep/ .el-tabs__nav-wrap::after {
  height: 0px;
}
</style>
