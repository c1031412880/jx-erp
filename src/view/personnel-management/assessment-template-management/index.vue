<template>
  <div class="assessment-template-management">
    <!-- <sub-req
      ref="head"
      @on-add="openAddPage"
      @on-ok="onSubmit"
    ></sub-req> -->
    <sub-req
      ref="head"
      @on-add="openAddPage"
      @on-ok="onSubmit"
    ></sub-req>
    <tr-table
      :selectionShow="false"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :isShowBottomOptions="false"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
    >
      <template slot-scope="scope" slot="operation">
          <el-button type="primary" size="mini" @click="editRowInfo(scope.data)" v-if="$isPowerShow('edit')">编辑</el-button>
          <el-popconfirm
            @confirm="deleteRowInfo(scope.data,scope.index)"
            title="确定删除此条记录吗？"
            v-if="$isPowerShow('del')">
            <el-button slot="reference" type="danger" size="mini">删除</el-button>
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
    >
    </el-pagination>

    <information-dialog
      ref="informationDialog"
      :dialogBool.sync="informationDialogShow"
      :curSelecedType="curSelecedType"
      :informationDialogTitle="informationDialogTitle"
      @save-add-edit="saveAddEdit"
    ></information-dialog>

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
import subReq from "./component/sub-req";
import subReq1 from "./component/sub-req1";
import informationDialog from "./component/information-dialog";
import { getSession, getUser } from "@/utils/auth";
export default {
  name: "assessment-template-managementment",
  components: {
    subReq,
    subReq1,
    informationDialog,
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      form: {},
      data: [],
      loading: false,
      TableHeight: 500,
      informationDialogShow: false,
      customSettingVialogVisible: false,
      curSelecedType: "",
      informationDialogTitle: "添加",
      drawerdialogVisible: false,
      customSettingList: [
        {
          id: 1,
          label: "模板名称",
          prop: "name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "添加时间",
          prop: "created_time",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
        {
          id: 3,
          label: "添加人",
          prop: "created_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "操作",
          prop: "operation",
          width: "140",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
      ],
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
      customSettingShowList: null,
    };
  },
  mounted() {
    this.loadData();
    this.$nextTick(() => {
      this.setHead('initialize');
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
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

    onSubmit(form) {
      this.form = form
      console.log(this.form);
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 数据加载
    loadData() {
      // this.loading = true;
      // let params = Object.assign({}, this.form);
      // params.page_index = this.pageInfo.pageIndex;
      // params.page_size = this.pageInfo.pageSize;
      // this.$client.getSysPositionList(params)
      //   .then(res => {
      //     console.log(JSON.stringify(res));
      //     if (res.head.result == "200") {
      //       this.loading = false;
      //       this.data = res.context.list;
      //       this.pageInfo.pageCount = res.context.total
      //     } else {
      //       this.loading = false;
      //       this.$message({
      //         showClose: true,
      //         message: res.head.describle,
      //         type: "error",
      //       });
      //     }
      //   }).catch(err => {
      //      this.$message({
      //       showClose: true,
      //       message: err.body.message,
      //       type: "error",
      //     });
      //   })
    },
    // 设置默认日期为当天
    setDate() {
      let created_time = '';
      let date = new Date();
      let Y = date.getFullYear()
      let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
      let D = date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()
      let hours = date.getHours() < 10 ? ('0' + date.getHours()) : date.getHours()
      let minutes = date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()
      let seconds = date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds()
      return created_time = Y + '-' + M + '-' + D + ' ' + hours + ':' + minutes + ':' + seconds
    },
    // 编辑、添加
    saveAddEdit(form) {
      let userInfo = JSON.parse(getUser());
      // console.log(userInfo)
      form.created_name = userInfo.user_name
      form.created_time = this.setDate()
      this.data.push(form)
      this.informationDialogShow = false;
      this.pageInfo.pageCount = this.data.length
      this.$message({
        showClose: true,
        message: `${this.curSelecedType == 'add'?'添加成功' :'编辑成功'}`,
        type: "success",
      });
      // let successrMessage = "";
      // let parmas = {
      //   context: form
      // };
      // if (this.curSelecedType == "add") {
      //   delete parmas.context.i_id;
      //   successrMessage = "添加成功";
      // } else {
      //   successrMessage = "编辑成功";
      // }
      // this.$client
      //   .addSysPositionInfo(parmas)
      //   .then((res) => {
      //     if (res.head.result == "200") {
      //       this.loadData();
      //       this.informationDialogShow = false;
      //       this.$message({
      //         showClose: true,
      //         message: successrMessage,
      //         type: "success",
      //       });
      //     } else {
      //       this.$message({
      //         showClose: true,
      //         message: res.head.describle,
      //         type: "error",
      //       });
      //     }
      //   })
      //   .catch((err) => {});
    },
    openAddPage(type) {
      this.curSelecedType = type;
      this.informationDialogTitle = "新增模板";
      this.informationDialogShow = true;
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
    // 编辑
    editRowInfo(form) {
      // console.log(form);
      this.curSelecedType = "edit";
      for (const key in this.$refs.informationDialog.form) {
        if (Object.hasOwnProperty.call(form, key)) {
          this.$refs.informationDialog.form[key]= form[key];

        }
      }
      this.informationDialogTitle = "编辑模板";
      this.informationDialogShow = true;
    },
    // 删除
    deleteRowInfo(info,index) {
      this.data.splice(index, 1)
      this.pageInfo.pageCount = this.data.length
      //  let params = {
      //   context: []
      // };

      // this.$client.deleteSysPositionInfo(params)
      // .then(res => {
      //   if (res.head.result == "200") {
      //     this.loadData();
      //     this.$message({
      //       showClose: true,
      //       message: "删除成功",
      //       type: "success",
      //     });
      //   } else {
      //     this.$message({
      //       showClose: true,
      //       message: res.head.describle,
      //       type: "error",
      //     });
      //   }
      // }).catch(err => {
      //   this.$message({
      //       showClose: true,
      //       message: err.body.message,
      //       type: "error",
      //     });
      // })
    },
    // 计算表格高度 和初始化表头
    setHead(type) {
      if(type == 'initialize') {
        this.canRendererTableHeader = this.customSettingList;
        this.customSettingShowList = this.customSettingList;
      }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        this.TableHeight = maxh - th - 30;
      }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.assessment-template-management {
  width: 100%;
  height: 100%;
}
</style>
