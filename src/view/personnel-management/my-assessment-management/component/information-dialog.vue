<template>
  <el-dialog
    :visible="dialogBool"
    fullscreen
    :before-close="dialogClose"
    center
  >
    <tr-page-header ref="trPageHeader" slot="title" :content="informationDialogTitle" @back="dialogClose"></tr-page-header>
    <div class="show-flex-box-r" style="margin-bottom:15px;align-items: center;">
      <div class="show-flex-box-c" style="flex-grow: 1;">
        <ul class="show-flex-box-r" style="margin-bottom: 10px;">
          <li style="width: 25%">考核名称：阿斯顿发发生的 </li>
          <li style="width: 25%">考核开始时间：2022-02-03  12:30  </li>
          <li style="width: 25%">考核结束时间：2022-02-4   13:00 </li>
          <li style="width: 25%">审核人：徐泽辉 </li>
        </ul>
        <ul class="show-flex-box-r" style="margin-bottom: 10px;">
          <li style="width: 25%">人员姓名：徐泽辉   </li>
          <li style="width: 25%">部门：产品部    </li>
          <li style="width: 25%">审核人审核时间： </li>
          <li style="width: 25%">审核人审核时间： </li>
        </ul>
      </div>
      <strong style="font-weight: 700;font-size: 16px;flex-shrink: 0;">考核总得分：100</strong>
    </div>
    <div class="information-dialog-table show-flex-box-c">
      <div class="table-content">
        <el-button
          type="primary"
          size="mini"
          style="margin-bottom: 15px;"
          @click="addRules()"
          >添 加</el-button
        >
        <tr-table
          ref="table"
          :selectionShow="false"
          :data="form.data"
          :tableHeaderList="canRendererTableHeader"
          :TableHeight="TableHeight"
          :loading="loading"
          :frontFixedNum="frontFixedNum"
          :backFixedNum="backFixedNum"
          :isShowSummary="true"
          :summaryText="'summaryText'"
          :omitColumnIndex="[1,2,4]"
        >
          <template slot-scope="scope" slot="name">
            <el-input v-model="scope.data.name" size="mini" placeholder="请输入考核项目"></el-input>
          </template>
          <template slot-scope="scope" slot="assessment_content">
            <el-input v-model="scope.data.assessment_content" size="mini" placeholder="请输入考核内容及标准"></el-input>
          </template>
          <template slot-scope="scope" slot="score_way">
            <el-input v-model="scope.data.score_way" size="mini" placeholder="评分办法"></el-input>
          </template>
          <template slot-scope="scope" slot="standard_value">
            <el-input v-model="scope.data.standard_value" size="mini" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="scope.data.standard_value = $event.target.value" placeholder="请输入标准分值" ></el-input>
          </template>
          <template slot-scope="scope" slot="operation">
            <el-button
              type="danger"
              size="mini"
              @click.stop="deleteRules(scope.index)"
              >删 除</el-button
            >
            <!-- <el-button
              type="primary"
              size="mini"
              @click.stop="addRules(scope.data)"
              v-if="scope"
              >添 加</el-button
            > -->
          </template>
        </tr-table>
      </div>
      <span style="margin-top: 15px;">批注：员工自评占比：30%,审核人评分占比70%</span>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('form')">确 认</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    dialogBool: Boolean,
    informationDialogTitle: {
      type: String,
      default: "新增模板",
    },
  },
  data() {
    return {
      TableHeight: 500,
      loading: false,
      frontFixedNum: 1,
      backFixedNum: 1,
      canRendererTableHeader: null,
      customSettingList: [
        {
          id: 1,
          label: "考核项目",
          prop: "name",
          width: "120",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "考核内容及标准",
          prop: "assessment_content",
          width: "120",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "评分办法",
          prop: "score_way",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "标准分值",
          prop: "standard_value",
          width: "120",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "自评分",
          prop: "assessment_content",
          width: "120",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "自评说明",
          prop: "score_way",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "审核人评分",
          prop: "standard_value",
          width: "120",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "审核说明",
          prop: "check_remake",
          width: "180",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        // {
        //   id: 5,
        //   label: "审核说明",
        //   prop: "operation",
        //   width: "180",
        //   align: "center",
        //   signIndex: 4,
        //   sortable: false,
        // },
      ],
      form: {
        name: "",
        remark: "",
        data: [],
      },
      basicRules: {
        name: [
          { required: true, message: "请输入模板名称", trigger: "change" },
        ],
        remark: [
          { required: true, message: "请填写考核规则说明", trigger: "change" },
        ],
      },
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      } else {
        this.loadData();
        this.$nextTick(() => {
          this.setHead('initialize');
          window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
            this.setHead()
          })
        });
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 加载数据
    loadData() {
      // this.loading = true
      // let params = Object.assign({},this.form);
      // this.$client.GetReqErpTradeMainManage(params)
      //   .then(res => {
      //     if (res.head.result == "200") {
      //       console.log(res)
      //       this.loading = false;
      //       this.data = res.context;
      //       // this.pageInfo.pageCount = res.context.total
      //     } else {
      //       this.loading = false;
      //       this.$message({
      //         showClose: true,
      //         message: res.head.describle,
      //         type: "error",
      //       });
      //     }
      //   })
    },
    // 删除考核项目
    deleteRules(index) {
     this.form.data.splice(index, 1)
    },
    // 添加考核项目
    addRules() {
      let obj = {
        name: '',
        assessment_content: '',
        score_way: '',
        standard_value: '',
      };
      this.form.data.push(obj)
    },
    // 保存
    updatePlaybill(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = {...this.form};
          console.log(info)
          this.$emit("save-add-edit", info);
        } else {
          return false;
        }
      });
    },
    // 计算表格高度
    setHead(type) {
      if(type == 'initialize') {
        this.canRendererTableHeader = this.customSettingList;
      }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let trPageHeader = this.$refs.trPageHeader.$el.offsetHeight;
        this.TableHeight = maxh - 360 - trPageHeader;
        // console.log(this.TableHeight);
      }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped></style>
