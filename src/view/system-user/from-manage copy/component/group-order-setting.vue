<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="590px"
  >
    <div class="draggable">
      <el-table
        row-key="id"
        ref="multipleTable"
        :data="tableData"
        style="width: 100%"
        tooltip-effect="dark"
        :header-cell-style="{
          background: '#eef1f6',
          color: '#606266',
          fontSize: '16px',
        }"
        height="400px"
        border
        @row-click="selectedRowInfo"
      >
        <el-table-column
          v-for="(item, index) in oldList"
          :key="`col_${index}`"
          :prop="item.prop"
          :label="item.label"
          :align="item.align || 'center'"
          :width="item.width || ''"
          :selectable="isDisabled"
        >
          <template v-if="item.prop == 'sort'">
            <i class="el-icon-s-operation"></i>
          </template>

          <template v-if="item.prop == 'operate'">
            <!-- <el-button slot="reference" type="text" v-if="scope.id == 11">固定</el-button> -->
            <el-popconfirm
              title="确定删除此表单分组吗？"
              @confirm="confirmDelete()"
             
            >
              <el-button slot="reference" type="text">删除</el-button>
            </el-popconfirm>

          </template>
        </el-table-column>
      </el-table>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill">保存</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import $ from "jquery";
// import draggable from "vuedraggable";
import Sortable from "sortablejs";
export default {
//   components: {
//     draggable,
//   },
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "表单分组编辑",
    },
    customGroupSettingList: [Object, Array],
  },
  data() {
    return {
      disabled: false,
      oldList: [],
      newList: [],
      //定义要被拖拽对象的数组
      tableConfig: {
        tableItems: [
          {
            label: "表单分组名称",
            prop: "label",
            width: "255",
            align: "left",
          },
          {
            label: "拖动顺序调整",
            prop: "sort",
            width: "135",
            align: "center",
          },
          {
            label: "操作",
            prop: "operate",
            width: "160",
            align: "center",
          },
        ],
      },
      configTableData: [],
      tableData: [],
      curSelectedRowInfo: null,
      deleteGroupId:[],
    };
  },
  mounted() {
    // this.configTableData = this.tableData;
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      } else {
        this.oldList = JSON.parse(JSON.stringify(this.tableConfig.tableItems));
        this.configTableTitle();
        //   this.newList = JSON.parse(JSON.stringify(this.tableConfig.tableItems));
        // if(this.tableData.length > 0) {
        setTimeout(() => {
          this.rowDrop();
        }, 50);
        // }
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },

    // 初始化数据
    configTableTitle() {
      this.tableData = this.customGroupSettingList;
      // this.customGroupSettingList.forEach((item, index) => {
      //   let obj = {
      //     id: item.id,
      //     label: item.title,
      //     sort: index,
      //   };
      //   this.tableData.push(obj);
      // });
    },

    // 禁止选中
    isDisabled(row, index) {
      if (this.havedTableId.indexOf(row.id) > -1) {
        return false;
      } else {
        return true;
      }
    },

    // 行拖拽
    rowDrop() {
      // 此时找到的元素是要拖拽元素的父容器
      const tbody = document.querySelector(
        ".draggable .el-table__body-wrapper tbody"
      );
      const _this = this;
      Sortable.create(tbody, {
        //  指定父元素下可被拖拽的子元素
        draggable: ".draggable .el-table__row",
        animation: 500,
        delayOnTouchOnly: true,
        onEnd({ newIndex, oldIndex }) {
          console.log("这是新的Index" + newIndex);
          console.log("这是旧的Index" + oldIndex);
          const currRow = _this.tableData.splice(oldIndex, 1)[0];
          _this.tableData.splice(newIndex, 0, currRow);
          console.log("这是tableData", _this.tableData);
        },
      });
    },

    updatePlaybill() {
      this.tableData.forEach((item,index) => {
          item.sort = index;
      });
      this.$parent.updateTableForm(this.tableData,this.deleteGroupId);
      this.dialogClose();
    },

    selectedRowInfo(row) {
      this.curSelectedRowInfo = row;
    },
    // 删除表单分组
    confirmDelete() {
        // console.log(this.curSelectedRowInfo)
        if(this.curSelectedRowInfo.id == 11 || this.curSelectedRowInfo.id == 9) {
          this.$message({
            showClose: true,
            message: '这是固定表单分组不能删除！',
            type: 'warning'
          });
          return
        }
        // if(this.curSelectedRowInfo.id == 9) {
        //   this.$message({
        //     showClose: true,
        //     message: '这是固定表单分组不能删除！',
        //     type: 'warning'
        //   });
        //   return
        // }
        let groupId = this.curSelectedRowInfo.id;
        this.tableData.forEach((item,index) => {
            if(item.id == groupId) {
                this.tableData.splice(index,1)
            }
        });
        this.deleteGroupId.push(groupId)
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-table /deep/ .disabledCheck .cell .el-checkbox__inner {
  display: none !important;
}

.el-table /deep/ .disabledCheck .cell {
  display: block;
}

// .el-table /deep/ .disabledCheck .cell:before {
// content: '显示' !important;
// position: absolute !important;
// right: 50px !important;
// }
.el-table /deep/ .el-table__row {
  // background-color: #f5f5f5;
}

.el-table /deep/ .can-draggable-active-options {
  cursor: pointer !important;
  background-color: #fff;
}
</style>
