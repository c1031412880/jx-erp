<template>
  <el-dialog
    :title="''"
    :visible="dialogBool"
    :before-close="dialogClose"
    append-to-body
    class="read-or-not-dialog"
    width="536px">
      <div slot="title" class="dialog-header show-flex-box-r show-flex-center" style="height: 60px; background:#456AfA;box-shadow:0px 6px 0px #F0F0F0;">
        <span style="font-size: 20px; font-weight: 500; color:#fff">查看详情</span>
      </div>
      <el-tabs v-model="activeName" style="height:100%">
        <el-tab-pane :label="`已读 ${readData.length}`" name="first">
          <div class="card-box">
            <div class="card-box-item" v-for="(item,index) in readData" :key="index">
              <img :src="require('../../../../../assets/approverStepIcon/shenpi@2x.png')" style="background-color: #0087FF;" alt="">
              <span>{{ item.name }}</span>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="`未读 ${unReadData.length}`" name="second">
          <div class="card-box">
            <div class="card-box-item" v-for="(item,index) in unReadData" :key="index">
              <img :src="require('../../../../../assets/approverStepIcon/shenpi@2x.png')" style="background-color: #0087FF;" alt="">
              <span>{{ item.name }}</span>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
export default {
  name: "read-or-not-dialog",
  props: {
    dialogBool: Boolean,
    formType: {
      type: String,
      default: ""
    }
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        this.data = []
        this.activeName = "first"
      }else{
      }
    },
  },
  data() {
    return {
      activeName:"first",
      readData: [],
      unReadData: [],
      apiMap:{
        'work-notice':'GetDetailWorkMessage',
        'company-announcement':'GetDetailCompanyMessage',
        'system-announcement':'GetReadSysVersion',
      }
    };
  },
  mounted() {
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 数据加载
    loadData(id) {
      this.unReadData = []
      this.readData = []
      this.$client[this.apiMap[this.formType]]({context:id})
        .then(res => {
          if (res.head.result == "200") {
            let list = res.context
            list.forEach(item => {
              if (item.state === 0) {
                this.unReadData.push(item)
              }else {
                this.readData.push(item)
              }
            });
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch(err => {
           this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
    },
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.read-or-not-dialog {
  width: 100%;
  height: 100%;
  .card-box {
    height: 100%;
    max-height: 400px;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    max-height: 400;
    overflow: auto;
    .card-box-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 10px;
      span {
        font-size: 14px;
        font-family: Source Han Sans SC-Regular, Source Han Sans SC;
        font-weight: 400;
        color: #666666;
        white-space: nowrap
      }
    }
    img {
      height: 40px;
      width: 40px;
      border-radius: 4px;        
    }
  }
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