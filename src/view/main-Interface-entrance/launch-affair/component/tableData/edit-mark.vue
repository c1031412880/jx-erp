<template>
  <el-dialog
      width="500px"
      :visible="dialogBool"
      :before-close="dialogClose"
      append-to-body
      :close-on-click-modal="false"
    >
      <div slot="title">
        <span style="padding-right: 20px">{{markTitle}}</span>
        <el-select v-model="form.state" size="mini" placeholder="请选择标记状态">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <el-input
        type="textarea"
        :rows="4"
        placeholder="请输入备注"
        v-model="form.remark">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogClose()" size="mini">取 消</el-button>
        <el-button @click="onBtn('edit')" size="mini" type="success" v-if="!!markState">编辑标记</el-button>
        <el-button @click="onBtn('del')" size="mini" type="danger" v-if="!!markState">取消标记</el-button>
        <el-button @click="onBtn('save')" type="primary" size="mini" v-else>保存标记</el-button>
      </span>
    </el-dialog>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    dialogBool: Boolean,
    markTitle: {
      type: String,
      default: '添加标记' //add添加  edit编辑  detail详情
    }, 
    markState: {
      type: [Number, String],
      default: 0
    },
    markForm: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      form: {
        remark: '',
        state: '',
      },
      options: [
        {label: '未处理', value: 1},
        {label: '进行中', value: 2},
        {label: '已完成', value: 3},
      ],
    }
  },
  watch: {
    markForm: {
      deep: true,
      // immediate: true,
      handler(val) {
        if(val) {
          this.form = Object.assign({}, val)
        }
      }
    }
  },
  methods: {
    dialogClose() {
      Object.assign(this.$data.form,  this.$options.propsData.markForm)
      this.$emit("update:dialogBool", false);
    },
    onBtn(type) {
      this.$emit(`on-${type}`, this.form)
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.div
  height: 100%
  width: 100%
</style>