<template>
  <el-form inline size="mini">
    <el-form-item label="标题">
      <el-input v-model="form.title" placeholder="请输入" clearable></el-input>
    </el-form-item>
    <el-form-item label="类型">
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
    <el-form-item label="发布状态">
      <el-select v-model="form.published" placeholder="请选择" clearable>
        <el-option label="已发布" :value="1"></el-option>
        <el-option label="未发布" :value="0"></el-option>
      </el-select>
    </el-form-item>
<!--    <el-form-item label="内容">-->
<!--      <el-input v-model="form.content" placeholder="请输入" clearable></el-input>-->
<!--    </el-form-item>-->
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
export default {
  components: {},
  props: {

  },
  data() {
    return {
      form: {
        title: '',
        content_type: '',
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
      this.form = {
        title: '',
        content_type: '',
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
