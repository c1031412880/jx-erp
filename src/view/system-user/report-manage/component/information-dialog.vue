<template>
  <el-dialog :fullscreen="true" class="add-process-dialog" :visible="dialogBool" :title="title" :before-close="dialogClose">
    <tr-page-header slot="title" :content="title" @back="dialogClose"></tr-page-header>
    <div class="page" style="height:calc(100vh - 197px);overflow:auto">
      <item-box title="查询语句">
        <el-input placeholder="请输入查询语句" type="textarea" rows="4" v-model="form.sql" style="margin-bottom: 10px"></el-input>
        <el-button size="mini" type="primary" @click="selectSeq">查询</el-button>
        <el-button size="mini" type="primary" @click="subFormShow = true">添加变量</el-button>
      </item-box>
      <item-box title="查询变量">
        <sub-model :data="sqlList" @ok="submitForm"></sub-model>
      </item-box>
      <item-box title="基础信息">
        <el-form label-width="120px" :inline="true">
          <el-form-item label="报表编号">
            <el-input v-model="form.code"></el-input>
          </el-form-item>
          <el-form-item label="报表名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="模块名称">
            <el-input v-model="form.module"></el-input>
          </el-form-item>
        </el-form>
      </item-box>
      <item-box title="查询结果">
        <tr-table
          :selectionShow="true"
          :data="data"
          :tableHeaderList="headerList"
          :TableHeight="400"
          :loading="loading"
          :frontFixedNum="frontFixedNum"
          :backFixedNum="backFixedNum"
        >
        </tr-table>
      </item-box>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="ok">确 定</el-button>
    </span>
    <add-form-dialog :dialog-bool.sync="subFormShow" @ok="addSqlList"></add-form-dialog>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import itemBox from "./item-box";
import addFormDialog from "./add-form-dialog";
import subModel from "./sub-model";
export default {
  components: {
    itemBox,
    addFormDialog,
    subModel
  },
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "自定义报表",
    },
  },
  data() {
    return {
      form: {
        id: 0,
        code: '',
        name: "",
        module: '',
        sql: '',
        query: '',
        group: '',
        langs: '',
        step: 0
      },
      subForm: {},
      sqlList: [],
      loading: false,
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      data: [],
      headerList: [],
      subFormShow: false
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }
    }
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    addSqlList(item) {
      this.sqlList.push(item)
      this.subFormShow = false
    },
    submitForm(form) {
      this.subForm = form
      this.selectSeq()
    },
    // 查询sql语句
    selectSeq() {
      if (!this.form.sql) {
        return false
      }
      this.$client.GetReportBySqlReportManage({
        sql: this.form.sql,
        query: this.subForm,
        page_index: 1,
        page_size: 10
      }).then(req => {
        if (req.head.result === '200') {
          this.data = req.context.list
          let table = req.context.table
          let header = []
          // id: 1,
          //   label: "标题",
          //   prop: "title",
          //   width: "130",
          //   align: "center",
          //   signIndex: 0,
          //   sortable: false,
          Object.keys(table).forEach((item, index) => {
            header.push({
              id: index +1,
              label: table[item],
              prop: item,
              width: 150,
              align: "center",
              signIndex: index,
              sortable: false,
            })
          })
          this.headerList = header
          console.log(req)
        }
      })
    },
    ok() {
      this.form.query = JSON.stringify(this.sqlList)
      this.form.langs = JSON.stringify(this.headerList)
      this.$emit('ok', this.form)
    }
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog__wrapper {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.el-dialog-div {
  height: 450px;
  // overflow-y: scroll;
}

.el-form-row-first {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;

  .el-form-row-first-left {
    width: 45%;
    height: 145px;
    display: flex;
    flex-direction: column;
  }

  .el-form-row-first-right {
    width: 35%;
    height: 120px;
    // background red
    margin-left: 15%;
    margin-bottom: 30px;
    display: flex;

    .avatar-uploader {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      // border: 1px dashed #d9d9d9;
      // border-radius: 6px;
      cursor: pointer;
      background: url('../../../../../src/assets/veh_svg/uploader-icon.svg') no-repeat center;
      background-size: 100% 100%;
      overflow: hidden;
      object-fit: cover !important;
        .avatar {
          display: block;
          width: 100%;
          height: 100%;
        }

      // .el-upload {
      //   width: 100% !important;
      //   height: 100% !important;
      //   overflow: hidden !important;
      //   object-fit: cover !important;

      // }
    }

    .have-avatar-active {
      background: none;

      div {
        width: 100% !important;
        height: 100% !important;
      }
    }
  }
}

.el-form-row {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;

  .el-form-item {
    width: 45%;
    margin-right: 5%;

    .el-form-item__label {
      white-space: nowrap;
    }
  }
}

.el-form-row /deep/ .el-input-number--mini {
  width: 195px;
}

.el-form-row /deep/ .el-select {
  width: 195px;
}
.el-form-row /deep/ .el-date-editor {
  width: 195px;
}
</style>

<style scoped>
.el-form-row-first-right /deep/ .have-avatar-active {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
/* .div{
  background: url("../../../../../src/assets/veh_svg/uploader-icon.svg") no-repeat center;
  object-fit: cover;
} */
</style>
