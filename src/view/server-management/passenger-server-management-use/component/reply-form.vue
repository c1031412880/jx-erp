<template>
  <!-- 回复单文档预览弹窗 -->
  <el-dialog
    title="回复单"
    :visible="dialogVisible"
    width="760px"
    top="20px"
    :before-close="dialogClose"
    :close-on-click-modal="false">
    
    <div class="reply-document-preview">
      <p class="title">
        关于
        <span v-if="replyFormData.message_sources_name">{{ replyFormData.message_sources_name }}</span>
        <span v-if="replyFormData.letter_code">{{ '(' + replyFormData.letter_code + ')' }}</span>
        交办单的回复
      </p>
      <p class="name">
        <span v-if="replyFormData.call_name">{{ replyFormData.call_name }}</span>
        先生或女士：
      </p>
      <p class="content">
        您好！信访件
        <span v-if="replyFormData.letter_code">{{ '编号：' + replyFormData.letter_code }}</span>
        已收悉，您反映的
        <span v-if="replyFormData.order_content">{{ replyFormData.order_content }}</span>
        问题，已向具体分管领导请示汇报，经调查了解（核实），现答复如下：
      </p>
      <p class="result" v-html="replyFormData.order_reply"></p>
      <p class="company">嘉兴市公共交通有限公司</p>
      <p class="time">
        {{ replyFormData.verify_time ? replyFormData.verify_time.slice(0, 4) : new Date().getFullYear() }}年
        {{ replyFormData.verify_time ? replyFormData.verify_time.slice(5, 7) : new Date().getMonth() + 1 }}月
        {{ replyFormData.verify_time ? replyFormData.verify_time.slice(8, 10) : new Date().getDate() }}日
      </p>
    </div>
    
    <!-- 弹窗底部按钮 -->
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="dialogClose">关闭</el-button>
      <el-button type="primary" size="mini" @click="handleDownload">下载</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'ReplyFormDialog',
  props: {
    dialogVisible: Boolean,
    replyFormData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      
    }
  },
  methods: {
    /**
     * 关闭弹窗
     */
    dialogClose() {
      this.$emit("update:dialogVisible", false);
    },
    handleDownload() {
      this.$client.GetPassengerServiceDocs({id: this.replyFormData.id}).then(res => {
        if (res.code == 200) {
          window.location.href = res.context
          this.$message({ type: 'success', message: '下载成功' })
        }else {
          this.$message({ type: 'error', message: '下载失败' })
        }
        this.dialogClose()
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.reply-document-preview {
  height: 660px;
  overflow-y: auto;
  .title {
    font-size: 22px;
    color: #333333
    font-weight: bold;
    text-align: center;
    margin-bottom: 30px;
    span {
      font-size: 22px;
      color: #333333
      font-weight: bold;
      text-align: center;
    }
  }
  .name, .content, .result, .company, .time {
    font-size: 16px;
    color: #333333;
    line-height: 30px;
    letter-spacing: 2px;
  }
  .content {
    text-indent: 2em;
  }
  .company {
    text-align: right;
  }
  .time {
    text-align: right;
  }
}
</style> 