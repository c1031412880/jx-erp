<template>
  <el-dialog
    :visible="dialogBool"
    title="盘点报告单"
    :before-close="dialogClose"
    width="920px"
    
    :modal="false"
  >
    <div class="div-dialog-box">
      <el-form
        style="margin-bottom: 10px"
        class="demo-ruleForm"
        :disabled="true"
        :inline="true"
        size="mini">
        <el-form-item label="方案名称">
          <el-input v-model="form.plan_name"></el-input>
        </el-form-item>
        <el-form-item label="盘点日期">
          <el-date-picker
            v-model="form.check_date"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="盘点仓库">
          <el-select
            v-model="form.warehouse_id"
            filterable
            clearable
            placeholder="请选择">
            <el-option
              v-for="item in houseOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="盘点负责人">
          <el-select
            filterable
            v-model="form.check_id"
            clearable>
            <el-option
              v-for="item in checkList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="form.state">
            <el-option
              v-for="item in stateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="盘点类型">
          <el-select v-model="form.type">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
      <div class="detail-content">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="全部" :name="'0'"></el-tab-pane>
          <el-tab-pane label="盘盈" :name="'1'"></el-tab-pane>
          <el-tab-pane label="盘亏" :name="'2'"></el-tab-pane>
          <el-tab-pane label="盘平" :name="'3'"></el-tab-pane>
        </el-tabs>
        <el-form :inline="true" size="mini">
          <el-row>
            <el-form-item label="物料搜索:">
              <el-input v-model="searchForm.key" placeholder="请输入编号或名称或型号" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="getDetails">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button @click="onExport()" type="primary">导出</el-button>
            </el-form-item>
          </el-row>
         
        </el-form>
        <tr-table
          ref="table"
          :selectionShow="false"
          :data="data"
          :tableHeaderList="canRendererTableHeader"
          :TableHeight="TableHeight"
          :frontFixedNum="frontFixedNum"
          :backFixedNum="backFixedNum"
          :isFixedEmptyPlaceholder="false"
          :loading="tableLoading">
          <template slot-scope="scope" slot="code">
            <get-material-select
              :allList="allList"
              :maxMumber="maxMumber"
              v-model="data[scope.index].material_id"
              :disabled="true"
              ></get-material-select>
            </template>
          <template slot="difference" slot-scope="scope">
            {{scope.data.real_count > scope.data.inventory_count ? '+' : ''}}{{scope.data.real_count - scope.data.inventory_count}}
          </template>
          <template slot="state" slot-scope="scope">
            <el-tag size="mini" :type="scope.data.real_count > scope.data.inventory_count ? 'success' : (scope.data.real_count === scope.data.inventory_count ? '' : 'danger')">
              {{scope.data.real_count > scope.data.inventory_count ? '盘盈' : (scope.data.real_count === scope.data.inventory_count ? '盘平' : '盘亏')}}
            </el-tag>
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
      </div>

      <div class="issue-receipt-doc-detail">
        <div v-if="!!form.enter_num || !!form.leave_num">
          <el-form :inline="true" size="mini">
            <el-row>
              <el-form-item label="审核人:" style="margin-right: 50px;">
                <span style="color:#FF3B30">{{review_name}}</span>
              </el-form-item>
              <el-form-item label="审核时间:"> 
                <span style="color:#FF3B30">{{review_date}}</span>
              </el-form-item>
            </el-row>
          </el-form>
        </div>
        
        <div v-if="!!form.enter_num">
          <div class="show-flex-box-c" style="margin-bottom: 15px;">
            <span class="show-flex-box-r" style="align-items: center;margin-bottom: 15px;"> <strong> 盘盈入库单</strong>   <el-link type="primary" style="margin-left: 30px;" @click="jumpEnterhouseManagement()">{{form.enter_num}}</el-link></span>
            <span style="font-size: 12px; color:#909399;">说明：管理员审核盘点单后，有盘盈的情况下会自动生成盘盈入库单。</span>
          </div>
          <div class="issue-table">
            <div class="show-flex-box-r" style="align-items: center;margin-bottom: 10px;;">
              <i style="float:left;width: 5px;height: 14px; background: #409EFF;"></i> 
              <p style="margin-left:15px;color:#409EFF;font-size:13px;font-weight:bold">入库明细</p>
            </div>
            <tr-table
              ref="table"
              :loading="loading1"
              :selectionShow="false"
              :data="warehousingData.slice((warehousingpageInfo.pageIndex - 1)*warehousingpageInfo.pageSize,warehousingpageInfo.pageIndex*warehousingpageInfo.pageSize)"
              :tableHeaderList="warehousingHeadData"
              :TableHeight="TableHeight"
              :frontFixedNum="frontFixedNum"
              :backFixedNum="0"
              :isFixedEmptyPlaceholder="false"
              :isShowSummary="true"
              :omitColumnIndex='[1,2,3,4,5,7,9,10,11,12]'>
            </tr-table>
            <el-pagination
              style="margin: 5px 0;display:flex; justify-content: flex-end;"
              @current-change="warehousinghandleCurrentChange"
              @size-change="warehousinghandleSizeChange"
              ref="paginationH"
              :current-page="warehousingpageInfo.pageIndex"
              :page-sizes="[10, 20, 30, 40, 50, 100]"
              :page-size="warehousingpageInfo.pageSize"
              layout="total,sizes, prev, pager, next, jumper"
              :total="warehousingpageInfo.pageCount"
            >
            </el-pagination>
          </div>
        </div>
        <div v-if="!!form.leave_num">
          <div class="show-flex-box-c" style="margin-bottom: 15px;">
            <span class="show-flex-box-r" style="align-items: center;margin-bottom: 15px;"> <strong> 盘亏出库单</strong>   <el-link type="primary" style="margin-left: 30px;" @click="jumpWarehouseManagement()">{{form.leave_num}}</el-link></span>
            <span style="font-size: 12px; color:#909399;">说明：管理员审核盘点单后，有盘亏的情况下会自动生成盘亏出库单。</span>
          </div>
          <div class="issue-table">
            <div class="show-flex-box-r" style="align-items: center;margin-bottom: 10px;;">
              <i style="float:left;width: 5px;height: 14px; background: #409EFF;"></i> 
              <p style="margin-left:15px;color:#409EFF;font-size:13px;font-weight:bold">出库明细</p>
            </div>
            <tr-table
              ref="table"
              :loading="loading2"
              :selectionShow="false"
              :data="issueData.slice((issuepageInfo.pageIndex - 1)*issuepageInfo.pageSize,issuepageInfo.pageIndex*issuepageInfo.pageSize)"
              :tableHeaderList="issueHeadData"
              :TableHeight="TableHeight"
              :frontFixedNum="frontFixedNum"
              :backFixedNum="0"
              :isFixedEmptyPlaceholder="false"
              :isShowSummary="true"
              :omitColumnIndex='[1,2,3,4,5,7,11,12]'>
            </tr-table>
            <el-pagination
              style="margin: 5px 0;display:flex; justify-content: flex-end;"
              @current-change="issuehandleCurrentChange"
              @size-change="issuehandleSizeChange"
              ref="paginationH"
              :current-page="issuepageInfo.pageIndex"
              :page-sizes="[10, 20, 30, 40, 50, 100]"
              :page-size="issuepageInfo.pageSize"
              layout="total,sizes, prev, pager, next, jumper"
              :total="issuepageInfo.pageCount"
            >
            </el-pagination>
          </div>
        </div>
      </div>
      
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose" size="mini">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import detailsConfig from "./detailsConfig";
import getMaterialSelect from "./get-material-select";
export default {
  components: {getMaterialSelect},
  props: {
    dialogBool: Boolean,
    newMaterialList:[Array],
    headSearchForm:[Object]
  },
  data() {
    return {
      form: {
        warehouse_id: '',
        id: 0,
        plan_name: '',
        check_date: '',
        check_id: '',
        state: '',
        type: '',
        remark: '',
        details: [],
        enter_num:'',
        leave_num:'',
      },
      review_name:'', //审核人姓名
      review_date:'', //审核时间
      stateOptions: detailsConfig.state,
      typeOptions: detailsConfig.type,
      canRendererTableHeader: detailsConfig.headData.filter(item => {
        return item.prop !== 'operation'
      }),
      warehousingHeadData: detailsConfig.warehousingHeadData,
      issueHeadData: detailsConfig.issueHeadData,
      TableHeight: detailsConfig.TableHeight,
      frontFixedNum: detailsConfig.frontFixedNum,
      backFixedNum: detailsConfig.backFixedNum,
      data: [],
      houseOptions: [],
      checkList: [],
      warehouseList:[],
      maxMumber: 30,
      tableLoading: false,
      activeName: '0',
      searchForm:{
        key: '',
        state:0
      },
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0
      },
      loading1:false,
      warehousingData:[],
      warehousingpageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0
      },
      loading2:false,
      issueData:[],
      issuepageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0
      },
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.form, this.$options.data().form);
        this.data = []
      }else{
        this.reqByPageEnterHouse()
        this.reqByPageLeaveHouse()
      }
    },
    'form.warehouse_id' (val) {
      this.getWarehouseList(val)
    },
    newMaterialList(newVal, oldVal) {  //对数组进行监听
      if(!!this.newMaterialList && this.newMaterialList.length) {
        this.allList = JSON.parse(JSON.stringify(this.newMaterialList))    
      }
    },
  },
  mounted() {
    this.getWarehouse()
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    handleClick(tab, event) {
      if(this.tableLoading) {
        return
      }
      this.pageInfo.pageIndex = 1
      this.pageInfo.pageSize = 20
      this.pageInfo.pageCount = 0
      this.getDetails()
    },
    // 导出物料明细
    onExport() {
    // 导出
      let params = {
        key: this.searchForm.key,
        state: Number(this.activeName),
        check_id: this.form.id
      }
      this.$client.ExportDetailWarehouseCheck(params).then(req => {
        if (req.head.result === '200') {
          window.open(req.context)
          this.$message({message: req.head.describle, type: 'success'});
        } else {
          this.$message({message: req.head.describle, type: 'error'});
        }
      })
    },
    // 分页切换事件
    handleCurrentChange(idx) {
      this.pageInfo.pageIndex = idx
      this.getDetails()
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = sizes;
      this.pageInfo.pageCount = 0;
      this.getDetails();
    },
    // 获取明细
    getDetails() {
      this.tableLoading = true
      let params = Object.assign({},this.searchForm)
      params.page_size = this.pageInfo.pageSize
      params.page_index = this.pageInfo.pageIndex
      params.check_id  =  this.form.id
      params.state = Number(this.activeName)
      if (this.form.id) {
        this.$client.GetDetailByPageWarehouseCheck(params).then(req => {
          if (req.head.result === '200') {
            this.data = req.context.list
            this.pageInfo.pageCount = req.context.total
            if(!!this.data && this.data.length) {
              this.maxMumber =  this.data.length + 30
              if(this.allList.length) {
                 this.data.forEach((item,index) => {
                  this.allList.forEach((zItem,zIndex) => {
                    if(item.material_id == zItem.id) {
                      let obj = Object.assign({},zItem)
                      this.allList.splice(zIndex,1)
                      this.allList.unshift(obj)
                    }
                  })
                })
              }
            }
            setTimeout(() => {
              this.tableLoading = false
            },1000)
          }else{
            this.data = []
            this.pageInfo.pageCount = 0
          }
        })
      }
    },
    //获取仓管员
    getWarehouseList(val) {
      this.checkList = [];
      this.warehouseList =[];
      this.$client.getRecordWarehouse({ id: val }).then((req) => {
        if (req.head.result === "200") {
          this.checkList = req.context.persons;
          if (req.context.persons.length > 0) {
            req.context.persons.forEach((element) => {
              if (element.is_operater == 1) {
                this.warehouseList.push(element);
              }
            });
            if (this.warehouseList.length == 1) {
              this.form.storage_id = this.warehouseList[0].id;
            }
          }
        }
      });
    },
    //获取仓库
    getWarehouse() {
      let params = {}
      params.usable = '1'
      this.$client.getRecord1Warehouse().then((req) => {
        if (req.head.result === "200") {
          this.houseOptions = req.context;
          if (req.context.length > 0) {
            this.form.warehouse_id = req.context[0].id;
          }
        }
      });
    },
    // 入库单明细
    reqByPageEnterHouse() {
      if(!this.form.enter_num) {
        return
      }
      this.loading1 = true
      let params = {
        enter_num: this.form.enter_num
      };
      params.page_index = this.warehousingpageInfo.pageIndex;
      params.page_size = this.warehousingpageInfo.pageSize;
      this.$client.getDataEnterHouse(params)
        .then(res => {
          if (res.head.result == "200") {
            this.loading1 = false;
            this.review_name = res.context.review_name || '';
            this.review_date = res.context.review_date || '';
            this.warehousingData = res.context.details;
            this.warehousingpageInfo.pageCount = res.context.details.length || 0
            this.warehousingData.forEach(element => {
            if(element.price){
               element.price=element.price.toFixed(2)
               element.total_price=element.total_price.toFixed(2)
                if(element.cost_price){
                  element.cost_price=element.cost_price.toFixed(2)
                  if(element.cost_total_price){
                    element.cost_total_price=element.cost_total_price.toFixed(2)
                  }
                }
              }
            });
          } else {
            this.loading1 = false;
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
    // 分页切换入库单明细事件
    warehousinghandleCurrentChange(idx) {
      this.warehousingpageInfo.pageIndex = idx
    },
    // 入库单明细切换每页条数
    warehousinghandleSizeChange(sizes) {
      this.warehousingpageInfo.pageIndex = 1;
      this.warehousingpageInfo.pageSize = sizes;
    },
    // 获取出库单明细
    reqByPageLeaveHouse() {
      if(!this.form.leave_num) {
        return
      }
      this.loading2 = true
      let params = {
        leave_num: this.form.leave_num
      };
      params.page_index = this.issuepageInfo.pageIndex;
      params.page_size = this.issuepageInfo.pageSize;
      this.$client.getDataLeaveHouse(params)
        .then(res => {
          if (res.head.result == "200") {
            this.loading2 = false;
            this.review_name = res.context.review_name || '';
            this.review_date = res.context.review_date || '';
            this.issueData = res.context.details;
            this.issuepageInfo.pageCount = res.context.details.length || 0
            this.issueData.forEach(element => {
            if(element.price){
               element.price=element.price.toFixed(2)
               element.total_price=element.total_price.toFixed(2)
                if(element.cost_price){
                  element.cost_price=element.cost_price.toFixed(2)
                  if(element.cost_total_price){
                    element.cost_total_price=element.cost_total_price.toFixed(2)
                  }
                }
              }
            });
          } else {
            this.loading2 = false;
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

    // 分页出库单切换事件
    issuehandleCurrentChange(idx) {
      this.issuepageInfo.pageIndex = idx
    },
    // 切换出库单每页条数
    issuehandleSizeChange(sizes) {
      this.issuepageInfo.pageIndex = 1;
      this.issuepageInfo.pageSize = sizes;
    },

    // 跳转到出库管理
    jumpWarehouseManagement(){
      this.$router.push({
        name:'warehouse-management',
        params:{
          leave_num: this.form.leave_num,
          leave_date_start: this.headSearchForm.begin,
          leave_date_end: this.headSearchForm.end
        }
      })
    },
    // 跳转到入库管理
    jumpEnterhouseManagement(){
      this.$router.push({
        name:'stock-management',
        params:{
          enter_num: this.form.enter_num,
          enter_date_start: this.headSearchForm.begin,
          enter_date_end: this.headSearchForm.end
        }
      })
    },

  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .div-dialog-box{
    height: 500px;
    overflow-y: scroll;
  }
</style>


