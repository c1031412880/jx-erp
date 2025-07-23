<template>
  <div class="bicycle-ic-refund">
    <sub-req
      ref="head"
      @on-ok="onSubmit"
      @set-remark="setRemark"
    ></sub-req>
    <el-tabs
      v-model="activeName"
      class="bicycleIcRefund"
      @tab-click="handleClick"
      style="flex-shrink: 0;"
    >
      <el-tab-pane
        v-for="(tab, index) in userTabs"
        :key="index"
        :label="tab.label"
        :name="tab.name"
      ></el-tab-pane>
    </el-tabs>
    <tr-table
      ref="table"
      :data="tabData[activeName]"
      :tableHeaderList="canRendererTableHeader"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      @row-click="editRemark"
      style="flex-grow: 1; overflow: auto;"
    ></tr-table>
<!--    <el-pagination-->
<!--      style="margin: 5px 0; display: flex; justify-content: flex-end;"-->
<!--      @size-change="handleSizeChange"-->
<!--      @current-change="handleCurrentChange"-->
<!--      :current-page="page"-->
<!--      :page-sizes="[10, 20, 30, 40, 50, 100]"-->
<!--      :page-size="pageSize"-->
<!--      layout="total, sizes, prev, pager, next, jumper"-->
<!--      :total="total"-->
<!--      ref="paginationH"-->
<!--    >-->
<!--    </el-pagination>-->
    <el-dialog
      title="编辑备注"
      :visible.sync="remarkDialogVisible"
      width="30%"
    >
      <el-form :model="remarkForm">
        <el-form-item label="备注">
          <el-input v-model="remarkForm.remark" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="remarkDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRemark">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import moment from 'moment'; // 引入moment.js用于日期处理

