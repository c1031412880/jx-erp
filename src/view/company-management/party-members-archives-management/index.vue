<template>
  <div class="party-organization-management">
    <div class="party-organization-management-content">
      <sub-req ref="head" @on-add="addInfo" @on-ok="onSubmit" @on-export="exportFile"></sub-req>

      <tr-table
        ref="table"
        :selectionShow="true"
        :data="accidentData"
        :tableHeaderList="canRendererTableHeader"
        :TableHeight="TableHeight"
        :loading="loading"
        :frontFixedNum="frontFixedNum"
        :backFixedNum="backFixedNum"
        @on-select-change-row="selectedList"
      >
        <template slot-scope="scope" slot="operation">
          <el-button
            type="primary"
            size="mini"
            @click="editInfo(scope.data, 'edit')"
            v-if="$isPowerShow('edit')"
          >
            编辑
          </el-button>
          <el-button
            type="primary"
            size="mini"
            @click="editInfo(scope.data, 'detail')"
            v-if="$isPowerShow('search')"
          >
            查看
          </el-button>
          <el-popconfirm
            @confirm="deleteCurRowInfo(scope.data)"
            title="是否确删除此条记录？"
            v-if="$isPowerShow('del')"
          >
            <el-button slot="reference" type="danger" size="mini" style="margin-left: 10px">
              删除
            </el-button>
          </el-popconfirm>

          <!-- <el-button type="danger" size="mini" @click="deleteCurRowInfo(scope.data)">删除</el-button> -->
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
    </div>

    <div class="dialog-box">
      <!-- 添加信息 -->
      <add-dialog
        ref="addDialog"
        :dialogBool.sync="addDialogShow"
        :curChangeType="curChangeType"
        :detailLoading="detailLoading"
        @sure-save-info="sureSaveInfo"
      ></add-dialog>
      <!-- 表格自定义组件 -->
      <custom-setting
        :dialogBool.sync="customSettingVialogVisible"
        :customSettingList="customSettingList"
        :canRendererTableHeader="canRendererTableHeader"
        :customSettingShowList="customSettingShowList"
        :frontFixedNum="frontFixedNum"
        :backFixedNum="backFixedNum"
      ></custom-setting>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from './component/sub-req'
import AddDialog from './component/dialog/add-dialog'

export default {
  name: "party-members-archives-management",
  components: {
    subReq,
    AddDialog,
  },
  data() {
    return {
      curChangeType: 'add', //add添加  edit编辑  detail详情
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0
      },
      filedialogVisible: false,
      queryform: {}, //查询表单
      accidentData: [], //列表
      loading: false,
      TableHeight: 500,
      informationDialogShow: false,
      addDialogShow: false, //添加信息
      customSettingVialogVisible: false,
      customSettingList:[
        {
          id: 1,
          label: "姓名",
          prop: "name",
          width: "130",
          align: "center",
          signIndex:0,
          sortable:false
        },
        {
          id: 2,
          label: "身份证号",
          prop: "idcode",
          width: "140",
          align: "center",
          signIndex:1,
          sortable:false
        },
        {
          id: 3,
          label: "手机号",
          prop: "phone",
          width: "160",
          align: "center",
          signIndex:2,
          sortable:false
        },
        {
          id: 4,
          label: "性别",
          prop: "sex",
          width: "120",
          align: "center",
          signIndex:3,
          sortable:false
        },
        {
          id: 5,
          label: "人员类别",
          prop: "ex_type",
          width: "145",
          align: "center",
          signIndex:4,
          sortable:false
        },
        {
          id: 6,
          label: "入党时间",
          prop: "join_party",
          width: "120",
          align: "center",
          signIndex:5,
          sortable:false
        },
        {
          id: 7,
          label: "所在党支部",
          prop: "ex_party_branch",
          width: "120",
          align: "center",
          signIndex:6,
          sortable:false
        },
        {
          id: 8,
          label: "操作",
          prop: "operation",
          width: "220",
          align: "center",
          signIndex:7,
          sortable:false
        }
      ],
      frontFixedNum:2, //前几行固定
      backFixedNum:1, //后几行固定
      canRendererTableHeader: null,
      customSettingShowList: null,
      detailLoading: false,
      curSelectedId: '', // 当前选中的ID
      selectedIds:[], //勾选的ID
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead('initialize')
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    })
  },
  methods: {
    // 导出Excel
    exportFile(){
      let params = Object.assign({},this.queryform);
      let ids = [ ...this.selectedIds ]
      if(ids.length) {
        params.ids = ids.toString()
      }
      this.$client.ExportElectricPartyRecord(params)
      .then(res => {
        if(res.head.result == '200') {
          window.location.href = res.context
          this.$message({type: 'success', message: '导出成功'})
        }else{
          this.$message({type: 'error', message: '导出失败'})
        }
      })
    },
    // 批量删除
    deleteCurRowInfo(row) {
      let parmas = {
        context: [row.id],
      };
      this.$client.BatchDeletePartyRecord(parmas)
      .then(res => {
        if(res.head.result == '200') {
          this.loadData();
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "success",
          });
        }else{
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "success",
          });
        }

      })

    },
    // 添加信息
    addInfo(){
      this.addDialogShow = true
      this.curChangeType = 'add'
      this.$refs['addDialog'].resetData()
    },
    // 更新表格头部
    updateTableHeader(newestTableHeaderList) {

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
      this.$forceUpdate()
    },
    // 打开自定义表格头部弹窗
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
    },
    // 表格上点击编辑、查看 获取详情
    editInfo(val,type){
      this.curChangeType = type;
      this.detailLoading = true;
      setTimeout(() => {
        this.$refs['addDialog'].setData(val)
        this.detailLoading = false;
      }, 100);
      this.addDialogShow = true;
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
    // 查询
    onSubmit(form) {
      this.queryform = form;
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    reqRouterQuery() {
      // this.activeName = this.$route.query.ruleType || 'first';
    },
    // 加载数据
    loadData() {
      this.loading = true
      let params = {};
      params = Object.assign({},this.queryform);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.ListPartyRecord(params)
      .then(res => {
        if (res.head.result == "200") {
          this.accidentData = res.context.list;
          this.pageInfo.pageCount = res.context.total
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        };
        this.loading = false;
      })
    },
    // 编辑、保存信息
    sureSaveInfo(context){
      let params = {
        context: context
      };
      this.$client.AddPartyUserPartyRecord(params)
      .then(res => {
        if(res.head.result == '200') {
          // this.form = {};
          if(this.curChangeType == 'add') {
            this.queryform = {};
            this.pageInfo.pageCount = 0;
            this.pageInfo.pageIndex = 1;
            this.$refs.head.Reset();
          }else{
            this.loadData();
          }
          this.addDialogShow = false;
          this.$message({
            showClose: true,
            type: 'success',
            message: '保存成功'
          })
        }else{
          this.$message({
            showClose: true,
            type: "error",
            message: res.head.describle
          })
        }
      })
    },
    // 勾选中的
    selectedList(list) {
      this.selectedIds = [];
      if(list && list.length > 0) {
        list.forEach((item,index) => {
          this.selectedIds.push(item.id)
        });
      }
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
        let paginationH = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - th - paginationH;
        // console.log(this.TableHeight)
      }, 60)
    }
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.party-organization-management
  width 100%
  height 100%
</style>
