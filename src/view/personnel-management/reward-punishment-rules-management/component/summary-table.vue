<template>
  <div class="table-compontent">
    <el-table
      :data="data"
      :height="TabelHeight"
      border
      ref="multipleTable"
      :header-cell-style="{background:'#E0F3FF',color:'#333333',fontSize:'16px',padding: '4px 0px',fontWeight: '800'}"
      :cell-style="{fontSize: '13px', padding: '4px 0px'}"
      v-loading="loading"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" fixed> </el-table-column>
      <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
      <el-table-column
        prop="type_name"
        label="所属类别"
        align="center"
        min-width="180"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        min-width="220"
        prop="title"
        align="center"
        label="奖惩情形"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        min-width="220"
        prop="pact"
        align="center"
        label="关联条约"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        min-width="130"
        prop="str_kinds"
        align="center"
        label="关联奖惩种类"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column min-width="160" prop="up_f_station" align="center" label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="editDetail(scope.row)" v-if="$isPowerShow('edit')"
            style="margin-right:10px">编辑</el-button
          >
            <el-popconfirm
              @confirm="deleteMileageInfo(scope.row)"
              title="确定要删除此条记录？"
              v-if="$isPowerShow('del')">
              <el-button slot="reference" type="danger" size="mini">删除</el-button>
            </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 10,
        pageCount: 0,
      },
      pageDetailInfo: {
        pageIndex: 1,
        pageSize: 10,
        pageCount: 0,
      },
      isShowDialog: false,
      subForm: {},
      detailDataTotal: [],
      detailDataList: [],
      detailLoading: false,
      singleRowInfo: null,
      exportloading: false,
    };
  },
  props: {
    data: {
      type: Array,
      default: null,
    },
    TabelHeight: {
      type: Number,
      default: 0,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    activeName:[String]
  },
  methods: {
    handleCurrentChange(idx) {
      this.pageDetailInfo.pageIndex = idx;
      // this.checkDetail()
      this.detailDataList = this.detailDataTotal.slice(
        (idx - 1) * this.pageDetailInfo.pageSize,
        idx * this.pageDetailInfo.pageSize
      );
    },

    editDetail: function (row) {
      this.$emit("edit-detail",row)
    },

    deleteMileageInfo(row) {
      this.$emit("delete-mileage-info",row)
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.$emit('selected-mile-detail-list',this.multipleSelection)
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    checkDetail: function (row) {},


    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
  },
  watch: {
    activeName() {
      this.$refs.multipleTable.doLayout()
    },
  },
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.table-compontent /deep/ .el-table td, .el-table th {
  font-size: 13px;
  padding: 4px 0;
}
</style>
