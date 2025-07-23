<template>
  <el-dialog
    :title="showTitle"
    width="760px"
    :before-close="dialogClose"
    :visible="dialogBool">
    <div class="content-box">
      <div style="color:#48a2ff;font-size:18px;padding-bottom:20px">资产信息</div>
      <el-form
        :validate-on-rule-change="false"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        class="demo-ruleForm"
        :label-position="'right'"
        size="mini">

        <el-row>
          <el-col :span="12">
            <el-form-item label="所属分组:" prop="group_id">
              <get-assets-select 
                ref="driverTree"
                v-model="ruleForm.group_id"
                :width="'220'"
                :isShowCheckbox="false"
                :placeholder="'请选择分组'"
                :isExportMultiple="false"
              ></get-assets-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="物品名称:" prop="assets_name">
              <el-input 
                v-model="ruleForm.assets_name" 
                clearable 
                placeholder="请输入物品名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规格型号:" prop="model">
              <el-input 
                v-model="ruleForm.model" 
                style="width:100%"
                clearable
                placeholder="请输入规格型号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="品牌:" prop="brand">
              <el-input 
                v-model="ruleForm.brand" 
                style="width:100%"
                clearable
                placeholder="请输入品牌"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计量单位:" prop="unit">
              <get-select-dictionaries 
                v-model="ruleForm.unit" 
                clearable 
                style="width:100%"
                :classKey="'计量单位'" 
                :placeholder="'请选择计量单位'"></get-select-dictionaries>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="物品单价:" prop="price">
              <el-input-number 
                v-model="ruleForm.price" 
                style="width:100%"
                :precision="2"
                :min="0" 
                :controls="false"
                placeholder="请输入物品单价"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="资产使用年限:" prop="time_limit">
              <el-input-number 
                v-model="ruleForm.time_limit" 
                :min="0" 
                style="width:100%"
                :controls="false"
                placeholder="请输入资产使用年限"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商" prop="supplier_id">
              <!-- <el-input v-model="ruleForm.supplier" placeholder="请输入供应商"></el-input> -->
              <get-supplier-list 
                style="width:100%"
                v-model="ruleForm.supplier_id" 
                @change="changeSupplier"
                :placeholder="'请选择供应商'">
              </get-supplier-list>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商联系人" prop="contact_person">
              <el-input v-model="ruleForm.contact_person" placeholder="请输入联系人姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商电话" prop="contact_phone">
              <el-input v-model="ruleForm.contact_phone" placeholder="请输入联系人电话"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="资产照片:" prop="time_limit">
              <div style="width:120px;height:120px;cursor: pointer;" @click="uploadFile">
                <el-image fit="fill" v-if="ruleForm.img" :src="ruleForm.img" style="width:100%;height:100%"></el-image>
                <div class="upload-box" v-else ><i class="el-icon-plus"></i></div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form> 
      <el-row type="flex" justify="end"  class="row-bg">
        <el-button @click="dialogClose" size="mini">取 消</el-button>
        <el-button type="primary" @click="updatePlaybill('ruleForm')" size="mini">保 存</el-button>
      </el-row>
    </div>
  </el-dialog> 
</template>

<script type="text/ecmascript-6">
import getAssetsSelect from 'components/base/formModel/tree/get-assets-select-tree'
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import getSupplierList from "@/components/base/formModel/select/get-supplier-list";
export default {
  components: {
    getAssetsSelect, 
    getSelectDictionaries,
    getDepartmentSelect,
    getSupplierList
  },
  props: {
    dialogBool: {
      type: Boolean,
      default: true
    },
    curSelectType: { 
      type: String,
      default: 'add'
    },
    showTitle: { 
      type: String,
      default: '添加'
    }, 
  },
  data() {
    return {
      ruleForm: {
        group_id: '',
        assets_name: '',
        model: '',
        unit: '',
        price: '',
        time_limit: '',
        img:'',
        brand: '',
        supplier_id: '',
        contact_person: '',
        contact_phone: '',
        id: ''
      },
      rules: {
        group_id: [
          { required: true, message: "请输入物料编号", trigger: "change" },
        ],
        assets_name: [
          { required: true, message: "请输入物品名称", trigger: "change" },
        ],
        price: [
          { required: true, message: "请输入物品单价", trigger: "change" },
        ],
      }
    }
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        this.$refs.driverTree.onClear()
        this.$refs.ruleForm.resetFields();
        this.$refs.ruleForm.clearValidate();
        Object.assign(this.$data, this.$options.data());
      } else {
        this.$nextTick(() => {
          this.$refs.ruleForm.clearValidate();
        });
      }
    }
  },
  methods: {
    changeSupplier(info){
      this.ruleForm.contact_person = info.contacts
      this.ruleForm.contact_phone = info.contacts_phone
    },
    dialogClose() {
      this.$emit("update:dialogBool", false);
    }, 
     // 数据回显
    setData(val){
      Object.keys(this.ruleForm).forEach(key => {
        if (val.hasOwnProperty(key)) {
          this.ruleForm[key] = val[key]
        }
      })
    },
    updatePlaybill(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = {};
          for (let i in this.ruleForm) {
            if (this.ruleForm[i]) {
              info[i] = this.ruleForm[i];
            }
          }
          switch (this.curSelectType) {
            case "add":
              this.$emit('save-add-edit', info);
              break;
            case "edit":
              this.$emit('save-add-edit', info);
              break;
          }
        } else {
          return false;
        }
      });
    },
    // 自定义上传文件方法
    // :http-request="uploadFile"
    uploadFile() {
      let input = document.createElement("input");
      input.type = "file";
      // input.accept = "image/*";
      input.accept = ".jpg,.png";
      input.onchange = () => {
        console.log(input.files);
        let reader = new FileReader();
        reader.readAsDataURL(input.files[0]);
        let file = input.files[0];
        if(!this.beforeUpload(file)) {
          return
        }
        reader.onload = (ev) => {
          input = undefined;
        };
        let formData = new FormData();
        formData.append("file", file);
        let params = {
          file: formData,
        };
        this.$client.uploadPictureMeetingRoom(params)
        .then(res => {
          if(res.head.result == '200') {
            this.ruleForm.img = res.context;
            console.log('this.ruleForm.img',this.ruleForm.img);
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
      };
      input.click();
    },
    // 判断文件大小
    beforeUpload (file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      if (isLt1M) {
        return true
      }
      this.$message({type: 'error', message: '请不要上传大小超过1M的文件', showClose: true})
      return false
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.content-box {
  height: 500px;
  .row-bg {
    width: 100%;
    position: absolute;
    bottom: 20px;
    right: 40px;
  }
  .upload-box {
    width: 100%;
    border: 1px dashed;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    
  }
}
</style>
