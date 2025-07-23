<template>
  <el-dialog
    title="快速通道管理"
    :visible="dialogBool"
    :before-close="dialogClose"
    width="960px">
    <div class="content-div">
      <div class="btn-div">
        <el-button @click="editRow(null, 'add')" type="primary" size="mini">添加</el-button>
        <el-button @click="delRow" type="danger" size="mini">删除</el-button>
        <el-button type="primary" size="mini">保存排序</el-button>
      </div>
      <div class="draggable">
        <el-table
          row-key="id"
          :data="data"
          style="width: 100%"
          ref="multipleTable"
          tooltip-effect="dark"
          :header-cell-class-name="cellClass"
          height="500px"
          @selection-change="handleSelectionChange"
          border>
          <el-table-column type="index" label="#" align="center" min-width="45"></el-table-column>
          <el-table-column type="selection" label="" align="center" min-width="45" prop="select" :selectable="isDisabled"></el-table-column>
          <el-table-column type="" label="快速通道名称" align="center" min-width="120" prop="name" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column type="" label="快速通道链接" align="center" min-width="220" prop="httpUrl" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column type="" label="图标" align="center" min-width="120" prop="img">
            <template slot-scope="scope">
              <el-image :preview-src-list="[ scope.row.img ]" style="width: 42px; height: 42px;" :src="scope.row.img"></el-image>
            </template>
          </el-table-column>
          <el-table-column type="" label="拖动顺序调整" align="center" min-width="100" prop="sort">
            <template slot-scope="scope">
              <i class="el-icon-s-operation"></i>
            </template>
          </el-table-column>
          <el-table-column type="" label="操作" align="center" width="120" prop="operation">
            <template slot-scope="scope">
              <el-button @click="editRow(scope.row, 'edit')" type="text" size="mini" v-show="scope.row.noDraw">编辑</el-button>
              <el-button @click="delRow(scope.row)" type="text" size="mini" style="color: red;" v-show="scope.row.noDraw">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog
      title="添加"
      append-to-body
      width="460px"
      :visible.sync="addDialogVisible"
      :before-close="addDialogClose">
      <div class="content-box">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="120px"
          :label-position="'right'"
          size="mini">
          <el-form-item label="名称:" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入快速通道名称"> </el-input>
          </el-form-item>
          <el-form-item label="快速通道连接:" prop="httpUrl">
            <el-input v-model="ruleForm.httpUrl" placeholder="请输入快速通道连接"> </el-input>
          </el-form-item>
          <el-form-item label="上传图标:" prop="img">
            <ul class="list-data">
              <li class="item" v-if="ruleForm.img">
                <image-box :src="ruleForm.img" :id="1" @on-delete="imageDelete"></image-box>
              </li>
              <li class="item unchecked" v-else @click="uploadFile()">
                <i class="el-icon-plus" style="font-size: 60px;font-weight: 600;"></i>
              </li>
            </ul>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="submitFormData('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import {getUser} from '@/utils/auth'
