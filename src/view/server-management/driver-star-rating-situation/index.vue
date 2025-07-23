<template>
  <div class="star-rating-situation">
    <sub-req ref="head" @on-ok="onSubmit"></sub-req>
    <tr-table
      :data="data"
      :loading="loading"
      :TableHeight="TableHeight"
      :backFixedNum="backFixedNum"
      :frontFixedNum="frontFixedNum"
      :tableHeaderList="customSettingList"
    >
      <template slot-scope="scope" slot="now_star">
        <div v-if="scope.data.now_star">
          <el-rate
            v-model="scope.data.now_star"
            :max="scope.data.now_star"
            :disabled="true"
            :colors="['#F56C6C', '#F56C6C', '#F56C6C']"
          ></el-rate>
        </div>
        <div class="show-flex-box-r show-flex-center" v-else>
          <span>无星级</span>
        </div>
      </template>
      <template v-for="item in months" slot-scope="scope" :slot="item">
        <el-button type="text" size="mini" @click="checkRowInfo(scope.data, item)">
          {{scope.data[item]}}
        </el-button>
      </template>
      <template slot-scope="scope" slot="operation">
        <el-button type="text" size="mini" @click="editRowInfo(scope.data, 'detail')">
          查看
        </el-button>
        <el-button
          type="text"
          size="mini"
          @click="editRowInfo(scope.data, 'edit')"
          v-if="$isPowerShow('edit')"
        >
          编辑
        </el-button>
      </template>
    </tr-table>
    <el-pagination
      style="margin: 5px 0; display: flex; justify-content: flex-end"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      ref="paginationH"
      :current-page="pageInfo.pageIndex"
      :page-sizes="[10, 20, 30, 40, 50, 100]"
      :page-size="pageInfo.pageSize"
      layout="total,sizes, prev, pager, next, jumper"
      :total="pageInfo.pageCount"
    ></el-pagination>

    <information-dialog
      :dialogBool.sync="informationVisible"
      ref="information"
      @on-edit="edit"
    ></information-dialog>

    <info-dialog
      ref="infoDialog"
      :dialogBool.sync="infoDialogShow"
      :accidentLiabilityType="accidentLiabilityType"
      :workOrderType="workOrderType"
    ></info-dialog>

    <detail-dialog :dialogBool.sync="detailVisible" ref="detail"></detail-dialog>
  </div>
</template>

