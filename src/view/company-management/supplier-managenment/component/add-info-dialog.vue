<template>
  <el-dialog
    :title="title"
    
    width="930px"
    :visible="dialogBool"
    :close-on-click-modal="false"
    :before-close="dialogClose">
    <div class="dialog-div">
      <el-form :model="form" :rules="basicRules" label-width="140px" ref="form" size="mini">
        <el-card style="margin-bottom:10px">
          <div style="font-weight: 600;font-size: 16px;margin-bottom: 10px;">基础信息</div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="供应商名称:" prop="name">
                <el-input v-model="form.name" placeholder="请输入供应商名称" clearable :disabled="curEventType == 'check'"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="供应商简称:" prop="simple_name">
                <el-input v-model="form.simple_name" placeholder="请输入供应商简称" clearable :disabled="curEventType == 'check'"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="供应商编号:" prop="code">
                <el-input v-model="form.code" placeholder="请输入供应商编号" clearable :disabled="curEventType == 'check'"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="供应商类型:" prop="type">
                <get-select-dictionaries  
                  style="width: 100%;" 
                  v-model="form.type" 
                  :classKey="'供应商类型'" 
                  :placeholder="'请选择供应商类型'"
                ></get-select-dictionaries>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="社会信用代码:" prop="social_code">
                <el-input v-model="form.social_code" placeholder="请输入社会信用代码" clearable :disabled="curEventType == 'check'"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="企业性质:" prop="enterprise_nature">
                <get-select-dictionaries  
                  style="width: 100%;" 
                  v-model="form.enterprise_nature" 
                  :classKey="'企业性质'" 
                  :placeholder="'请选择企业性质'"
                ></get-select-dictionaries>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="地址:" prop="address">
                <el-input v-model="form.address" placeholder="请输入地址" clearable :disabled="curEventType == 'check'"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="法人代表:" prop="legal">
                <el-input v-model="form.legal" placeholder="请输入法人代表" clearable :disabled="curEventType == 'check'"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系人:" prop="contacts">
                <el-input v-model="form.contacts" placeholder="请输入联系人" clearable :disabled="curEventType == 'check'"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系人电话号码:" prop="contacts_phone">
                <el-input v-model="form.contacts_phone" placeholder="请输入联系人电话号码" clearable :disabled="curEventType == 'check'"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="税号:" prop="duty_code">
                <el-input v-model="form.duty_code" placeholder="请输入税号" clearable :disabled="curEventType == 'check'"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注:" prop="remark">
                <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" clearable :disabled="curEventType == 'check'"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
        <el-card>
          <div style="font-weight: 600;font-size: 16px;margin-bottom: 10px;">银行信息</div>
          <el-row>
            <el-col :span="12">
              <el-form-item label="银行编码:" prop="bank_code">
                <el-input v-model="form.bank_code" placeholder="请输入银行编码" clearable :disabled="curEventType == 'check'"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="银行名称:" prop="bank">
                <get-select-dictionaries  
                  style="width: 100%;" 
                  v-model="form.bank" 
                  :classKey="'银行名称'" 
                  :placeholder="'请选择银行名称'"
                ></get-select-dictionaries>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="银行账户:" prop="bank_account">
                <el-input v-model="form.bank_account" placeholder="请输入银行账户" clearable :disabled="curEventType == 'check'"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="银行户主:" prop="bank_house">
                <el-input v-model="form.bank_house" placeholder="请输入银行户主" clearable :disabled="curEventType == 'check'"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose" size="mini">取 消</el-button>
      <el-button type="primary" size="mini" v-if="curEventType!='check'" @click="saveOnSubmit">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
export default {
  components: {
    getSelectDictionaries
  },
  props: {
    dialogBool: Boolean,
    curEventType: {
      type: String,
      default: 'add'
    },
  },
  data() {
    return {
      title: '添加供应商信息',
      form: {
        id: '',
        name: '',
        simple_name: '',
        code: '',
        type: '',
        social_code: '',
        enterprise_nature: '',
        address: '',
        legal: '',
        contacts: '',
        contacts_phone: '',
        duty_code: '',
        remark: '',
        bank_code: '',
        bank: '',
        bank_account: '',
        bank_house: '',
      },
      loading: false,
      TableHeight: 300,
      basicRules: {
        name: [
          {
            required: true,
            message: "请选择入库方式",
            trigger: "change",
          },
        ],
      },
    }
  },
  watch: {
    dialogBool(bool) {
      if(bool) {
      }else {
        Object.assign(this.$data, this.$options.data());
        this.$refs.form.clearValidate();
      }
    }
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    setConfigTitle() {
      switch (this.curEventType) {
        case 'add':
          this.title = '添加供应商信息'
          break;
        case 'edit':
          this.title = '编辑供应商信息'
          break;
      }
    },
    // 保存
    saveOnSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let info = {...this.form};
          this.$emit("save-add-edit", info);
        } else {
          return false;
        }
      });
    },
    // 回显
    setData(form) {
      setTimeout(() => {
        for (let key in this.form) {
          this.form[key] = form[key];
        }
      }, 30);
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>