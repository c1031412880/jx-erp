<template>
  <div>
    <div class="head-content">
      <div class="head-nav">
        <h2>入库单</h2>
      </div>
      <div class="head">
        <div class="head-item">
          入库单编号:
          <span class="item1">{{data.enter_num}}</span>
        </div>
        <div class="head-item">
          审核状态:
          <span class="item2">{{data.state_name}}</span>
        </div>
      </div>
    </div>
    <div class="footle-content">
      <div class="footle-nav">
        <h3>基本信息</h3>
      </div>
      <div class="footle">
        <div class="footle-item">
          入库方式:
          <span class="item1" v-if="data.enter_type=='YBRK'">一般入库</span>
          <span class="item1" v-else-if="data.enter_type=='CGRK'">采购单入库</span>
          <span class="item1" v-else-if="data.enter_type=='DBRK'">调拨入库</span>
          <span class="item1" v-else-if="data.enter_type=='PYRK'">盘盈入库</span>
          <span class="item1" v-else-if="data.enter_type=='HCRK'">红冲入库</span>
          <span class="item1" v-else-if="data.enter_type=='TLRK'">退料入库</span>
          <span v-else></span>
        </div>
        <div class="footle-item">
          入库日期:
          <span class="item2"> <el-date-picker
                v-model="data.enter_date"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd HH:mm:ss"
                type="date"
                placeholder="选择日期"
                size="mini"
                disabled
              >
              </el-date-picker></span>
        </div>
        <div class="footle-item">
          入库仓库:
          <span class="item2">{{data.house_name}}</span>
        </div>
        <div class="footle-item">
          关联单号:
          <span class="item2">{{data.relate_num}}</span>
        </div>
        <div class="footle-item">
          采购员:
          <span class="item2">{{data.buyer_name}}</span>
        </div>
        <div class="footle-item">
          仓管员:
          <span class="item2">{{data.storage_name}}</span>
        </div>
        <div class="footle-item">
          提交人:
          <span class="item2">{{data.created_name}}</span>
        </div>
        <div class="footle-item">
          提交时间:
          <span class="item2">{{data.created_date}}</span>
        </div>
        <div class="footle-item">
        </div>
        <div class="footle-item">
          备注:
          <span class="item2">{{data.remark}}</span>
        </div>
      </div>
      <div class="footle-nav">
        <h3>入库明细</h3>
      </div>
       <div class="table">
            <tr-table
             :isShowSummary="true"
              :selectionShow="true"
              :data="tableData.slice(
              (currentPage - 1) * pagesize,
              currentPage * pagesize
            )"
              :tableHeaderList="tableHeaderLists"
              :TableHeight="250"
              :omitColumnIndex='[2,3,5,6,8,10,11,12,13,14]'
              :isFixedEmptyPlaceholder="false"
            > 
             <template slot-scope="scope" slot="material_id" >
                <el-select v-model="scope.data.material_id" disabled size="mini" filterable placeholder="请选择"  >
                  <el-option
                    v-for="item in wuziOptions"
                    :key="item.value"
                    :label="item.groupgo"
                    :value="item.id">
                  </el-option>
                </el-select>
              </template>
            <template slot-scope="scope" slot="count" >
                 <el-input-number v-model="scope.data.count" disabled :precision="0" :controls="false"  @change="countChange(scope.data)" :min="0"  size="mini" ></el-input-number>
              </template>
              <template slot-scope="scope" slot="price" >
                 <el-input-number v-model="scope.data.price" disabled :precision="2" :controls="false"  @change="countChange(scope.data)" :min="0"  size="mini" ></el-input-number>
              </template>
              <template slot-scope="scope" slot="total_price" >
                 <el-input-number v-model="scope.data.total_price" disabled :precision="2" :controls="false" :min="0"  size="mini" ></el-input-number>
              </template>
               <template slot-scope="scope" slot="cost_price">
            <el-input-number
              disabled
              v-model="scope.data.cost_price"
              :precision="2"
              :controls="false"
              @change="priceChange(scope.data)"
              :min="0"
              size="mini"
            ></el-input-number>
          </template>
          <template slot-scope="scope" slot="cost_total_price">
            <el-input-number
              disabled
              v-model="scope.data.cost_total_price"
              :precision="2"
              :controls="false"
              :min="0"
              size="mini"
            ></el-input-number>
          </template>
              <template slot-scope="scope" slot="batch_no" >
                <span v-if="scope.data.batch_no" >{{scope.data.batch_no}}</span>
                <span v-else>系统自动生成</span>
              </template>
              <template slot-scope="scope" slot="provider_id" >
                <el-select v-model="scope.data.provider_id" filterable clearable disabled placeholder="请选择">
                  <el-option
                    v-for="item in gongysOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
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
        i_id:'',
        gongysOptions:[],
        data:[],
            tableData: [],
            wuziOptions:[],
          tableHeaderLists: [
        {
          id: 1,
          label: "*物料编码",
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
          label: "*申请入库数量",
          prop: "count",
          width: "160",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "*销售单价",
          prop: "price",
          width: "160",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "销售金额",
          prop: "total_price",
          width: "160",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
          {
          id: 10,
          label: "成本单价",
          prop: "cost_price",
          width: "160",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "成本金额",
          prop: "cost_total_price",
          width: "160",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
        {
          id: 12,
          label: "批次",
          prop: "batch_no",
          width: "100",
          align: "center",
          signIndex: 11,
          sortable: false,
        },
        {
          id: 13,
          label: "供应商",
          prop: "provider_id",
          width: "150",
          align: "center",
          signIndex: 12,
          sortable: false,
        },
        {
          id: 14,
          label: "原始物料编码",
          prop: "origin_code",
          width: "130",
          align: "center",
          signIndex: 13,
          sortable: false,
        },
        {
          id: 15,
          label: "仓位",
          prop: "position",
          width: "90",
          align: "center",
          signIndex: 14,
          sortable: false,
        },
        {
          id: 16,
          label: "备注",
          prop: "remark",
          width: "130",
          align: "center",
          signIndex: 15,
          sortable: false,
        },
      ],
        }
    },
    mounted() {
      this.getdataTable()
      this.getGinsang()
      this.getwuzi()
    },
    methods: {
    //   getwuzi(){
    //   this.$client.getMaterialPage({usable:1}).then(req => {
    //       if (req.head.result === '200') {
    //       this.wuziOptions = req.context.list
    //       req.context.list.forEach(element => {
    //         this.wuziOptions.forEach(val => {
    //          if(val.specification==null){
    //             this.$set(val,"groupgo", val.name+'('+val.code+')')  
    //            }else{
    //              this.$set(val,"groupgo", val.name+val.specification+'('+val.code+')')  
    //            }
    //         });
          
    //       });
    //     }
    //     else{
    //       this.$message({type: 'error', message: '获取失败'})
    //     }
    //   })
    // },
    getwuzi() {
      this.$client.getMaterialPage({ usable: 1 }).then((req) => {
        if (req.head.result === "200") {
          let ids = [];
          this.wuziOptionMap = {};
          this.wuziOptionAllMap = {};
          this.tableData.forEach((obj) => {
            ids.push(obj.material_id);
          });
          let length = req.context.list.length;
          let allList = req.context.list;
          for (var i = 0; i < length; i++) {
            let item = allList[i];
            if (item.specification == null) {
              item.groupgo = item.name + "(" + item.code + ")";
            } else {
              item.groupgo =
                item.name + item.specification + "(" + item.code + ")";
            }
            this.wuziOptionAllMap[item.id] = item;
            if (i < 99) {
              this.wuziOptionMap[item.id] = item;
            }
          }
          ids.forEach((key) => {
            this.wuziOptionMap[key] = this.wuziOptionAllMap[key];
          });
          this.wuziOptions = Object.values(this.wuziOptionMap);
          // console.log(this.wuziOptionAllMap, this.wuziOptionMap, ids)
        } else {
          this.$message({ type: "error", message: "获取失败" });
        }
      });
    },
    handleSizeChange (val) {
      this.pagesize = val;
    },
    handleCurrentChange  (currentPage) {
      this.currentPage = currentPage;
    },
      //获取供应商
       getGinsang(){
        this.$client.GetProviderPage().then(req => {
            if (req.head.result === '200') {
           this.gongysOptions = req.context.list
          }
          else{
            this.$message({type: 'error', message: '获取失败'})
          }
        })  
    },
      //获取值
      getdataTable(val){
        if(val!=null){
          this.$client.getDataEnterHouse({id:val})
            .then(res => {
              if(res.head.result == '200') {
              this.tableData = res.context.details
              this.data = res.context
                // this.$message({type: 'success', message: '成功'})
              }else{
                this.$message({type: 'error', message: '失败'})
              }
            })
            return
        }
        if(this.$route.query.enter_num!=null){
       this.$client.getDataEnterHouse({enter_num:this.$route.query.enter_num})
      .then(res => {
        if(res.head.result == '200') {
        this.tableData = res.context.details
        this.data = res.context
          // this.$message({type: 'success', message: '成功'})
        }else{
          this.$message({type: 'error', message: '失败'})
        }
        })
        return
        }
      if(this.$route.query.id!=null){
      this.$client.getDataEnterHouse({id:this.$route.query.id})
      .then(res => {
        if(res.head.result == '200') {
        this.tableData = res.context.details
        this.data = res.context
          // this.$message({type: 'success', message: '成功'})
        }else{
          this.$message({type: 'error', message: '失败'})
        }
      })
      }
      },

      getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总价';
            return;
          }
          if(index === 1 || index === 13) {
              sums[index] = '';
              return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
          } else {
            sums[index] = '';
          }
        });

        return sums;
      }
    }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.head-content,.footle-content{
    border-radius: 10px
    padding: 20px 5px
    margin: 0 30px
    box-shadow: 0px -1px 0px 0px #eee,-1px 0px 0px 0px #eee,1px 0px 0px 0px #eee,0px 1px 0px 0px #eee
    -moz-box-shadow: 0px -1px 0px 0px #eee,-1px 0px 0px 0px #eee,1px 0px 0px 0px #eee,0px 1px 0px 0px #eee
    -webkit-box-shadow: 0px -1px 0px 0px #eee,-1px 0px 0px 0px #eee,1px 0px 0px 0px #eee,0px 1px 0px 0px #eee
    .head-nav{
        margin-left: 30px
        h2{
            font-weight: 600
            color: #666666
       }
    }
    .head{
        width: 100%
        display: flex
        margin: 40px 0 0 50px
        .head-item{
            padding-right: 190px
            color: #999
            font-weight: 700
            font-size: 12px
            padding-bottom: 20px
            span{
                color: #333
                font-size: 14px
                margin-left: 20px
            }
            .item2{
                &::before{
                    display: inline-block;
                    width: 7px;
                    height: 7px;
                    border-radius: 50%
                    margin-right: 5px
                    background: #52c1f5;
                    content: '';
                }
            }
        }
    }
}
.footle-content{
    margin-top: 10px
    .footle-nav{
        margin: 0 0 20px 30px
        h3{
            font-weight: 600
            color: #666666
            font-size: 12px
            display: inline-block;
            vertical-align: top
            margin-top: 1px
        }
        &::before{
            display: inline-block;
            width: 5px;
            height: 14px;
            margin-right: 5px
            background: #409eff;
            content: '';
        }
    }
    .footle{
        display: flex
        flex-wrap: wrap
        margin: 0px 0 0 50px
        .footle-item{
            flex: 33%
            padding-bottom: 30px
            color: #999
            font-weight: 700
            font-size: 12px
            span{
                color: #333
                font-size: 14px
                margin-left: 20px
            }
        }
    }
    .el-table-column{
        background-color: #f2f2f2
    }
}
</style>
