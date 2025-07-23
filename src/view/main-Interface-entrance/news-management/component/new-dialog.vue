<template>
  <el-dialog
    :title="''"
    :visible="dialogBool"
    :before-close="dialogClose"
    append-to-body
    fullscreen>
      <tr-page-header ref="trPageHeader" slot="title" :content="title" @back="dialogClose"></tr-page-header>
      <div class="content-box">
        <div class="content-left">
          <div class="content-new">
            <div class="content-head">
              <p>{{title === '新闻详情' ? form.title : form.grassroots_title}}</p>
              <el-tag v-show="!!form.top" type="warning" effect="plain" size="mini">置 顶</el-tag>
              <el-tag v-show="!!form.home_page" type="success" effect="plain" size="mini">轮 播</el-tag>
              <div class="head-bottom">
                <div class="head-bottom-left">
                  <span>{{form.created_date}}</span>
                  <span>{{form.user_name}}</span>
                  <span>{{form.type_name}}</span>
                </div>
                <div class="head-bottom-right">
                  <el-button  v-show="!!form.all" @click="openReadDialog" type="text">共{{form.all}}人，{{form.Read}}人已读</el-button>
                  <div v-if="!!form.image_url">
                    <el-popover
                    placement="bottom"
                    trigger="hover"
                    class="image-popover"
                    >
                    <div>
                      <el-image
                      style="width: 350px;height: 136px;"
                      :src="form.image_url"
                      :preview-src-list="[form.image_url]"
                    ></el-image>
                    </div>
                    <!-- <el-button slot="reference">click 激活</el-button> -->
                    <el-button 
                      slot="reference" 
                      type="text">
                      <span 
                        style="display: flex;line-height: 19px;height: 19px;margin-left: 10px;">
                        <svg-icon icon-class="image" style="font-size: 18px;margin-right: 3px;"/>
                        <i> 查看封面图片</i>
                      </span>
                    </el-button>
                  </el-popover>
                </div>
                </div>
              </div>
            </div>
            <div class="content-body">
              <div class="content-text" v-html="form.content"></div>
              <div class="content-bottom" v-for="item in form.files_list" :key="item.id">
                <div>
                  <i class="el-icon-document" style="margin-right: 10px;"></i>
                  <span>{{item.file_name}}</span>
                </div>
                <div><i @click="downloadFile(item)" class="el-icon-download"></i></div>
              </div>
            </div>
          </div>
        </div>
        <div class="audit-box" v-show="isAudit">
          <el-form :model="ruleForm" :rules="basicRules" ref="ruleForm" size="mini">
            <el-form-item label="审核评论:" prop="remark">
              <el-input
                v-model="ruleForm.remark" 
                type="textarea"
                maxlength="200"
                :rows="4"
                show-word-limit
                placeholder="请输入审核评论"></el-input>
            </el-form-item>
          </el-form>
          <div>
            <!-- <el-button type="primary" size="mini">编 辑</el-button> -->
            <el-button @click="updatePlaybill(2)" type="success" size="mini">通 过</el-button>
            <el-button @click="updatePlaybill(3)" type="danger" size="mini">驳 回</el-button>
          </div>
        </div>
      </div>
      <read-dialog :dialogBool.sync="isShowReadDialog" :readData="readUsers" :unReadData="unreadUsers"></read-dialog>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
