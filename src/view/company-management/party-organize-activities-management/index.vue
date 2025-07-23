<template>
  <div class="party-organize-activities-management">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="党组织活动" name="first">
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
          <!-- <template slot-scope="scope" slot="state">
            <span v-if="!!scope.data.state">{{scope.data.state === 1? '未出租':'已出租'}}</span>
          </template> -->
          <template slot-scope="scope" slot="operation">
              <el-button type="primary" size="mini" @click="editRowInfo(scope.data,'edit')" :disabled="!scope.data.ex_can_edit" v-if="$isPowerShow('edit')">编辑</el-button>
              <el-button type="primary" size="mini" @click="editRowInfo(scope.data, 'detail')">查看</el-button>
              <el-popconfirm
                v-if="$isPowerShow('del')"
                @confirm="deleteRowInfo(scope.data)"
                title="确定删除此条记录吗？">
                <el-button slot="reference" type="danger" size="mini" >删除</el-button>
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
      </el-tab-pane>
      <el-tab-pane label="活动审批" name="second" v-if="false">
        <div style="overflow-y: scroll;" :style="`height:${secondHeight}px`">

          <el-card class="box-card" style="margin-bottom:15px;">
            <div slot="header" class="clearfix">
              <span style="line-height:30px;">活动审批单</span>
              <el-button style="float: right;" type="" size="mini">更多操作</el-button>
              <el-button style="float: right; margin-right:10px;" type="" size="mini">拒绝</el-button>
              <el-button style="float: right; " type="primary" size="mini">同意</el-button>
            </div>
            <div>
              <el-descriptions >
                <el-descriptions-item label="订单编号">18100000000</el-descriptions-item>
                <el-descriptions-item label="当前流程">dsada </el-descriptions-item>
                <!-- <el-descriptions-item label="居住地">苏州市</el-descriptions-item>
                <el-descriptions-item label="备注">
                  <el-tag size="small">学校</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="联系地址">江苏省苏州市吴中区吴中大道 1188 号</el-descriptions-item> -->
              </el-descriptions>
            </div>

          </el-card>

          <el-card class="box-card" style="margin-bottom:15px;">
            <div slot="header" class="clearfix">
              <span style="line-height:30px;">活动详情</span>
            </div>
            <div>
              <el-descriptions >
                <el-descriptions-item label="组织名称">18100000000</el-descriptions-item>
                <el-descriptions-item label="活动属性">dsada </el-descriptions-item>
                <el-descriptions-item label="是否在党群服务中心举办">18100000000</el-descriptions-item>

                <el-descriptions-item label="活动类别">dsada </el-descriptions-item>
                <el-descriptions-item label="活动类型">18100000000</el-descriptions-item>
                <el-descriptions-item label="是否教育培训活动">dsada </el-descriptions-item>

                <el-descriptions-item label="关键词">dsada </el-descriptions-item>
                <el-descriptions-item label="活动名称">18100000000</el-descriptions-item>
                <el-descriptions-item label="是否开放">dsada </el-descriptions-item>

                <el-descriptions-item label="开始时间">dsada </el-descriptions-item>
                <el-descriptions-item label="结束时间">18100000000</el-descriptions-item>
                <el-descriptions-item label="活动地址">dsada </el-descriptions-item>

                <el-descriptions-item label="签到管理员">dsada </el-descriptions-item>
                <el-descriptions-item label="内容">18100000000</el-descriptions-item>
                <el-descriptions-item label="参与对象">dsada </el-descriptions-item>

                <el-descriptions-item label="参与人员">法外狂徒张三、李四、王五 </el-descriptions-item>
                <el-descriptions-item label="图片">
                  <div class="list-data-list show-flex-box-r">
                    <ul class="list-data" v-for="(item,index) in imagesList" :key="index">
                      <li class="item" v-if="item">
                        <image-box :src="item" :id="index+1"></image-box>
                      </li>
                      <!-- <li class="item unchecked" v-else @click="uploadFile()">
                        <i class="el-icon-plus" style="font-size: 60px;font-weight: 600;"></i>
                      </li> -->
                    </ul>
                  </div>
                </el-descriptions-item>

              </el-descriptions>
            </div>

          </el-card>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span style="line-height:30px;">审核流程</span>
            </div>
            <div>

            </div>

          </el-card>
        </div>
      </el-tab-pane>
    </el-tabs>
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
import imageBox from './component/image-box'
export default {
  name: "party-organize-activities-management",
  components: {
    subReq,
    informationDialog,
    imageBox,
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
      activeName: "first",
      loading: false,
      TableHeight: 500,
      secondHeight: 500,
      informationDialogShow: false,
      customSettingVialogVisible: false,
      curSelecedType: "",
      informationDialogTitle: "添加",
      customSettingList: [
        {
          id: 1,
          label: "活动名称",
          prop: "name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "组织名称",
          prop: "ex_organ_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "活动类别",
          prop: "ex_type",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "活动属性",
          prop: "ex_nature",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "状态",
          prop: "ex_state",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "开始时间",
          prop: "start_date",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "结束时间",
          prop: "end_date",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "是否为培训活动",
          prop: "ex_is_px",
          width: "140",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "是否为三会一课",
          prop: "ex_is_shyk",
          width: "140",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "操作",
          prop: "operation",
          width: "240",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
      ],
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
      customSettingShowList: null,
      imagesList:['https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg','https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg','https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg']
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

    handleClick(tab, event) {
      // console.log(tab, event);
      if(tab.name == "second") {
        // this.refreshSecondTableList()
      }else{
        // this.refreshTableList()
        // this.loadData();
      }
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
      this.$client.ListPartyActivity(params)
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
        .AddPartyActivityPartyActivity(parmas)
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
    restTableList() {
      this.form = {};
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
    },
    openAddPage(type) {
      this.curSelecedType = type;
      this.informationDialogTitle = "新增活动";
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
    editRowInfo(form,type) {
      // console.log(form);
      this.curSelecedType = type;
      let newForm = JSON.parse(JSON.stringify(form))
      for (const key in this.$refs.informationDialog.form) {
        if (Object.hasOwnProperty.call(newForm, key)) {
          this.$refs.informationDialog.form[key] = newForm[key];
        }
        if(key == 'ex_files') {
          if(!newForm.ex_files) {
            this.$refs.informationDialog.form.ex_files = []
          }
        }
        if(key == 'ex_pics') {
          if(!newForm.ex_pics) {
            this.$refs.informationDialog.form.ex_pics = []
          }
        }
      }
      setTimeout(() => {
        this.$refs.informationDialog.form.ex_user_ids = '';
        this.$refs.informationDialog.form.ex_user_ids = newForm.ex_user_ids;
      },200)
      this.informationDialogTitle = type == 'edit'?"修改活动":"活动详情";
      this.informationDialogShow = true;
    },
    // 删除
    deleteRowInfo(info) {
       let params = {
        context: [info.id]
      };
      this.$client.BatchDeletePartyActivity(params)
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
        this.TableHeight = maxh - th - 90;
        this.secondHeight = maxh- 60;
      }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.party-organize-activities-management {
  width: 100%;
  height: 100%;
}

.party-organize-activities-management /deep/ .el-tabs__item {
  width: 160px;
  // display flex
  // flex-direction row
  // justify-content center
  text-align: center;
}

.party-organize-activities-management /deep/ .el-tabs__nav-wrap::after {
  // content: "";
  // position: absolute;
  // left: 0;
  // bottom: 0;
  // width: 100%;
  height: 0px;
  // background-color: #E4E7ED;
  // z-index: 1;
}

.list-data-list
  flex-wrap: wrap;
  align-items: center;
  .list-data
    // width: 450px
    overflow: hidden
  .item
    float: left
    width: 100px
    height: 100px
    margin: 5px
  .unchecked
    border-radius: 4px
    border: 2px dashed #606266
    text-align: center
    line-height: 130px
    &:hover
      border-color: #409EFF
      color: #409EFF

</style>
