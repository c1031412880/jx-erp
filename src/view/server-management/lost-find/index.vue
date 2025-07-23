<template>
  <div class="accident-manage">
    <div class="accident-manage-content">
      <sub-req
        ref="head"
        @on-add="addInfo"
        @on-ok="onSubmit"
        @on-export="exportFile"
        @on-import="importExcel"
        @on-setting="goodsTypeSetting"
        @on-publish="publishOrUnpublishList"
        @on-unpublish="publishOrUnpublishList"
      ></sub-req>

      <tr-table
        ref="table"
        :selectionShow="true"
        :data="data"
        :tableHeaderList="canRendererTableHeader"
        :TableHeight="TableHeight"
        :loading="loading"
        :frontFixedNum="frontFixedNum"
        :backFixedNum="backFixedNum"
        @on-select-change-row="selectedRowList"
      >
        <template slot-scope="scope" slot="state_name">
          <span :style="{ color: getStateColor(scope.data.state) }">{{scope.data.state_name}}</span>
        </template>
        <template slot-scope="scope" slot="publish_state_name">
          <span :style="{ color: scope.data.publish_state == 1 ? '#95f204' : '#999999' }">{{scope.data.publish_state_name}}</span>
        </template>
        <template slot-scope="scope" slot="operation">
          <el-button type="text" size="mini" @click="editInfo(scope.data, 'detail')" v-if="$isPowerShow('detail')">查看</el-button>
          <el-button type="text" size="mini" @click="editInfo(scope.data, 'edit')" v-if="$isPowerShow('edit') && scope.data.state !== 2">编辑</el-button>
          <el-button type="text" size="mini" @click="claimInfo(scope.data)" v-if="$isPowerShow('edit') && scope.data.state == 1">认领</el-button>
          <el-popconfirm v-if="$isPowerShow('del')" @confirm="deleteCurRowInfo(scope.data)" title="是否确认删除此条记录？">
            <el-button slot="reference" type="text" size="mini" style="margin-left: 10px;">删除</el-button>
          </el-popconfirm>
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
      ></el-pagination>
    </div>

    <div class="dialog-box">
      <!-- 添加信息 -->
      <information-dialog
        ref="informationDialog"
        :dialogBool.sync="informationDialogShow"
        :curChangeType="curChangeType"
        @save-add-edit="saveAddEdit"
      ></information-dialog>
      <!-- 设置物品分类 -->
      <good-classify-dialog
        ref="goodClassfyDialog"
        :dialogBool.sync="goodClassfyDialogShow"
        @save="saveGoodType"
      ></good-classify-dialog>
      <!-- 物品认领 -->
      <claim-dialog
        ref="claimDialog"
        :dialogBool.sync="claimDialogShow"
        @save="RlSub"
      ></claim-dialog>
      <!-- 上传文件 导出文件弹窗组件 -->
      <file-dialog
        :dialogBool.sync="fileDialogVisible"
        :fileData="FileData"
        :typeMessage="'相同日期线路车辆记录'"
        @on-submit-excel="importICExcel"
      ></file-dialog>
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
import subReq from "./component/sub-req";
import informationDialog from "./component/information-dialog";
import goodClassifyDialog from "./component/good-classify-dialog";
import claimDialog from "./component/claim-dialog";
import {getDate} from '@/utils/index'
import fileDialog from "@/components/fileDialog/file-dialog";
export default {
  name: "lost-find",
  components: {
    subReq,
    informationDialog,
    goodClassifyDialog,
    claimDialog,
    fileDialog
  },
  data() {
    return {
      curChangeType: "add", //add添加  edit编辑  detail详情
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0
      },
      filedialogVisible: false,
      queryform: {}, //查询表单
      data: [], //列表
      loading: false,
      TableHeight: 500,
      informationDialogShow: false, //添加信息
      goodClassfyDialogShow: false,//物品类别设置
      claimDialogShow: false,//物品认领
      fileDialogVisible: false,
      FileData: {
        url: `${window.newHttpConfig.URL_EASYMOCK}/Files/TempFiles/失物招领模板.xlsx`,
      },
      customSettingVialogVisible: false,
      customSettingList: [
        {
          id: 1,
          label: "状态",
          prop: "state_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false
        },
        {
          id: 2,
          label: "发布状态",
          prop: "publish_state_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false
        },
        {
          id: 3,
          label: "车牌号(自编号)",
          prop: "self_id",
          width: "150",
          align: "center",
          signIndex: 2,
          sortable: false
        },
        {
          id: 4,
          label: "所属组织",
          prop: "dept",
          width: "145",
          align: "center",
          signIndex: 3,
          sortable: false
        },
        {
          id: 5,
          label: "线路",
          prop: "line",
          width: "120",
          align: "center",
          signIndex: 4,
          sortable: false
        },
        {
          id: 6,
          label: "驾驶员",
          prop: "driver",
          width: "120",
          align: "center",
          signIndex: 5,
          sortable: false
        },
        {
          id: 7,
          label: "物品名称",
          prop: "good_name",
          width: "150",
          align: "center",
          signIndex: 6,
          sortable: false
        },
        {
          id: 8,
          label: "物品类别",
          prop: "lost_type_name",
          width: "150",
          align: "center",
          signIndex: 7,
          sortable: false
        },
        {
          id: 9,
          label: "拾取时间",
          prop: "lost_time",
          width: "160",
          align: "center",
          signIndex: 8,
          sortable: false
        },
        {
          id: 10,
          label: "物品有效期",
          prop: "expiry_date",
          width: "160",
          align: "center",
          signIndex: 9,
          sortable: false
        },
        {
          id: 11,
          label: "上交人员",
          prop: "handle_user_name",
          width: "130",
          align: "center",
          signIndex: 10,
          sortable: false
        },
        {
          id: 12,
          label: "签收人员",
          prop: "receive_user",
          width: "130",
          align: "center",
          signIndex: 11,
          sortable: false
        },
        {
          id: 13,
          label: "备注",
          prop: "remark",
          width: "130",
          align: "center",
          signIndex: 12,
          sortable: false
        },
        {
          id: 14,
          label: "领取人姓名",
          prop: "take_name",
          width: "130",
          align: "center",
          signIndex: 13,
          sortable: false
        },
        {
          id: 15,
          label: "联系电话",
          prop: "phone",
          width: "130",
          align: "center",
          signIndex: 14,
          sortable: false
        },
        {
          id: 16,
          label: "身份证号",
          prop: "id_no",
          width: "160",
          align: "center",
          signIndex: 15,
          sortable: false
        },
        {
          id: 17,
          label: "认领时间",
          prop: "take_time",
          width: "130",
          align: "center",
          signIndex: 16,
          sortable: false
        },
        {
          id: 18,
          label: "经办人",
          prop: "operator_user_name",
          width: "130",
          align: "center",
          signIndex: 17,
          sortable: false
        },
        {
          id: 19,
          label: "办理时间",
          prop: "operator_time",
          width: "160",
          align: "center",
          signIndex: 18,
          sortable: false
        },
        {
          id: 20,
          label: "操作",
          prop: "operation",
          width: "190",
          align: "center",
          signIndex: 19,
          sortable: false
        }
      ],
      frontFixedNum: 0, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
      customSettingShowList: null,
      publishIds: [],
      unpublishIds: []
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead('initialize')
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
      this.loadData();
    });
  },
  methods: {
    // 导出Excel
    exportFile() {
      let params = {
        context:Object.assign({}, this.queryform)
      };
      params.context.page_index = this.pageInfo.pageIndex;
      params.context.page_size = this.pageInfo.pageSize;
      this.$client.exportLostArticle(params).then(res => {
        if (res.head.result == "200") {
          window.location.href = res.context;
          this.$message({ type: "success", message: "导出成功" });
        } else {
          this.$message({ type: "error", message: "导出失败" });
        }
      });
    },
    importExcel() {
      this.fileDialogVisible = true;
    },
    // 导入信息Excel
    importICExcel(val) {
      let formData = new FormData();
      formData.append("file", val.file);
      let params = formData;
      this.$client.importLostArticle(params).then((res) => {
        if (res.head.result == "200") {
          this.form = {};
          // 重置信息
          this.$refs.head.Reset();
          this.loadData();
          this.fileDialogVisible = false;
          this.$message({ message: res.head.describle, type: "success" });
        } else {
          this.fileDialogVisible = false;
          let errorData = [];
          const h = this.$createElement;
          errorData.push(h("p", null, res.head.describle));
          this.$msgbox({
            title: "提示",
            message: h("div", null, errorData),
            confirmButtonText: "确定",
          });
        }
      });
    },
    // 添加信息
    addInfo() {
      this.curChangeType = "add";
      this.informationDialogShow = true;
    },
    // 更新表格头部
    updateTableHeader(newestTableHeaderList) {
      this.canRendererTableHeader = null;
      this.customSettingShowList = null;
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
      this.$forceUpdate();
    },
    // 打开自定义表格头部弹窗
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
    },
    // 认领
    claimInfo(val) {
      this.$refs.claimDialog.form.id = val.id
      this.claimDialogShow = true;
    },
    editInfo(form,type) {
      this.curChangeType = type;
      this.$refs.informationDialog.setData(form)
      this.informationDialogShow = true;
    },
    // 删除
    deleteCurRowInfo(row) {
      let params = {
        context:{
          id:row.id
        }
      }
      this.$client.DeleteLostArticle(params).then(res => {
        if (res.head.result == "200") {
          this.loadData();
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "success"
          });
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "success"
          });
        }
      });
    },
    // 分页切换事件
    handleCurrentChange(idx) {
      this.pageInfo.pageIndex = idx;
      this.loadData();
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
    // 加载数据
    loadData() {
      this.loading = true;
      let params = {
        context:Object.assign({}, this.queryform)
      };
      params.context.page_index = this.pageInfo.pageIndex;
      params.context.page_size = this.pageInfo.pageSize;
      this.$client.getListLostArticle(params).then(res => {
        if (res.head.result == "200") {
          this.data = res.context.list;
          this.pageInfo.pageCount = res.context.total;
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error"
          });
        }
        this.loading = false;
      });
    },
    //保存物品类别设置 刷新head的类别数据
    saveGoodType(){
      this.$refs.head.loadTypeData()
      this.goodClassfyDialogShow = false
    },
    // 编辑、添加
    saveAddEdit(form) {
      let params = {
        context: form
      };
      if (this.curChangeType == "add") {
        delete params.context.id;
        this.$client
        .addLostArticle(params)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadData();
            this.informationDialogShow = false;
            this.$message({
              showClose: true,
              message: "添加成功",
              type: "success",
            });
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
       .catch((err) => {});
      } else {
        this.$client
        .editLostArticle(params)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadData();
            this.informationDialogShow = false;
            this.$message({
              showClose: true,
              message: "编辑成功",
              type: "success",
            });
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
       .catch((err) => {});
      }
      
    },
    //物品类别设置
    goodsTypeSetting(){
      this.goodClassfyDialogShow = true;
    },
    // 认领提交
    RlSub(form) {
      let params = {
        context: form
      }
      this.$client.lostClaimLostArticle(params).then(req => {
        this.loadData()
        if (req.head.result === "200") {
          this.loadData();
          this.claimDialogShow = false;
          this.$message({type: 'success', message: req.head.describle, showClose: true})
        } else {
          this.$message({type: 'error', message: req.head.describle, showClose: true})
        }
      })
    },
    getStateColor(state) {
      switch (state) {
        case 1:
          return '#0000bf';
        case 2:
          return '#95f204';
        case 4:
          return '#d9001b';
        default:
          return 'black';
      }
    },
    // 列表勾选
    selectedRowList(list) {
      this.publishIds = []
      this.unpublishIds = []
      if (list && list.length > 0) {
        list.forEach((item, index) => {
          if(!item.publish_state) {
            this.publishIds.push(item.id)  
          }else {
            this.unpublishIds.push(item.id)  
          }
        })
      }
    },
    publishOrUnpublishList(com) {
      // 判断是否勾选
      if(this.publishIds.length == 0 && com == 'publish') {
        this.$message({type: 'warning', message: '请先勾选要发布的记录', showClose: true})
        return
      }
      if(this.unpublishIds.length == 0 && com == 'unpublish') {
        this.$message({type: 'warning', message: '请先勾选要取消发布的记录', showClose: true})
        return
      }
      let params = {
        context: {
          ids: com == 'publish' ? this.publishIds : this.unpublishIds,
          publish_state: com == 'publish' ? 1 : 0
        }
      }
      this.$client.BatchUpdatePublishState(params).then(req => {
        if (req.head.result === "200") {
          this.loadData()
          this.$message({type: 'success', message: req.head.describle, showClose: true})
        } else {
          this.$message({type: 'error', message: req.head.describle, showClose: true})
        }
      })
    },
    // 计算表格高度
    setHead(type) {
      if(type == 'initialize') {
        this.canRendererTableHeader = this.customSettingList;
        this.customSettingShowList = this.customSettingList;
      }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        let paginationH = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - th - paginationH;
      }, 60);
    }
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.accident-manage {
  width: 100%;
  height: 100%;
}

</style>
