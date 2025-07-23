<template>
  <el-dialog
    :visible="dialogBool"
    :title="''"
    :before-close="dialogClose"
    width="700px"
    center
  >
    <div slot="title" class="dialog-header show-flex-box-r show-flex-center" style="height: 60px; background:#456AfA;box-shadow:0px 6px 0px #F0F0F0;">
      <span style="font-size: 20px; font-weight: 500; color:#fff">工作通知</span>
    </div>
    <div class="el-dialog-div">
      <div class="show-flex-box-r" style="justify-content: space-between; padding: 15px 10px 0px 15px;">
        <strong style="font-size: 15px"> 
          <span>{{form.title}}</span>
          <span @click="showUnread(form)" v-if="form.unread_count > 0" style="color:#027DB4;cursor: pointer">{{form.unread_count + '人未读'}}</span>
          <span v-if="form.unread_count == 0" style="color:#AAA">{{"全部已读"}}</span>
        </strong>
        <span style="font-size: 12px; color: #909399">生效开始日期： {{form.send_time}}</span>
      </div>
      <div class="html-content" style="padding: 20px 10px; height: 380px;">
        <div ref="htmlContenDom" class="show-flex-box-c" :style="`${htmlContentHeight>340? 'height: 340px; overflow-y: scroll':''}`" v-html="form.content">
        </div>
      </div>
      <div v-if="form.files_list.length > 0" style="padding: 0 10px">
        <ul class="document-content show-flex-box-c" style="margin-top:10px">
          <li class="show-flex-box-r" style="margin-bottom:10px;justify-content:space-between;" v-for="(item,index) in form.files_list" :key="index">
            <span class="show-flex-box-r">
              <i class="el-icon-document-remove" style="margin-right:6px;font-size: 16px"></i>
              <span>{{item.file_name}}</span> 
            </span>
            <div class="show-flex-box-r">
              <el-button type="text" style="padding:0" @click="downloadDocument(item)">下载</el-button>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <read-or-not-dialog
      ref="readOrNotDialog"
      :dialogBool.sync="readOrNotDialogShow"
    ></read-or-not-dialog>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import readOrNotDialog from "../dialog/read-or-not-dialog";
export default {
  name: "system-announcement-popup",
  components: { readOrNotDialog },
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
      form: {
        files_list: []
      },
      htmlContentHeight: 0,
      readOrNotDialogShow: false
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
    },
    showUnread(form){
      this.readOrNotDialogShow = true
      setTimeout(() => {
        this.$refs.readOrNotDialog.loadData(form.id)
      }, 100);
    },
    // 下载文件
    downloadDocument(item) {
      // console.log(item)
      window.location.href = item.url
      this.$message({type: 'success', message: '下载成功'})
    },
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div {
  // height: 400px;
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

