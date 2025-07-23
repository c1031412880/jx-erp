<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    top="20px"
    :close-on-click-modal="false"
    width="900px">
    <div class="dialog-content">
      <el-tabs v-model="activeName">
        <el-tab-pane label="检查记录" name="first">
          <inspection-record v-if="id" :id="id"></inspection-record>
        </el-tab-pane>
        <el-tab-pane label="反馈意见" name="second" v-if="curSelectedType">
          <corrective-feedback v-if="contents_result" :detail_id="detail_id"></corrective-feedback>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import inspectionRecord from "./inspection-record";
import correctiveFeedback from "./corrective-feedback";
export default {
  components: {inspectionRecord, correctiveFeedback},
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "检查详情",
    },
    curSelectedType: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      activeName: 'first',
      id:0,
      detail_id:0,
      contents_result:'',
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    setDate(obj) {
      this.id = obj.id
      this.detail_id = obj.detail_id
      this.contents_result = obj.contents_result
    }
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
/deep/ .el-tabs__content {
  height: 600px;
  overflow: auto;
}
</style>

