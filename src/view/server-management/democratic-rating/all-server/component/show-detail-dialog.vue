<template>
  <el-dialog
    :visible="dialogBool"
    title="评分人员详情"
    :before-close="dialogClose"
    :close-on-click-modal="false"
    center
    append-to-body
    width="80%"
    top="20px"
  >
    <div class="base-info">
      <el-form
        ref="form"
        size="mini"
        :model="form"
        label-suffix=":"
      >
        <div style="display:flex">
          <div style="float:left;width: 6px;height: 18px; background: #409EFF;"></div> 
          <p style="margin-left:15px;margin-bottom:15px;color:#409EFF;font-size:16px;font-weight:bold">基本信息</p>
        </div>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="经办人" prop="user_name">
              <span>{{form.user_name}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所在部门" prop="dept_name">
              <span>{{form.dept_name}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="评分季度" prop="season_name_full">
              <span>{{form.season_name_full}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="评分时间" prop="score_date_range">
              <span>{{form.score_date_range}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="评分人" prop="score_person_names">
              <span>{{form.score_person_names}}</span>
            </el-form-item>
          </el-col> 
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input autosize type="textarea" class="richText" disabled v-model="form.remark"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" class="table-box">
            <div style="display: flex;align-items:center;margin-bottom:5px">
              <div style="float:left;width: 6px;height: 18px; background: #409EFF;"></div> 
              <p style="margin:0 15px;color:#409EFF;font-size:16px;font-weight:bold">评分详情</p>
              <el-button type="primary" size="mini" @click="preview()">预览</el-button>
              <el-button type="primary" size="mini" @click="onExport()">导出</el-button>
            </div>
            <tr-table
              :loading="loading"
              class="tableBox"
              ref="tableBox"
              :data="tableList"
              :tableHeaderList="tableHeaderList"
              :TableHeight="300">
            </tr-table>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-dialog
      ref="previewDialog"
      title="预览"
      :visible.sync="previewDialogVisible"
      :append-to-body="true"
      fullscreen>
        <tr-table
          ref="table"
          :data="tableList"
          :tableHeaderList="tableHeaderList"
          :TableHeight="previewHeight">
        </tr-table>
    </el-dialog>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import imageFileUpload from "@/components/imageFileUpload/index";
import common from '@/mixin/exportToExcel'
import { getUser } from "@/utils/auth";
export default {
  components: {
    imageFileUpload,
  },
  mixins: [common],
  props: {
    dialogBool: Boolean,
  },
  data() {
    return {
      form: {},
      loading: false,
      tableList: [],
      previewDialogVisible: false,
      previewHeight: 500,
      tableHeaderList: [],
      tableHeaderList1: [
        {
          id: 1,
          label: "驾驶员",
          prop: "driver_name",
          width: "130",
          align: "center",
          signIndex: 0,
        },
        {
          id: 2,
          label: "所在部门",
          prop: "dept_name",
          width: "130",
          align: "center",
          signIndex: 1,
        },
      ],
      tableHeaderList2: [
        {
          id: 20,
          label: "合计",
          prop: "total_score",
          width: "130",
          align: "center",
          signIndex: 19,
        },
        {
          id: 21,
          label: "平均分",
          prop: "avg_score",
          width: "130",
          align: "center",
          signIndex: 20,
        },
      ]
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      } else {
      }
    },
  },
  methods: {
    // 初始化数据
    initSet(info) {
      if (!!info) {
        this.form = JSON.parse(JSON.stringify(info))
        // let user_id = JSON.parse(getUser()).user_id
        let list = info.details
        let L = 0
        list.forEach(item => {
          L = item.details.length
          item.details.forEach((child,index) => {
            let key = `name${index}`
            item[key] = child.score || ''
          })
        })
        let header = []
        for (let index = 0; index < L; index++) {
          let obj = {
              id: index + 3  ,
              label: (index + 1).toString(),
              prop: `name${index}`,
              width: "130",
              align: "center",
              signIndex: index + 2,
          }         
          header.push(obj) 
        }
        this.tableHeaderList = [...this.tableHeaderList1,...header,...this.tableHeaderList2]
        this.tableList = list
      }
    },
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 预览
    preview() {
      this.previewDialogVisible = true
      this.$nextTick(() => {
        this.previewHeight = this.$refs.previewDialog.$el.offsetHeight - 70
      })
    },
    // 导出
    onExport() {
      if (this.tableList.length > 0) {
        let table_dom = this.$refs['tableBox'].$refs.table.$el
        this.exportToExcel(table_dom,'评分详情','tableBox')
      } else {
        this.$message({
          showClose: true,
          message: "暂无数据",
          type: "warning",
        });
      }
    },
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.richText {
  width: 100%;
  /deep/ {
    .el-textarea__inner {
      background-color: #fff; 
      border: none;
      cursor: auto;
      padding: 0;
    }
  }
}
</style>


