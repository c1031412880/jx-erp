<template>
  <el-dialog
    :visible="dialogBool"
    :title="'添加'"
    :before-close="dialogClose"
    width="490px">
    <div class="el-dialog-div">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        :label-position="'right'"
        size="mini">
        <el-form-item label="名称:" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入快速通道名称"> </el-input>
        </el-form-item>
        <el-form-item label="快速通道连接:" prop="url">
          <el-input v-model="ruleForm.url" placeholder="请输入快速通道连接"> </el-input>
          <p style="font-size:12px;color:#999999">请添加整地址(浏览器可打开地址)例：https://www.baidu.com</p>
        </el-form-item>
        <el-form-item label="是否默认:">
          <el-switch
            v-model="ruleForm.is_default"
            :active-value="1"
            :inactive-value="2">
          </el-switch>
        </el-form-item>
        <el-form-item label="上传图标:" prop="image">
          <ul class="list-data">
            <li class="item" v-if="ruleForm.image">
              <image-box :src="ruleForm.image" :id="1" @on-delete="imageDelete"></image-box>
            </li>
            <li class="item unchecked" v-else @click="uploadFile()">
              <i class="el-icon-plus" style="font-size: 60px;font-weight: 600;"></i>
            </li>
          </ul>
        </el-form-item>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill()">确 定</el-button>
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
      default: "编辑",
    },
    curSelectType: [String],
  },
  mounted() {
  },
  data() {
    return {
      ruleForm: {
        id: '',
        name: '',
        url: '',
        is_default: 2,
        image: '',
      },
      rules: {
        name: [
          { required: true, message: "请输入快速通道名称", trigger: "change" },
        ],
        url: [
          { required: true, message: "请输入快速通道连接", trigger: "change" },
        ],
        image: [
          { required: true, message: "请上传图片", trigger: "change" },
        ],
      },
    };
  },
  watch: {
    dialogBool(bool) {
      if (!bool) {
        this.$refs['ruleForm'].resetFields()
        Object.assign(this.$data.ruleForm, this.$options.data().ruleForm);
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
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
          if (req.head.result === "200") {
            this.ruleForm.image = req.context;
          }
        });
      };
      input.click();
    },
    // 删除图标
    imageDelete() {
      this.ruleForm.image = ''
    },
    // 编辑回显
    setData(info) {
      for(let item in this.ruleForm) {
        if(info[item]) {
          this.ruleForm[item] = info[item]
        }
      }
    },
    updatePlaybill() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let info = {...this.ruleForm};
          this.$emit("save-add-edit", info);
        } else {
          return false;
        }
      });
    },
  },
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

