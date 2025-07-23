<template>
  <el-dialog
    :visible="dialogBool"
    :title="`批量更改年检状态(当前选中车辆数:${veh_count})`"
    :before-close="dialogClose"
    width="560px"
    
  >
    <div class="el-dialog-div">
      <el-form
        size="mini"
        ref="form"
        label-width="120px"
      >
        <el-form-item label="本次年检日期:">
          <el-date-picker
            v-model="form.real_check_date"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input
            v-model="form.remark"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="ok">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
  import {getUser} from '@/utils/auth'
  export default {
    props: {
      dialogBool: Boolean
    },
    data() {
      return {
        veh_count: 0,
        form: {
          ids: '',
          real_check_date: '',
          remark: '',
          userid: ''
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
      ok() {
        if (!this.form.real_check_date) {
          this.$message.error('请选择本次年检日期');
          return false
        }
        this.form.userid = JSON.parse(getUser()).user_id
        this.$emit('on-ok', this.form)
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

