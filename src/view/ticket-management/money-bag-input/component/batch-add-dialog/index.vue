<template>
  <el-dialog
    ref="dialog"
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    :fullscreen.sync="fullscreen"
    width="1080px"
  >
    <div class="el-dialog-div-content" ref="elDialogDivContent">
      <el-card class="box-card left-box">
        <div
          slot="header"
          class="clearfix show-flex-box-r"
          style="height: 37px; flex-wrap: nowrap; align-items: center"
        >
          <span style="white-space: nowrap">线路车辆选择</span>
        </div>
        <div class="show-flex-box-c" :style="`height: ${treeBoxHeight}px`">
          <line-tree
            ref="lineTree"
            :isShowCheckbox="false"
            :isNodeExpanded="false"
            :placeholder="'请输入关键词'"
            @on-check="selectLineInfo"
          ></line-tree>
        </div>
      </el-card>
      <el-card class="box-card center-box" ref="centerBox">
        <sub-req
          ref="head"
          @on-ok="onSubmit"
        ></sub-req>
        <tr-table
          ref="trTable"
          :indexShow="false"
          :selectionShow="false"
          :data="data"
          :tableHeaderList="canRendererTableHeader"
          :isShowBottomOptions="false"
          :TableHeight="TableHeight"
          :loading="loading"
          :frontFixedNum="0"
          :backFixedNum="0"
          :isShowSummary="true"
          :omitColumnIndex="[0,1,2,3,4,6]"
          @sort-table-change="sortTableChange"
        >
        <template slot-scope="scope" slot="lp_num">
          <span :style="`color: ${scope.data.vehicle_id === -1?'#D9001B':''}`">{{scope.data.vehicle_id === -1? '破币': scope.data.lp_num}}</span>
        </template>

        <template slot-scope="scope" slot="state">
          <span :style="`color: ${scope.data.state == 2?'#409EFF':''}`">{{scope.data.state
              === 1? '未审核': scope.data.state
              === 2?'已审核': scope.data.state
              === 3?'取消审核':'--'}}</span>
        </template>

        <template slot-scope="scope" slot="total_fee">
          <el-input v-model="scope.data.total_fee" :ref='scope.data.vehicle_id' 
            @keydown.native="validateCounts(scope.data,scope.index, $event, data)"
            autocomplete="off"
            placeholder="请输入金额" style="width:120px" oninput="value=value.replace(/[^\d.-]/g,'')" 
            size="mini" @blur=" scope.data.total_fee = $event.target.value" 
            :disabled="scope.data.state === 2" v-if="scope.data.state !== 2"></el-input>
          <span v-else>{{scope.data.total_fee}}</span>
        </template>

        </tr-table>
      </el-card>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill()"
        >保 存（Ctrl+S键）</el-button
      >
    </span>
    <div class="full" @click="fullSwitch">
      <i class="el-icon-full-screen"></i>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import lineTree from "./component/line-tree";