// import auditDialog from "./audit-dialog"
import readDialog from "./read-dialog";
export default {
  props: {
    dialogBool: Boolean,
    isAudit: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: "新闻详情"
    }
  },
  components: {
    // auditDialog,
    readDialog
  },
  data() {
    return {
      ruleForm: {
        id: 0,
        remark: '',
        state: ''
      },
      basicRules: {
        // remark: [
        //   { required: true, message: "请输入审核评论", trigger: "change" },
        // ],
      },
      readUsers: [],
      unreadUsers: [],
      isShowReadDialog: false,
      imageDalogVisible: false,

      form: {
        id: 0,
        title: '',
        grassroots_title: '',
        content: '',
        top: 1 ,
        home_page: 1 ,
        send_type: 0,
        is_public: 0,
        send_time: '',
        created_date: '',
        type: '',
        user_id: '',
        user_name: '',
        type_name: '',
        all: null,
        Read: null,
        state: '',
        image_url: '',
        read_users: [],
        unread_users: [],
        files_list: []
      }
    };
  },
  mounted() {
  },
  watch: {
    dialogBool(bool) {
      if(bool == false) {
        Object.assign(this.$data.form, this.$options.data().form);
      }
    }
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 数据回显
    setData(info) {
      for(let key in this.form) {
        if(info[key] || (info[key] == 0)) {
          this.form[key] = info[key]
        }
      }
      this.ruleForm.id = info.id
    },
    downloadFile(item) {
      if(item.url) {
        window.location.href = item.url
        this.$message({type: 'success', message: '下载成功'})
      }
    },
    updatePlaybill(type) {
      this.ruleForm.state = type
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let info = {...this.ruleForm};
          this.$emit("save-add-edit", info);
        } else {
          return false;
        }
      });
    },
    openReadDialog() {
      this.readUsers = JSON.parse(JSON.stringify(this.form.read_users))
      this.unreadUsers = JSON.parse(JSON.stringify(this.form.unread_users))
      this.isShowReadDialog = true
    },
    //查看背景图片
    loadImage(){
      this.imageDalogVisible = true
      console.log(this.form)
    },
    imageDialogClose(){
      this.imageDalogVisible = false
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
/deep/ .el-dialog__body {
  padding: 0;
  height: calc(100% - 57px);
  overflow: hidden;
}
/deep/ .el-dialog__header {
  padding: 10px;
}
.content-box {
  display: flex;
  height: 100%;
  padding-top: 10px;
  background-color: #F2F2F2;
  .content-left {
    flex: 1;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.1);
    .content-new {
      padding: 0 20px;
      height: 100%;
      background-color: #ffffff;
      width: 960px;
      margin: 0 auto;
    }
    .content-head {
      text-align: center;
      p {
        padding: 20px 0;
        margin: 0px;
        font-size: 22px;
        font-weight: 700;
        color: #333;
        letter-spacing: 2px;
        line-height: 32px
      }
      .head-bottom {
        display: flex;
        justify-content: space-around;
        align-items: center;
        .head-bottom-left > span {
          font-size: 14px;
          font-weight: 400;
          color: #999999;
          padding: 12px;
        }
        .head-bottom-right{
          display: flex;
          
        }
      }
    }
    .content-body {
      height: calc(100% - 120px);
      overflow-y: auto;
      /deep/ .content-text {
        p {
          font-size: 16px !important;
          line-height: 28px !important;
          color: #3e3e3e !important;
          letter-spacing: 1.5px !important;
          font-family: Arial, Helvetica, sans-serif;
          span {
            font-size: 16px !important;
            line-height: 28px !important;
            color: #3e3e3e !important;
            letter-spacing: 1.5px !important;
            font-family: Arial, Helvetica, sans-serif;
          }
          img {
            max-width: 450px !important;
            max-height: 300px !important;
            margin: 0 auto;
            margin-bottom: 10px;
          }
        }
      }
      .content-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 16px;
        font-weight: 400;
        border-bottom: 1px solid #999999;
        padding-bottom: 5px;
        margin-bottom: 10px;
        i {
          font-size: 20px;
          font-weight: 400;
        }
        &:hover {
          color: #409EFF;
          cursor: pointer;
          border-bottom: 1px solid #409EFF;
        }
      }
    }
  }
  ::-webkit-scrollbar {
    display: none;
  }
  .audit-box {
    width: 360px;
    padding: 30px 10px 10px;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.1);
    // background-color: #ffffff;
  }
}
.image-dialog{
  >>> .el-dialog__header{
    padding: 0;
  }
}
.el-popover {
  padding: 0 !important;
}
</style>