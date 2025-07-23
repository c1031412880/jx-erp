<template>
  <el-dialog
    :visible="dialogBool"
    :title="showTitle"
    :before-close="dialogClose"
    :close-on-click-modal="false"
    append-to-body
    width="820px"
    
  >
    <div class="base-info">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        class="demo-ruleForm"
        :label-position="'right'"
        size="mini"
      >
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="考核指标类型:" prop="group_id">
              <el-select v-model="ruleForm.group_id" placeholder="请选择" style="width:100%">
                <el-option
                  v-for="item in typeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="考核内容:" prop="content">
              <el-input v-model="ruleForm.content" clearable style="width:100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="指标值及要求:" prop="demand">
              <el-input v-model="ruleForm.demand" clearable style="width:100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分值:" prop="score">
              <el-input-number :controls="false" v-model="ruleForm.score" clearable style="width:100%" :step="1" :step-strictly="true"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最高评分:" prop="max_score">
              <el-input-number :controls="false" v-model="ruleForm.max_score" clearable style="width:100%" :step="1" :step-strictly="true"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="考核标准:" prop="standard">
              <el-input v-model="ruleForm.standard" clearable style="width:100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <div style="display:flex">
              <el-form-item label="备注:">
                <el-input v-model="ruleForm.remark"  type="textarea" style="width: 420px"></el-input>
              </el-form-item>
              <el-form-item label-width="0">
                <el-form-item label="启用状态:" >
                  <el-switch
                    v-model="ruleForm.enable"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    :active-value="1"
                    :inactive-value="0"
                    >
                  </el-switch>
                </el-form-item>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="24">
            <el-col :span="24" style="margin-bottom: 20px">
              <image-file-upload
                :images="imgs"
                :files="files"
                @files-update-success="filesUpdateSuccess"
                @images-update-success="imagesUpdateSuccess"></image-file-upload>
            </el-col>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose" size="mini">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('ruleForm')" size="mini"
        >保 存</el-button
      >
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import imageFileUpload from "@/components/imageFileUpload/index";
export default {
  components: { imageFileUpload },
  props: {
    dialogBool: Boolean,
    curSelecedType: [String],
    organizationTreeList: [Array], //所属类别
  },
  data() {
    return {
      ruleForm: {
        group_id: '',
        content: '',
        demand: '',
        score: '',
        max_score: '',
        standard: '',
        remark: '',
        enable: 1,
        img_ids: [],
        file_ids: [],
        id:'',
      },
      rules: {
        group_id: [
          { required: true, message: "请选择考核指标类型", trigger: "change" },
        ],
        content: [
          { required: true, message: "请输入考核内容", trigger: "change" },
        ],
        demand: [
          { required: true, message: "请输入指标值及要求", trigger: "change" },
        ],
        score: [
          { required: true, message: "请输入分值", trigger: "change" },
        ],
        standard: [
          { required: true, message: "请输入考核标准", trigger: "change" },
        ],
      },
      showTitle: '',
      typeList: [],
      files: [],
      imgs: [],
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      } else {
        this.configTitle();

        this.typeList = this.organizationTreeList[0].children
      }
    },
  },
  mounted() {
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    configTitle() {
      if (this.curSelecedType == "add") {
        this.showTitle = "添加考核内容";
      } else {
        this.showTitle = "编辑考核内容";
      }
    },
    updatePlaybill(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = JSON.parse(JSON.stringify(this.ruleForm))

          if (this.imgs.length > 0) {
            info.img_ids = this.imgs.map(item => {return item.id})
          }

          if (this.files.length > 0) {
            info.file_ids = this.files.map(item => {return item.id})
          }
          info.score = Number(info.score)
          info.max_score = Number(info.max_score)
          this.$emit("save-add-edit", info);
        } else {
          return false;
        }
      });
    },
    // 上传图片
    imagesUpdateSuccess(list) {
      this.imgs = list
    },
    // 上传文件
    filesUpdateSuccess(filesList) {
      this.files = filesList;
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


