<template>
  <div class="advertising-source-management" ref="advertisingSource">
    <el-card class="box-card left-box" >
      <div
        slot="header"
        class="clearfix show-flex-box-r"
        style="height: 37px; flex-wrap: nowrap; align-items: center"
      >
        <span style="white-space: nowrap">线路车辆选择</span>
      </div>
      <div class="show-flex-box-c" :style="`height: ${treeBoxHeight}px`">
        <line-tree
          ref="lineTree"
          :isShowCheckbox="false"
          :isNodeExpanded="false"
          :placeholder="'请输入关键词'"
          @on-check="selectLineInfo"
        ></line-tree>
      </div>
    </el-card>
    <el-card class="box-card center-box" ref="centerBox">
      <sub-req
        ref="head"
        @on-ok="onSubmit"
        @export-excel="exportExcel"
      ></sub-req>
      <tr-table
        :selectionShow="true"
        :data="data"
        :tableHeaderList="canRendererTableHeader"
        :isShowBottomOptions="false"
        :TableHeight="TableHeight"
        :loading="loading"
        :frontFixedNum="frontFixedNum"
        :backFixedNum="backFixedNum"
      >
        <template slot-scope="scope" slot="rise_rate">
          <span v-if="!!scope.data.rise_rate || scope.data.rise_rate == 0">{{scope.data.rise_rate}}%</span>
        </template>
      </tr-table>

      <el-pagination
        style="margin: 5px 0;display:flex; justify-content: flex-end;"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        ref="paginationH"
        :current-page="pageInfo.pageIndex"
        :page-sizes="[10, 20, 30, 40, 50, 100]"
        :page-size="pageInfo.pageSize"
        layout="total,sizes, prev, pager, next, jumper"
        :total="pageInfo.pageCount"
      >
      </el-pagination>
    </el-card>

    <custom-setting
      :dialogBool.sync="customSettingVialogVisible"
      :customSettingList="customSettingList"
      :canRendererTableHeader="canRendererTableHeader"
      :customSettingShowList="customSettingShowList"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
    ></custom-setting>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import lineTree from "./component/line-tree";
export default {
  name: "advertising-source-management",
  components: {
    subReq,
    customSetting,
    lineTree
  },
  data() {
    return {
      treeBoxHeight:500,
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      form: {},
      data: [],
      loading: false,
      TableHeight: 500,
      customSettingVialogVisible: false,
      customSettingList: [
        {
          id: 1,
          label: "线路",
          prop: "line_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "车牌号",
          prop: "lp_num",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "广告投放状态",
          prop: "state_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "客户名称",
          prop: "customer_name",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },

        // {
        //   id: 5,
        //   label: "企业类型",
        //   prop: "firm_name",
        //   width: "130",
        //   align: "center",
        //   signIndex: 4,
        //   sortable: false,
        // },
        {
          id: 5,
          label: "联系人",
          prop: "con_name",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "联系人电话",
          prop: "phone",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "合同开始时间",
          prop: "start",
          width: "150",
          align: "center",
          signIndex: 6,
          sortable: true,
        },
        {
          id: 8,
          label: "合同结束时间",
          prop: "end",
          width: "150",
          align: "center",
          signIndex: 7,
          sortable: true,
        },
        // {
        //   id: 10,
        //   label: "对接人",
        //   prop: "duty_name",
        //   width: "130",
        //   align: "center",
        //   signIndex: 9,
        //   sortable: false,
        // }
        {
          id: 9,
          label: "合同金额",
          prop: "fee",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "每年缴费日期",
          prop: "timer_date",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "合同金额年递增率",
          prop: "rise_rate",
          width: "180",
          align: "center",
          signIndex: 10,
          sortable: false,
        }

      ],
      frontFixedNum: 1, //前几行固定
      backFixedNum: 0, //后几行固定
      canRendererTableHeader: null,
      customSettingShowList: null,
    };
  },
  mounted() {
    // this.loadData();
    this.setLineTreeFirstLoadSelect();
    this.$nextTick(() => {
      this.setHead('initialize');
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
    updateTableHeader(newestTableHeaderList) {
      this.canRendererTableHeader = null;
      this.customSettingShowList = null;
      this.customSettingShowList = newestTableHeaderList;
      this.canRendererTableHeader = newestTableHeaderList.filter(item => item.isSelected).map((sing,index) => {
        let obj = {
          id: index +1,
          label: sing.label,
          prop: sing.prop,
          width: sing.width,
          align: sing.align,
          signIndex: index,
          sortable: sing.sortable,
        }
        return obj
      });
      this.$forceUpdate();
    },
    // 导出Excel
    exportExcel(){
      let params = Object.assign({}, this.form);
      this.$client.exportAdSource(params)
      .then(res => {
        if(res.head.result == '200') {
          window.location.href = res.context
          this.$message({type: 'success', message: '导出成功'})
        }else{
          this.$message({type: 'error', message: '导出失败'})
        }
      })

    },
     // 第一次加载 显示总公司下面的广告源
    setLineTreeFirstLoadSelect() {
      setTimeout(() => {
        if(this.$refs.lineTree.data.length > 0){
          this.$refs.lineTree.setCurrentKey([this.$refs.lineTree.data[0].i_id]);
          this.$refs.lineTree.handleNodeClick(this.$refs.lineTree.data[0]);
          return
        }else{
          this.setLineTreeFirstLoadSelect()
        }
        
      }, 100);
    },
     // 选择中的线路
    selectLineInfo(lineInfo) {
      console.log(lineInfo);
      if(lineInfo[0].type == 1) {
        this.form.dept_id = lineInfo[0].i_id
        delete this.form.line_id
        delete this.form.vehicle_ids
      }

      if(lineInfo[0].type == 2) {
        this.form.line_id = lineInfo[0].i_id
        delete this.form.dept_id
        delete this.form.vehicle_ids
      }

      if(lineInfo[0].type == 3) {
        this.form.vehicle_ids = [lineInfo[0].i_id]
        delete this.form.line_id
        delete this.form.dept_id
      }

      this.loadData()
    },
    onSubmit(form) {
      this.form = Object.assign(this.form, form);
      console.log(this.form);
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 数据加载
    loadData() {
      this.loading = true;
      let params = Object.assign({}, this.form);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.GetByPageAdSource(params)
        .then(res => {
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context.list;
            this.pageInfo.pageCount = res.context.total
          } else {
            this.loading = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch(err => {
           this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
    },
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
    },
    // 分页切换事件
    handleCurrentChange(idx) {
      this.pageInfo.pageIndex = idx;
      this.loadData();
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = sizes;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 计算表格高度 和初始化表头
    setHead(type) {
      this.treeBoxHeight = this.$refs.advertisingSource.offsetHeight - 110;
      if(type == 'initialize') {
        this.canRendererTableHeader = this.customSettingList;
        this.customSettingShowList = this.customSettingList;
      }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        this.TableHeight = maxh - th - 30 - 68;
      }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.advertising-source-management {
  width: 100%;
  height: 100%;
  display: flex;

  .box-card {
    height: 100%;
    overflow: auto;
  }

  .left-box {
    // flex: 0 0 23vw;
    margin: 0 5px 0 0;
    min-width: 260px;
    height: 100%;
  }

  .center-box {
    flex: 1;
    height: 100%;
  }
}

.advertising-source-management /deep/ .el-card__header {
  background-color: #F5F5F5;
  padding: 12px 20px;
}

.superior-department-content {
  margin-bottom: 30px;
}
</style>
