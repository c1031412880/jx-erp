<template>
  <el-dialog
    :title="title"
    :visible="dialogVisible"
    width="900px"
    @close="handleClose('ruleForm')"
    :close-on-click-modal="false"
    top="10px"
  >
    <el-form ref="ruleForm" size="mini" label-width="80px" :model="form" :rules="rules">
      <el-form-item label="新闻标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="content_type">
        <el-select v-model="form.content_type" placeholder="请选择" clearable>
          <el-option label="通知公告" value="通知公告"></el-option>
          <el-option label="公交新闻" value="公交新闻"></el-option>
          <el-option label="公司荣誉" value="公司荣誉"></el-option>
          <el-option label="企业文化" value="企业文化"></el-option>
          <el-option label="先进事迹" value="先进事迹"></el-option>
          <el-option label="党风廉政" value="党风廉政"></el-option>
          <el-option label="乘客中心" value="乘客中心"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否发布">
        <el-switch
          v-model="form.published"
          active-color="#13ce66"
          inactive-color="#ff4949"
          :active-value="1"
          :inactive-value="0"
        ></el-switch>
      </el-form-item>
      <el-form-item label="封面" prop="thumbnail">
        <div class="list-data-list show-flex-box-r">
          <ul class="list-data">
            <li class="item" v-if="form.thumbnail">
              <image-box :src="form.thumbnail" :id="1" @on-delete="imageDelete(0)"></image-box>
            </li>
          </ul>
          <div class="item unchecked" @click="uploadFile()" v-if="!form.thumbnail">
            <i class="el-icon-plus" style="font-size: 60px;font-weight: 600;"></i>
          </div>
        </div>
      </el-form-item>
      <div style="display: flex;justify-content: space-between">
        <el-form-item label="发布期限" prop="publish_from">
          <el-date-picker
            style="width: 200px"
            v-model="form.publish_from"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            :clearable="false"
            @change="fromChange"
          />
        </el-form-item>
        <el-form-item label="" prop="publish_end" style="margin-left: -450px;">
          <el-date-picker
            style="width: 200px;"
            v-model="form.publish_end"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            :clearable="false"
            @change="endChange"
          />
        </el-form-item>
        <div></div>
      </div>
      <el-form-item label="内容" prop="content">
        <div style="width: 100%;height: 100%">
          <tinymce-Vue :value="form.content" @input="(res) => form.content = res"></tinymce-Vue>
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="mini" @click="handleClose('ruleForm')">取 消</el-button>
      <el-button size="mini" type="primary" @click="submit('ruleForm')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import tinymceVue from "@/components/ueditor/tinyVue.vue";
import imageBox from './image-box.vue';
import getLineSelectTree from 'components/base/formModel/tree/get-line-select-tree.vue'
export default {
  components: {
    tinymceVue,
    imageBox,
    getLineSelectTree,
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      title: '提示',
      form: {
        title: '',
        content_type: '',
        published: 0,
        publish_from: '',
        publish_end: '',
        kind: 0,
        thumbnail: '',
        content: '',
      },
      rules:{
        title: [{ required: true, message: '必填项', trigger: 'change' },],
        content_type: [{ required: true, message: '必填项', trigger: 'change' },],
        thumbnail: [{ required: false, message: '必填项', trigger: 'change' },],
        content: [{ required: true, message: '必填项', trigger: 'change' },],
        publish_from: [{ required: true, message: '必填项', trigger: 'change' },],
        publish_end: [{ required: true, message: '必填项', trigger: 'change' },],
      },
    }
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    //开始时间
    fromChange(e){
      if(this.compareDate(e,this.form.publish_end)){
        this.form.publish_from = this.form.publish_end;
        this.form.publish_end = e;
      }
    },
    //结束时间
    endChange(e){
      if(this.compareDate(this.form.publish_from, e)){
        this.form.publish_end = this.form.publish_from;
        this.form.publish_from = e;
      }
    },
    // 删除照片
    imageDelete(index) {
      this.form.thumbnail = '';
    },
    //上传封面
    uploadFile() {
      let input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      // input.accept = ".jpg,.jpeg";
      input.onchange = () => {
        let reader = new FileReader();
        reader.readAsDataURL(input.files[0]);
        let file = input.files[0];
        console.log(file)
        reader.onload = (ev) => {
          input = undefined;
        };
        let params = new FormData
        params.append('file', file)
        this.$client.uploadPicture({file: params}, '/api/ERPWeb/PartyHonor/UploadPicture').then((req) => {
          // console.log(req,'aaaaa');
          if (req.head.result === "200") {
            this.form.thumbnail = req.context
          }else{
            this.form.thumbnail = ''
          }
        });
      };
      input.click();
    },
    submit(formName) {
      if(!this.form.content){
        this.$message.warning("请输入内容！");
        return;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log('submit!', this.form);
          if (this.title === '添加') this.$emit('send-add-news', this.form)
          else this.$emit('send-edit-news', this.form)
        } else {
          console.log('err!', this.form);
          return false;
        }
      });
    },
    handleClose(formName) {
      this.$emit('update:dialogVisible', false);
      this.$refs.ruleForm.resetFields();
      this.form = {
        title: '',
        content_type: '',
        published: 0,
        publish_from: '',
        publish_end: '',
        kind: 0,
        thumbnail: '',
        content: '',
      }
    },
    // 比较时间的大小
    compareDate(d1,d2) {
      return ((new Date(d1.replace(/-/g,"\/"))) > (new Date(d2.replace(/-/g,"\/"))));
    },
  },
  beforeDestroy() {},
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
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
