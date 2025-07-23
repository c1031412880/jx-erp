<template>
  <el-dialog
    :visible="dialogBool"
    :title="''"
    :before-close="dialogClose"
    width="700px"
    center
  >
    <div slot="title" class="dialog-header show-flex-box-r show-flex-center" style="height: 60px; background:#456AfA;box-shadow:0px 6px 0px #F0F0F0;">
      <span style="font-size: 20px; font-weight: 500; color:#fff">系统公告</span>
    </div>
    <div class="el-dialog-div">
      <div class="show-flex-box-r" style="justify-content: space-between; padding: 15px 10px 0px 15px;">
        <strong style="font-size: 15px"> {{form.title}}</strong>
        <span style="font-size: 12px; color: #909399">生效开始日期： {{form.start_date}}</span>
      </div>
      <div class="html-content" style="padding: 20px 10px; height: 380px;">
        <div ref="htmlContenDom" class="show-flex-box-c" :style="`${htmlContentHeight>340? 'height: 340px; overflow-y: scroll':''}`" v-html="form.content">
        </div>
      </div>
    </div>

  </el-dialog>
</template>

<script type="text/ecmascript-6">
export default {
  name: "system-announcement-popup",
  props: {
    dialogBool:{
      type: Boolean,
      default: false
    }
  },
  mounted() {
  },
  data() {
    return {
      dsda:'<p>&nbsp;&nbsp;&nbsp;&nbsp;1.新增[车辆油耗录入]功能，通过人工录入车辆每月油耗，形成车辆的油耗台账。</p><p>&nbsp;&nbsp;&nbsp;&nbsp;2.新增[驾驶员安全档案]功能，维护驾驶员安全档案。</p><p>&nbsp;&nbsp;&nbsp;&nbsp;3.优化了部分功能的查询速度。</p><p>&nbsp;&nbsp;&nbsp;&nbsp;4.修复一些BUG。</p><p>&nbsp;&nbsp;&nbsp;&nbsp;1.新增[车辆油耗录入]功能，通过人工录入车辆每月油耗，形成车辆的油耗台账。</p><p>&nbsp;&nbsp;&nbsp;&nbsp;1.新增[车辆油耗录入]功能，通过人工录入车辆每月油耗，形成车辆的油耗台账。</p><p>&nbsp;&nbsp;&nbsp;&nbsp;2.新增[驾驶员安全档案]功能，维护驾驶员安全档案。</p><p>&nbsp;&nbsp;&nbsp;&nbsp;3.优化了部分功能的查询速度。</p><p>&nbsp;&nbsp;&nbsp;&nbsp;4.修复一些BUG。</p><p>&nbsp;&nbsp;&nbsp;&nbsp;1.新增[车辆油耗录入]功能，通过人工录入车辆每月油耗，形成车辆的油耗台账。</p><p>&nbsp;&nbsp;&nbsp;&nbsp;1.新增[车辆油耗录入]功能，通过人工录入车辆每月油耗，形成车辆的油耗台账。</p><p>&nbsp;&nbsp;&nbsp;&nbsp;2.新增[驾驶员安全档案]功能，维护驾驶员安全档案。</p><p>&nbsp;&nbsp;&nbsp;&nbsp;3.优化了部分功能的查询速度。</p><p>&nbsp;&nbsp;&nbsp;&nbsp;4.修复一些BUG。</p><p>&nbsp;&nbsp;&nbsp;&nbsp;1.新增[车辆油耗录入]功能，通过人工录入车辆每月油耗，形成车辆的油耗台账。</p><p>&nbsp;&nbsp;&nbsp;&nbsp;1.新增[车辆油耗录入]功能，通过人工录入车辆每月油耗，形成车辆的油耗台账。</p><p>&nbsp;&nbsp;&nbsp;&nbsp;2.新增[驾驶员安全档案]功能，维护驾驶员安全档案。</p><p>&nbsp;&nbsp;&nbsp;&nbsp;3.优化了部分功能的查询速度。</p><p>&nbsp;&nbsp;&nbsp;&nbsp;4.修复一些BUG。</p><p>&nbsp;&nbsp;&nbsp;&nbsp;1.新增[车辆油耗录入]功能，通过人工录入车辆每月油耗，形成车辆的油耗台账。</p>',
      form: {},
      htmlContentHeight: 0
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }else{
        this.$nextTick(() => {
          this.configData();

        })
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    configData() {
      this.htmlContentHeight = this.$refs.htmlContenDom.offsetHeight;
      // console.log(this.htmlContentHeight)
    },
    setData(info) {
      this.form = {...info}
    }
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div {
  height: 400px;
  // overflow-y: scroll;
}
.el-dialog__body{
  padding: 20px 0px 10px 0px !important;
}
.el-dialog__wrapper /deep/ .el-dialog__header{
  padding: 0 !important;
}
.el-dialog__wrapper /deep/ .el-dialog--center .el-dialog__body{
  padding: 0 !important;
}
.el-dialog__wrapper /deep/ .el-dialog__headerbtn .el-dialog__close {
  color: #fff !important;
}

.html-content /deep/ .list-paddingleft-2{
  width: 650px !important;
}
.html-content /deep/  p{
  color: #333;
  font-size: 14px;
  margin-bottom: 8px;
  line-height: 16px;
}
</style>