<script>
// import infoDialog from '../driver-service-quality-statistics/component/info-dialog'
import informationDialog from './information-dialog'
import detailDialog from './detail-dialog'
import subReq from './sub-req'
export default {
  name: 'driver-star-rating-situation',
  components: {
    subReq,
    informationDialog,
    detailDialog,
    infoDialog
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0
      },
      months: [],
      form: {},
      data: [],
      loading: false,
      TableHeight: 500,
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      customSettingList: [
        {
          id: 1,
          label: '姓名',
          prop: 'driver_name',
          width: '70',
          align: 'center',
          signIndex: 0
        },
        // {
        //   id: 2,
        //   label: '工号',
        //   prop: 'work_code',
        //   width: '70',
        //   align: 'center',
        //   signIndex: 1
        // },
        {
          id: 3,
          label: '所属组织',
          prop: 'dept_name',
          width: '80',
          align: 'center',
          signIndex: 2
        },
        // {
        //   id: 4,
        //   label: '职位',
        //   prop: 'position',
        //   width: '100',
        //   align: 'center',
        //   signIndex: 3
        // },
        // {
        //   id: 5,
        //   label: '员工状态',
        //   prop: 'state',
        //   width: '80',
        //   align: 'center',
        //   signIndex: 4
        // },
        // {
        //   id: 6,
        //   label: '进单位时间',
        //   prop: 'join_date',
        //   width: '100',
        //   align: 'center',
        //   signIndex: 5
        // },
        // {
        //   id: 7,
        //   label: '累积工作年份',
        //   prop: 'work_year',
        //   width: '60',
        //   align: 'center',
        //   signIndex: 6
        // },
        // {
        //   id: 8,
        //   label: '当前星级',
        //   prop: 'now_star',
        //   width: '150',
        //   align: 'center',
        //   signIndex: 7
        // },
        // {
        //   id: 9,
        //   label: '评星时间',
        //   prop: 'last_star_time',
        //   width: '100',
        //   align: 'center',
        //   signIndex: 8
        // },
        {
          id: 10,
          label: '最高星级',
          prop: 'max_star',
          width: '60',
          align: 'center',
          signIndex: 9
        },
        {
          id: 11,
          label: '最高星级月份',
          prop: 'max_star_month',
          width: '60',
          align: 'center',
          signIndex: 10
        },
        {
          id: 11,
          label: '变化情况',
          prop: 'change',
          width: '60',
          align: 'center',  
          signIndex: 10
        },
        {
          id: 12,
          label: '操作',
          prop: 'operation',
          width: '120',
          align: 'center',
          signIndex: 11
        }
      ],
      informationVisible: false,
      detailVisible: false,
      infoDialogShow: false,
      workOrderType: '',
      accidentLiabilityType: []
    }
  },
  mounted() {
    this.reqWorkOrderDataDictionary();
    this.reqAccidentLiabilityDataDictionary();
    this.$nextTick(() => {
      this.setHead()
    })
  },
  methods: {
    onSubmit(form, id) {
      this.form = Object.assign({}, form);
      if(id) this.form.dept_id = id
      this.loadData()
    },
    // 数据加载
    loadData() {
      this.loading = true
      this.customSettingList = this.$options.data().customSettingList
      let params = Object.assign({}, this.form)
      params.page_index = this.pageInfo.pageIndex
      params.page_size = this.pageInfo.pageSize
      this.$client
        .GetRecordDriverStar({ context: params })
        .then(res => {
          // console.log(JSON.stringify(res));
          if (res.head.result == '200') {
            this.loading = false
            this.data = res.context.list
            if (this.data.length) {
              this.months = this.data[0].recent_months || []
              this.months.forEach(item => {
                this.customSettingList.splice(-1, 0, {
                  label: item,
                  prop: item,
                  width: '100',
                  align: 'center'
                })
              })
              this.customSettingList = this.customSettingList.map((x, i) => ({
                ...x,
                id: i + 1,
                signIndex: i
              }))
              this.data.forEach(item => {
                let recent_month_star = item.recent_month_star || []
                if (item.recent_months && item.recent_months.length) {
                  item.recent_months.forEach((m, i) => {
                    item[m] = recent_month_star[i] || ''
                  })
                }
              })
            }
            this.pageInfo.pageCount = res.context.total
          } else {
            this.loading = false
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: 'error'
            })
          }
        })
        .catch(err => {
          this.$message({
            showClose: true,
            message: err.body.message,
            type: 'error'
          })
        })
    },
    // 分页切换事件
    handleCurrentChange(idx) {
      this.pageInfo.pageIndex = idx
      this.loadData()
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.pageIndex = 1
      this.pageInfo.pageSize = sizes
      this.pageInfo.pageCount = 0
      this.loadData()
    },
    editRowInfo(row, type) {
      if (type == 'detail') {
        this.detailVisible = true
        this.$nextTick(() => {
          this.$refs.detail.loadData(row.driver_id)
        })
      } else {
        this.informationVisible = true
        this.$nextTick(() => {
          this.$refs.information.setData(row)
        })
      }
    },
    edit(form) {
      this.$client
        .UpdateDriverStar({ context: form })
        .then(res => {
          if (res.head.result == '200') {
            this.informationVisible = false
            this.loadData()
            this.$message({
              showClose: true,
              message: '编辑成功',
              type: 'success'
            })
          } else {
            this.$message({
              showClose: true,
              message: res.errmsg,
              type: 'error'
            })
          }
        })
        .catch(err => {
          this.$message({
            showClose: true,
            message: err.body.message,
            type: 'error'
          })
        })
    },
    // 获取工单类型数据字典
    reqWorkOrderDataDictionary() {
      this.workOrderType = '';
      let context = ['passenger-service-work-order-type']
      this.$client.getDictionaryDataBase({context: context}).then(req => {
        if (req.head.result === '200') {
          if (req.context.length) {
            let options = req.context[0].dic_detls;
            if(!!options && options.length) {
              try{
                options.forEach(element => {
                  if(element.c_name == '投诉') {
                    this.workOrderType = element.c_code
                    throw new Error("EndIterative");
                  }
                });

              }catch(e){}
            }
            
          }
        }
      })
    },
    // 获取事故责任数据字典
    reqAccidentLiabilityDataDictionary() {
      this.accidentLiabilityType = []
      let context = ['accident-zr']
      this.$client.getDictionaryDataBase({context: context}).then(req => {
        if (req.head.result === '200') {
          if (req.context.length) {
            let options = req.context[0].dic_detls;
            if(!!options && options.length) {
              try{
                options.forEach(element => {
                  if(element.c_name !== '无责') {
                    this.accidentLiabilityType.push(element.c_code)
                    // throw new Error("EndIterative");
                  }
                });

              }catch(e){}
            }
          }
        }
      })
    },
    checkRowInfo(row, date) {
      this.$refs.infoDialog.form.month = date
      this.$refs.infoDialog.form.driver_id = row.driver_id
      this.$refs.infoDialog.form.driver_name = row.driver_name
      this.infoDialogShow = true
      
    },    
    // 计算表格高度 和初始化表头
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight
        let th = this.$refs.head.$el.offsetHeight
        let ph = this.$refs.paginationH.$el.offsetHeight
        this.TableHeight = maxh - th - ph
      }, 900)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.star-rating-situation
  height: 100%
  width: 100%
</style>
