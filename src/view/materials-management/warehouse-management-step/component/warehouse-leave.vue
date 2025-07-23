<template>
  <div>
    <div class="head-content">
      <div class="head-nav">
        <h2>出库单</h2>
      </div>
      <div class="head">
        <div class="head-item">
          出库单编号:
          <span class="item1">{{ data.leave_num }}</span>
        </div>
        <div class="head-item">
          审核状态:
          <span class="item2">{{ data.state_name }}</span>
        </div>
      </div>
    </div>
    <div class="footle-content">
      <div class="footle-nav">
        <h3>基本信息</h3>
      </div>
      <div class="footle">
        <div class="footle-item">
          出库方式:
          <span class="item1" v-if="data.leave_type == 'YBCK'">一般出库</span>
          <span class="item1" v-else-if="data.leave_type == 'WXCK'"
            >维修出库</span
          >
          <span class="item1" v-else-if="data.leave_type == 'DBCK'"
            >调拨出库</span
          >
          <!-- <span class="item1" v-else-if="data.leave_type == 'PYCK'"
            >盘盈出库</span
          > -->
          <span class="item1" v-else-if="data.leave_type == 'HCCK'"
            >红冲出库</span
          >
          <span v-else></span>
        </div>
        <div class="footle-item">
          出库日期:
          <span class="item2">
            <el-date-picker
              v-model="data.leave_date"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd HH:mm:ss"
              type="date"
              placeholder="选择日期"
              size="mini"
              disabled
            >
            </el-date-picker
          ></span>
        </div>
        <div class="footle-item">
          出库仓库:
          <span class="item2">{{ data.house_name }}</span>
        </div>
        <div class="footle-item">
          关联单号:
          <span class="item2">{{ data.relate_num }}</span>
        </div>
        <div class="footle-item">
          车牌自编号:
          <span class="item2">{{ data.v_num }}</span>
        </div>
        <div class="footle-item">
          车牌号:
          <span class="item2">{{ data.lp_num }}</span>
        </div>
        <div class="footle-item">
          仓保员:
          <span class="item2">{{ data.storage_name }}</span>
        </div>
        <div class="footle-item">
          领料员:
          <span class="item2">{{ data.pick_name }}</span>
        </div>
        <div class="footle-item">
          领料组织:
          <span class="item2">{{ data.pick_depatment_name }}</span>
        </div>
        <div class="footle-item">
          领料用途:
          <span class="item2">{{ data.use_way_name }}</span>
        </div>
        <div class="footle-item">
          提交时间:
          <span class="item2">{{ data.created_date }}</span>
        </div>
        <div class="footle-item">
          提交人：
          <span class="item2">{{ data.created_name }}</span>
        </div>
        <div class="footle-item">
          备注:
          <span class="item2">{{ data.remark }}</span>
        </div>
      </div>
      <div class="footle-nav">
        <h3>出库明细</h3>
      </div>
      <div class="table">
        <tr-table
          :isShowSummary="true"
          :selectionShow="true"
          :data="
            tableData.slice(
              (currentPage - 1) * pagesize,
              currentPage * pagesize
            )
          "
          :tableHeaderList="tableHeaderLists"
          :TableHeight="250"
          :omitColumnIndex="[2, 3, 5, 6, 8, 10, 11, 12, 13, 14]"
          :isFixedEmptyPlaceholder="false"
        >
          <template slot-scope="scope" slot="material_id">
            <el-select
              v-model="scope.data.material_id"
              disabled
              size="mini"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in wuziOptions"
                :key="item.id"
                :label="item.groupgo"
                :value="item.material_id"
              >
              </el-option>
            </el-select>
          </template>
          <template slot-scope="scope" slot="count">
            <el-input-number
              v-model="scope.data.count"
              disabled
              :precision="0"
              :controls="false"
              @change="countChange(scope.data)"
              :min="1"
              size="mini"
            ></el-input-number>
          </template>
          <template slot-scope="scope" slot="price">
            <el-input-number
              v-model="scope.data.price"
              disabled
              :precision="2"
              :controls="false"
              @change="countChange(scope.data)"
              :min="0"
              size="mini"
            ></el-input-number>
          </template>
          <template slot-scope="scope" slot="total_price">
            <el-input-number
              v-model="scope.data.total_price"
              disabled
              :precision="2"
              :controls="false"
              :min="0"
              size="mini"
            ></el-input-number>
          </template>
          <template slot-scope="scope" slot="batch_no">
            <span v-if="scope.data.batch_no">{{ scope.data.batch_no }}</span>
            <span v-else>系统自动生成</span>
          </template>
          <template slot-scope="scope" slot="provider_id">
            <el-select
              v-model="scope.data.provider_id"
              filterable
              clearable
              disabled
              placeholder="请选择"
            >
              <el-option
                v-for="item in gongysOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </template>
        </tr-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10]"
          :page-size="pagesize"
          :total="tableData.length"
          layout="total, sizes, prev, pager, next, jumper"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  data() {
    return {
      pagesize: 10, //默认分页每页数据量
      currentPage: 1, //默认展示第一页数据
      wuziOptions: [],
      wuziOptionAllMap: {},
      wuziOptionMap: {},
      gongysOptions: [],
      data: [],
      tableData: [],
      wuziOptions: [],
      tableHeaderLists: [
        {
          id: 1,
          label: "物料编码",
          prop: "material_id",
          width: "200",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "物料名称",
          prop: "material_name",
          width: "160",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "规格型号",
          prop: "specification",
          width: "160",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "计量单位",
          prop: "measure_unit_name",
          width: "120",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "品牌",
          prop: "brand",
          width: "120",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 7,
          label: "申请出库数量",
          prop: "count",
          width: "160",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        // {
        //   id: 8,
        //   label: "含税单价",
        //   prop: "trueprice",
        //   width: "160",
        //   align: "center",
        //   signIndex: 7,
        //   sortable: false,
        // },
        {
          id: 8,
          label: "单价",
          prop: "price",
          width: "160",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "总金额",
          prop: "total_price",
          width: "160",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "当前仓库库存",
          prop: "current_inventory",
          width: "150",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "全部仓库库存",
          prop: "total_inventory",
          width: "150",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
        {
          id: 12,
          label: "批次",
          prop: "batch_no",
          width: "130",
          align: "center",
          signIndex: 11,
          sortable: false,
        },
        {
          id: 14,
          label: "备注",
          prop: "remark",
          width: "130",
          align: "center",
          signIndex: 13,
          sortable: false,
        },
      ],
    };
  },
  activated() {
    this.getwuzi();

    if (this.$route.query.leave_num) {
      setTimeout(() => {
      this.getdataTable();
      }, 500);
  }
  },
  created(){
    this.getwuzi();

  },
  mounted() {
    this.getdataTable();
    // this.getGinsang()
    // this.getwuzi();
  },
  methods: {
        //获取物资
    getwuzi() {
      this.$client
        .getByPage1TimerHouse({})
        .then((req) => {
          if (req.head.result === "200") {
            let ids = [];
            this.wuziOptions = [];
            this.wuziOptionMap = {};
            this.wuziOptionAllMap = {};
            this.tableData.forEach((obj) => {
              ids.push(obj.material_id);
            });
            for (let n = 0; n < ids.length; n++) {
            if (
              ids[n] == "" ||
              typeof ids[n] == "undefined" ||
              ids[n] == null
            ) {
              ids.splice(n, 1);
              n = n - 1;
            }
          }
            let length = req.context.list.length;
            let allList = req.context.list;
            for (let i = 0; i < length; i++) {
              let item = allList[i];
              if (item.specification == null) {
                item.groupgo =
                  item.material_name + "(" + item.material_code + ")";
              } else {
                item.groupgo =
                  item.material_name +
                  item.specification +
                  "(" +
                  item.material_code +
                  ")";
              }
              this.wuziOptionAllMap[item.material_id] = item;
              if (i < 99) {
                this.wuziOptionMap[item.material_id] = item;
              }
            }
            ids.forEach((key) => {
              this.wuziOptionMap[key] = this.wuziOptionAllMap[key];
            });
            this.wuziOptions = Object.values(this.wuziOptionMap);
            console.log(this.wuziOptionMap);
            // console.log(this.wuziOptionAllMap, this.wuziOptionMap, ids)
          } else {
            // this.$message({ type: "error", message: "获取失败" });
          }
        }).catch(err=>{console.log(err)});
    },
    handleSizeChange: function (val) {
      this.pagesize = val;
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage;
    },
    //获取供应商
    getGinsang() {
      this.$client.GetProviderPage().then((req) => {
        if (req.head.result === "200") {
          this.gongysOptions = req.context.list;
        } else {
          // this.$message({ type: "error", message: "获取失败" });
        }
      });
    },
    //获取值
    getdataTable(val, leave_num) {
      this.getwuzi()
      if (val != null) {
        this.$client.getDataLeaveHouse({ id: val }).then((res) => {
          if (res.head.result == "200") {
            this.tableData = res.context.details;
            this.data = res.context;
            console.log(this.wuziOptions)
            // this.$message({type: 'success', message: '成功'})
          } else {
            // this.$message({ type: "error", message: "失败" });
          }
        });
        return;
      }
      if(this.$route.query.leave_num!=null){
        this.$client
          .getDataLeaveHouse({ leave_num: this.$route.query.leave_num })
          .then((res) => {
            if (res.head.result == "200") {
              this.tableData = res.context.details;
              this.data = res.context;
              // this.$message({type: 'success', message: '成功'})
            } else {
              this.$message({ type: "error", message: "失败" });
            }
          });
          return
      }  
      if(this.$route.query.id!=null){
        this.$client
          .getDataLeaveHouse({ id: this.$route.query.id })
          .then((res) => {
            if (res.head.result == "200") {
              this.tableData = res.context.details;
              this.data = res.context;
              // this.$message({type: 'success', message: '成功'})
            } else {
              this.$message({ type: "error", message: "失败" });
            }
          });
      }
      if(leave_num!=null){
        this.$client
          .getDataLeaveHouse({ leave_num: leave_num })
          .then((res) => {
            if (res.head.result == "200") {
              this.tableData = res.context.details;
              this.data = res.context;
              // this.$message({type: 'success', message: '成功'})
            } else {
              this.$message({ type: "error", message: "失败" });
            }
          });
          return
      }  
    },

    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总价";
          return;
        }
        if (index === 1 || index === 13) {
          sums[index] = "";
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (!values.every((value) => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
        } else {
          sums[index] = "";
        }
      });

      return sums;
    },
  },
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.head-content, .footle-content {
  border-radius: 10px;
  padding: 20px 5px;
  margin: 0 30px;
  box-shadow: 0px -1px 0px 0px #eee, -1px 0px 0px 0px #eee, 1px 0px 0px 0px #eee, 0px 1px 0px 0px #eee;
  -moz-box-shadow: 0px -1px 0px 0px #eee, -1px 0px 0px 0px #eee, 1px 0px 0px 0px #eee, 0px 1px 0px 0px #eee;
  -webkit-box-shadow: 0px -1px 0px 0px #eee, -1px 0px 0px 0px #eee, 1px 0px 0px 0px #eee, 0px 1px 0px 0px #eee;

  .head-nav {
    margin-left: 30px;

    h2 {
      font-weight: 600;
      color: #666666;
    }
  }

  .head {
    width: 100%;
    display: flex;
    margin: 40px 0 0 50px;

    .head-item {
      padding-right: 190px;
      color: #999;
      font-weight: 700;
      font-size: 12px;
      padding-bottom: 20px;

      span {
        color: #333;
        font-size: 14px;
        margin-left: 20px;
      }

      .item2 {
        &::before {
          display: inline-block;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          margin-right: 5px;
          background: #52c1f5;
          content: '';
        }
      }
    }
  }
}

.footle-content {
  margin-top: 10px;

  .footle-nav {
    margin: 0 0 20px 30px;

    h3 {
      font-weight: 600;
      color: #666666;
      font-size: 12px;
      display: inline-block;
      vertical-align: top;
      margin-top: 1px;
    }

    &::before {
      display: inline-block;
      width: 5px;
      height: 14px;
      margin-right: 5px;
      background: #409eff;
      content: '';
    }
  }

  .footle {
    display: flex;
    flex-wrap: wrap;
    margin: 0px 0 0 50px;

    .footle-item {
      flex: 33%;
      padding-bottom: 30px;
      color: #999;
      font-weight: 700;
      font-size: 12px;

      span {
        color: #333;
        font-size: 14px;
        margin-left: 20px;
      }
    }
  }

  .el-table-column {
    background-color: #f2f2f2;
  }
}
</style>
