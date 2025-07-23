<template>
  <div class="monthly-summary">
    <div class="department-detail show-flex-box-c" v-loading="loading">
      <sub-req
        ref="head"
        @on-ok="onSubmit"
        @on-export="onExport"
      ></sub-req>
      <div>
        <div style="text-align: center;font-size: 24px;margin-bottom: 15px;">
          {{ title }}
        </div>
        <tr-table
          class=""
          ref="tableBox"
          :data="data"
          :tableHeaderList="canRendererTableHeader"
          :isShowBottomOptions="false"
          :TableHeight="TableHeight"
          :loading="loading"
          :frontFixedNum="frontFixedNum"
          :backFixedNum="backFixedNum"
          :isShowSummary="true"
          :omitColumnIndex="omitColumnIndex"
        >
        </tr-table>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import common from '@/mixin/exportToExcel'
export default {
  name: "monthly-summary",
  components: {
    subReq,
  },
  mixins: [common],
  data() {
    return {
      data:[], //列表
      frontFixedNum: 1, //前几行固定
      backFixedNum: 0, //后几行固定
      canRendererTableHeader: [],
      topHeader: [
        {
          id: 1,
          label: "考核内容",
          prop: "assess_content",
          width: "130",
          align: "center",
          signIndex: 0,
        },
        {
          id: 2,
          label: "指标值及要求",
          prop: "assess_require",
          width: "130",
          align: "center",
          signIndex: 1,
        },
        {
          id: 3,
          label: "分值",
          prop: "score",
          width: "130",
          align: "center",
          signIndex: 2,
        },
        {
          id: 4,
          label: "评分标准", 
          prop: "score_level",
          width: "130",
          align: "center",
          signIndex: 3,
        },
      ],
      loading: false,
      TableHeight:500,
      form:{}, //查询表单数据 
      topColumnIndex: [1,2,4],
      omitColumnIndex: [],
      title: ''
    };
  },
 
  mounted() {
    this.setHead()
  },
  methods: {
    // 计算高吨
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        this.TableHeight = maxh - 50 - 30
      }, 60);
    },
    // 获取列表
    loadData() {
      this.loading = true;
      let params = Object.assign({},params,this.form)
      this.$client.GetMonthTotalSummary({context:params})
      .then(res => {
        if (res.head.result == "200") {
          this.data = res.context 
          this.getNewData(this.data)

          this.loading = false;
          } else {
            this.loading = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
      }).catch(err => {
        this.loading = false;
      })
    },
    // 查询
    onSubmit(form) {
      this.form = form;

      let year = new Date(form.month).getFullYear()
      let month = new Date(form.month).getMonth() + 1

      this.title = `${year}年${month}月考评得分表`
      this.loadData();
    },
    // 数据组装 
    getNewData(list) {
      let depts = []
      list.forEach(item => {
        item.details.forEach(child => {
          depts.push(child.dept_name)
        })
      });
      depts = [...new Set(depts)]
      this.getCustoms(depts)
      this.getList(list,depts)
    },
    // 组装表头
    getCustoms(depts) {
      let header = []
      
      depts.forEach((item,index) => {
        let obj = {
          id: index + 5,
          label: item,
          prop: "score",
          width: "100",
          align: "center",
          signIndex: index + 4,
          nestedTablesHeader: [
            {
              id: 101,
              label: "得分",
              prop: `score${index}`,
              width: "80",
              align: "center",
              signIndex: 100,
            },
            {
              id: 102,
              label: "完成情况",
              prop: `finished${index}`,
              width: "80",
              align: "center",
              signIndex: 101,
            },
          ]
        }
        header.push(obj)
      })

      this.canRendererTableHeader = [...this.topHeader,...header]
      let header_list = []
      // 被忽略合计列 
      let omit = []
      this.canRendererTableHeader.forEach(item => {
        if (item.nestedTablesHeader) {
          item.nestedTablesHeader.forEach(child => {
            header_list.push(child)
          })
        }
      })
      header_list.forEach((item,index) => {
        if (!item.prop.includes('score')) {
          omit.push(index + 5)
        }
      })
      this.omitColumnIndex = [...this.topColumnIndex,...omit]
    },
    // 组装列表数据
    getList(list,depts) {
      list.forEach(item => {
        depts.forEach((t,index) => {
          item[`score${index}`] = ''
          item[`finished${index}`] = ''
        })
      })

      list.forEach(item => {
        if (item.details) {
          item.details.forEach(child => {
            depts.forEach((t,index) => {
              if (child.dept_name == t) {
                item[`score${index}`] = child.socre || ''
                item[`finished${index}`] = child.finished || ''
              }
            })
          })  
        }

      })
    },
    // 导出 
    onExport() {
      if (this.data.length > 0) {
        let table_dom = this.$refs['tableBox'].$refs.table.$el
        let titles = [this.title]
        this.exportToExcel(table_dom,'月度汇总表','monthly-summary',titles)
      } else {
        this.$message({
          showClose: true,
          message: "暂无数据",
          type: "warning",
        });
      }
    }
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.monthly-summary{
  width: 100%;
  height: 100%;
}
</style>
