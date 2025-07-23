<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :destroy-on-close="true"
    :before-close="dialogClose"
    fullscreen
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
            <el-form-item label="作者:" prop="author">
              <el-input v-model="form.author" placeholder="请输入发布人" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="curSelecedType != 'edit'">
            <el-form-item label="发送人员:" prop="user_type">
              <el-col :span="4">
                <el-checkbox v-model="form.user_type" :true-label="0" :false-label="1">全员</el-checkbox>
              </el-col>
              <el-col :span="20">
                <get-user-select-tree
                  ref="busAuthorityUser"
                  v-model="form.user_ids"
                  style="width:100%;height:300px"
                  v-show="form.user_type == 1"
                  :isEcho="true"
                  placeholder="请选择通知人员"
                ></get-user-select-tree>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="公告分类" prop="type">
              <get-select-dictionaries
                v-model="form.type"
                style="width:100%"
                @change="changeClassification"
                :classKey="'公告类别'"
                placeholder="请选择公告分类">
              </get-select-dictionaries>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="封面图片" prop="maintain_type">
              <el-image
                @click.native="uploadFile"
                style="width:350px; height: 136px"
                :src="form.image_url ? form.image_url : bgImg"
              ></el-image>
              <p>推荐尺寸750*272；支持.jpg, .jpeg, .bmp, .gif, .png类型文件，5M以下</p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="top">
              <el-checkbox v-model="form.top" :true-label="1" :false-label="0">设为置顶公告</el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="curSelecedType != 'edit'">
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
          <el-col :span="12" v-if="curSelecedType !== 'edit'">
            <el-form-item label="" prop="notice">
              <el-checkbox v-model="form.notice" :true-label="1" :false-label="0">通知发送人员</el-checkbox>
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
              <!-- <div style="width: 720px"> -->
<!--                <ueditor :id="'ueditor_id3'" ref="ueditorContent"></ueditor>-->
<!--                <tinymce-content :value="form.content" @input="(res) => form.content = res"></tinymce-content>-->
                <tinymce-Vue :value="form.content" @input="(res) => form.content = res"></tinymce-Vue>
              <!-- </div> -->
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button @click="preview">预 览</el-button>
      <el-button type="primary" @click="updatePlaybill('form')">发 布</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
// import ueditor from "@/components/ueditor/ueditor";
import tinymceVue from "../../../../../components/ueditor/tinyVue.vue";
// import tinymceContent from '../../../../../components/Tinymce/index.vue'
import getUserSelectTree from 'components/base/formModel/tree/get-user-select-tree'
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
import { getUser } from "@/utils/auth";
import bgImg from "@/assets/notice-image/bj.png"
import { formatDateTime} from '@/utils/index'
export default {
  components: { getUserSelectTree, getSelectDictionaries,tinymceVue},
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
        id: "",
        title: '',
        content: '',
        send_time: '',
        author:'',
        send_type: 0,
        user_type: 1,
        user_ids: [],
        file_list: [],
        image_url: '',
        type_name: '',
        type: "",
        top: 0 ,
        notice: 0
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
      bgImg: bgImg
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
        this.$refs.busAuthorityUser.onClear()
        
        // this.$refs.ueditorContent.setContent(this.form.content);
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
    // 编辑时数据回显
    setData(info){
      Object.keys(info).forEach(key => {
        if (this.form.hasOwnProperty(key)) {
          this.form[key] = info[key]
        }
      })
      // this.$refs.ueditorContent.initEditor();
      // this.$refs.ueditorContent.setContent(this.form.content);
      console.log('this.form',this.form);
    },
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    changeClassification(info) {
      this.form.type_name = info.c_name
    },
    preview() {
      this.form.created_time = formatDateTime(new Date())
      // this.form.content = this.$refs.ueditorContent.getContent()
      this.$emit("show-preview",this.form)
    },
    configData() {
      let userInfo = JSON.parse(getUser());
      this.form.author = userInfo.user_name
    },
    updatePlaybill(formName) {
      // console.log(this.$refs.ueditorContent.getContent())
      // this.form.content = this.$refs.ueditorContent.getContent()
      if (this.form.user_type == 1 && this.form.user_ids.length == 0) {
        this.$message({type: 'warning', message: "请选择通知人员", showClose: true})
        return false
      }
      if (this.form.content === "") {
        this.$message({type: 'warning', message: "请填写公告内容", showClose: true})
        return false
      }
      if (this.form.send_type == 1 && this.form.send_time === "") {
        this.$message({type: 'warning', message: "请填写定时发送时间", showClose: true})
        return false
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = {...this.form};
          // info.content = this.$refs.ueditorContent.getContent();
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
    // 自定义上传图片
    uploadFile() {
      let input = document.createElement("input");
      input.type = "file";
      // input.accept = "image/*";
      input.accept = ".jpg,.jpeg,.bmp,.gif,.png";
      input.onchange = () => {
        let reader = new FileReader();
        reader.readAsDataURL(input.files[0]);
        let file = input.files[0];
        console.log(file)
        const isLt5M = file.size / 1024 / 1024 < 5
        if (!isLt5M) {
          this.$message({type: 'warning', message: `请选择上传图片大小不能超过5M`, showClose: true})
          return false
        }
        reader.onload = (ev) => {
          input = undefined;
        };
        let params = new FormData
        params.append('file', file)
        this.$client.uploadPicture({file: params}, '/api/ERPWeb/PartyHonor/UploadPicture').then((req) => {
          if (req.head.result === "200") {
            this.form.image_url = req.context
          }
        });
      };
      input.click();
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
// .el-dialog-div {
//  height: 660px;
//  overflow-y: scroll;
// }
</style>

