<template>
  <el-dialog
    :visible="dialogBool"
    width="1250px"
    :before-close="dialogClose"
    center
  >
    <div class="salary-rule-setting-dialog-box">
      <tr-page-header ref="trPageHeader" slot="title" :content="showTitle" @back="dialogClose"></tr-page-header>
      <div class="salary-rule-setting-dialog">
        <el-tabs :tab-position="'left'" style="height: 100%;" v-model="activeName"  @tab-click="handleClick">
          <el-tab-pane :label="tableHeaderKeyName[item]" :name="item" v-for="(item,index) in tableHeaderKey" :key="index">
            <div class="table-content show-flex-box-c">
              <div class="show-flex-box-r" style="margin-bottom: 10px;">
                <i style="float: left; width: 6px; height: 18px; background: #409eff;margin-top:5px"></i>
                <p style="margin-left: 15px;color: #303133;font-size: 16px;font-weight: bold;line-height: 24px; margin-right: 10px;">{{tableHeaderKeyName[item]}}</p>
                <el-button type="primary" size="mini" @click.stop="addRule()">添加</el-button>
              </div>
              <tr-table
                ref="trTabelBox"
                :selectionShow="true"
                :data="dataMap[item]"
                :tableHeaderList="tableHeaderData[item]"
                :TableHeight="TableHeight"
                :loading="loading"
                :frontFixedNum="frontFixedNum"
                :backFixedNum="backFixedNum"
              >
                <template slot-scope="scope" slot="comprehensiveAward">
                  <div class="set-proportion-box show-flex-box-c" v-if="!!scope.data.detail_items && scope.data.detail_items.length > 0">
                    <div class="set-proportion-start show-flex-box-r" style="align-items: center; margin-bottom: 15px;" v-if="scope.data.detail_items.length > 0">
                      <span>上班天数小于等于&nbsp;</span>
                      <el-input v-model="scope.data.detail_items[0].max" placeholder="" style="width:120px" oninput="value=value.replace(/[^\d.-]/g,'')" size="mini" @blur="scope.data.detail_items[0].max = $event.target.value" disabled> <template slot="append">天</template> </el-input>
                      <span>&nbsp;，综合奖金额：</span>
                      <el-input v-model="scope.data.detail_items[0].value" placeholder="" style="width:150px" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="scope.data.detail_items[0].value = $event.target.value" size="mini" disabled> <template slot="append">元/天</template> </el-input>
                    </div>

                    <ul class="show-flex-box-c" v-if="scope.data.detail_items.length > 2">
                      <li class="show-flex-box-r" style="align-items: center;" v-for="(item,index) in scope.data.detail_items" :key="index">
                        <div class="show-flex-box-r" style="align-items: center;margin-right:10px;margin-bottom: 15px;"  v-if=" index != 0 && index != (scope.data.detail_items.length -1)">
                          <span>上班天数大于等于&nbsp;</span>
                          <el-input v-model="item.min" placeholder="" style="width:120px" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="item.min = $event.target.value" size="mini" disabled> <template slot="append">天</template> </el-input>
                          <span>&nbsp;，小于等于&nbsp;</span>
                          <el-input v-model="item.max" placeholder="" style="width:120px" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="item.max = $event.target.value" size="mini" disabled> <template slot="append">天</template> </el-input>
                          <span>&nbsp;，综合奖金额：</span>
                          <el-input v-model="item.value" placeholder="" style="width:150px" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="item.value= $event.target.value" size="mini" disabled> <template slot="append">元/天</template> </el-input> 
                        </div>
                        <!-- <span class="show-flex-box-r" v-if="index == (proportionSetList.length-1)">
                          <el-button type="primary" icon="el-icon-circle-plus-outline" size="mini" @click="addProportionSetList"></el-button>
                          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteProportionSetList(index)"></el-button>
                        </span> -->
                      </li>
                    </ul>
                    <!-- <div class="show-flex-box-r" style="align-items: center; margin-bottom: 15px;"  v-else>
                      <span>增加综合奖金额设置: &nbsp;&nbsp;</span>
                      <el-button type="primary" icon="el-icon-circle-plus-outline" size="mini" @click="addProportionSetList"></el-button>
                    </div> -->
                    <div class="set-proportion-end show-flex-box-r" style="align-items: center; padding-bottom: 15px;" v-if="scope.data.detail_items.length > 1">
                      <span>上班天数大于等于&nbsp;</span>
                      <el-input v-model="scope.data.detail_items.slice(-1)[0].min" placeholder="" style="width:120px" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="scope.data.detail_items.slice(-1)[0].min = $event.target.value" size="mini" disabled> <template slot="append">天</template> </el-input>
                      <span>&nbsp;，综合奖金额：</span>
                      <el-input v-model="scope.data.detail_items.slice(-1)[0].value" placeholder="" style="width:150px" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="scope.data.detail_items.slice(-1)[0].value = $event.target.value" size="mini" disabled> <template slot="append">元/天</template> </el-input>
                    </div>
                  </div>
                  <div v-else style="color: #909399">
                    暂无设置综合奖薪资规则
                  </div>
                </template>

                <template slot-scope="scope" slot="operation">
                  <el-button
                    type="primary"
                    size="mini"
                    @click.stop="openLeaveRecordPop(scope.data)"
                    >编辑</el-button
                  >
                <el-popconfirm
                    @confirm="deleteRowInfo(scope.data)"
                    title="确定删除此条记录吗？"
                    v-if="$isPowerShow('del') && !!scope.data.line_id[0]"
                  >
                    <el-button
                      slot="reference"
                      type="danger"
                      size="mini"
                      style="margin-left: 10px"
                      >删除</el-button
                    >
                  </el-popconfirm>
                </template>
              </tr-table>
            </div>
          </el-tab-pane>
        </el-tabs>
        <div class="dialog-content">
          <set-infor-dialog
            ref="setInforDialog"
            :dialogBool.sync="isShowSetRuleSettingDialog"
            :curChangeType="curChangeType"
            :title="tableHeaderKeyName[this.activeName]"
            :activeName="activeName"
            :curInfo="curInfo"
            @save-add-edit="saveAddEdit"
          ></set-infor-dialog>
        </div>
      </div>
    </div>
    
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import tableHeader from './table-header'
import setInforDialog from "./component/set-infor-dialog";
export default {
  components: {
    setInforDialog
  },
  props: {
    dialogBool: Boolean,
  },
  data() {
    return {
      showTitle: "薪资规则设定",
      activeName: 'first',
      TableHeight: 400,
      loading: false,
      frontFixedNum: 1,
      backFixedNum: 1,
      tableHeaderKey:[],
      tableHeaderData:{},
      tableHeaderKeyName:{
        'first':'线路日基础工资设置',
        'second': '综合奖设置',
        'third': '餐补设置',
        'fourth': '请假趟次金额设置'
      },
      dataMap:{
        'first':[],
        'second': [],
        'third': [],
        'fourth': [],
      },
      curChangeType:'add',
      isShowSetRuleSettingDialog: false,
      curInfo:{}, //当前要编辑的规则

      startForm: {
        min: 0,
        max: "",
        value: "",
      },
      endForm: {
        min: "",
        max: -1,
        value: "",
      },
      proportionSetList:[
        {
          min: '',
          max: '',
          value:'',
        }
      ],
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      } else {
        this.configData();
        this.reqSalaryRulsList('first')
        this.$nextTick(() => {
          window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
            this.setHead()
          })
          this.setHead();
        });
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    configData() {
      this.tableHeaderData = tableHeader
      this.tableHeaderKey = Object.keys(tableHeader)
    },
    handleClick(tab, event) {
      this.reqSalaryRulsList(tab.name);
      // switch (tab.name) {
      //   case 'first':

      //     break;
      //   case 'second':

      //     break;
      //   case 'third':

      //     break;
      //   case 'fourth':

      //     break;
      // }
    },
    reqSalaryRulsList(type) {
      this.loading = true;
      let types = [];
      switch (type) {
        case 'first':
          types = [1,2]
          break;
        case 'second':
          types = [3]
          break;
        case 'third':
          types = [4]
          break;
        case 'fourth':
          types = [5,6]
          break;
      }
      this.$client.ListSalaryList({types: types})
        .then(res => {
          if (res.head.result == "200") {
            setTimeout(() => {
              this.loading = false;
            }, 400);
            this.dataMap[type] = null;
            if(type == 'first' || type == 'fourth') {
              this.dataMap[type] = this.bulidListData(res.context.list);
            }else{
              this.dataMap[type] = res.context.list;
            }
        //     this.$nextTick(() => {
        //       let _this = this
        //       setTimeout(() => {
        //         this.$refs.trTabelBox.headerDragend()
        //         // 　　　　this.$refs.tableBox.$refs.table.doLayout()
        //       },300)
        // 　　})

          } else {
            setTimeout(() => {
              this.loading = false;
            }, 400);
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch(err => {
           this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
    },
    // 构建 线路日基础工资设置和请假趟次金额设置
    bulidListData(list) {
      let bigList = []
      let smallList = []
      list.forEach(item => {
        if(item.type == 1 || item.type == 5) {
          bigList.push(item)
        }
        if(item.type == 2 || item.type == 6) {
          smallList.push(item)
        }
      })
      const arrs = bigList.map(item => {
        // const data = smallList.find(i => item.line_id == i.line_id)

        const data = smallList.find(i => ([...new Set(item.line_id)].sort()).toString() ==  ([...new Set(i.line_id)].sort()).toString()) //找两个记录相同的多个线路相同
        item.bigFee = item.fee
        delete item.fee
        item.bigType = item.type
        delete item.type
        item.bigId = item.id
        delete item.id

        data.smallFee = data.fee
        delete data.fee
        data.smallType = data.type
        delete data.type
        data.smallId = data.id
        delete  data.id
        return {
          ...item,
          ...data,
        }
      })
      return arrs
    },
    // 打开设置规则
    addRule() {
      this.curChangeType = 'add'
      this.isShowSetRuleSettingDialog = true
    },
    // 编辑设置规则
    openLeaveRecordPop(form) {
      this.curInfo = form;
      this.curChangeType = 'edit'
      // this.$refs.setInforDialog.setData(form)
      this.isShowSetRuleSettingDialog = true
    },
    // 保存添加、編輯
    saveAddEdit(form) {
      let successrMessage = "";
      let parmas = {
        context: form,
      };
      if (this.curChangeType == "add") {
        successrMessage = "添加成功";
      } else {
        successrMessage = "编辑成功";
      }

      this.$client
        .SalaryRuleBatchSetSalaryList(parmas)
        .then((res) => {
          if (res.head.result == "200") {
            this.reqSalaryRulsList(this.activeName);
            this.isShowSetRuleSettingDialog = false;
            this.$message({
              showClose: true,
              message: successrMessage,
              type: "success",
            });
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
        .catch((err) => {});
    },
    //
    deleteRowInfo(row) {
      let params = {
        context: [],
      };
      switch (this.activeName) {
        case 'first':
          params.context = [row.bigId, row.smallId]
          break;

        default:
          params.context = [row.id]
          break;
      }
      this.$client.BatchDeleteSalaryList(params)
        .then((res) => {
          if (res.head.result == "200") {
            this.reqSalaryRulsList(this.activeName);
            this.$message({
              showClose: true,
              message: "删除成功",
              type: "success",
            });
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch((err) => {
          this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        });
    },
    // 计算表格高度
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let trPageHeader = this.$refs.trPageHeader.$el.offsetHeight;
        this.TableHeight = 600 - 140 - trPageHeader;
      }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.salary-rule-setting-dialog-box{
  height: 500px;
}
</style>
