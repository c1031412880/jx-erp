<template>
  <div class="document-library">
    <el-tabs v-model="activeName"  type="border-card">
      <el-tab-pane v-if="$isPowerShow('send-look')" label="发文库" name="发文库" :lazy="true">
        <cor-box :height="carHeight">
          <send-doc @set-show="onStateSet"></send-doc>
        </cor-box>
      </el-tab-pane>
      <el-tab-pane v-if="$isPowerShow('receipt-look')" label="收文库"  name="收文库" :lazy="true">
        <cor-box :height="carHeight">
          <receipt-doc @set-show="onStateSet"></receipt-doc>
        </cor-box>
      </el-tab-pane>
    </el-tabs>
    <info-dialog ref="draftDialog" :dialogTitle="dialogTitle" :dialogBool.sync="draftDialogShow"></info-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import infoDialog from './component/info-dialog'
import corBox from "./component/cor-box";
import sendDoc from "./component/send-doc";
import receiptDoc from "./component/receipt-doc";
export default {
  name: "document-library",
  components: {infoDialog, corBox, sendDoc, receiptDoc},
  data() {
    return {
      activeName: '发文库',
      draftDialogShow: false,
      carHeight: 400,
      dialogTitle: '查看发文'
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead()
    })
  },
  methods: {
    // 审核编辑初始化
    onStateSet(item, type) {
      console.log(item, type);
      this.dialogTitle = type == 1 ? '查看发文' : '查看收文'
      item.type = type
      item.is_audit = false
      item.document_id = item.id
      setTimeout(() => {
        this.$refs.draftDialog.setData(item)
      }, 100)
      this.draftDialogShow = true
    },
    // 计算表格高度
    setHead() {
      this.carHeight = this.$el.offsetHeight - 70
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.document-library{
  width 100%
  height 100%
}
</style>
