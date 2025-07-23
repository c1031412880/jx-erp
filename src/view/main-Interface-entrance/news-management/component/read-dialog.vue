<template>
  <el-dialog
    :title="''"
    :visible="dialogBool"
    :before-close="dialogClose"
    :show-close="false"
    append-to-body
    class="read-dialog"
    width="525px">
      <div slot="title" class="dialog-header show-flex-box-r show-flex-center">
        <span style="font-size: 20px; font-weight: 500; color:#fff">查看详情</span>
      </div>
      <el-tabs v-model="activeName" style="height:100%">
        <el-tab-pane :label="`已读 ${readData.length}`" name="first">
          <div class="card-box">
            <div class="card-box-item" v-for="(item) in readData" :key="item.id">
              <el-image :src="require('@/assets/approverStepIcon/shenpi@2x.png')" style="background-color: #0087FF;" alt=""></el-image>
              <el-tooltip class="item" effect="dark" :content="item.name" placement="top">
                <span>{{ item.name }}</span>
              </el-tooltip>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="`未读 ${unReadData.length}`" name="second">
          <div class="card-box">
            <div class="card-box-item" v-for="(item) in unReadData" :key="item.id">
              <el-image :src="require('@/assets/approverStepIcon/shenpi@2x.png')" style="background-color: #0087FF;" alt=""></el-image>
              <el-tooltip class="item" effect="dark" :content="item.name" placement="top">
                <span>{{ item.name }}</span>
              </el-tooltip>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    dialogBool: Boolean,
    readData: {
      type: Array,
      default: () => []
    },
    unReadData: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
      activeName:"first",
    };
  },
  mounted() {
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
/deep/ .el-dialog__header {
  background-color: #456AfA;
  padding: 20xp;
}
/deep/ .el-dialog__body {
  padding: 0 10px;
}
.card-box {
  height: 500px;
  display: flex;
  flex-wrap: wrap;
  overflow-y: auto;
  .card-box-item {
    display: flex;
    flex-direction: column;
    margin: 0 10px 10px 0;
    cursor: pointer;
    .el-image {
      width: 42px;
      height: 42px;
      border-radius: 3px;
      margin-bottom: 5px;
    }
    span {
      width: 42px;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>