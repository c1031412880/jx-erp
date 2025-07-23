<template>
  <div class="quarterly-total-summary">
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
          ref="tableBox"
          :data="data"
          :tableHeaderList="canRendererTableHeader"
          :isShowBottomOptions="false"
          :TableHeight="TableHeight"
          :loading="loading"
          :frontFixedNum="frontFixedNum"
          :backFixedNum="backFixedNum"
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
  name: "quarterly-total-summary",
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
          label: "季度",
          prop: "month",
          width: "130",
          align: "center",
          signIndex: 0,
        },
      ],
      loading: false,
      TableHeight:500,
      form:{}, //查询表单数据 
      title: '季度总分汇总表'
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
      this.$client.GetQuarterTotalScore({context:params})
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
      this.loadData();
    },
    // 数据组装 
    getNewData(list) {
      let depts = []
      list.forEach(item => {
        if (item.details) {
          item.details.forEach(child => {
            depts.push(child.dept_name)
          })
        }

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
          id: index + 2,
          label: item,
          prop: `score${index}`,
          width: "100",
          align: "center",
          signIndex: index + 1,
        }
        header.push(obj)
      })

      this.canRendererTableHeader = [...this.topHeader,...header]
    },
    // 组装列表数据
    getList(list,depts) {
      list.forEach(item => {
        depts.forEach((t,index) => {
          item[`score${index}`] = ''
        })
      })

      list.forEach(item => {
        if (item.details) {
          item.details.forEach(child => {
            depts.forEach((t,index) => {
              if (child.dept_name == t) {
                item[`score${index}`] = child.socre || ''
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
        this.exportToExcel(table_dom,'季度总分汇总表','quarterly-total-summary',titles)
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
.quarterly-total-summary{
  width: 100%;
  height: 100%;
}
</style>
