<template>
  <div class="table">
    <el-table
      :data="data"
      :height="TableHeight"
      border
      stripe
      v-loading="loading"
      style="width: 100%"
      :header-cell-style="{background:'#eef1f6',color:'#606266',fontSize:'16px'}"
      @selection-change="handleSelectionChange"
      @row-click="selectedRowInfo">
      <el-table-column
        v-for="(item, index) in tableHeaderDataList"
        :key="`col_${index}`"
        :prop="item.prop"
        :label="item.label"
        :type="item.signIndex == -1 ? 'selection' : item.signIndex == -2 ? 'index':''"
        :align="item.align || 'left'"
        :width="item.signIndex == -2 ? '80px':''"
        :min-width="item.width || '80'"
        :fixed="item.signIndex < frontFixedNum? 'left': item.signIndex > (tableHeaderList.length - backFixedNum -1) ? 'right': false "
        :sortable="item.sortable"
      >
        <template  v-if="item.prop == 'operation'">
          <el-button type="primary" size="mini" @click="editRowInfo()">编辑</el-button>
          <el-popconfirm
            @confirm="deleteRowInfo()"
            title="确定删除此条记录吗？"
          >
            <el-button slot="reference" type="danger" size="mini">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>

    </el-table>
    <div style="margin-top:10px;position:absolute;bottom: 0;">
      <el-button size="mini" @click="changeAll">选择全部</el-button>
      <el-button size="mini" @click="ReverseChoice">反向选择</el-button>
      <el-popover
        placement="top"
        width="160"
        v-model="visible">
        <div style="text-align:center">
          <el-button type="primary" size="mini"  style="margin-top:5px">删除全部</el-button>
          <el-button type="primary" size="mini" style="margin-top:5px">操作1</el-button>
          <el-button type="primary" size="mini"  style="margin-top:5px">操作2</el-button>
        </div>
        
        <el-button size="mini" icon="el-icon-top" slot="reference">更多操作</el-button>
      </el-popover>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getRoleIds} from '@/utils/auth'
  export default {
    data () {
      return {
        visible: false,
        power: getRoleIds(),
        multipleSelection: [],
        tableHeaderDataList:[],
        curSelectedRowInfo:null,
      }
    },
    props: {
      data: {
        type: Array,
        default: null
      },
      TableHeight: {
        type: Number,
        default: 400
      },
      loading: {
        type: Boolean,
        default: false
      },
      tableHeaderList:[Array,Object],
      frontFixedNum:[Number],
      backFixedNum:[Number]
    },
    methods: {
      // 初始化表头
      configTableHeaderList() {
        this.tableHeaderDataList = JSON.parse(JSON.stringify(this.tableHeaderList));
        const tableHeaderObj1 = {
          id: 0,
          label: "",
          prop: "",
          width: "50",
          align: "center",
          signIndex:-1,
        };
        const tableHeaderObj2 = {
          id: 0,
          label: "序号",
          prop: "",
          width: "80",
          align: "center",
          signIndex:-2,
        };
        this.tableHeaderDataList.unshift(tableHeaderObj1,tableHeaderObj2)
      },

      selectedRowInfo(row) {
        this.curSelectedRowInfo = row;
      },
      // 编辑
      editRowInfo() {
        setTimeout(() => {
          if(this.curSelectedRowInfo) {
            this.$emit("on-set", this.curSelectedRowInfo)
          }
          
        }, 50);
      },
      // 删除
      deleteRowInfo() {
        // console.log(this.curSelectedRowInfo)
        this.$emit("on-del", this.curSelectedRowInfo)
      },

      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      // 选择全部
      changeAll(){

      },
      // 反向选择
      ReverseChoice(){

      }

    },
    watch:{
      tableHeaderList() {
        this.configTableHeaderList();
        console.log(this.tableHeaderList.length - this.backFixedNum -1)
      },
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