export default {
  components: {subReq,lineTree },
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "批量添加",
    },
  },
  mounted() {

  },
  data() {
    return {
      treeBoxHeight: 400,
      TableHeight: 418,
      loading: false,
      fullscreen: false,
      data: [],
      form: {
        dept_id: "",
        line_id: "",
        vehicle_ids: [],
        date: "",
        // total_fee: "",
      },
      canRendererTableHeader: [
        {
          id: 1,
          label: "序号",
          prop: "index",
          width: "80",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "线路",
          prop: "line_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "分公司",
          prop: "dept_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "车牌号",
          prop: "lp_num",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: true,
        },
        {
          id: 5,
          label: "自编号",
          prop: "vehicle_number",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: true,
        },
        {
          id: 6,
          label: "金额",
          prop: "total_fee",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "审核状态",
          prop: "state",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        }
      ],
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        // this.$refs.lineTree.onClear();
        Object.assign(this.$data, this.$options.data());
      }else{
        this.$nextTick(() => {
          // this.$refs.form.clearValidate();
          this.setDate();
          this.setLineTreeFirstLoadSelect();
          this.ListeningKeyboardEvent();
        })
        
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 设置默认日期为前一天
    setDate() {
      let date = new Date();
      date.setTime(new Date().getTime()-24*60*60*1000);
      let Y = date.getFullYear()
      let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
      let D = date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()
      this.form.date = Y + '-' + M + '-' + D
      this.$refs.head.form.date = this.form.date
    },
    // 第一次加载 显示总公司下面的线路车辆
    setLineTreeFirstLoadSelect() {
      setTimeout(() => {
        if(this.$refs.lineTree.data.length > 0){
          this.$refs.lineTree.setCurrentKey([this.$refs.lineTree.data[0].i_id]);
          this.$refs.lineTree.handleNodeClick(this.$refs.lineTree.data[0]);
          return
        }else{
          this.setLineTreeFirstLoadSelect()
        }
        
      }, 100);
    },
    onSubmit(val) {
      this.form.date = val;
      this.reqLineVehicles()
    },
    // 选择中的线路
    selectLineInfo(lineInfo) {
      // console.log(lineInfo);
      if(lineInfo[0].type == 1) {
        this.form.dept_id = lineInfo[0].i_id
        delete this.form.line_id
        delete this.form.vehicle_ids
      }

      if(lineInfo[0].type == 2) {
        this.form.line_id = lineInfo[0].i_id ? lineInfo[0].i_id.split('_')[1] : ''
        delete this.form.dept_id
        delete this.form.vehicle_ids
      }

      if(lineInfo[0].type == 3) {
        this.form.vehicle_ids = [lineInfo[0].i_id]
        delete this.form.line_id
        delete this.form.dept_id
      }

      this.reqLineVehicles()
    },
    // 获取节点（组织、线路、车辆）下面的数据
    reqLineVehicles() {
      this.loading = true;
      let params = Object.assign({}, this.form)
      let scapshow = this.$refs.lineTree.scapshow - 1
      if(scapshow > -1) params.vechice_state  = scapshow
      this.$client.GetSimpleDataDayPurse(params).then(res => {
        // console.log(res)
        if(res.head.result == "200") {
          this.data = res.context.map(((item, sing)=> {
            if(item.total_fee === 0 && item.state === 0) {
              item.total_fee = ''
            }
            item.index = sing + 1
            return item
          }))
          this.loading = false;
        }else{
          this.loading = true;
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    // 排序
    sortTableChange(info, list) {
      // console.log(this);
      let dataList = this.$refs.trTable.$refs.table.tableData
      this.data = dataList.map(((item, sing)=> {
        item.index = sing + 1
        return item
      }))
    },
    validateCounts(row,index, e, data) {
      // console.log(this.sortData);
      
      var keyCode = e.keyCode || e.which || e.charCode;
      if(keyCode=== 13) {
        this.$refs[row.vehicle_id].blur()
        if(data.length-1 === index) {
          index = -1
        }
        this.$refs[data[index + 1]['vehicle_id']].focus();
      }
    },
    // 监听键盘事件
    ListeningKeyboardEvent() {
      let that = this;
      document.onkeydown = function(e) {
        let key = window.event.keyCode || window.event.which;
        // tab键 9 enter 13 ctrl 17
        if (e.ctrlKey && e.key == 's') {
            e.preventDefault(); // 阻止默认行为，防止页面刷新
            // console.log('Ctrl+S 被按下，执行保存操作。');
            that.updatePlaybill()
        //     // 在这里执行保存操作
        }
      }
    },
    // 切换全屏
    fullSwitch() {
      this.fullscreen = !this.fullscreen
      let maxh = this.$el.offsetHeight;
      this.treeBoxHeight = this.fullscreen ? (maxh - 249) : 400;
      this.TableHeight = this.fullscreen ? (maxh - 229) : 418;
      // console.log(maxh, this.treeBoxHeight, this.TableHeight);
    },
    // 确定保存
    updatePlaybill() {
      this.$emit("save-batch-add-edit", this.data);
    },
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
/deep/ .el-dialog__body {
  height: calc(100% - 124px);
  .el-dialog-div-content {
    display: flex;
    height: 100%;
    width: 100%;
    .left-box {
      // flex: 0 0 23vw;
      margin: 0 5px 0 0;
      width: 280px;
      height: 100%;
    }
    .center-box {
      flex: 1;
      height: 100%;
    }
    .box-card {
      height: 100%;
      // overflow: auto;
    }
  }
}

.el-dialog-div-content  /deep/ .el-card__header {
  background-color: #F5F5F5;
  padding: 12px 20px;
}

.full {
  position: absolute;
  right: 45px;
  top: 22px;
  cursor: pointer;
}
</style>

