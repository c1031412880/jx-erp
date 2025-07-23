<template>
  <div class="pageIndex">
    <sub-req :isDel="isDel" :isCheck="isCheck" ref="head" @on-ok="subOk" @on-add="addShow" @on-del="delOk"></sub-req>
    <tr-table
      ref="table"
      @on-select-change-row="tableSelect"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :selectionShow="isDel"
      :TableHeight="TableHeight"
      :loading="loading"
      :spanMethodType="['column']"
      :rowspanObj="rowspanObj"
      :mergekeys="mergeKeys"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum">
      <template slot-scope="scope" slot="operation">
        <slot :data="scope.data"></slot>
      </template>
      <template slot-scope="scope" slot="state">
        <el-tag size="mini" :type="stateType(scope.data.state)">{{ scope.data.state_name }}</el-tag>
      </template>
      <template slot="enter_state" slot-scope="scope">
        {{scope.data.enter_state === 1 ? '未入库' : (scope.data.enter_state === 2 ? '部分入库' : '已入库')}}
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
    <info-dialog ref="InfoDialog" :dialogBool.sync="infoDialogShow" @on-ok="infoDialogOk"
                 @on-sub="infoDialogSub"></info-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import SubReq from "./sub-req";
import dataConfig from "./dataConfig";
import InfoDialog from "./info-dialog";

export default {
  name: "pageIndex",
  components: {InfoDialog, SubReq},
  props: {
    loadKey: {
      type: String,
      default: 'GetByPagePurchaseOrder'
    },
    isDel: {
      type: Boolean,
      default: false
    }
  },
  data() {
    //这里存放数据",
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0
      },
      data: [],
      form: {},
      canRendererTableHeader: dataConfig.tableHeaderData,
      rowspanObj: {},
      mergeKeys: dataConfig.mergeKeys,
      TableHeight: 400,
      frontFixedNum: 1,
      backFixedNum: 1,
      loading: false,
      infoDialogShow: false,
      selectData: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
      this.setHead()
    })
  },
  computed: {
    isCheck () {
      return this.selectData && this.selectData.length > 0
    }
  },
  //方法集合",
  methods: {
    tableSelect(list) {
      this.selectData = list
    },
    stateType(state) {
      let type = ''
      switch (state) {
        case 1:
          type = ''
          break;
        case 2:
          type = 'success'
          break
        case 3:
          type = 'warning'
          break
        case 4:
          type = 'danger'
          break
        case 5:
          type = 'info'
          break
      }
      return type
    },
    // 查询
    subOk(form) {
      this.form = form
      this.pageInfo.pageIndex = 1
      this.loadData()
    },
    addShow() {
      this.infoDialogShow = true
    },
    setShow(form) {
      this.infoDialogShow = true
      setTimeout(() => {
        this.$refs.InfoDialog.setForm(form)
      }, 100)
    },
    // 选中删除
    delOk() {
      if (this.selectData && this.selectData.length) {
        let context = this.selectData.map(item => item.id)
        this.$client.DeletePurchaseOrder({context: [...context]}).then(req => {
          if (req.head.result === '200') {
            this.loadData()
            this.$message({message: req.head.describle, type: 'success'});
          } else {
            this.$message({message: req.head.describle, type: 'error'});
          }
        })
      }
    },
    // 数据查询
    loadData() {
      this.form.page_size = this.pageInfo.pageSize
      this.form.page_index = this.pageInfo.pageIndex
      this.loading = true
      this.$client[this.loadKey](this.form).then(req => {
        this.loading = false
        if (req.head.result === '200') {
          let data = req.context.list
          this.data = []
          this.pageInfo.pageCount = req.context.total
          data.forEach(item => {
            if (!!item.details && !!item.details.length) {
              item.details.forEach(dt => {
                let obj = {
                  ...item, ...{
                    code: dt.code,
                    count: dt.count,
                    fee: dt.fee,
                    material_id: dt.material_id,
                    name: dt.name,
                    price: dt.price,
                    remark: dt.remark,
                    specification: dt.specification,
                    unit: dt.unit,
                    brand: '',
                  }
                }
                obj.brand += dt.brand ? `(${dt.brand}、)` : '、'
                this.data.push({...obj})
              })
            } else {
              this.data.push(item)
            }
          })
          let rowspanObj = this.$handleTableSpan(this.mergeKeys, this.data)
          let purchaseCodeKey = rowspanObj['purchase_code']
          Object.keys(rowspanObj).forEach(key => {
            rowspanObj[key] = purchaseCodeKey
          })
          this.rowspanObj = rowspanObj
          console.log(this.data, this.rowspanObj)
        } else {
          this.data = []
          this.pageInfo.pageCount = 0
          this.$message({message: req.head.describle, type: 'error'});
        }
        console.log(req)
      })
    },
    // 仅保存
    infoDialogOk(form) {
      this.$client.CreateOrUpdateReqPurchaseOrder({context: form}).then(req => {
        this.infoDialogShow = false
        this.loadData()
        if (req.head.result === '200') {
          this.$message({message: req.head.describle, type: 'success'});
        } else {
          this.$message({message: req.head.describle, type: 'error'});
        }
      })
    },
    // 提交
    infoDialogSub(context) {
      if (context.form_data.id) {
        this.apiImplementKey('StartFlowRecord', {context: context.step_data}, req => {
          this.apiImplementKey('SubmitPurchaseOrder', {context:
              {
                form_data: {
                  id: context.form_data.id,
                  flow_id: req.context.id,
                  flow_code: req.context.code
                },
                step_data: context.step_data
              }}, () => {
            this.infoDialogShow = false
            this.$message({message: req.head.describle, type: 'success'});
            this.loadData()
          })
        })
      } else {
        this.apiImplementKey('CreateOrUpdateReqPurchaseOrder', {context}, req => {
          // this.apiImplementKey('StartFlowRecord', {context: context.step_data}, req => {
          //   this.apiImplementKey('SubmitPurchaseOrder', {context:
          //       {
          //         form_data: {
          //           id: form.context.id,
          //           flow_id: req.context.id,
          //           flow_code: req.context.code
          //         },
          //         step_data: context.step_data
          //       }}, () => {
              this.infoDialogShow = false
              this.$message({message: req.head.describle, type: 'success'});
              this.loadData()
          //   })
          // })
        })
      }
    },
    // 执行接口
    apiImplementKey(key, context, fun) {
      this.$client[key](context).then(req => {
        if (req.head.result === '200') {
          fun(req)
        } else {
          this.$message({message: req.head.describle, type: 'error'});
        }
      })
    },
    // 分页切换事件
    handleCurrentChange(idx) {
      this.pageInfo.pageIndex = idx
      this.loadData()
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = sizes;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight
        let th = this.$refs.head.$el.offsetHeight
        let paginationH = this.$refs.paginationH.$el.offsetHeight
        this.TableHeight = maxh - (th + paginationH + 10)
      }, 60)
    }
  },
}
</script>

<style lang="scss" scoped>
.pageIndex {
  width: 100%;
  height: 100%;
}
</style>
