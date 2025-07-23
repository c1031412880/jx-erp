<template>
  <el-dialog :visible="dialogBool" :title="formData.id === 0 ? '添加' : '编辑'" :before-close="dialogClose" width="650px" >
    <el-form
      size="mini"
      :model="formData"
       :rules="basicRules"
      ref="formData"
      label-width="130px"
    >
      <el-form-item label="印章名称:" prop="name">
        <el-input
          placeholder="请输入印章名称"
          v-model="formData.name"
        ></el-input>
      </el-form-item>
      <el-form-item label="印章说明:">
        <el-input
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 8}"
          placeholder="请输入印章说明"
          v-model="formData.describe"
        ></el-input>
      </el-form-item>
      <el-form-item label="上传印章:" prop="url">
        <ul class="list-data">
          <li class="item" v-if="formData.url">
            <image-box :src="formData.url" :id="1" @on-delete="imageDelete"></image-box>
          </li>
          <li class="item unchecked" v-else @click="uploadFile()">
            <i class="el-icon-plus" style="font-size: 60px;font-weight: 600;"></i>
          </li>
        </ul>
      </el-form-item>
      <el-form-item label="设置尺寸(厘米):" prop="width">
        <span>宽度</span>
        <el-input-number placeholder="宽度" :min="0" v-model="formData.width"></el-input-number>
      </el-form-item>
      <el-form-item prop="length">
        <span>长度</span>
        <el-input-number placeholder="长度" :min="0" v-model="formData.length"></el-input-number>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="submitFormData('formData')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import imageBox from './image-box'
export default {
  props: {
    dialogBool: Boolean,
  },
  components: {imageBox},
  data() {
    return {
      formData: {
        id: 0,
        name: "",
        describe: "",
        length: 40,
        width: 40,
        url: ""
      },
      basicRules: {
        name: [
          { required: true, message: "请输入印章名称", trigger: "change" },
        ],
        url: [
          { required: true, message: "请上传图片", trigger: "change" },
        ],
        width: [
          { required: true, message: "请输入宽度", trigger: "change" },
        ],
        length: [
          { required: true, message: "请输入长度", trigger: "change" },
        ],
      }
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        // Object.assign(this.$data, this.$options.data());
        this.$refs.formData.resetFields()
        this.formData.describe = ''
      }else{
        this.$nextTick(() => {
          this.$refs.formData.clearValidate();
        })
      }
    },
  },
  methods: {
    // 编辑时数据回显
    setData(val){
      Object.keys(val).forEach(key => {
        if (this.formData.hasOwnProperty(key)) {
          this.formData[key] = val[key]
        }
      })
    },
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    submitFormData(formName) {
      if(!this.formData.width || !this.formData.length) {
        this.$message.error('尺寸不能为0')
        return
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log(this.formData);
          this.$emit('on-ok', this.formData)
        } else {
          return false;
        }
      });
      
    },
    imageDelete() {
      this.formData.url = ''
    },
    // 自定义上传文件方法
    // :http-request="uploadFile"
    uploadFile() {
      let input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = () => {
        let reader = new FileReader();
        reader.readAsDataURL(input.files[0]);
        let file = input.files[0];
        reader.onload = (ev) => {
          input = undefined;
        };
        let params = new FormData
        params.append('file', file)
        this.$client.uploadPicture({file: params}, '/api/ERPWeb/VehicleManager/AddCarInfoImage').then((req) => {
          // console.log(req);
          if (req.head.result === "200") {
            this.formData.url = req.context;
          }
        });
      };
      input.click();
    },
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.list-data
  width: 450px
  overflow: hidden
  .item
    float: left
    width: 100px
    height: 100px
    margin: 5px
  .unchecked
    border-radius: 4px
    border: 2px dashed #606266
    text-align: center
    line-height: 130px
    &:hover
      border-color: #409EFF
      color: #409EFF
</style>
