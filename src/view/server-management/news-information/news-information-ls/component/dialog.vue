<template>
  <el-dialog
    :title="title"
    :visible="dialogVisible"
    width="600px"
    @close="handleClose('ruleForm')"
    :close-on-click-modal="false"
  >
    <el-form ref="ruleForm" size="mini" label-width="80px" :model="form" :rules="rules">
      <el-form-item label="线路" prop="line_ids">
        <getLineSelectTree
          ref="lineTree"
          :placeholder="'请选择'"
          :value="form.line_ids"
          :width="450"
          :isShowCheckbox="true"
          @on-change="getLineId"/>
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
      <el-form-item label="长期发布">
        <el-checkbox v-model="longChecked" @change="longChange"></el-checkbox>
      </el-form-item>
      <div style="display: flex;justify-content: space-between" v-if="!longChecked">
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
        <el-form-item label="" prop="publish_end" style="margin-left: -150px;">
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
        <el-input
          type="textarea"
          :rows="6"
          placeholder="请输入"
          v-model="form.content"
          maxlength="200"
          show-word-limit>
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="mini" @click="handleClose('ruleForm')">取 消</el-button>
      <el-button size="mini" type="primary" @click="submit('ruleForm')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getLineSelectTree from 'components/base/formModel/tree/get-line-select-tree.vue'
export default {
  components: {
    getLineSelectTree,
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    longFrom: {
      type: String,
      default: "2000-01-01 00:00:00",
    },
    longEnd: {
      type: String,
      default: "3000-01-01 00:00:00",
    },
  },
  data() {
    return {
      title: '提示',
      form: {
        line_ids: [],
        published: 0,
        publish_from: '',
        publish_end: '',
        kind: 0,
        content: '',
      },
      rules:{
        line_ids: [{ required: true, message: '必填项', trigger: 'change' },],
        content_type: [{ required: true, message: '必填项', trigger: 'change' },],
        content: [{ required: true, message: '必填项', trigger: 'change' },],
        publish_from: [{ required: true, message: '必填项', trigger: 'change' },],
        publish_end: [{ required: true, message: '必填项', trigger: 'change' },],
      },
      longChecked:false,
    }
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    //线路树选择事件
    getLineId(ids){
      // console.log(ids,'aaa')
      this.form.line_ids = ids;
    },
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
    //是否长期发布
    longChange(e){
      if(!e && this.form.publish_from === this.longFrom && this.form.publish_end === this.longEnd){
        this.form.publish_from = "";
        this.form.publish_end = "";
      }
    },
    submit(formName) {
      if(this.form.line_ids.length===0){
        this.$message.warning("请选择线路！");
        return;
      }
      if(this.longChecked){
        this.form.publish_from = this.longFrom;
        this.form.publish_end = this.longEnd;
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
      if(this.$refs.lineTree) this.$refs.lineTree.onClear();
      this.longChecked = false;
      this.form = {
        line_ids: [],
        published: 0,
        publish_from: '',
        publish_end: '',
        kind: 0,
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
  // align-items: center;
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
