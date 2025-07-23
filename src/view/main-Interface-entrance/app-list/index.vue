<template>
  <div class="app-list">
    <div class="btn-div">
      <el-button @click="editRow(null, 'add')" type="primary" size="mini">添加</el-button>
      <el-button @click="delRow" type="danger" size="mini">删除</el-button>
      <el-button @click="saveDataSort"  v-show="isSort" type="primary" size="mini">保存排序</el-button>
    </div>
    <div class="draggable">
      <el-table
        row-key="id"
        :data="data"
        style="width: 100%"
        ref="multipleTable"
        tooltip-effect="dark"
        :header-cell-class-name="cellClass"
        :height="TableHeight"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        border>
        <el-table-column type="index" label="#" align="center" min-width="45"></el-table-column>
        <el-table-column type="selection" label="" align="center" min-width="45" prop="select" :selectable="isDisabled"></el-table-column>
        <el-table-column type="" label="快速通道名称" align="center" min-width="120" prop="name" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column type="" label="快速通道链接" align="center" min-width="220" prop="url" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column type="" label="图标" align="center" min-width="120" prop="image">
          <template slot-scope="scope">
            <el-image :preview-src-list="[ scope.row.image ]" style="width: 42px; height: 42px;" :src="scope.row.image"></el-image>
          </template>
        </el-table-column>
        <el-table-column type="" label="拖动顺序调整" align="center" min-width="100" prop="sort">
          <template slot-scope="scope">
            <i class="el-icon-s-operation"></i>
          </template>
        </el-table-column>
        <el-table-column type="" label="操作" align="center" width="120" prop="operation">
          <template slot-scope="scope">
            <el-button @click="editRow(scope.row, 'edit')" type="text" size="mini">编辑</el-button>
            <el-popconfirm
              @confirm="delRow(scope.row)"
              title="确认删除?">
              <el-button  v-show="scope.row.is_default != 1" style="color: red;" type="text" size="mini" slot="reference">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <add-dialog ref="addDialog" @save-add-edit="saveRowInfo" :dialogBool.sync="addDialogShow"></add-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import {getUser} from '@/utils/auth'
import $ from 'jquery'
import draggable from "vuedraggable";
import Sortable from "sortablejs";
import addDialog from "./component/add-dialog"
export default {
  name: 'app-list',
  components: {
    draggable,
    addDialog
  },
  data() {
    return {
      data: [],
      loading: false,
      TableHeight: 500,
      frontFixedNum: 1,
      addDialogShow: false,
      curSelectType: 'add',
      selectedTableId:[], //已选择数据行ID
      isSort: false,
      reqObj: {
        'add': 'AddFastMenuSysMenu',
        'edit': 'EditFastMenuSysMenu',
      },
      dataList: [
        
      ],
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead()
      this.loadData()
    })
  },  
  methods: {
    // 获取用户快速通道
    loadData() {
      this.loading = true
      let user_id = Number(JSON.parse(getUser()).user_id)
      let params = {user_id: user_id}
      this.$client.GetUserFastMenuSysMenu(params)
        .then(res => {
          this.loading = false
          if (res.head.result == "200") {
            this.data = res.context
            let num = 0
            this.data.forEach(item => {
              if(item.is_default == 1) {
                num++
              }
            })
            this.frontFixedNum = num
            setTimeout(() => {
              this.addRowByClassName();
              this.rowDrop();
            }, 30);
          } else {
            this.$message({ message: res.head.describle, type: "error" });
          }
        })
    },
    // 绑定可拖拽的区域
    addRowByClassName() {
      let rowDom = $('.draggable .el-table__row')
      // console.log(rowDom);
      rowDom.splice(0,this.frontFixedNum);
      rowDom.addClass("can-draggable-active-options")
    },
    // 行拖拽
    rowDrop() {
      // 此时找到的元素是要拖拽元素的父容器
      const tbody = document.querySelector(
        ".draggable .el-table__body-wrapper tbody"
      );
      const that = this;
      Sortable.create(tbody, {
        //  指定父元素下可被拖拽的子元素
        draggable: ".draggable .can-draggable-active-options",
        animation: 500,
        delayOnTouchOnly: true,
        onEnd({ newIndex, oldIndex }) {
          console.log('拖动了行，序号(index)"'+oldIndex+'"拖动到序号(index)"' + newIndex+'"');
          const currentRow = that.data.splice(oldIndex, 1)[0]; // 将oldIndex位置的数据删除并取出，oldIndex后面位置的数据会依次前移一位
          that.data.splice(newIndex, 0, currentRow); // 将被删除元素插入到新位置（currRow表示上面的被删除数据）
          // this.$parent.dataList = JSON.parse(JSON.stringify(this.data))
          that.isSort = true
        },
      });
    },
    // 对全选框进行class绑定
    cellClass(row) {
      if (row.columnIndex === 0) {
        return "disabledCheck";
      }
    },
    // 禁止选中
    isDisabled(row,index) {
      if(row.is_default == 1) {
        return false
      }else{
        return true
      }
    },
    // 添加、编辑
    editRow(row, type) {
      this.curSelectType = type
      this.addDialogShow = true
      if(!!row) {
        this.$refs.addDialog.setData(row)
      }
    },
    // 保存添加编辑
    saveRowInfo(form) {
      let params = {context: {}}
      params.context = form
      params.context.user_id = Number(JSON.parse(getUser()).user_id)
      this.$client[this.reqObj[this.curSelectType]](params).then((res) => {
        this.addDialogShow = false
        if (res.head.result == "200") {
          this.loadData()
          this.$message({
            showClose: true,
            message: '保存成功',
            type: "success",
          });
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      });
    },
    // 多选选中
    handleSelectionChange(rowList) {
      this.selectedTableId = rowList.map(item => { return item.id})
    },
    // 批量删除
    delRow(row) {
      if(!row && !this.selectedTableId.length) {
        this.$message({
          showClose: true,
          message: '请选择要删除的数据',
          type: "error",
        });
        return false
      }
      let params = {context: {}}
      params.context = !!row ? [row.id]: this.selectedTableId
      this.$client.DelFastMenuSysMenu(params).then((res) => {
        if (res.head.result == "200") {
          this.loadData()
          this.$message({
            showClose: true,
            message: '删除成功',
            type: "success",
          });
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      });
    },
    // 保存排序
    saveDataSort() {
      let params = {context: []}
      params.context = this.data
      this.$client.EditFastMenuSortSysMenu(params).then((res) => {
        if (res.head.result == "200") {
          this.isSort = false
          this.loadData()
          this.$message({
            showClose: true,
            message: '保存成功',
            type: "success",
          });
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      });
    },
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        this.TableHeight = maxh - 38;
      }, 50);
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.app-list {
  height: 100%
  width: 100%
  .btn-div {
    margin-bottom 10px
  }

}
.el-table /deep/ .disabledCheck .cell .el-checkbox__inner {
  display: none !important;
}
.el-table /deep/ .disabledCheck .cell {
  display: block;
}
.el-table /deep/ .el-table__row {
  background-color: #f5f5f5;
}
.el-table /deep/ .can-draggable-active-options {
  cursor: pointer !important;
  background-color: #fff;
}
</style>