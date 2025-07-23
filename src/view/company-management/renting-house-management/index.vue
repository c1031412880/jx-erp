<template>
  <div class="renting-house-management">
    <sub-req
      ref="head"
      @on-add="openAddPage"
      @on-ok="onSubmit"
    ></sub-req>
    <tr-table
      :selectionShow="true"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :isShowBottomOptions="false"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
    >
      <template slot-scope="scope" slot="state">
        <span v-if="!!scope.data.state" :style="`color:${scope.data.state === 2?'#F56C6C':'#409EFF'}`">{{scope.data.state === 1? '未出租':'已出租'}}</span>
      </template>
      <template slot-scope="scope" slot="rise_rate">
        <span v-if="!!scope.data.rise_rate || scope.data.rise_rate == 0">{{scope.data.rise_rate}}%</span>
      </template>
      <template slot-scope="scope" slot="operation">
          <el-button type="primary" size="mini" @click="editRowInfo(scope.data)" v-if="$isPowerShow('edit')">编辑</el-button>
          <el-popconfirm
            @confirm="deleteRowInfo(scope.data)"
            title="确定删除此条记录吗？"
            v-if="$isPowerShow('del')">
            <el-button slot="reference" type="danger" size="mini" :disabled="scope.data.state == 2">删除</el-button>
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
      :title="informationDialogTitle"
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
import informationDialog from "./component/information-dialog";
export default {
  name: "renting-house-management",
  components: {
    subReq,
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
      customSettingList: [
        {
          id: 1,
          label: "租房名称",
          prop: "name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "房源状态",
          prop: "state",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "地址",
          prop: "address",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        // {
        //   id: 4,
        //   label: "联系人",
        //   prop: "person_name",
        //   width: "130",
        //   align: "center",
        //   signIndex: 3,
        //   sortable: false,
        // },

        // {
        //   id: 5,
        //   label: "联系电话",
        //   prop: "person_phone",
        //   width: "130",
        //   align: "center",
        //   signIndex: 4,
        //   sortable: false,
        // },
        {
          id: 4,
          label: "租金",
          prop: "hope_rent",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: true,
        },
         {
          id: 5,
          label: "面积/㎡",
          prop: "area",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: true,
        },
        {
          id: 6,
          label: "房源类型",
          prop: "type_name",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },


        {
          id: 7,
          label: "房产证编号",
          prop: "house_no",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "土地证编号",
          prop: "land_no",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: false,
        }
        ,{
          id: 9,
          label: "客户名称",
          prop: "customer_name",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "联系人",
          prop: "customer_person",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "联系人电话",
          prop: "customer_phone",
          width: "130",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
        {
          id: 12,
          label: "合同开始时间",
          prop: "start_date",
          width: "160",
          align: "center",
          signIndex: 11,
          sortable: true,
        },
        {
          id: 13,
          label: "合同结束时间",
          prop: "end_date",
          width: "160",
          align: "center",
          signIndex: 12,
          sortable: true,
        },
        {
          id: 14,
          label: "合同金额",
          prop: "fee",
          width: "130",
          align: "center",
          signIndex: 13,
          sortable: true,
        },
        {
          id: 15,
          label: "合同金额年递增率",
          prop: "rise_rate",
          width: "180",
          align: "center",
          signIndex: 14,
          sortable: true,
        },
      
        // {
        //   id: 8,
        //   label: "出租方式",
        //   prop: "way_name",
        //   width: "130",
        //   align: "center",
        //   signIndex: 7,
        //   sortable: false,
        // },
        // {
        //   id: 9,
        //   label: "面积/㎡",
        //   prop: "area",
        //   width: "130",
        //   align: "center",
        //   signIndex: 8,
        //   sortable: true,
        // },
        // {
        //   id: 10,
        //   label: "看房时间",
        //   prop: "view_time_name",
        //   width: "130",
        //   align: "center",
        //   signIndex: 9,
        //   sortable: false,
        // },
        // {
        //   id: 11,
        //   label: "房间设施",
        //   prop: "facilities",
        //   width: "130",
        //   align: "center",
        //   signIndex: 10,
        //   sortable: false,
        // },
        {
          id: 16,
          label: "操作",
          prop: "operation",
          width: "140",
          align: "center",
          signIndex: 15,
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
      this.loading = true;
      let params = Object.assign({}, this.form);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.getByPageHouse(params)
        .then(res => {
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context.list;
            this.pageInfo.pageCount = res.context.total
          } else {
            this.loading = false;
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
    // 编辑、添加
    saveAddEdit(form) {
      let successrMessage = "";
      let parmas = {
        context: form
      };
      if (this.curSelecedType == "add") {
        delete parmas.context.id;
        successrMessage = "添加成功";
      } else {
        successrMessage = "编辑成功";
      }
      this.$client
        .setRecordHouse(parmas)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadData();
            this.informationDialogShow = false;
            this.$message({
              showClose: true,
              message: successrMessage,
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
    },
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
    },
    openAddPage(type) {
      this.curSelecedType = type;
      this.informationDialogTitle = "新增房源";
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
      let newForm = {...form}
      for (const key in this.$refs.informationDialog.form) {
        if (Object.hasOwnProperty.call(newForm, key)) {
          this.$refs.informationDialog.form[key] = newForm[key];
        }
      }
      this.informationDialogTitle = "修改房源";
      this.informationDialogShow = true;
    },
    // 删除
    deleteRowInfo(info) {
       let params = {
        context: [info.id]
      };
      this.$client.deleteRecordHouse(params)
      .then(res => {
        if (res.head.result == "200") {
          this.loadData();
          this.$message({
            showClose: true,
            message: "删除成功",
            type: "success",
          });
        } else {
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
.renting-house-management {
  width: 100%;
  height: 100%;
}
</style>
