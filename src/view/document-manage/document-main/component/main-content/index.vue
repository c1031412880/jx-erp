<template>
  <div class="main-content">
    <sub-req ref="head" @on-ok="onSubmit" @on-draft="draftDialogShow = true"></sub-req>
    <tr-table
      ref="table"
      :selectionShow="true"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
    >
      <template slot-scope="scope" slot="type">
        <span>{{ scope.data.type === 1 ? '发文' : '收文' }}</span>
      </template>
      <template slot-scope="scope" slot="state_name">
        <span :style="scope.data.state | outType">{{ scope.data.state_name }}</span>
      </template>
      <template slot-scope="scope" slot="title">
        <span style="color: #409eff">{{ scope.data.title }}</span>
      </template>
      <template slot="operation" slot-scope="scope">
        <el-button type="text" v-if="scope.data.is_audit" @click="openApply(scope.data)">
          审批
        </el-button>
        <!--  @click="onStateSet(scope.data, 'apply')" -->
        <el-button type="text" v-else @click="openApply(scope.data)">查看</el-button>
        <el-button type="text" v-if="scope.data.state == 4" @click="showCopy(scope.data)">
          抄送
        </el-button>
        <el-button type="text" v-if="scope.data.state == 4" @click="showCCRecord(scope.data)">
          抄送记录
        </el-button>
        <el-button type="text" v-if="scope.data.state > 1" @click="onStateDel(scope.data)">
          删除
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
    <draft-dialog
      ref="draftDialog"
      @on-loadData="loadData"
      :curChangeType="curSelectType"
      :dialogBool.sync="draftDialogShow"
      @on-ok="draftDialogOk"
    ></draft-dialog>
    <el-dialog :visible.sync="dialogCopy" width="740px" title="选择人员">
      <user-role-tree-list
        v-if="dialogCopy"
        ref="userRoleTreeList"
        ser-role-tree-list
        placeholder="选择抄送人员"
        :show_all="true"
        :func_type="0"
        :is_contain_emp="true"
        :isShowCheckbox="true"
      ></user-role-tree-list>
      <div style="text-align: right; margin-top: 15px">
        <el-button @click="dialogCopy = false">取消</el-button>
        <el-button type="primary" @click="addCC">确认</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogCCRecord" width="740px" title="抄送记录">
      <tr-table :data="CCRecordData" :tableHeaderList="CCRecordList" :TableHeight="500"></tr-table>
    </el-dialog>
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
import subReq from './component/sub-req'
import draftDialog from './component/draft-dialog'
import UserRoleTreeList from '@/components/base/formModel/tree/user-role-tree/list'
export default {
  name: "main-content",
  components: { subReq, draftDialog, UserRoleTreeList},
  data() {
    return {
      data: [],
      TableHeight: 400,
      customSettingList:[
        {
          id: 1,
          label: "公文标题",
          prop: "title",
          width: "200",
          align: "center",
          signIndex:0,
          sortable:false
        },
        {
          id: 2,
          label: "状态",
          prop: "state_name",
          width: "120",
          align: "center",
          signIndex:1,
          sortable:false
        },
        {
          id: 3,
          label: "当前流程",
          prop: "step_name",
          width: "120",
          align: "center",
          signIndex:2,
          sortable:false
        },
        {
          id: 4,
          label: "当前审核人",
          prop: "person_name",
          width: "120",
          align: "center",
          signIndex:3,
          sortable:false
        },
        {
          id: 5,
          label: "公文流程类型",
          prop: "type_name",
          width: "130",
          align: "center",
          signIndex:4,
          sortable:false
        },
        {
          id: 6,
          label: "滞留时间",
          prop: "wait_time",
          width: "120",
          align: "center",
          signIndex:5,
          sortable:false
        },
        {
          id: 7,
          label: '主送单位',
          prop: 'main_department_name',
          width: "120",
          align: "center",
          signIndex:6,
          sortable:false
        },
        {
          id: 8,
          label: "公文类型",
          prop: "doc_name",
          width: "160",
          align: "center",
          signIndex:7,
          sortable:false
        },
        {
          id: 9,
          label: "公文日期",
          prop: "document_date",
          width: "160",
          align: "center",
          signIndex:8,
          sortable:false
        },
        {
          id: 10,
          label: "操作",
          prop: "operation",
          width: "220",
          align: "center",
          signIndex:9,
          sortable:false
        },
      ],
      frontFixedNum:2, //前几行固定
      backFixedNum:1, //后几行固定
      canRendererTableHeader: null,
      customSettingShowList: null,
      loading: false,
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0
      },
      draftDialogShow: false,
      form: {},
      curSelectType: 'apply',
      doc_id: '',
      doc_type: 1,
      dialogCopy: false,
      dialogCCRecord: false,
      CCRecordData: [],
      CCRecordList: [
         {
          id: 1,
          label: "抄送人员",
          prop: "user_name",
          align: "center",
          signIndex:0,
          sortable:false
        },
         {
          id: 2,
          label: "抄送时间",
          prop: "date",
          align: "center",
          signIndex:0,
          sortable:false
        },
         {
          id: 3,
          label: "操作人",
          prop: "create_name",
          align: "center",
          signIndex:0,
          sortable:false
        }
      ],
      customSettingVialogVisible: false,
      titlesId:'', //当前表头的id
      menu_code:'',
    }
  },
  filters: {
    outType(type) {
      let color = '#409EFF'
      switch (type) {
        case 0:
          color = '#E6A23C'
          break
        case 2:
          color = '#E6A23C'
          break
        case 3:
          color = '#F56C6C'
          break
        case 5:
          color = '#F56C6C'
          break
        case 4:
          color = '#67C23A'
          break
      }
      return {color: color}
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.menu_code = this.$route.meta.code + '-3';
      this.reqTitleTable()
      this.setHead('initialize');
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    })
  },
  methods: {
    // 查看删除
    onStateDel(item) {
      this.$confirm('此操作将永久删除该查看记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$client.DeleteDocumentFlow({context: {page_type:1,document_type: item.doc_type,ids:[item.document_id]}}).then(req => {
          this.loadData()
          if (req.head.result === '200') {
            this.$message({
              message: req.head.describle,
              type: 'success'
            });
          } else {
            this.$message.error(req.head.describle);
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 提交审核
    draftDialogOk(form, type) {
      this.draftDialogShow = false
      if (type === 1) {
        this.$client.UpdateStateDocumentMain({context: form}).then(req => {
          this.loadData()
          if (req.head.result === '200') {
            this.$message({
              message: '审批完成',
              type: 'success'
            });
          } else {
            this.$message.error(req.head.describle);
          }
        })
      } else {
        this.$client.UpdateStateDocumentAccept({context: form}).then(req => {
          this.loadData()
          if (req.head.result === '200') {
            this.$message({
              message: '审批完成',
              type: 'success'
            });
          } else {
            this.$message.error(req.head.describle);
          }
        })
      }

    },
    // 审核编辑初始化
    onStateSet(item, type) {
      this.curSelectType = type
      setTimeout(() => {
        this.$refs.draftDialog.setData(item)
      }, 100)
      this.draftDialogShow = true
    },
    // 审批查看
    openApply(val) {
      let detail_id = val.doc_type == 1 ? 30 : 40, title = val.doc_type == 1 ? '发文审批' : '收文审批'
      this.$router.push({
        path: `/news-details/${val.document_id}/${title}/${detail_id}`
      })
    },
    showCopy(row) {
      this.doc_id = row.document_id
      this.doc_type = row.doc_type
      this.dialogCopy = true
    },
    addCC() {
      let ids = this.$refs.userRoleTreeList.id
      if(!ids || !ids.length) {
        this.$message.warning('请选择抄送人员')
        return
      }
      let params = {
        doc_id: this.doc_id,
        user_ids: ids,
        type: this.doc_type
      }
      this.$client.AddCCDocumentMain({context: params}).then(res => {
        if (res.head.result === '200') {
          this.dialogCopy = false
          this.$message({message:'抄送成功',type: 'success'});
        } else {
          this.$message({message:res.head.describle,type: 'error'});
        }
      })
    },
    showCCRecord(row) {
      this.$client.GetCCPersonDocumentMain({doc_id: row.document_id}).then(res => {
        if (res.head.result === '200') {
          this.CCRecordData = res.context
          this.dialogCCRecord = true
        } else {
          this.$message({message:res.head.describle,type: 'error'});
        }
      })
    },
    onSubmit(form) {
      this.form = form
      this.pageInfo.pageIndex = 1
      this.loadData()
    },
    // 获取数据
    loadData() {
      this.loading = true
      this.form.page_index = this.pageInfo.pageIndex
      this.form.page_size = this.pageInfo.pageSize
      this.$client.GetByPageDocumentFlow(this.form).then(req => {
        this.loading = false
        eventOn.$emit('update-upcoming-matter')
        if (req.head.result === '200') {
          this.data = req.context.list
          this.pageInfo.pageCount = req.context.total
        } else {
          this.data = []
          this.pageInfo.pageCount = 0
        }
      })
    },
    // 获取表头
    reqTitleTable() {
      this.$httpTableHeader.reqTableHeader(this.menu_code,this.customSettingList).then(res => {
        this.titlesId = res.titlesId;
        this.canRendererTableHeader = res.canRendererTableHeader;
        this.customSettingList = res.customSettingList;
        this.customSettingShowList = res.customSettingShowList;
        this.$forceUpdate();
      }).catch(err => {})
    },
    updateTableHeader(newestTableHeaderList) {
      this.$httpTableHeader.saveTableHeader(this.titlesId,this.menu_code,newestTableHeaderList).then(res => {

        this.reqTitleTable()
      }).catch(err => {

      })
    },
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
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
// 计算表格高度
    setHead(type) {
      if(type == 'initialize') {
        this.canRendererTableHeader = this.customSettingList;
        this.customSettingShowList = this.customSettingList;
      }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight
        let th = this.$refs.head.$el.offsetHeight
        this.TableHeight = maxh - (th) - 42
        console.log(this.TableHeight)
      }, 60)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.main-content{
  width 100%
  height 100%
}
</style>
