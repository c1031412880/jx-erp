<template>
  <div class="vehicle-maintain-static">
    <el-card class="box-card left-box">
      <div
        slot="header"
        class="clearfix show-flex-box-r"
        style="height: 37px; flex-wrap: nowrap; align-items: center"
      >
        <span style="white-space: nowrap">线路选择</span>
      </div>
      <div class="show-flex-box-c" :style="`height: ${treeBoxHeight}px`">
        <line-tree
          ref="lineTree"
          :isShowCheckbox="false"
          :isNodeExpanded="false"
          :placeholder="'请输入关键词'"
          @on-check="selectLineInfo"
          @refresh-tree="refreshTreeList"
        ></line-tree>
      </div>
    </el-card>
    <el-card class="box-card center-box" ref="centerBox">
      <sub-req
        ref="head"
        @on-ok="onSubmit"
        @on-btn-export="exportFile"
        @open-setting-page="openSettingPageEvent"
      ></sub-req>
      <tr-table
        ref="trTable"
        :selectionShow="false"
        :data="data"
        :tableHeaderList="canRendererTableHeader"
        :isShowBottomOptions="false"
        :isShowSummary="true"
        :TableHeight="TableHeight"
        :loading="loading || headerLoading"
        :frontFixedNum="frontFixedNum"
        :backFixedNum="backFixedNum"
        :sumTotal="sumTotal"
        :sumColumnIndex="sumColumnIndex"
      ></tr-table>
    </el-card>
    <custom-setting
      :dialogBool.sync="customSettingVialogVisible"
      :customSettingList="customSettingList"
      :canRendererTableHeader="canRendererTableHeader"
      :customSettingShowList="customSettingShowList"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      :isParentUse="isParentUse"
      @update-table-header="updateTableHeader"
    ></custom-setting>
  </div>
</template>

