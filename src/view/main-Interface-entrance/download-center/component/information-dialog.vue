<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="600px"
    
  >
    <div class="el-dialog-div">
      <div>
        <multiple-files-upload :filesList="form.files" :acceptType="'.rar,.zip,.doc,.docx,.pdf'" @upload-update-success="uploadUpdateSuccess" :type="1" :maxUpLoadSize="100" :maxUpLoadNum="9999"></multiple-files-upload>
      </div>
      <div>
         <el-checkbox v-model="form.is_send">是否发送消息通知 </el-checkbox>
      </div>
      <!-- <el-form :model="form" :rules="basicRules" ref="form" label-width="140px" size="mini">
        <el-form-item label="岗位名称:" prop="c_name">
          <el-input v-model="form.c_name" placeholder="请输入岗位名称"></el-input>
        </el-form-item>
        <el-form-item label="岗位描述:" prop="c_remark">
          <el-input
            v-model="form.c_remark" 
            type="textarea"
            maxlength="200"
            :rows="4"
            show-word-limit
            placeholder="请输入岗位描述"></el-input>
        </el-form-item>
      </el-form> -->
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import multipleFilesUpload from "@/components/multiple-files-upload";
export default {
  components: {multipleFilesUpload},
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
      date: [],
      form: {
        files: [],
        is_send: false
      },
      basicRules: {},
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
   // 上传文件
    uploadUpdateSuccess(filesList) {
      // console.log(filesList)
      this.form.files = filesList;
    },
    updatePlaybill() {
      let info = {...this.form};
      if(this.form.is_send) {
        info.is_send = 1
      }else{
        info.is_send = 2
      }
      this.$emit("save-add-edit", info);
    },
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div /deep/ .el-input {
  width: 420px;
}
</style>