export default {
  name: "bicycle-ic-refund",
  components: {
    subReq,
  },
  data() {
    const oneMonthAgo = moment().subtract(1, 'months').format('YYYY-MM-DD');
    const today = moment().format('YYYY-MM-DD');
    return {
      form: {
        startDate: oneMonthAgo,
        endDate: today,
      },
      data: [],
      loading: false,
      TableHeight: 500,
      informationDialogShow: false,
      user_name: "",
      icRefundList: [
        {
          id: 1,
          label: "日期",
          prop: "date",
          width: "130",
          align: "center",
          signIndex: 0,
        },
        {
          id: 2,
          label: "退卡、注销",
          prop: "card_total",
          width: "130",
          align: "center",
          signIndex: 1,
          nestedTablesHeader: [
            {
              id: 101,
              label: "A卡(张)",
              prop: "card_A",
              width: "100",
              align: "center",
              signIndex: 100,
            },
            {
              id: 102,
              label: "B卡(张)",
              prop: "card_B",
              width: "100",
              align: "center",
              signIndex: 101,
            },
            {
              id: 103,
              label: "C卡(张)",
              prop: "card_C",
              width: "100",
              align: "center",
              signIndex: 102,
            },
            {
              id: 104,
              label: "市民卡(张)",
              prop: "citi_card",
              width: "100",
              align: "center",
              signIndex: 103,
            },
            {
              id: 105,
              label: "公交卡(张)",
              prop: "bus_card",
              width: "100",
              align: "center",
              signIndex: 104,
            },
            {
              id: 106,
              label: "退押金(元)",
              prop: "deposit",
              width: "100",
              align: "center",
              signIndex: 105,
            },
            {
              id: 107,
              label: "退余额(元)",
              prop: "card_money",
              width: "100",
              align: "center",
              signIndex: 106,
            },
          ],
        },
        {
          id: 3,
          label: "应缴实际数",
          prop: "total_money",
          width: "130",
          align: "center",
          signIndex: 2,
        },
        {
          id: 4,
          label: "实缴金额",
          prop: "real_money",
          width: "130",
          align: "center",
          signIndex: 3,
        },
        {
          id: 5,
          label: "备注（点击对应行进行编辑备注）",
          prop: "remark",
          width: "200",
          align: "center",
          signIndex: 4,
        },
      ],
      frontFixedNum: 0,
      backFixedNum: 0,
      canRendererTableHeader: null,
      icRefundShowList: null,
      userTabs: [], // 存储用户标签页的数据
      activeName: "summary", // 当前激活的标签页名称
      tabData: {}, // 存储每个标签页对应的数据
      remarkDialogVisible: false,
      remarkForm: {
        server_id: "",
        remark: "",
      },
      editingRow: null, // 用于存储正在编辑的行
      page: 1, // 当前页码
      pageSize: 20, // 每页显示条数
      total: 0, // 总条数
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead("initialize");
      window.eventOn.$on("view-resize" + this.$route.fullPath, () => {
        this.setHead();
      });
    });
  },
  methods: {
    updateTableHeader(newestTableHeaderList) {
      this.canRendererTableHeader = null;
      this.icRefundShowList = null;
      this.icRefundShowList = newestTableHeaderList;
      this.canRendererTableHeader = newestTableHeaderList
        .filter((item) => item.isSelected)
        .map((sing, index) => {
          let obj = {
            id: index + 1,
            label: sing.label,
            prop: sing.prop,
            width: sing.width,
            align: sing.align,
            signIndex: index,
            sortable: sing.sortable,
          };
          return obj;
        });
      this.$forceUpdate();
    },
    // 查询
    onSubmit(form) {
      this.form = form;
      this.page = 1; // 重置页码
      this.total = 0; // 重置总条数
      this.loadData();
    },
    // 数据加载
    loadData() {
      this.loading = true;
      let params = Object.assign({}, this.form, {
        page_index: this.page,
        page_size: this.pageSize,
        active_tab: this.activeName // 添加当前激活标签页参数
      });
      this.$client.GetBicycleCardTotalBicycleManage({ context: params })
        .then((res) => {
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context;
            // 清空现有的标签页和数据
            this.userTabs = [];
            this.tabData = {};
            // 添加汇总页
            if (res.context.totals) {
              this.userTabs.push({
                label: "汇总",
                name: "summary",
              });
              this.tabData["summary"] = res.context.totals.slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
            }
            // 动态生成标签页
            for (const key in res.context.details) {
              if (res.context.details.hasOwnProperty(key)) {
                const users = res.context.details[key];
                this.userTabs.push({
                  label: key, // 使用 additionalProp 作为标签页名称
                  name: key,
                });
                this.tabData[key] = users.slice((this.page - 1) * this.pageSize, this.page * this.pageSize); // 将该 additionalProp 下的所有用户数据放入对应标签页
              }
            }
            // 计算总条数
            this.total = this.calculateTotal(res)
          } else {
            this.loading = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
        .catch((err) => {
          this.loading = false;
          this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        });
    },
    calculateTotal(res) {
      console.log(Object.values(res.context.details || {}));
      const totalsCount = res.context.totals ? res.context.totals.length : 0;
      const detailsData = Object.values(res.context.details || {});
      console.log("detailsData", detailsData);
      const detailsCount =  [...detailsData].reduce((acc, users) => acc + users.length, 0);
      return totalsCount + detailsCount;
    },
    // 计算表格高度 和 初始化表头
    setHead(type) {
      if (type == "initialize") {
        this.canRendererTableHeader = this.icRefundList;
        this.icRefundShowList = this.icRefundList;
      }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        this.TableHeight = maxh - th -54; // 动态计算表格高度
      }, 60);
    },
    handleClick(tab) {
      // 处理标签页点击事件
      this.activeName = tab.name; // 设置当前激活的标签页名称
      this.loadData(); // 加载数据
    },
    setRemark() {
      // 打开编辑备注对话框
      this.remarkDialogVisible = true;
    },
    editRemark(row) {
      // 如果是汇总页面，则不允许编辑备注
      if (this.activeName === "summary") {
        this.$message({
          showClose: true,
          message: "汇总页不允许编辑备注,请在个人页备注",
          type: "warning"
        });
        return;
      }
      // 设置当前编辑的行信息
      this.remarkForm.server_id = row.server_id;
      this.remarkForm.remark = row.remark;
      this.remarkForm.date = row.date; // 记录点击行的日期
      this.editingRow = row; // 存储正在编辑的行
      this.remarkDialogVisible = true;
    },
    saveRemark() {
      this.$client.BicycleIcUpdateRemarkBicycleManage({
        server_id: this.remarkForm.server_id,
        context: {
          date: this.remarkForm.date,
          remark: this.remarkForm.remark,
        },
      })
        .then((res) => {
          if (res.head.result == "200" && res.context) {
            this.$message({
              showClose: true,
              message: "备注更新成功",
              type: "success",
            });
            // 更新表格中的数据
            if (this.editingRow) {
              this.editingRow.remark = this.remarkForm.remark;
            }
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
        .catch((err) => {
          this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
        .finally(() => {
          this.remarkDialogVisible = false;
        });
    },
    handleSizeChange(newPageSize) {
      this.pageSize = newPageSize;
      this.loadData();
    },
    handleCurrentChange(newPage) {
      this.page = newPage;
      this.loadData();
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.bicycle-ic-refund {
  height: 100%;
}
</style>
