<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    width="600px"
    center
    :close-on-click-modal="false"
    :before-close="dialogClose"
  >
    <div class="el-dialog-div">
      <el-form
        :model="form"
        :rules="basicRules"
        ref="form"
        label-width="140px"
        size="mini"
      >
        <el-form-item label="图片顺序:" prop="sort">
          <el-input
            v-model="form.sort"
            maxlength="1"
            placeholder="请输入图片顺序"
          ></el-input>
        </el-form-item>
        <el-form-item label="图片:" prop="url">
          <el-upload
            class="my-upload"
            list-type="picture-card"
            ref="imagesUpload"
            action="string"
            :on-change="imagesHandlePreview"
            :accept="imagesType"
            :auto-upload="false"
            :show-file-list="false"
            style="margin-right: 10px;"
          >
            <div v-loading="loading" class="loading-box">
              <img
                v-if="form.url"
                :src="form.url"
                class="avatar"
                style="width:258px;height: 146px;"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <span style="font-size: 12px; color:#909399"
            >支持jpg、gif、png图片上传，单次仅允许上传一张</span
          >
        </el-form-item>
      </el-form>
    </div>

    <span
      slot="footer"
      class="dialog-footer show-flex-box-r"
      style="justify-content: flex-end;"
    >
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('form')"
        >上 传</el-button
      >
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">

export default {
  components: {},
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "添加",
    },
    curSelecedType: [String],
    imagesType:{
      type: String,
      default: '.png,.jpg,.jpeg,.jpe', //图片类型 'image/*'
    },
    imagesNum:{
      type: Number,
      default: 0,
    }
  },
  mounted() {
  },
  data() {
    return {
      loading:false,
      date: [],
      form: {
        id: "",
        sort: "",
        url: null,
      },
      basicRules: {
        sort: [
          { required: true, message: "请输入图片顺序", trigger: "change" },
        ],
        url: [
          { required: true, message: "请上传图片", trigger: "change" },
        ],
      },
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }else{
        this.$nextTick(() => {
          this.$refs.form.clearValidate();
        })
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },

    // 删除图片
    imageDelete() {
      this.form.url = null;
    },

    // 大图片文件分块上传
    splitUpload(file) {
      return new Promise(async (resolve, reject) => {
      try {
        // const { eachSize } = this;
        let eachSize =  1 * 1024 * 1024  //切片大小
        const chunks = Math.ceil(file.size / eachSize);
        const fileChunks = this.splitFile(file, eachSize, chunks);
        let size = (file.size /1024/1024).toFixed(2);
        let currentChunk = 0;
        let imageName = file.name;
        this.loading = true
        // this.imagePer = 0
        // this.isShowPer = true
        console.log(fileChunks);
        for (let i = 0; i < fileChunks.length; i++) {
          if (currentChunk === i) {
            let formData = new FormData();
            formData.append("file", fileChunks[i]);
            formData.append("md5_code", file.uid);
            formData.append("merge_name", file.name);
            formData.append("index", i + 1);
            formData.append("total", fileChunks.length);
            if(i < fileChunks.length -1) {
              formData.append("is_last", false);
            }else{
              formData.append("is_last", true);
            }
            console.log("formData",formData)
            let res = await this.UpLoadFileBreakPointResumeUpload(formData);
            if(res.head.result == "200") {
                if(currentChunk == fileChunks.length -1) {
                  // let fileObj= {
                  //     name: imageName,
                  //     url: res.context[0],
                  //     thumbnail_url: res.context[1],
                  //     size: size
                  // }
                  this.loading = false
                  // this.isShowPer = false
                  this.form.url = res.context[1]
                  console.log(this.form.url)
                  this.$message({
                    showClose: true,
                    message: `该(${file.name})图片上传成功`,
                    type: "success"
                  });
                }
                currentChunk = i + 1;
              }else{
                this.loading = false
                this.$message({
                  showClose: true,
                  message: `该(${file.name})图片上传失败，请从新上传未上传成功的图片`,
                  type: "error",
                });
              }
          }
        }
      } catch (e) {
        reject(e);
      }
    });
    },
    // 调用切片上传接口
    UpLoadFileBreakPointResumeUpload(formData) {
    return this.$client.UpLoadFileBreakPointResumeUpload(formData).then(res => res)
    },
    // 文件分块,利用Array.prototype.slice方法
    splitFile(file, eachSize, chunks) {
      const fileChunk = [];
      for (let chunk = 0; chunks > 0; chunks--) {
        fileChunk.push(file.raw.slice(chunk, chunk + eachSize));
        chunk += eachSize;
      }
      return fileChunk;
    },
    // 自定义上传图片
     imagesHandlePreview(file) {
       this.splitUpload(file);
    },
    // 上传类型限制
    beforeUploadType(file) {
      let type = this.imagesType;
      let name = '图片';
      const fileSuffix = (file.name.substring(file.name.lastIndexOf(".") + 1)).toLowerCase()
      console.log("fileSuffix",fileSuffix)
      if(type.indexOf(fileSuffix) === -1) {
        this.$message({type: 'warning', message: `只能上传${type}类型的${name}, 该(${file.name})${name}类型不符`, showClose: true})
        return false
      }else{
        return true
      }
    },
    updatePlaybill(formName) {
      if(this.imagesNum >= 5){
        this.$message({type: 'warning', message: "最多上传五张图片！", showClose: true})
      }else{
        this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = {...this.form};
          this.$emit("subimit-imgae", info);
        } else {
          return false;
        }
      });
      }

    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div{
  .loading-box /deep/ .el-loading-spinner {
    top:0 !important;
    margin-top:0 !important;
  }
  .my-upload /deep/ .el-upload--picture-card{
    width: 260px;
  }
}
.el-dialog-div /deep/ .el-input {
  width: 120px;

}
</style>
