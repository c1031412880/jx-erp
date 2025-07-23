<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="600px"
    center
  >
    <div class="el-dialog-div">
      <el-form :model="form" :rules="basicRules" ref="form" label-width="140px" size="mini">
        <el-form-item label="合理化建议内容:" prop="content">
          <el-input
            v-model="form.content" 
            type="textarea"
            maxlength="200"
            :rows="4"
            show-word-limit
            placeholder="请输入合理化建议内容"></el-input>
        </el-form-item>
        <el-form-item label="图片:" prop="pics">
          <div class="list-data-list show-flex-box-r">
            <ul class="list-data" v-for="(item,index) in form.pics" :key="index">
              <li class="item" v-if="item">
                <image-box :src="item" :id="index+1" @on-delete="imageDelete(index)"></image-box>
              </li>
              <!-- <li class="item unchecked" v-else @click="uploadFile()">
                <i class="el-icon-plus" style="font-size: 60px;font-weight: 600;"></i>
              </li> -->
            </ul>
            <div class="item unchecked" @click="uploadFile()" v-if="form.pics.length < 3">
              <i class="el-icon-plus" style="font-size: 60px;font-weight: 600;"></i>
            </div>
          </div>
          
        </el-form-item>
        <el-form-item>
          <span style="font-size: 12px; color:#909399">支持jpg、gif、png图片上传，图片最多能上传三张</span>
        </el-form-item>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer show-flex-box-r" style="justify-content: flex-end;">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('form')">提 交</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import imageBox from './image-box'
export default {
  components: {imageBox},
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "合理化建议",
    },
    curSelecedType: [String],
  },
  mounted() {
  },
  data() {
    return {
      date: [],
      form: {
        id: "",
        content: "",
        pics: [],
        type:1, //1ERP 2长安集团app
      },
      basicRules: {
        content: [
          { required: true, message: "请输入合理化建议内容", trigger: "change" },
        ],
        pics: [
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
    imageDelete(index) {
      this.form.pics.splice(index,1)
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
            this.form.pics.push( req.context)
          }
        });
      };
      input.click();
    },
    updatePlaybill(formName) {
       this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = {...this.form};
          this.$emit("subimit-suggestions", info);
        } else {
          return false;
        }
      });
    },
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div /deep/ .el-input {
  width: 420px;
}
.list-data-list
  flex-wrap: wrap;
  align-items: center;
  .list-data
    // width: 450px
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