import $ from 'jquery'
import draggable from "vuedraggable";
import Sortable from "sortablejs";
import imageBox from './image-box'
export default {
  components: {
    draggable,
    imageBox
  },
  props: {
    dialogBool: Boolean,
    canRendererTableHeader:[Array,Object],
  },
  data() {
    return {
      data: [],
      loading: false,
      TableHeight: 500,
      selectedTableId:[], //已选择数据行ID
      addDialogVisible: false,
      curSelectType: 'add',
      frontFixedNum: 1,
      ruleForm: {
        id: '',
        name: '',
        httpUrl: '',
        img: '',
      },
      rules: {
        name: [
          { required: true, message: "请输入快速通道名称", trigger: "change" },
        ],
        httpUrl: [
          { required: true, message: "请输入快速通道连接", trigger: "change" },
        ],
      },
      reqObj: {
        'add': 'AddFastMenuSysMenu',
        'edit': 'EditFastMenuSysMenu',
      },
      dataList: [
        {
          id: 0,
          name: '百度',
          httpUrl: 'http://www.baidu.com',
          img: 'http://122.225.198.118:5000/images/car_info_img/20230525143841.jpg',
          noDraw: false,
        },
        {
          id: 2,
          name: '百度百度',
          httpUrl: 'http://www.baidu.com',
          img: 'http://122.225.198.118:5000/images/car_info_img/20230525143841.jpg',
          noDraw: true,
        },
        {
          id: 3,
          name: '京东',
          httpUrl: 'http://www.jd.com',
          img: 'http://124.221.93.130:7099/wwwroot/Files/LocalFiles/1695364297Screenshot_20230922_135623.jpg',
          noDraw: true,
        },
        {
          id: 4,
          name: '淘宝',
          httpUrl: 'http://www.taobao.com',
          img: 'http://122.225.198.118:5000/images/car_info_img/20230525143841.jpg',
          noDraw: true,
        },
      ],
    }
  },
  watch: {
    dialogBool(bool) {
      if(bool) {
        setTimeout(() => {
          this.addRowByClassName();
          this.rowDrop();
        }, 50);
      }
    }
  },
  mounted() {
    // this.loadData()
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    addDialogClose() {
      this.$refs.ruleForm.resetFields()
      this.ruleForm.ing = ''
    },
    // 获取用户快速通道
    loadData(type) {
      this.loading = true
      let user_id = Number(JSON.parse(getUser()).user_id)
      let params = {user_id: user_id}
      this.$client.GetUserFastMenuSysMenu(params)
        .then(res => {
          this.loading = false
          if (res.head.result == "200") {
            // this.$parent.dataList = res.context
            this.$parent.dataList = this.dataList
            this.data = this.dataList
            if(type) {
              this.addRowByClassName();
              this.rowDrop();
            }
          } else {
            this.$message({ message: res.head.describle, type: "error" });
          }
        })
    },
    // 绑定可拖拽的区域
    addRowByClassName() {
      let rowDom = $('.draggable .el-table__row')
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
      if(!row.noDraw) {
        return false
      }else{
        return true
      }
    },
    // 自定义上传文件方法
    // :http-request="uploadFile"
    uploadFile() {
      let input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = () => {
        let reader = new FileReader();
        reader.readAsDataURL(input.files[0]);
        let file = input.files[0];
        reader.onload = (ev) => {
          input = undefined;
        };
        let params = new FormData
        params.append('file', file)
        this.$client.uploadPicture({file: params}, '/api/ERPWeb/VehicleManager/AddCarInfoImage').then((req) => {
          if (req.head.result === "200") {
            this.ruleForm.img = req.context;
          }
        });
      };
      input.click();
    },
    // 删除图标
    imageDelete() {
      this.formData.url = ''
    },
    // 添加、编辑
    editRow(row, type) {
      this.curSelectType = type
      this.addDialogVisible = true
      if(!!row) {
        for(let item in this.ruleForm) {
          if(row[item]) {
            this.ruleForm[item] = row[item]
          }
        }
        this.$refs.ruleForm.clearValidate()
      }
    },
    // 提交
    submitFormData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.ruleForm);
          this.$client[this.reqObj[this.curSelectType]](this.ruleForm).then((res) => {
            if (res.head.result == "200") {
              this.$message({
                showClose: true,
                message: '保存成功',
                type: "success",
              });
              this.loadData(true)
            } else {
              this.$message({
                showClose: true,
                message: res.head.describle,
                type: "error",
              });
            }
          });
        } else {
          return false;
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
      let params = !!row ? params.push(row.id) : this.selectedTableId
      this.$client.DelFastMenuSysMenu(params).then((res) => {
        if (res.head.result == "200") {
          this.$message({
            showClose: true,
            message: '删除成功',
            type: "success",
          });
          this.loadData(true)
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      });
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.btn-div 
  margin-bottom 20px

.el-table /deep/ .disabledCheck .cell .el-checkbox__inner 
  display: none !important;


.el-table /deep/ .disabledCheck .cell 
  display: block;


.el-table /deep/ .el-table__row
  background-color: #f5f5f5;


.el-table /deep/ .can-draggable-active-options
  cursor: pointer !important;
  background-color: #fff;

.list-data
  width: 450px
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