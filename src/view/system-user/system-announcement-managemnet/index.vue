<template>
  <div class="system-announcement-managemnet">
    <el-tabs v-model="activeName" style="height:100%">
      <el-tab-pane label="系统公告" name="first" style="height:100%">
        <system-announcement :TableHeight="TableHeight"></system-announcement>
      </el-tab-pane>
      <el-tab-pane label="工作通知" name="second">
        <work-notice :TableHeight="TableHeight"></work-notice>
      </el-tab-pane>
      <el-tab-pane label="公司公告" name="third">
        <company-announcement :TableHeight="TableHeight"></company-announcement>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import systemAnnouncement from "./component/system-announcement"
import workNotice from "./component/work-notice"
import companyAnnouncement from "./component/company-announcement"
export default {
  name: "system-announcement-managemnet",
  components: {
    systemAnnouncement,
    workNotice,
    companyAnnouncement
  },
  data() {
    return {
      activeName:"first",
      TableHeight: 500,
    };
  },
  mounted() {
    this.setHead()
    let activeName = this.$route.params.activeName
    if (activeName) {
      this.activeName = activeName
    }
  },
  activated() {
    let activeName = this.$route.params.activeName
    if (activeName) {
      
      this.activeName = activeName
    }
  },
  methods: {
    // 计算表格高度 和初始化表头
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = 100;
        this.TableHeight = maxh - th;
      }, 60);
    },
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.system-announcement-managemnet {
  width: 100%;
  height: 100%;
}
</style>
