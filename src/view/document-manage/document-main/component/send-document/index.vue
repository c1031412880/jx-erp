<template>
  <div class="send-document">
    <sub-req ref="head" @on-ok="onSubmit" @on-draft="onStateSet('', 'add')"></sub-req>
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
      <template slot="title" slot-scope="scope">
        <el-button
          type="text"
          v-if="scope.data.state === 0"
          @click="onStateSet(scope.data, 'show')"
        >
          {{ scope.data.title }}
        </el-button>
        <el-button type="text" v-else @click="onStateSet(scope.data, 'show')">
          {{ scope.data.title }}
        </el-button>
      </template>
      <template slot="state_name" slot-scope="scope">
        <span :style="scope.data.state | outType">{{ scope.data.state_name }}</span>
      </template>
      <template slot="operation" slot-scope="scope">
        <el-button
          type="text"
          v-if="
            scope.data.state === 0 ||
            scope.data.state === 6 ||
            (scope.data.state === 3 && scope.data.commit !== 1)
          "
          @click="onStateSet(scope.data)"
        >
          编辑
        </el-button>
        <el-button type="text" v-else @click="openApply(scope.data, 'show')">查看</el-button>
        <el-button
          type="text"
          v-if="scope.data.state === 3 || scope.data.state === 6"
          @click="onStateVoid(scope.data)"
        >
          作废
        </el-button>
        <el-button
          type="text"
          v-if="scope.data.state === 5 || scope.data.state === 0"
          @click="onStateDel(scope.data)"
        >
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
    <custom-setting
      :dialogBool.sync="customSettingVialogVisible"
      :customSettingList="customSettingList"
      :canRendererTableHeader="canRendererTableHeader"
      :customSettingShowList="customSettingShowList"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
    ></custom-setting>
    <draft-dialog
      ref="draftDialog"
      :draftType="draftType"
      :dialogBool.sync="draftDialogShow"
      @on-ok="draftDialogOk"
      @on-save="loadData"
    ></draft-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from './component/sub-req'
import draftDialog from './component/draft-dialog'
import { getUser } from "@/utils/auth";
export default {
  name: "send-document",
  components: {subReq, draftDialog},
  data() {
    return {
      data: [],
      TableHeight: 400,
      customSettingList:[
        {
          id: 1,
          label: "发文标题",
          prop: "title",
          width: "200",
          align: "center",
          signIndex:0,
          sortable:false
        },
        {
          id: 2,
          label: "发文字号",
          prop: "font_number",
          width: "160",
          align: "center",
          signIndex:1,
          sortable:false
        },
        {
          id: 3,
          label: "文件编号",
          prop: "code",
          width: "120",
          align: "center",
          signIndex:2,
          sortable:false
        },
        {
          id: 4,
          label: "状态",
          prop: "state_name",
          width: "120",
          align: "center",
          signIndex:3,
          sortable:false
        },
        {
          id: 5,
          label: "当前审核人",
          prop: "user_names",
          width: "120",
          align: "center",
          signIndex:4,
          sortable:false
        },
        {
          id: 6,
          label: "拟稿人",
          prop: "post_name",
          width: "130",
          align: "center",
          signIndex:5,
          sortable:false
        },
        {
          id: 7,
          label: "发文类型",
          prop: "type_name",
          width: "120",
          align: "center",
          signIndex:6,
          sortable:false
        },
        {
          id: 8,
          label: "缓急程度",
          prop: "degree_name",
          width: "160",
          align: "center",
          signIndex:7,
          sortable:false
        },
        {
          id: 9,
          label: "保密密级",
          prop: "secret_name",
          width: "120",
          align: "center",
          signIndex:8,
          sortable:false
        },
        {
          id: 10,
          label: "发文日期",
          prop: "posy_time",
          width: "150",
          align: "center",
          signIndex:9,
          sortable:false
        },
        {
          id: 11,
          label: "主送单位",
          prop: "main_department_name",
          width: "150",
          align: "center",
          signIndex:10,
          sortable:false
        },
        {
          id: 12,
          label: "主送人员",
          prop: "main_person_names",
          width: "150",
          align: "center",
          signIndex:11,
          sortable:false
        },
        {
          id: 13,
          label: "抄送单位",
          prop: "copy_department_names",
          width: "150",
          align: "center",
          signIndex:12,
          sortable:false
        },
        {
          id: 14,
          label: "抄送人员",
          prop: "copy_person_names",
          width: "150",
          align: "center",
          signIndex:13,
          sortable:false
        },
        {
          id: 15,
          label: "操作",
          prop: "operation",
          width: "150",
          align: "center",
          signIndex:14,
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
      userId: JSON.parse(getUser()).user_id,
      urgeDialogVisible: false,
      urgeForm:{
        flow_id:'',
        content:'',
        send_users:[],
        is_sms: false,
        send_usersname:''
      },
      urgeRules: {
        content: [
          {
            required: true,
            message: "请输入催办内容",
            trigger: "change",
          },
        ],
      },
      draftType: '',
      customSettingVialogVisible: false,
      titlesId:'', //当前表头的id
      menu_code:'',
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.menu_code = this.$route.meta.code + '-1';
      this.reqTitleTable()
      this.setHead('initialize');
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    })
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
  methods: {
    // 删除
    onStateDel(info) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$client.DeleteDocumentMain({context: [info.id]}).then(req => {
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
    // 提交审核
    draftDialogOk(form) {
      this.$client.UpdateStateDocumentMain({context: form}).then(req => {
        this.loadData()
        if (req.head.result === '200') {
          this.$message({
            message: req.head.describle,
            type: 'success'
          });
          this.draftDialogShow = false
        } else {
          this.$message.error(req.head.describle);
        }
      })
    },
    // 审核编辑初始化
    onStateSet(item,type) {
      if(item) {
        setTimeout(() => {
          this.$refs.draftDialog.setData(item)
        }, 300)
      }
      if(type === 'add') {
        setTimeout(() => {
          this.$refs.draftDialog.getDraft()
        }, 100)
      }
      this.draftType = type
      this.draftDialogShow = true
    },
    // 查看
    openApply(val) {
      let detail_id = 30, title = '发文审批'
      this.$router.push({
        path: `/news-details/${val.id}/${title}/${detail_id}`
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
      this.$client.GetByPageDocumentMain(this.form).then(req => {
        this.loading = false
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
.send-document{
  width 100%
  height 100%
}
</style>
