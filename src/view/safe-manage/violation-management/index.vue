<template>
  <div class="accident-manage">
    <div class="accident-manage-content">
      <sub-req
        ref="head"
        @on-add="addInfo"
        @on-ok="onSubmit"
        @on-export="exportFile"
        @on-setting="operatorSetting"
        @on-delete="onDelete"
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
        @on-select-change-row="selectedList"
      >
        <template slot-scope="scope" slot="order_state">
          <span :style="{ color: getStateColor(scope.data.i_order_state) }">{{scope.data.order_state}}</span>
        </template>
        <template slot-scope="scope" slot="operation">
          <el-button type="text" size="mini" @click="editInfo(scope.data, 'detail')" v-if="$isPowerShow('detail')">查看</el-button>
          <el-button type="text" size="mini" @click="editInfo(scope.data, 'edit')" v-if="$isPowerShow('edit') && scope.data.i_order_state !== 3">编辑</el-button>
          <el-button type="text" size="mini" @click="editInfo(scope.data, 'handle')" v-if="scope.data.i_order_state == 2 && scope.data.i_person_ids.includes(user_id)">办结</el-button>
          <el-popconfirm v-if="$isPowerShow('del')" @confirm="deleteCurRowInfo(scope.data)" title="是否确删除此条记录？">
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
      <!-- 设置经办人 -->
      <operator-setting-dialog
        ref="operatorSettingDialog"
        :dialogBool.sync="operatorSettingDialogShow"
      ></operator-setting-dialog>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import informationDialog from "./component/information-dialog";
import operatorSettingDialog from "./component/operator-setting-dialog";
import {getDate} from '@/utils/index'
import { getUser } from '@/utils/auth';
export default {
  name: "lost-find",
  components: {
    subReq,
    informationDialog,
    operatorSettingDialog,
  },
  data() {
    return {
      curChangeType: "add", //add添加  edit编辑  detail详情
      user_id: Number(JSON.parse(getUser()).user_id),
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
      selectedIds:[], //勾选中的ID
      informationDialogShow: false, //添加信息
      operatorSettingDialogShow: false,//物品类别设置
      customSettingVialogVisible: false,
      customSettingList: [
        {
          id: 1,
          label: "状态",
          prop: "order_state",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false
        },
        {
          id: 2,
          label: "车牌号(自编号)",
          prop: "lincense_plate_number",
          width: "150",
          align: "center",
          signIndex: 1,
          sortable: false
        },
        {
          id: 3,
          label: "所属组织",
          prop: "department_name",
          width: "145",
          align: "center",
          signIndex: 2,
          sortable: false
        },
        {
          id: 4,
          label: "线路",
          prop: "line",
          width: "120",
          align: "center",
          signIndex: 3,
          sortable: false
        },
        {
          id: 5,
          label: "违章时间",
          prop: "d_violation_date",
          width: "160",
          align: "center",
          signIndex: 4,
          sortable: false
        },
        {
          id: 6,
          label: "违章驾驶员",
          prop: "driver_name",
          width: "120",
          align: "center",
          signIndex: 5,
          sortable: false
        },
        {
          id: 7,
          label: "违章地点",
          prop: "c_place",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false
        },
        {
          id: 8,
          label: "违章项目",
          prop: "violation_name",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: false
        },
        {
          id: 9,
          label: "违章扣分",
          prop: "score",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false
        },
        {
          id: 10,
          label: "违章罚款",
          prop: "money",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: false
        },
        {
          id: 11,
          label: "交警处理结果",
          prop: "state",
          width: "160",
          align: "center",
          signIndex: 10,
          sortable: false
        },
        {
          id: 12,
          label: "备注",
          prop: "c_remark",
          width: "130",
          align: "center",
          signIndex: 10,
          sortable: false
        },
        {
          id: 13,
          label: "教育时间",
          prop: "educate_time",
          width: "160",
          align: "center",
          signIndex: 12,
          sortable: false
        },
        {
          id: 14,
          label: "教育地点",
          prop: "c_educate_address",
          width: "160",
          align: "center",
          signIndex: 13,
          sortable: false
        },
        {
          id: 15,
          label: "教育人",
          prop: "educate_user_name",
          width: "160",
          align: "center",
          signIndex: 14,
          sortable: false
        },
        {
          id: 16,
          label: "记录人",
          prop: "record_user_name",
          width: "130",
          align: "center",
          signIndex: 15,
          sortable: false
        },
        {
          id: 17,
          label: "操作",
          prop: "operation",
          width: "190",
          align: "center",
          signIndex: 16,
          sortable: false
        }
      ],
      frontFixedNum: 0, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
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
      this.$client.exportViolationManage(params).then(res => {
        if (res.head.result == "200") {
          window.location.href = res.context;
          this.$message({ type: "success", message: "导出成功" });
        } else {
          this.$message({ type: "error", message: "导出失败" });
        }
      });
    },
    // 添加信息
    addInfo() {
      this.curChangeType = "add";
      this.informationDialogShow = true;
    },
    editInfo(form,type) {
      this.curChangeType = type;
      this.informationDialogShow = true;
      this.$nextTick(() =>{
        this.$refs.informationDialog.setData(form)
      }) 
    },
    // 删除
    deleteCurRowInfo(row) {
      this.selectedIds = [row.i_id]
      this.onDelete()
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
      this.$client.getListViolationManage(params).then(res => {
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
    // 编辑、添加
    saveAddEdit(form) {
      let params = {
        context: form
      };
      if (this.curChangeType == "add") {
        delete params.context.id;
        this.$client
        .addViolationManageInfo(params)
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
        .EditViolationManage(params)
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
    // 勾选中的
    selectedList(list) {
      this.selectedIds = [];
      if(list && list.length > 0) {
        list.forEach((item,index) => {
          this.selectedIds.push(item.i_id)
        });
      }
      console.log(this.selectedIds)
    },
    // 批量删除
    onDelete() {
      if(this.selectedIds.length == 0) {
        this.$message({
          showClose: true,
          message: '请勾选至少一条要删除的数据',
          type: "warning",
        });
        return
      }
      let parmas = {
        context: this.selectedIds,
      };
      this.$client.batchDeleteViolationManage(parmas)
      .then(res => {
        if(res.head.result == '200') {
          this.selectedIds = [];
          // // 清除勾选
          // this.$refs.table.handleSelectionChange([]);
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
    //经办人设置
    operatorSetting(){
      this.operatorSettingDialogShow = true;
    },
    getStateColor(state) {
      switch (state) {
        case 1:
          return '#0000bf';
        case 2:
          return '#f59a23';
        case 3:
          return '#95f204';
        default:
          return 'black';
      }
    },
    // 计算表格高度
    setHead(type) {
      if(type == 'initialize') {
        this.canRendererTableHeader = this.customSettingList;
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
