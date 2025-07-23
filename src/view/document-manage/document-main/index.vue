<template>
  <div class="document-main">
    <el-tabs v-model="activeName" @tab-click="tabsClick">
      <el-tab-pane label="发文管理" name="发文管理" lazy v-if="$isPowerShow('send-manage')">
        <cor-box :height="carHeight">
          <send-document ref="sendDocument"></send-document>
        </cor-box>
      </el-tab-pane>
      <el-tab-pane label="收文管理" name="收文管理" lazy v-if="$isPowerShow('receipt-manage')">
        <cor-box :height="carHeight">
          <receipt-manage ref="receiptManage"></receipt-manage>
        </cor-box>
      </el-tab-pane>
      <el-tab-pane label="我的公文" name="我的公文" lazy>
        <cor-box :height="carHeight">
          <main-content ref="mainContent"></main-content>
        </cor-box>
      </el-tab-pane>
      <el-tab-pane label="抄送我的" name="抄送我的" lazy>
        <cor-box :height="carHeight">
          <cc-my ref="ccMy"></cc-my>
        </cor-box>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import corBox from './component/cor-box'
import mainContent from './component/main-content'
import receiptManage from './component/receipt-register'
import sendDocument from './component/send-document'
import ccMy from './component/cc-my'
export default {
  name: "document-main",
  components: {corBox, mainContent, receiptManage, sendDocument, ccMy},
  data() {
    return {
      activeName: '我的公文',
      carHeight: 400
    }
  },
  activated() {
    let activeName = this.$route.params.activeName
    if (activeName) {
      this.activeName = activeName
    }
  },
  mounted() {
    this.$nextTick(() => {
      let activeName = this.$route.params.activeName
      if (activeName) {
        this.activeName = activeName
      }
      this.setBoxHeight()
    })
  },
  methods: {
    setBoxHeight() {
      this.carHeight = this.$el.offsetHeight - 55
    },
    tabsClick(tab) {
      setTimeout(() => {
        switch (tab.label) {
          case '发文管理' :
            this.$refs.sendDocument.loadData()
            break
          case '收文管理' :
            this.$refs.receiptManage.loadData()
            break
          case '我的公文' :
            this.$refs.mainContent.loadData()
            break
          case '抄送我的' :
            this.$refs.ccMy.loadData()
            break
        }
      }, 60)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.document-main{
  width 100%
  height 100%
}
</style>
