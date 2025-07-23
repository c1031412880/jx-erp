<template>
  <div class="send-doc">
    <sub-req ref="head" @on-ok="onSubMeit"></sub-req>
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
      <template slot="operation" slot-scope="scope">
        <el-button type="text" @click="openApply(scope.data)">查看</el-button>
        <el-button type="text" v-if="scope.data.state !== 5" @click="showCopy(scope.data)">
          抄送
        </el-button>
        <el-button type="text" @click="showCCRecord(scope.data)">抄送记录</el-button>
        <el-button
          type="text"
          @click="onStateVoid(scope.data)"
          v-if="$isPowerShow('send-void') && scope.data.state !== 5"
        >
          作废
        </el-button>
      </template>
      <template slot="state" slot-scope="scope">
        <span :style="scope.data.state | outType">{{ scope.data.state_name }}</span>
      </template>
    </tr-table>
    <el-pagination
      style="margin: 5px 0; display: flex; justify-content: flex-end"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      ref="paginationH"
      :current-page="PageInfo.pageIndex"
      :page-sizes="[10, 20, 30, 40, 50, 100]"
      :page-size="PageInfo.pageSize"
      layout="total,sizes, prev, pager, next, jumper"
      :total="PageInfo.pageCount"
    ></el-pagination>
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
import UserRoleTreeList from '@/components/base/formModel/tree/user-role-tree/list'
import subReq from "./sub-req";
export default {
  name: "send-doc",
  components: {subReq, UserRoleTreeList},
  data() {
    return {
      PageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0
      },
      data: [],
      TableHeight: 400,
      customSettingList:[
        {
          id: 1,
          label: "发文标题",
          prop: "title",
          width: "120",
          align: "center",
          signIndex:0,
          sortable:false
        },
        {
          id: 2,
          label: "发文字号",
          prop: "font_number",
          width: "120",
          align: "center",
          signIndex:1,
          sortable:false
        },
        {
          id: 3,
          label: "发文编号",
          prop: "code",
          width: "120",
          align: "center",
          signIndex:2,
          sortable:true
        },
        {
          id: 4,
          label: "状态",
          prop: "state",
          width: "120",
          align: "center",
          signIndex:3,
          sortable:false
        },
        {
          id: 5,
          label: "拟稿人",
          prop: "post_name",
          width: "130",
          align: "center",
          signIndex:4,
          sortable:false
        },
        {
          id: 6,
          label: "拟稿时间",
          prop: "posy_time",
          width: "160",
          align: "center",
          signIndex:5,
          sortable:true
        },
        {
          id: 7,
          label: "拟稿部门",
          prop: "department_name",
          width: "120",
          align: "center",
          signIndex:6,
          sortable:false
        },
        {
          id: 8,
          label: "主送部门",
          prop: "main_department_name",
          width: "120",
          align: "center",
          signIndex:7,
          sortable:false
        },
        {
          id: 9,
          label: "主送人员",
          prop: "main_person_names",
          width: "120",
          align: "center",
          signIndex:8,
          sortable:false
        },
        {
          id: 10,
          label: "抄送部门",
          prop: "copy_department_names",
          width: "120",
          align: "center",
          signIndex:9,
          sortable:false
        },
        {
          id: 11,
          label: "抄送人员",
          prop: "copy_person_names",
          width: "120",
          align: "center",
          signIndex:10,
          sortable:false
        },
        {
          id: 12,
          label: "生成时间",
          prop: "posy_time",
          width: "160",
          align: "center",
          signIndex:11,
          sortable:true
        },
        {
          id: 13,
          label: "操作",
          prop: "operation",
          width: "220",
          align: "center",
          signIndex:12,
          sortable:false
        },
      ],
      draftDialogShow:false,
      frontFixedNum:2, //前几行固定
      backFixedNum:1, //后几行固定
      canRendererTableHeader: null,
      customSettingShowList: null,
      loading: false,
      form: {},
      dialogCopy: false,
      doc_id: '',
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
      menu_code: '',
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
        case 6:
          color = '#999999'
          break
      }
      return {color: color}
    }
  },
  created() {
    this.menu_code = this.$route.meta.code + '-1';
    this.reqTitleTable()
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead('initialize');
      this.loadData()
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    })
  },
  methods: {
    addCC() {
      let ids = this.$refs.userRoleTreeList.id
      if(!ids || !ids.length) {
        this.$message.warning('请选择抄送人员')
        return
      }
      let params = {
        doc_id: this.doc_id,
        user_ids: ids,
        type: 1
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
      this.$client.GetCCPersonDocumentMain({doc_id: row.id}).then(res => {
        if (res.head.result === '200') {
          this.CCRecordData = res.context
          this.dialogCCRecord = true
        } else {
          this.$message({message:res.head.describle,type: 'error'});
        }
      })
    },
    showCopy(row) {
      this.doc_id = row.id
      this.dialogCopy = true
    },
    // 作废
    onStateVoid(info) {
      this.$confirm('此操作将作废该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$client.UpdateScrapDocumentMain({context: [info.id]}).then(req => {
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
          message: '已取消作废'
        });
      });
    },
    onSubMeit(info) {
      this.form = info
      this.PageInfo.pageIndex = 1
      this.loadData()
    },
    // 审核编辑初始化
    onStateSet(item, type) {
      this.$emit('set-show', item, type)
    },
    // 审批查看
    openApply(val) {
      let detail_id = 30, title = '发文审批'
      this.$router.push({
        path: `/news-details/${val.id}/${title}/${detail_id}`
      })
    },
    loadData() {
      this.loading = true
      Object.assign(this.form, {
        page_index: this.PageInfo.pageIndex,
        page_size: this.PageInfo.pageSize,
      })
      this.$client.GetAllByPageDocumentMain(this.form).then(req => {
        this.loading = false
        if (req.head.result === '200') {
          this.data = req.context.list
          this.PageInfo.pageCount = req.context.total
        } else {
          this.data = []
          this.PageInfo.pageCount = 0
        }
      })
    },
    // 分页切换事件
    handleCurrentChange(idx) {
      this.PageInfo.pageIndex = idx
      this.loadData()
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.PageInfo.pageIndex = 1;
      this.PageInfo.pageSize = sizes;
      this.PageInfo.pageCount = 0;
      this.loadData();
    },
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
    },
    // 获取表头
    reqTitleTable() {
      this.headerLoading = true;
      this.$httpTableHeader.reqTableHeader(this.menu_code,this.customSettingList).then(res => {
        this.titlesId = res.titlesId;
        this.canRendererTableHeader = res.canRendererTableHeader;
        this.customSettingList = res.customSettingList;
        this.customSettingShowList = res.customSettingShowList;
        this.$forceUpdate();
        setTimeout(() =>{
          this.headerLoading = false;
        },600)
      }).catch(err => {
        setTimeout(() =>{
          this.headerLoading = false;
        },600)
      })
    },
    updateTableHeader(newestTableHeaderList) {
      this.$httpTableHeader.saveTableHeader(this.titlesId,this.menu_code,newestTableHeaderList).then(res => {

        this.reqTitleTable()
      }).catch(err => {

      })
    },
    // 计算表格高度
    setHead(type) {
      if(type == 'initialize') {
        this.canRendererTableHeader = this.customSettingList;
      }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight
        let head = this.$refs.head.$el.offsetHeight
        this.TableHeight = maxh - 52 - head
      }, 60)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.send-doc {
  width: 100%;
  height: 100%;
}
</style>
