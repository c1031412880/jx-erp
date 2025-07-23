<template>
  <el-form inline size="mini">
    <el-form-item label="线路">
      <getLineSelectTree
        ref="lineTree"
        :placeholder="'请选择'"
        :value="form.line_ids"
        :isShowCheckbox="true"
        @on-change="getLineId"/>
    </el-form-item>
    <el-form-item label="发布状态">
      <el-select v-model="form.published" placeholder="请选择" clearable>
        <el-option label="已发布" :value="1"></el-option>
        <el-option label="未发布" :value="0"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="内容">
      <el-input v-model="form.content" placeholder="请输入" clearable></el-input>
    </el-form-item>
    <el-form-item label="添加时间">
      <el-date-picker
        v-model="timeList"
        value-format="yyyy-MM-dd HH:mm:ss"
        :default-time="['00:00:00', '23:59:59']"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      >
      </el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" @click="submit">查询</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" @click="reset">重置</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" @click="addInfo" v-if="$isPowerShow('add')">添加</el-button>
    </el-form-item>
  </el-form>
</template>

<script type="text/ecmascript-6">
import getLineSelectTree from 'components/base/formModel/tree/get-line-select-tree.vue'
export default {
  components: { getLineSelectTree },
  props: {
    printUrl_appid:{
      type:String,
      default: 'test'
    }
  },
  data() {
    return {
      form: {
        line_ids: [],
        add_bg_date: '',
        add_ed_date: '',
        published: '',
        content: '',
      },
      timeList: [],
    }
  },
  created() {
    this.submit()
  },
  mounted() {},
  methods: {
    //线路树选择事件
    getLineId(ids){
      // console.log(ids,'aaa')
      this.form.line_ids = ids;
    },
    submit() {
      if (!this.timeList) {
        this.timeList = []
      }
      this.form.add_bg_date = this.timeList[0]
      this.form.add_ed_date = this.timeList[1]
      // console.log(this.form)
      this.$emit('load-table-data', this.form)
    },
    reset(){
      if(this.$refs.lineTree) this.$refs.lineTree.onClear();
      this.form = {
        line_ids: [],
        add_bg_date: '',
        add_ed_date: '',
        published: '',
        content: '',
      }
      this.timeList = [];
      this.$emit('load-table-data', this.form)
    },
    addInfo() {
      this.$emit('show-add-info')
    },
  },
  beforeDestroy() {},
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped></style>
