<template>
  <el-dialog
    :visible="dialogBool"
    title="考核模板预览"
    :before-close="dialogClose"
    fullscreen
    center
    top="20px"
  >
    <div style="margin-bottom: 20px" ref="buttonBox">
      <el-button @click="onExport">导出</el-button>
      <el-button style="float:right" @click="dialogClose">返回</el-button>
    </div>
    <tr-table
      :data="data"
      :tableHeaderList="tableHeaderList"
      :isShowBottomOptions="false"
      :TableHeight="TableHeight"
      :frontFixedNum="1"
      :backFixedNum="1"
      :isShowSummary="true"
      :spanMethodType="['column']"
      :rowspanObj="rowspanObj"
      :mergekeys="mergekeys"
      :omitColumnIndex='[1,2,3,5,7,8]'
    ></tr-table>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
export default {
  components: {
  },
  props: {
    dialogBool: Boolean,
    data: [Array],
    form: {}
  },
  data() {
    return {
      TableHeight: 500,
      tableHeaderList: [
        {
          id: 1,
          label: "指标分类",
          prop: "group_name",
          width: "130",
          align: "center",
          signIndex: 0,
        },
        {
          id: 2,
          label: "考核内容",
          prop: "content",
          width: "130",
          align: "center",
          signIndex: 1,
        },
        {
          id: 3,
          label: "指标值及要求",
          prop: "demand",
          width: "200",
          align: "center",
          signIndex: 2,
        },
        {
          id: 4,
          label: "分数明细",
          prop: "score",
          width: "100",
          align: "center",
          signIndex: 3,
          nestedTablesHeader: [
            {
              id: 101,
              label: "明细",
              prop: "score",
              width: "100",
              align: "center",
              signIndex: 100,
            },
            {
              id: 102,
              label: "合计",
              prop: "total_score",
              width: "100",
              align: "center",
              signIndex: 101,
            },
          ]
        },
        {
          id: 5,
          label: "最高评分",
          prop: "max_score",
          width: "100",
          align: "center",
          signIndex: 4,
        },
        {
          id: 6,
          label: "考核标准",
          prop: "standard",
          width: "130",
          align: "center",
          signIndex: 5,
        },
        {
          id: 7,
          label: "备注",
          prop: "remark",
          width: "130",
          align: "center",
          signIndex: 6,
        },
      ],
      rowspanObj: {},
      mergekeys: ['group_id','group_name','total_score']
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
      } else {
        this.setHead()
        this.getSpanObj()
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    getSpanObj() {
      this.rowspanObj = this.$handleTableSpan(this.mergekeys, this.data,'group_id',true)
    },
    // 计算高吨
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.buttonBox.offsetHeight
        this.TableHeight = maxh - 130 -th;
      }, 60);
    },
    onExport() {
      let params = Object.assign({}, this.form);
      this.$client.ExportAssessModel(params).then((res) => {
        if(res.head) {
          if (res.head.result == "200") {
            window.location.href = res.context;
            this.$message({ type: "success", message: "导出成功" });
          } else {
            this.$message({ type: "error", message: "导出失败" });
          }
        }else{
          this.$message({ type: "warning", message: "暂无可导出内容" });
        }
        
      });
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>


