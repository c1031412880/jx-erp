<template>
  <div class="emergency-command-information">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane el-tab-pane label="应急指挥消息" name="first" :disabled="loading">
         <sub-req
          ref="head"
          @on-ok="onSubmit"
          @on-del="bacthDelete"
        ></sub-req>
        <tr-table
          ref="trTable"
          :selectionShow="true"
          :data="dataMap[this.activeName]"
          :tableHeaderList="canRendererTableHeader"
          :TableHeight="TableHeight"
          :loading="loading"
          :frontFixedNum="frontFixedNum"
          :backFixedNum="backFixedNum"
          @on-select-change-row="selectChange"
        > 
          <template slot-scope="scope" slot="ex_state">
            <div class="show-flex-box-r show-flex-center" style="align-items: center;">
              <em style="width: 8px;height: 8px;margin-right: 3px;border-radius: 50%;" :style="`${scope.data.state == 2?'background: #4BD863':'background:#D9001B'}`"></em>
              <span>{{scope.data.ex_state}}</span>
            </div>
          </template>
          <template slot-scope="scope" slot="operation">
           <el-button type="primary" size="mini" @click="examineDialogShow(scope.data)">查看</el-button>
          </template>
        </tr-table>
        <el-pagination
          style="margin: 5px 0;display:flex; justify-content: flex-end;"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          ref="paginationH"
          :current-page="pageInfoMap[this.activeName].pageIndex"
          :page-sizes="[10, 20, 30, 40, 50, 100]"
          :page-size="pageInfoMap[this.activeName].pageSize"
          layout="total,sizes, prev, pager, next, jumper"
          :total="pageInfoMap[this.activeName].pageCount"
        >
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="应急预案消息" name="second" :disabled="loading">
        <second-sub-req
          ref="secondHead"
          :activeName="activeName"
          @on-ok="onSubmit"
          @on-del="bacthDelete"
        ></second-sub-req>
        <tr-table
          :selectionShow="true"
          :data="dataMap[this.activeName]"
          :tableHeaderList="secondCanRendererTableHeader"
          :TableHeight="TableHeight"
          :loading="loading"
          :frontFixedNum="frontFixedNum"
          :backFixedNum="backFixedNum"
          @on-select-change-row="selectChange"
        >
          <template slot-scope="scope" slot="ex_state">
            <div class="show-flex-box-r show-flex-center" style="align-items: center;">
              <em style="width: 8px;height: 8px;margin-right: 3px;border-radius: 50%;" :style="`${scope.data.state == 2?'background: #4BD863':'background:#D9001B'}`"></em>
              <span>{{scope.data.ex_state}}</span>
            </div>
          </template>
          <template slot-scope="scope" slot="operation">
            <el-button type="primary" size="mini" @click="examineDialogShow(scope.data)">查看</el-button>
          </template>
        </tr-table>
        <el-pagination
          style="margin: 5px 0;display:flex; justify-content: flex-end;"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          ref="paginationH"
          :current-page="pageInfoMap[this.activeName].pageIndex"
          :page-sizes="[10, 20, 30, 40, 50, 100]"
          :page-size="pageInfoMap[this.activeName].pageSize"
          layout="total,sizes, prev, pager, next, jumper"
          :total="pageInfoMap[this.activeName].pageCount"
        >
        </el-pagination>
      </el-tab-pane>
    </el-tabs>

    <info-detail
      :dialogBool.sync="infoDetailDialog"
      ref="infoDetail"
      :model="model"
    ></info-detail>
    
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import secondSubReq from "./component/second-sub-req";

