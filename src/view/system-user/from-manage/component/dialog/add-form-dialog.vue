<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="780px">

    <el-form ref="formData" size="mini" :model="form" :rules="basicRules" label-width="140px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="选择表单:" prop="i_form_id">
            <el-select v-model="form.i_form_id" placeholder="请选择表单" clearable filterable style="width: 220px;">
              <el-option 
                v-for="item in contactFormOptions" 
                :label="item.label" 
                :value="Number(item.id)" 
                :key="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="选择分组:" prop="i_classify_id">
            <el-select 
              v-model="form.i_classify_id"
              clearable
              filterable 
              @change="setFormIsUse"
              placeholder="请选择分组"
               style="width: 220px;">
              
              <el-option
                v-for="item in groupOptions"
                :key="item.i_id"
                :label="item.c_type_name"
                :value="item.i_id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否可用:" prop="i_use">
            <el-select v-model="form.i_use" disabled placeholder="请选择是否可用" clearable style="width: 220px;">
                <el-option 
                  v-for="item in useOptions" 
                  :label="item.label" 
                  :value="Number(item.value)" 
                  :key="item.label"></el-option>
              </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注:" prop="c_remark">
            <el-input v-model="form.c_remark" placeholder="请输入表单备注" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="APP跳转路由地址:" prop="jump_url">
            <el-input v-model="form.jump_url" placeholder="请输入地址" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="上传图标:" prop="logo_url">
            <div style="width:120px;height:120px;cursor: pointer;" @click="uploadFile">
              <el-image fit="fill" v-if="form.logo_url" :src="form.logo_url" style="width:100%;height:100%;background-color: #999999"></el-image>
              <div class="upload-box" v-else ><i class="el-icon-plus"></i></div>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="图标颜色:" prop="logo_color">
            <el-color-picker v-model="form.logo_color"></el-color-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="dialogClose">取 消</el-button>
      <el-button size="small" type="primary" @click="updatePlaybill('formData')">保存</el-button>
    </span>
  </el-dialog>
</template> 

<script type="text/ecmascript-6">
export default {
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "表单添加",
    },
    groupOptions: [Array],
  },
  data() {
    return {
      form: {
        i_id: '',
        i_classify_id: '',
        i_form_id: '',
        logo_url: '',
        logo_color: '',
        jump_url: '',
        c_remark: '',
        i_use: ''
      },
      useOptions: [
        { label: '可用', value: 1},
        { label: '不可用', value: 0}
      ],
      contactFormOptions: [],
      basicRules: {
        i_form_id: [
          { required: true, message: "请选择表单", trigger: "change", },
        ],
        i_classify_id: [
          { required: true, message: "请选择分组", trigger: "change", },
        ],
        logo_url: [
          { required: true, message: "请上传图标", trigger: "change", },
        ],
        logo_color: [
          { required: true, message: "请选择颜色", trigger: "change", },
        ],
      },
    };
  },
  mounted() {
    this.getAllForm()
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data.form, this.$options.data().form);
        this.$refs['formData'].clearValidate();
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 获取所有表单
    getAllForm() {
      this.contactFormOptions = [];
      this.$client.GetFormTypeFlowManage({}).then(req => {
        console.log("新表单接口", req);
        if (req.head.result === "200") {
          Object.keys(req.context).forEach(key => {
            this.contactFormOptions.push({
              id: key,
              label: req.context[key]
            })
          })
        }
      });
    },
    // 自定义上传文件方法
    uploadFile() {
      let input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      // input.accept = ".jpg,.jpeg";
      input.onchange = () => {
        let reader = new FileReader();
        reader.readAsDataURL(input.files[0]);
        let file = input.files[0];
        reader.onload = (ev) => {
          input = undefined;
        };
        let params = new FormData
        params.append('file', file)
        this.$client.uploadPicture({file: params}, '/api/ERPWeb/PartyHonor/UploadPicture').then((req) => {
          if (req.head.result === "200") {
            this.form.logo_url = req.context
          }
        });
      };
      input.click();
    },
    // 是否可用
    setFormIsUse(val) {
      console.log(val);
      let data = this.groupOptions.find((item, index) => {
        return item.i_id == val
      })
      this.form.i_use = data.c_type_name === '已停用' ? 0 : 1
    },
    // 保存
    updatePlaybill(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = {...this.form};
          // console.log(this.form);
          this.$emit("save-add-edit", info);
        } else {
          return false;
        }
      });
    },
    // 回显
    setData(val) {
      for(let key in this.form) {
        if(val[key]) this.form[key] = val[key]
      }
      let data = this.groupOptions.find((item, index) => {
        return item.i_id == val.i_classify_id
      })
      this.form.i_use = data.c_type_name === '已停用' ? 0 : 1 
    }
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
// /deep/ .el-input__inner
//   width: 220px

.upload-box
  width: 100%;
  border: 1px dashed;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
/deep/ .el-color-picker__trigger
  height: 120px
  width: 120px
</style>
