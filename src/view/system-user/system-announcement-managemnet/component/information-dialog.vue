<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="920px"
    
  >
    <div class="el-dialog-div">
      <el-form :model="form" :rules="basicRules" ref="form" label-width="120px" size="mini">
        <div class="show-flex-box-r">
          <el-form-item label="标题:" prop="title">
            <el-input v-model="form.title" placeholder="请输入标题" :disabled="curSelecedType == 'detail'"></el-input>
          </el-form-item>
          <el-form-item label="发布人:" prop="created_id">
            <el-input v-model="form.created_name" placeholder="请输入发布人" disabled></el-input>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="公告类别:" prop="type">
            <el-select v-model="form.type" clearable placeholder="请选择">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="版本号:" prop="version">
            <el-input v-model="form.version" placeholder="请输入版本号" :disabled="curSelecedType == 'detail'"></el-input>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="生效开始日期:" prop="start_date">
            <el-date-picker
              v-model="form.start_date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              :disabled="curSelecedType == 'detail'">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="生效结束日期:" prop="end_date">
            <el-date-picker
              v-model="form.end_date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              :disabled="curSelecedType == 'detail'">
            </el-date-picker>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="是否强制弹窗:" prop="is_popover">
            <el-radio-group v-model="form.is_popover">
              <el-radio :label="1"><span style="color:#606266">是</span></el-radio>
              <el-radio :label="2"><span style="color:#606266">否</span></el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="内容:" prop="content">
            <div style="width: 600px;">
              <tinymce-Vue :value="form.content" @input="(res) => form.content = res"></tinymce-Vue>
            </div>
          </el-form-item>
        </div>
        
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('form')">发 布</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import tinymceVue from "@/components/ueditor/tinyVue.vue";
import { getUser } from "@/utils/auth";
export default {
  components: {tinymceVue},
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
      typeOptions: [{
        value: 1,
        label: 'web版本升级'
      }, {
        value: 2,
        label: '系统维护'
      }, {
        value: 3,
        label: 'app版本升级'
      }],
      form: {
        type: '',
        title: '',
        content: '',
        version:'',
        start_date:'',
        end_date: '',
        is_popover: 1,
        created_id:'',
        created_name:''
      },
      basicRules: {
        title: [
          { required: true, message: "请输入标题", trigger: "change" },
        ],
        type: [
          { required: true, message: "请选择公告类别", trigger: "change" },
        ],
        content: [
          { required: true, message: "请输入内容", trigger: "change" },
        ],
        start_date: [
          { required: true, message: "请选择生效开始日期", trigger: "change" },
        ],
        end_date: [
          { required: true, message: "请选择生效结束日期", trigger: "change" },
        ]
      },
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }else{
        this.configData();
        this.$nextTick(() =>{
          this.$refs.form.clearValidate();
        })
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    configData() {
      let userInfo = JSON.parse(getUser());
      this.form.created_id = Number(userInfo.user_id)
      this.form.created_name = userInfo.user_name
      this.setDate();
    },
     // 设置默认日期为当天
    setDate() {
      let date = new Date();
      // date.setTime(new Date().getTime());
      let Y = date.getFullYear()
      let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
      let D = date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()
      let hours = date.getHours() < 10 ? ('0' + date.getHours()) : date.getHours()
      let minutes = date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()
      let seconds = date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds()
      this.form.start_date = Y + '-' + M + '-' + D + ' ' + hours + ':' + minutes + ':' + seconds
    },
   
    updatePlaybill(formName) {
       this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = {...this.form};
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
.el-dialog-div {
  height: 400px;
  overflow-y: scroll;
}
.el-dialog-div /deep/ .el-date-editor {
  width: 300px;
}
.el-dialog-div /deep/.el-select,.el-select--mini {
  width: 300px;
}
.el-dialog-div /deep/ .el-input,.el-input--mini{
  width: 300px;
}

.el-dialog-div /deep/ .el-textarea {
  width: 620px;
}


</style>

