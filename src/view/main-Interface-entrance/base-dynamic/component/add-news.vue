<template>
  <tr-dialog
    :visible="dialogBool"
    :title="title"
    :center="true"
    :width="'860px'"
    @before-close="dialogClose">
    <el-form :model="form" :rules="basicRules" ref="form" label-width="80px" size="mini">
      <el-row>
        <el-col :span="12">
          <el-form-item label="标题:" prop="grassroots_title">
            <el-input v-model="form.grassroots_title" placeholder="请输入标题"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="动态分类:" prop="type">
            <get-select-dictionaries
              v-model="form.type"
              @change="changeDictionaries"
              :classKey="'动态分类'"
              :width="'100%'"
              :placeholder="'请选择动态分类'"
            ></get-select-dictionaries>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="作者:" prop="user_id">
            <get-department-select
              ref="personalTree"
              @on-change="checkCreatedUser"
              v-model="form.user_id"
              :isShowCheckbox="false"
              :placeholder="'请选择申请人'"
              :isContainEmp="true"
              :show_all="true"
              :isExportMultiple="false"
              :clearable="false"
            ></get-department-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="" prop="top">
            <el-checkbox v-model="form.top" :true-label="1" :false-label="0">设为置顶动态</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="" prop="is_public">
            <el-checkbox v-model="form.is_public" :true-label="1" :false-label="0">公开阅读信息</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- <el-form-item label="" prop="send_type">
            <el-checkbox v-model="form.send_type" :true-label="1" :false-label="0">定时发送</el-checkbox>
            <el-date-picker
              v-model="form.send_time"
              placeholder="选择日期"
              value-format="yyyy-MM-dd HH:mm"
              format="yyyy-MM-dd HH:mm"
              type="datetime"
              :disabled="!form.send_type">
            </el-date-picker>
          </el-form-item> -->
          <el-form-item label="" prop="home_page">
            <el-checkbox v-model="form.home_page" :true-label="1" :false-label="0">首页轮播图</el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="封面图片:" prop="maintain_type">
            <el-image
              @click.native="uploadFile"
              style="width:350px; height: 136px"
              :src="form.image_url ? form.image_url : require('@/assets/notice-image/bj.png')" 
            ></el-image>
            <p>推荐尺寸750*272；支持.jpg, .jpeg, .bmp, .gif, .png类型文件，5M以下</p>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="上传文件:">
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
            <ul class="document-content show-flex-box-c" style="margin-top:10px;">
              <li class="show-flex-box-r" style="margin-bottom:10px;justify-content:space-between;" v-for="(item,index) in form.files_list" :key="index">
                <span class="show-flex-box-r" style="align-items: center;color: #333333">
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
          <el-form-item label="动态内容:" prop="content">
            <tinymce-Vue :value="form.content" @input="(res) => form.content = res"></tinymce-Vue>
          </el-form-item>
        </el-col>
        <el-card v-show="isNeedFlow" style="margin-top: 10px;max-height: 330px;overflow: auto">
          <approve-step
            ref="approveStep"
            :key="key"
            @on-users="setUsers"
            :form_data="form"
            :object_id="8300">
          </approve-step>
        </el-card>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="mini" @click="dialogClose">取 消</el-button>
      <el-button @click="openNewsInfoDetail" type="" size="mini">预 览</el-button>
      <el-button @click="saveNewsInfo(-1)"  type="primary" size="mini">保存草稿</el-button>
      <el-button @click="saveNewsInfo(1)" type="primary" size="mini"> {{isNeedFlow ? '发起审批': '发 布'}} </el-button>
    </span>
    <new-dialog ref="newInfoDialog" :isAudit="false" :dialogBool.sync="isShowNewDialog"></new-dialog>
  </tr-dialog>
</template>

<script type="text/ecmascript-6">
import { getUser } from "@/utils/auth";
import { formatDate } from '@/utils'
import newDialog from "./new-dialog";
import tinymceVue from "@/components/ueditor/tinyVue.vue";
import approveStep from '@/components/approve-echo/approve-step2'
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
export default {
  components: {approveStep,tinymceVue,newDialog,getDepartmentSelect,getSelectDictionaries,},
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "添加动态",
    },
    isNeedFlow: {
      type: Boolean,
      default: false,
    },
    curSelectedType: [String],
  },
  data() {
    return {
      form: {
        id: null,
        grassroots_title: '',
        type: '',
        user_id: '',
        top: 0 ,
        // send_type: 0,
        // send_time: '',
        is_public: 0,
        home_page: 0,
        content: '',
        state: 1,
        image_url: '',
        files_list: [],
      },
      key: null,
      //预览回显暂存部分信息
      InfoData:{
        user_name: '',
        type_name: '',
        content: '',
        files_list: [],
      },
      isShowNewDialog: false,
      basicRules: {
        grassroots_title: [
          { required: true, message: "请输入标题", trigger: "change" },
        ],
      }
    }
  },
  mounted() {},
  watch: {
    dialogBool(bool) {
      if(bool) {
        this.$nextTick(() =>{
          this.configData();
          this.$refs.form.clearValidate();
        })
      }else {
        Object.assign(this.$data, this.$options.data());
        this.$refs.personalTree.onClear()
      }
    }
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    configData() {
      if(this.curSelectedType == 'add') {
        setTimeout(() => {
          let userInfo = JSON.parse(getUser());
          this.form.user_id = Number(userInfo.user_id)
        }, 300);
      }
    },
    //人员树节点点击事件 获取对应的名字c_name
    checkCreatedUser(vehs, nodes, parentNode){
      //对话框关闭 触发onClear 也会触发该事件 但不存在nodes
      if(nodes){
        this.InfoData.user_name = nodes[0].c_name;
      }
      
    },
    //数据字典点击事件 获取对应的c_name
    changeDictionaries(item){
      this.InfoData.type_name = item.c_name;
    },
    // 回显数据
    setData(info) {
      this.form = Object.assign(this.form, info)
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
      if( this.form.files_list.length > 4) {
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
          let fileObjCopy = {
            file_name: fileName,
            url: res.context,
            size: file.size
          }
          this.form.files_list.push(fileObj)
          this.InfoData.files_list.push(fileObjCopy)
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
      this.form.files_list.splice(index, 1)
      // this.$refs.uploadDocomnet.uploadFiles.splice(index, 1)
    },
    // 下载文件
    downloadDocument(item) {
      window.location.href = item.url
      this.$message({type: 'success', message: '下载成功'})
    },
    // 发布
    saveNewsInfo(type) {
      this.form.state = type
      if (this.form.content === "") {
        this.$message({type: 'warning', message: "请填写公告内容", showClose: true})
        return false
      }
      // if (this.form.send_type == 1 && this.form.send_time === "") {
      //   this.$message({type: 'warning', message: "请填写定时发送时间", showClose: true})
      // }
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let info = {...this.form};
          this.$emit("save-add-edit", info, this.nodes);
        } else {
          return false;
        }
      });
    },
    // 预览
    openNewsInfoDetail() {
      let info = Object.assign({},this.form);
      info.created_date = formatDate(new Date(),'yyyy-MM-dd'),
      info.user_name = this.InfoData.user_name;
      info.type_name = this.InfoData.type_name;
      info.content = this.form.content;
      info.files_list = this.InfoData.files_list;
      this.$refs.newInfoDialog.setData(info)
      this.isShowNewDialog = true
    },
    // 设置流程节点
    setUsers(data) {
      this.nodes = data
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
/deep/ .el-form {
  height: 680px;
  overflow-y: auto;
}
</style>