import infoDetail from './component/info-detail'
export default {
  name: "emergency-command-information",
  components: {
    subReq,
    secondSubReq,
    infoDetail
  },
  data() {
    return {
      activeName: 'first',
      selectList: [],
      form: {
        'first': {},
        'second': {}
      },
      dataMap:{
        'first': [],
        'second': []
      },
      pageInfoMap:{
        'first': {
          pageIndex: 1,
          pageSize: 20,
          pageCount: 0,
        },
        'second': {
          pageIndex: 1,
          pageSize: 20,
          pageCount: 0,
        }
      },
      loading: false,
      TableHeight: 500,
      informationDialogTitle: "添加",
      customSettingList: [
        {
          id: 1,
          label: "信息名称",
          prop: "title",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "编制单位",
          prop: "dept_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "发布时间",
          prop: "created_date",
          width: "160",
          align: "center",
          signIndex: 2,
          sortable: true,
        },
        {
          id: 4,
          label: "消息内容",
          prop: "content",
          width: "150",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "编写人",
          prop: "write_user_name",
          width: "150",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        
        {
          id: 6,
          label: "是否已读",
          prop: "ex_state",
          width: "110",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "操作",
          prop: "operation",
          width: "110",
          align: "center",
          signIndex: 6,
          sortable: false,
        }
      ],
      frontFixedNum: 2, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
      secondCanRendererTableHeader:[
        {
          id: 1,
          label: "预案名称",
          prop: "title",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "编制单位",
          prop: "dept_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "发布时间",
          prop: "created_date",
          width: "160",
          align: "center",
          signIndex: 2,
          sortable: true,
        },
        {
          id: 4,
          label: "预案内容",
          prop: "content",
          width: "250",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "预案附件",
          prop: "plan_file_name",
          width: "150",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        
        {
          id: 6,
          label: "预案物资",
          prop: "plan_material",
          width: "150",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "预案对应队伍",
          prop: "team_name",
          width: "150",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "预案对应专家",
          prop: "user_name",
          width: "150",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "编写人",
          prop: "write_user_name",
          width: "150",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "是否已读",
          prop: "ex_state",
          width: "110",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "操作",
          prop: "operation",
          width: "110",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
      ],
      infoDetailDialog: false,
      model:''
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead('initialize');
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
    handleClick(tab, event) {
      this.setHead();
      // console.log(tab, event);
      if(tab.name == "second") {
        this.$refs.secondHead.onSubmit()
      }else{
        this.$refs.head.onSubmit()
      }
    },

    onSubmit(form) {
      this.form[this.activeName] = form;
      this.loadData();
    },
    // 数据加载
    loadData() {
      this.loading = true;
      let content = this.form[this.activeName];
      content.page_index = this.pageInfoMap[this.activeName].pageIndex;
      content.page_size = this.pageInfoMap[this.activeName].pageSize;
      this.$client.DsMessageListMessageCenter(content).then(req => {
        this.loading = false;
        if (req.head.result === "200") {
          this.dataMap[this.activeName] = req.context.list;
          this.pageInfoMap[this.activeName].pageCount = req.context.total;
        } else {
          this.dataMap[this.activeName] = [];
        }
      })
    },
    // 分页切换事件
    handleCurrentChange(idx) {
      this.pageInfoMap[this.activeName].pageIndex = idx;
      this.loadData();
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfoMap[this.activeName].pageIndex = 1
      this.pageInfoMap[this.activeName].pageSize = sizes;
      this.pageInfoMap[this.activeName].pageCount = 0;
      this.loadData();
    },
    // 勾选表格
    selectChange(list) {
      this.selectList = list
    },
    // 查看
    examineDialogShow(info) {
      let parmas = {
        context:[info.id]
      }
      this.$client.ReadMessageMessageCenter(parmas).then(res => {
        if (res.head.result == "200") {
          this.loadData();
          this.infoDetailDialog = true
          this.model = info.model
          this.$refs.infoDetail.form = info
          
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "success"
          });
        }
      });
      //   this.$router.push({
      //   path: `/news-details/${info.id}/${info.model == 10003?'应急指挥消息':'应急预案消息'}/${info.model}`,
      //   params: {id: info.id, model: info.model}
      // })
    },

    // 删除
    bacthDelete(item) {
      if(!this.selectList.length) {
        this.$message({
          showClose: true,
          message: '请勾选至少一条要移除的',
          type: "warning"
        });
        return
      }
      let parmas = {
        context: this.selectList.map(item => item.id)
      };
      this.$client.DeleteMessageMessageCenter(parmas).then(res => {
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

    // 计算表格高度 和初始化表头
    setHead(type) {
      if(type == 'initialize') {
        this.canRendererTableHeader = this.customSettingList;
      }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = 0
        if(this.activeName == 'first') {
           th = this.$refs.head.$el.offsetHeight;
        }
        if(this.activeName == 'second') {
          th = this.$refs.secondHead.$el.offsetHeight;
        }
        this.TableHeight = maxh - th  - 60 -30; 
      }, 60);
    },
  },
  watch:{
    activeName() {
      this.selectList = []
    },
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.emergency-command-information {
  width: 100%;
  height: 100%;
}

.emergency-command-information /deep/ .el-tabs__item {
  width: 160px;
  text-align: center;
}

.emergency-command-information /deep/ .el-tabs__nav-wrap::after {
  height: 0px;
}

</style>