<script type="text/ecmascript-6">
import lineTree from "./component/line-tree";
import subReq from "./component/sub-req";
export default {
  name: "vehicle-maintain-static",
  components: {
    lineTree,
    subReq
  },
  data() {
    return {
      treeBoxHeight:500,
      form: {},
      data: [],
      loading: false,
      TableHeight: 500,
      frontFixedNum: 0, //前几行固定
      backFixedNum: 0, //后几行固定
      canRendererTableHeader: null,
      titlesId:'', //当前表头的id
      menu_code:'',
      headerLoading: false,
      isParentUse: false,
      customSettingVialogVisible: false,
      curNodeType: 1, //选中的当前节点类型
      curLineId:'',
      curDeptId:'',
      sumTotal:{ //约定某一列汇总合计自定义数据
        1:'',
        8:'',
        9:'',
        10:'',
        11:'',
        12:'',
        13:'',
        14:'',
        15:'',
        16:'',
        17:''
      },
      sumColumnIndex:[1,8,9,10,11,12,13,14,15,16,17], //要定义的列的索引
      customSettingList: [
        {
          id: 1,
          label: "车牌号",
          prop: "lp_num",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: true,
        },
        {
          id: 2,
          label: "自编号",
          prop: "v_num",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
        {
          id: 3,
          label: "所属组织",
          prop: "group_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "线路",
          prop: "line_name",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "车辆型号",
          prop: "name",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: true,
        },
        {
          id: 6,
          label: "车龄",
          prop: "vheicle_age",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "发动机号",
          prop: "engine_number",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "累计公里数",
          prop: "mile",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "门检次数",
          prop: "door_num",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "一保次数",
          prop: "one_num",
          width: "180",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "二保次数",
          prop: "two_num",
          width: "180",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
        {
          id: 12,
          label: "小修次数",
          prop: "small_num",
          width: "130",
          align: "center",
          signIndex: 11,
          sortable: false,
        },
        {
          id: 13,
          label: "外修次数",
          prop: "out_num",
          width: "130",
          align: "center",
          signIndex: 12,
          sortable: false,
        },
        {
          id: 14,
          label: "合计次数",
          prop: "total_num",
          width: "130",
          align: "center",
          signIndex: 13,
          sortable: false,
        },
        {
          id: 15,
          label: "总工时",
          prop: "hour",
          width: "130",
          align: "center",
          signIndex: 14,
          sortable: true,
        },
        {
          id: 16,
          label: "工时费",
          prop: "hour_fee",
          width: "130",
          align: "center",
          signIndex: 15,
          sortable: false,
        },
        {
          id: 17,
          label: "材料费",
          prop: "material_fee",
          width: "130",
          align: "center",
          signIndex: 16,
          sortable: false,
        }
      ]
    }
  },
  created() {
    this.menu_code = this.$route.meta.code
    this.reqTitleTable()
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead('initialize');
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
      this.setLineTreeFirstLoadSelect();
    });
  },
  methods: {
    // delete() {
    //   let params = {}
    //   params.context = []
    //   params.context.push(3479426)
    //   this.$client.BatchDeleteTableOrder(params).then(res => {
    //     console.log(res);
    //   })
    // },
    updateTableHeader(newestTableHeaderList) {
      this.$httpTableHeader.saveTableHeader(this.titlesId,this.menu_code,newestTableHeaderList).then(res => {

        this.reqTitleTable()
      }).catch(err => {

      })
    },
    // 获取表头
    reqTitleTable() {
      this.headerLoading = true;
      this.$httpTableHeader.reqTableHeader(this.menu_code,this.customSettingList).then(res => {
        this.titlesId = res.titlesId;
        this.canRendererTableHeader = res.canRendererTableHeader;
        this.customSettingList = res.customSettingList;
        this.customSettingShowList = res.customSettingShowList;
        this.$forceUpdate();
        setTimeout(() =>{
          this.headerLoading = false;
        },600)
      }).catch(err => {
        setTimeout(() =>{
          this.headerLoading = false;
        },600)
      })
    },
    // 第一次加载 显示总公司下面的记录
    setLineTreeFirstLoadSelect() {
      setTimeout(() => {
        if(this.$refs.lineTree.data.length > 0){
          this.$refs.lineTree.setCurrentKey([this.$refs.lineTree.data[0].i_id]);
          this.$refs.lineTree.handleNodeClick(this.$refs.lineTree.data[0]);
          return
        }else{
          this.setLineTreeFirstLoadSelect()
        }
      }, 300);
    },
    // 查询
    onSubmit(form) {
      this.form = Object.assign({}, form);
      this.loadData();
    },
    loadData() {
      this.loading = true;
      let params = Object.assign({}, this.form);
      if(this.curNodeType == 1) {
        params.dept_id = this.curDeptId
      }
      if(this.curNodeType == 2) {
        params.line_id = this.curLineId
      }
      this.$client.GetDataVehicleKeepRepair(params)
        .then((res) => {
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context.list;
            this.sumTotal = {
              1: res.context.list.length + '辆',
              8: res.context.mile,
              9: res.context.door_num,
              10: res.context.one_num,
              11: res.context.two_num,
              12: res.context.small_num,
              13: res.context.out_num,
              14: res.context.total_num,
              15: res.context.hour,
              16: res.context.hour_fee,
              17: res.context.material_fee
            }
          } else {
            this.loading = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
        .catch((err) => {
          this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        });
    },
    // 导出Excel
    exportFile() {
      let params = Object.assign({}, this.form);
      if(this.curNodeType == 1) {
        params.dept_id = this.curDeptId
      }
      if(this.curNodeType == 2) {
        params.line_id = this.curLineId
      }
      // let ids = [ ...this.selectedIds ]
      // if(ids.length) {
      //   params.ids = ids.toString()
      // }
      this.$client.ExportVehicleKeepRepair(params).then((res) => {
        if(res.head) {
          if (res.head.result == "200") {
            window.location.href = res.context;
            this.$message({ type: "success", message: "导出成功" });
          } else {
            this.$message({ type: "error", message: "导出失败" });
          }
        }else{
          this.$message({ type: "warning", message: "暂无可导出内容" });
        }

      });
    },
    // 刷新线路数
    refreshTreeList() {},
    // 选择中的线路
    selectLineInfo(lineInfo) {
      console.log(lineInfo);
      // for (const key in this.form) {
      //   if (Object.hasOwnProperty.call(this.form, key)) {
      //     delete this.form[key];
      //   }
      // }
      this.curNodeType = lineInfo[0].type;
      if(lineInfo[0].type == 1) {
        this.curDeptId = lineInfo[0].i_id;
        this.form.line_id = '';
        delete this.form.line_id;
      }
      if(lineInfo[0].type == 2) {
        // this.$refs.head.resetForm(2);
        this.curLineId = lineInfo[0].i_id;
      }
      // 查询
      this.$refs.head.onSubmit();
    },
    // 打开表头设置
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
    },
    setHead(type) {
      if(type == 'initialize') {
        this.canRendererTableHeader = this.customSettingList;
      }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        this.treeBoxHeight = maxh - 105
        this.TableHeight = maxh - th - 45;
      }, 60);
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.vehicle-maintain-static {
  width: 100%;
  height: 100%;
  display: flex;

  .box-card {
    height: 100%;
    overflow: auto;
  }
  .left-box {
    // flex: 0 0 23vw;
    margin: 0 5px 0 0;
    width: 240px;
    height: 100%;
  }

  .center-box {
    flex: 1;
    height: 100%;
  }
}
.vehicle-maintain-static /deep/ .el-card__header {
  background-color: #F5F5F5;
  padding: 12px 20px;
}
</style>
