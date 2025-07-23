<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="560px"
    
  >
    <div :class="{'el-dialog-div': model == 10004}">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item :label="`${model == 10003?'消息名称':'预案名称'}:`">
          <span>{{form.title}}</span>
        </el-form-item>
        <el-form-item label="编制单位：">
          <span>{{form.dept_name}}</span>
        </el-form-item>
        <el-form-item label="发布时间：">
          <span>{{form.created_date}}</span>
        </el-form-item>
        <el-form-item :label="`${model == 10003?'消息内容':'预案内容'}:`">
          <span>{{form.content}}</span>
        </el-form-item>
        <div v-if="model == 10004">
          <el-form-item label="预案附件：">
            <div>
              <multiple-files-upload :disabled="true" :filesList="form.files? form.files:[]" v-if="form.files && form.files.length > 0"></multiple-files-upload>
            </div>
          </el-form-item>
          <el-form-item label="预案物资：">
            <span>{{form.plan_material}}</span>
          </el-form-item>
          <el-form-item label="预案对应队伍：">
            <span>{{form.team_name}}</span>
          </el-form-item>
          <el-form-item label="预案对应专家：">
            <span>{{form.user_name}}</span>
          </el-form-item>
        </div>
        <el-form-item label="编写人：">
          <span>{{form.write_user_name}}</span>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
  import multipleFilesUpload from "@/components/multiple-files-upload";
  export default {
    components: {
      multipleFilesUpload
    },
    props: {
      dialogBool: Boolean,
      model:[Number,String]
    },
    data() {
      return {
        id:[],
        title:'',
        form: {}
      };
    },
    watch: {
      dialogBool(bool) {
        if (bool === false) {
          Object.assign(this.$data, this.$options.data());
        }else{
          this.configData()
        }
      },
    },
    methods: {
      dialogClose() {
        this.$emit("update:dialogBool", false);
      },
      configData() {
        if(this.model == 10003) {
          this.title = '信息消息详情'
        }else{
          this.title = '应急预案消息详情'
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .el-dialog-div {
    height: 450px;
    overflow-y: scroll;
  }

  .el-dialog-div /deep/ .document-content{
    padding: 0px;
  }

</style>
