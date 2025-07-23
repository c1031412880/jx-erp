<template>
  <el-dialog :visible="dialogBool" title="添加" :before-close="dialogClose" width="620px"  :close-on-click-modal="false">
<!--    <el-button type="primary" @click="addData">添加</el-button>-->
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="120px"
    >
    <el-row>
      <el-col :span="12">
        <el-form-item label="上传文件类型:" prop="type" >
          <get-select-dictionaries v-model="ruleForm.type" :classKey="'上传文件类型'" :placeholder="'请选择上传文件类型'"></get-select-dictionaries>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item >
          <el-button type="primary" @click="addFiles">批量上传</el-button>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <p style="font-size: 14px; backgroundColor: #F2F6FC; line-height: 20px">支持格式：.jpg,.jpeg,.png,.rar,.zip,.doc,.docx,.pdf,.xls,.xlsx,.txt,.dmp,.log</p>
      </el-col>
    </el-row>
    </el-form>
    <el-table :data="data">
      <el-table-column type="index" label="序号" width="80px"></el-table-column>
      <el-table-column prop="name" label="标题">
        <template slot-scope="scope">
          <el-input size="mini" v-model="data[scope.$index].name" placeholder="请输入"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="url" label="上传地址">
        <template slot-scope="scope">
          <el-alert
            v-if="data[scope.$index].url"
            :title="data[scope.$index].url"
            @close="closeUrl(scope.$index)"
            type="info">
          </el-alert>
          <el-button size="mini" v-else type="primary" @click="uploadFile(scope.$index)">上传</el-button>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
export default {
  props: {
    dialogBool: Boolean,
  },
  components: { getSelectDictionaries },
  data() {
    return {
      form: {
        name: '',
        url: '',
      },
      data: [],
      fileLoad: false,
      ruleForm: {
        type: ''
      },
      rules: {
        type: [
          { required: true, message: '请选择上传文件类型', trigger: 'change' },
        ],
      }
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
    closeUrl(i) {
      this.data[i].url = ''
    },
    addData() {
      this.data.push(JSON.parse(JSON.stringify(this.form)))
    },
    // 批量上传文件
    addFiles() {
      let input = document.createElement("input");
      input.type = "file";
      input.multiple = 'multiple'
      const uploadFile = (i,file) => {
        let params = new FormData
        params.append('file', file)
        params.append('type', '1')
        this.fileLoad = true
        this.$client.uploadPicture({file: params}, '/api/ERPWeb/DataBase/UploadFile').then((req) => {
          this.fileLoad = false
          // console.log(req);
          if (req.head.result === "200") {
            this.data[i].url = req.context;
          }
        });
      }
      input.onchange = () => {
        let files = input.files
        for(let i=0;i<files.length;i++) {
          let file = files[i]
          this.data.push({
            name: file.name,
            url: ''
          })
          console.log(this.data,this.data.length - 1,file)
          uploadFile(this.data.length - 1, file)
        }
      };
      input.click();
    },
    // 自定义上传文件方法
    // :http-request="uploadFile"
    uploadFile(i) {
      let input = document.createElement("input");
      input.type = "file";
      input.onchange = () => {
        let reader = new FileReader();
        reader.readAsDataURL(input.files[0]);
        let file = input.files[0];
        reader.onload = (ev) => {
          input = undefined;
        };
        let params = new FormData
        params.append('file', file)
        this.fileLoad = true
        this.$client.uploadPicture({file: params}, '/api/ERPWeb/DataBase/UploadFile').then((req) => {
          this.fileLoad = false
          // console.log(req);
          if (req.head.result === "200") {
            this.data[i].url = req.context;
          }
        });
      };
      input.click();
    },
    save() {
      let isName = []
      let isUrl = []
      if (!this.data.length) {
        this.$message.warning('请添加上传文件');
        return false
      }
      if (!this.ruleForm.type) {
        this.$message.warning('请选择上传文件类型');
        return false
      }
      this.data.forEach((item, i) => {
        if (!item.name) {
          isName.push((i + 1))
        }
        if (!item.url) {
          isUrl.push((i + 1))
        }
      })
      if(isName.length) {
        this.$message.warning(`上传列表第${isName.toString()}行请填写标题`);
        return false
      }
      if(isUrl.length) {
        this.$message.warning(`上传列表第${isUrl.toString()}行请上传文件`);
        return false
      }
      this.$emit('on-ok', this.data, this.ruleForm.type)
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.content-box{
  width 100%
  height 550px
  overflow-y auto
}
</style>
