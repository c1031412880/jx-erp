<template>
  <div class="table-compontent" :class="{'fixed-empty-placeholder-table':isFixedEmptyPlaceholder}">
    <el-table
      :data="data"
      :height="TabelHeight"
      border
      ref="table"
      :header-cell-style="{background:'#E0F3FF',color:'#333333',fontSize:'16px',padding: '4px 0px',fontWeight: '800'}"
      :cell-style="{fontSize: '13px', padding: '4px 0px'}"
      v-loading="loading"
      style="width: 100%"
    >
      <template slot="empty">
        <div style="height:180px; align-items: center; justify-content: center;" class="show-flex-box-c" v-if="Number(TabelHeight) > 249">
          <img :src="emptyPlaceholder" alt="" style="width:180px;height: 152px;display: block;">
          <div style="height: 28px;">暂无数据</div>
        </div>
      </template> 
      <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
      <el-table-column
        prop="self_id"
        label="自编号"
        align="center"
        min-width="180"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        min-width="160"
        prop="lincense_plate_number"
        align="center"
        label="车牌号"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        min-width="120"
        prop="belong_company"
        align="center"
        label="所属分公司"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        min-width="130"
        prop="date"
        align="center"
        label="里程日期"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        min-width="130"
        prop="total_mile"
        align="center"
        label="累积里程（km）"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        min-width="120"
        prop="mile"
        align="center"
        label="里程（km）"
        show-overflow-tooltip
      ></el-table-column>
      <!-- <el-table-column min-width="160" prop="cur_status" label="所属车队"></el-table-column> -->
      <!-- <el-table-column min-width="160" prop="up_f_station" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="checkDetail(scope.row)"
            >查看详情</el-button
          >
        </template>
      </el-table-column> -->
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
      isShowDialog: false,
      subForm: {},
      detailDataTotal: [],
      detailDataList: [],
      detailLoading: false,
      singleRowInfo: null,
      exportloading: false,
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
    handleCurrentChange(idx) {
      this.pageDetailInfo.pageIndex = idx;
      // this.checkDetail()
      this.detailDataList = this.detailDataTotal.slice(
        (idx - 1) * this.pageDetailInfo.pageSize,
        idx * this.pageDetailInfo.pageSize
      );
    },
    checkDetail: function (row) {},

    exportFrom() {},

    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
  },
  watch: {
    activeName() {
      this.$refs.table.doLayout()
    },
  },
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .table-compontent /deep/ .el-table td, .el-table th {
    font-size: 13px;
    padding: 4px 0;
  }

  .table-compontent /deep/ .el-table__empty-block {
    width: 100%;
    min-width: 100%;
    max-width: 100%;
  }
  .table-compontent /deep/  .el-table__body-wrapper {
    position: relative;
  }
  .table-compontent /deep/ .el-table__empty-text {
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
