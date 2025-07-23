<template>
  <div class="water-management-box">
    <sub-req
      ref="head"
      @on-add="openAddPage"
      @on-ok="onSubmit"
    ></sub-req>
    <div class="show-box">
      <span>已选宣传审批单：</span>
      <div class="title-tag">
        <el-tag closable style="margin: 0 5px" size="mini" effect="dark" type="success" v-for="item in selectedList" :key="item.id">{{item.advert_title}}</el-tag>
      </div>
    </div>
    <tr-table
      ref="table"
      :selectionShow="true"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :isShowBottomOptions="false"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      :reserveSelect="true"
      @on-select-change-row="selectedUserList"
    >
    </tr-table>
    <!-- <el-pagination
        style="margin: 5px 0;display:flex; justify-content: flex-end;"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        ref="paginationH"
        :current-page="pageInfo.pageIndex"
        :page-sizes="[10, 20, 30, 40, 50,]"
        :page-size="pageInfo.pageSize"
        layout="total,sizes, prev, pager, next, jumper"
        :total="pageInfo.pageCount"
      >
      </el-pagination> -->
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./sub-req";
export default {
  name: "assessment-template",
  components: {
    subReq,
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 50,
        pageCount: 0,
      },
      data:[], //列表
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: [
        {
          id: 1,
          label: "经办人",
          prop: "user_name",
          width: "100",
          align: "center",
          signIndex: 0,
        },
        {
          id: 2,
          label: "申请部门",
          prop: "dept_name",
          width: "100",
          align: "center",
          signIndex: 1,
        },
        {
          id: 3,
          label: "日期",
          prop: "date",
          width: "100",
          align: "center",
          signIndex: 2,
        },
        {
          id: 4,
          label: "作者(文)",
          prop: "author_article_name",
          width: "100",
          align: "center",
          signIndex: 3,
        },
        {
          id: 5,
          label: "作者(摄)",
          prop: "author_photo_name",
          width: "100",
          align: "center",
          signIndex: 4,
        },
        {
          id: 6,
          label: "信息标题",
          prop: "advert_title",
          width: "200",
          align: "center",
          signIndex: 5,
        },
        {
          id: 7,
          label: "信息内容",
          prop: "content",
          width: "200",
          align: "center",
          signIndex: 6,
        },
        {
          id: 8,
          label: "关联次数",
          prop: "relation_count",
          width: "130",
          align: "center",
          signIndex: 7,
        },
      ],
      loading: false,
      TableHeight:500,

      form:{}, //查询表单数据

      selectedList: []
    };
  },
  mounted() {
    this.setHead()
  },
  methods: {
    // 计算高吨
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight
        this.TableHeight = maxh - 85 -th;
      }, 60);
    },
    
    // 获取列表
    loadData() {
      this.loading = true;
      let params = Object.assign({},params,this.form)
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      params.state = 2
      this.$client.GetByPageAdvertInfo({context:params})
      .then(res => {
        // console.log(JSON.stringify(res))
        if (res.head.result == "200") {
          this.data = res.context
          // 总分类下需要分页
          this.pageInfo.pageCount = res.context.total
          this.loading = false;
          } else {
            this.loading = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
      }).catch(err => {
          this.loading = false;
      })
    },
    // 查询
    onSubmit(form) {
      this.form = form;
      console.log(this.form);
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 头部事件抛出
    openAddPage(type) {
      switch (type) {
        case "save":
          this.onSave()
          break;
        case "close": 
          this.onClose()
          break;
      }
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
    // 选中表格勾选框
    selectedUserList(projectList) {
      this.selectedList = projectList
    },
    //去重
    unique(arr) {
      let map = new Map();
      for (let item of arr) {
        map.set(item.id, item);
      }
      return [...map.values()];
    },
    // 清空勾选
    clearData() {
      this.selectedList = []
      this.$refs.table.handleSelectionChange([])
    },
    // 提交勾选物资
    onSave() {
      this.$emit('on-save',this.selectedList)
      this.clearData()
    },
    onClose() {
      this.$emit("on-close");
      this.clearData()
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.water-management-box{
  width: 100%;
  height: 100%;

  .show-box {
    width: 100%;
    height: 20px;
    display: flex;
    margin-bottom: 10px;
    align-items: center
    .title-tag {
      flex: 1; 
      overflow: hidden;
      height: 20px;
    }
  }
}
</style>
