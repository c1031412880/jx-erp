<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="920px"
    
  >
    <div class="el-dialog-div">
      <el-form :model="form" :rules="basicRules" ref="form" label-width="120px" size="mini">
        <el-row>
          <el-col :span="12">
            <el-form-item label="标题:" prop="title">
              <el-input v-model="form.title" placeholder="请输入标题" :disabled="curSelecedType == 'detail'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发布人:" prop="created_id">
              <el-input v-model="form.created_name" placeholder="请输入发布人" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="通知人员:" prop="user_type">
              <el-col :span="4">
                <el-checkbox v-model="form.user_type" :true-label="0" :false-label="1">全员</el-checkbox>
              </el-col>
              <el-col :span="20">
                <get-user-select-tree 
                  ref="busAuthorityUser" 
                  v-model="form.user_ids" 
                  style="width:100%;height:300px" 
                  v-show="form.user_type == 1"
                  placeholder="请选择通知人员"
                ></get-user-select-tree>
              </el-col>   
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否强制弹窗:" prop="message_box">
              <el-radio-group v-model="form.message_box">
                <el-radio :label="1"><span style="color:#606266">是</span></el-radio>
                <el-radio :label="0"><span style="color:#606266">否</span></el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="" prop="send_time">
              <el-col :span="4">
                <el-checkbox v-model="form.send_type" :true-label="1" :false-label="0">定时发送</el-checkbox>
              </el-col>
              <el-col :span="4">
                <el-date-picker
                  v-model="form.send_time"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd HH:mm"
                  format="yyyy-MM-dd HH:mm"
                  type="datetime"
                  :disabled="form.send_type == 0">
                </el-date-picker>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="上传文件">
              <el-upload
                class="upload-demo"
                ref="uploadDocomnet"
                action="string"
                :on-change="handlePreview"
                accept=".jpg,.jpeg,.bmp,.gif,.png,.rar,.zip,.doc,.docx,.pdf"
                :show-file-list="false"
                :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary" class="el-icon-upload">选择文件</el-button>
                <div slot="tip" class="el-upload__tip">支持格式：.jpg,.jpeg,.bmp,.gif,.png,.rar,.zip,.doc,.docx,.pdf ，单个文件不能超过20MB，最多只能保存5个文件</div>
              </el-upload>
              <ul class="document-content show-flex-box-c" style="margin-top:10px">
                <li class="show-flex-box-r" style="margin-bottom:10px;justify-content:space-between;" v-for="(item,index) in form.file_list" :key="index">
                  <span class="show-flex-box-r">
                    <i class="el-icon-document-remove" style="margin-right:6px;font-size: 16px"></i>
                    <span>{{item.name}}</span> 
                  </span>
                  <div class="show-flex-box-r">
                    <el-button type="text" style="padding:0" @click="downloadDocument(item)">下载</el-button>
                    <el-button type="text" style="padding:0" @click="deleteDocument(item,index)">删除</el-button>
                  </div>
                </li>
              </ul>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="内容:" prop="content">
              <div style="width: 600px;">
                <tinymce-Vue :value="form.content" @input="(res) => form.content = res"></tinymce-Vue>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('form')">发 布</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import tinymceVue from "@/components/ueditor/tinyVue.vue";
import getUserSelectTree from 'components/base/formModel/tree/get-user-select-tree'
import { getUser } from "@/utils/auth";
export default {
  components: { tinymceVue, getUserSelectTree},
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "编辑",
    },
    curSelecedType: [String],
  },
  mounted() {
  },
  data() {
    return {
      checked:'',
      form: {
        title: '',
        content: '',
        message_box: 0,
        send_time: '',
        created_id:'',
        send_type: 0,
        user_type: 1,
        user_ids: [],
        file_list: []
      },
      basicRules: {
        title: [
          { required: true, message: "请输入标题", trigger: "change" },
        ],
        user_type: [
          { required: true, message: "请选择通知人员", trigger: "change" },
        ],
        content: [
          { required: true, message: "请输入内容", trigger: "change" },
        ],
      },
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
        this.$refs.busAuthorityUser.onClear()
      }else{
        this.configData();
        this.$nextTick(() =>{
          this.$refs.form.clearValidate();
          this.$refs.busAuthorityUser.$refs.tree.scapshow = 0
        })
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    configData() {
      let userInfo = JSON.parse(getUser());
      this.form.created_id = Number(userInfo.user_id)
      this.form.created_name = userInfo.user_name
    },
    updatePlaybill(formName) {
      if (this.form.user_type == 1 && this.form.user_ids.length == 0) {
        this.$message({type: 'warning', message: "请选择通知人员", showClose: true})
        return false
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = {...this.form};
          this.$emit("save-add-edit", info);
        } else {
          return false;
        }
      });
    },
    // 判断文件类型
    beforeUploadFileType(file) {
      let acceptType = '.jpg,.jpeg,.bmp,.gif,.png,.rar,.zip,.doc,.docx,.pdf'
      const fileSuffix = file.name.substring(file.name.lastIndexOf(".") + 1)
      if(acceptType.indexOf(fileSuffix) === -1) {
        this.$message({type: 'warning', message: `只能上传${acceptType}类型的文件`, showClose: true})
        return false
      }else{
        return true
      }
    },
    // 判断文件大小
    beforeFileUpload (file) {
      const isLt1M = file.size / 1024 / 1024 < 20
      if (isLt1M) {
        return true
      }
      this.$message({type: 'error', message: '请不要上传大小超过20M的文件', showClose: true})
      return false
    },
    // 上传资料
    handlePreview(file) {
      if( this.form.file_list.length > 4) {
         this.$message({type: 'warning', message: '最多只能上传五个文件', showClose: true})
        return
      }
      if (this.beforeFileUpload(file) && this.beforeUploadFileType(file)) {
        this.uploadAccidentDataFiles(file)
      }
    },
    // 上传相关资料文件
    uploadAccidentDataFiles(file) {
       // let parmas ={
      //   file: file.row
      // };
      console.log(file)
      let formData = new FormData();
      formData.append("file", file.raw);

      let params = {
        file: formData,
      };
      let fileName = file.name;
      this.$client.AddTxtfileUpload(params).then(res => {
        if(res.head.result == "200") {
          let fileObj = {
            name: fileName,
            url: res.context,
            size: file.size
          }
          this.form.file_list.push(fileObj)
          this.$message({
            showClose: true,
            message: "上传成功",
            type: "success"
          });
        }else{
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    // 删除文件
    deleteDocument(item,index) {
      this.form.file_list.splice(index, 1)
      // this.$refs.uploadDocomnet.uploadFiles.splice(index, 1)
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
  height: 400px;
  overflow-y: scroll;
}
</style>

