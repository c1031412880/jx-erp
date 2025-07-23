<template>
  <div class="table" :class="{'fixed-empty-placeholder-table':isFixedEmptyPlaceholder}">
    <el-table
      :data="data"
      :height="TabelHeight"
      ref="multipleTable"
      border
      :header-cell-style="{background:'#E0F3FF',color:'#333333',fontSize:'16px',padding: '4px 0px',fontWeight: '800'}"
      :cell-style="{fontSize: '13px', padding: '4px 0px'}"
      v-loading="loading"
      @selection-change="handleSelectionChange"
      style="width: 100%"
    >
      <template slot="empty">
        <div style="height:180px; align-items: center; justify-content: center;" class="show-flex-box-c" v-if="Number(TabelHeight) > 249">
          <img :src="emptyPlaceholder" alt="" style="width:180px;height: 152px;display: block;">
          <div style="height: 28px;">暂无数据</div>
        </div>
      </template> 
      <el-table-column type="selection" width="55" fixed> </el-table-column>
      <el-table-column type="index"  label="序号" align="center" width="60" fixed> </el-table-column>
      <el-table-column
        prop="self_id"
        label="自编号"
        align="center"
        width="100"
        fixed
        sortable=true
      ></el-table-column>
      <el-table-column
        min-width="100"
        prop="lincense_plate_number"
        align="center"
        label="车牌号"
        fixed
        show-overflow-tooltip
        sortable=true
      ></el-table-column>
      <el-table-column
        min-width="120"
        prop="belong_company"
        align="center"
        show-overflow-tooltip
        label="所属分公司"
        fixed
      ></el-table-column>
      <el-table-column
        min-width="180"
        prop="date"
        align="center"
        label="里程日期"
        show-overflow-tooltip
        sortable=true
      ></el-table-column>
      <el-table-column
        min-width="140"
        prop="mile"
        align="center"
        label="里程（km）"
        show-overflow-tooltip
        sortable=true
      ></el-table-column>
      <el-table-column
        min-width="120"
        prop="origitype"
        align="center"
        label="数据源类型"
        show-overflow-tooltip
      > 
        <!-- <template slot-scope="scope">
          <span>{{scope.row.c_from_type == "1"? '人工录入':'GPS推送'}}</span>
        </template> -->
      </el-table-column>
      <el-table-column
        min-width="150"
        prop="create"
        align="center"
        label="录入时间"
        show-overflow-tooltip
        sortable=true
      ></el-table-column>
      <el-table-column
        min-width="120"
        prop="create_user_name"
        align="center"
        label="录入人员"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        min-width="120"
        prop="remark"
        align="center"
        label="备注"
        show-overflow-tooltip
      ></el-table-column>
      <!-- <el-table-column min-width="160" prop="cur_status" label="所属车队"></el-table-column> -->
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
 import placeholderImage from "@/assets/home-image/placeholder-1.png";
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
      visible: false,
      subForm: {},
      detailDataTotal: [],
      detailDataList: [],
      detailLoading: false,
      singleRowInfo: null,
      exportloading: false,
      multipleSelection:[],
      emptyPlaceholder: placeholderImage
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
    activeName:[String],
    isFixedEmptyPlaceholder: {
      type: Boolean,
      default: true
    },
  },
  methods: {
    editDetail: function (row) {
      this.$emit("edit-detail",row)
    },

    deleteMileageInfo(row) {
      this.$emit("delete-mileage-info",row)
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection);
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
  },
  watch: {
    activeName() {
      this.$refs.multipleTable.doLayout()
    }
  },
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.table /deep/ .el-table td, .el-table th {
    font-size: 13px;
    padding: 4px 0;
  }
  .table /deep/ .el-table__empty-block {
    width: 100%;
    min-width: 100%;
    max-width: 100%;
  }
  .table /deep/  .el-table__body-wrapper {
    position: relative;
  }
  .table /deep/ .el-table__empty-text {
    position: absolute;
  }


  .fixed-empty-placeholder-table /deep/ .el-table__empty-block {
    width: 100%;
    min-width: 100%;
    max-width: 100%;
  }
  .fixed-empty-placeholder-table /deep/  .el-table__body-wrapper {
    position: relative;
  }
  .fixed-empty-placeholder-table /deep/ .el-table__empty-text {
    position: fixed;
  }
</style>
