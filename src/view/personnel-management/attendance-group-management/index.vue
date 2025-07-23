<template>
  <div class="attendance-group-management" v-loading="addLoading" element-loading-text="正在重新生成考勤结果，请稍等">
     <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="固定排班" name="first">
        <sub-req-fixed
          ref="head"
          @on-add="openAddPage"
          @on-ok="onSubmit"
        ></sub-req-fixed>
        <tr-table
          :selectionShow="false"
          :data="data"
          :tableHeaderList="canRendererTableHeader"
          :isShowBottomOptions="false"
          :TableHeight="TableHeight"
          :loading="loading"
          :frontFixedNum="frontFixedNum"
          :backFixedNum="backFixedNum"
          @on-select-change-row="selectedRowList"
        >
          <template slot-scope="scope" slot="oaKqzUser">
            <span v-if="!!scope.data.oaKqzUser">{{scope.data.oaKqzUser.length || 0}}</span>
          </template>
          <!-- <template slot-scope="scope" slot="type">
            <span>固定班制</span>
          </template> -->
          <template slot-scope="scope" slot="kqsj">
            <p v-html="scope.data.kqsj"></p>
          </template>
          <template slot-scope="scope" slot="is_default">
            <el-switch
              v-model="scope.data.is_default == 1 ? true: false"
              active-color="#409EFF"
              inactive-color="#ff4949"
              @change="changeState(scope.data)"
              >
            </el-switch>
          </template>
          <template slot-scope="scope" slot="operation">
              <!-- <el-button type="primary" size="mini" @click="showScheduling(scope.data)" v-if="$isPowerShow('scheduling') && scope.data.type === 2">排班</el-button> -->
              <el-button type="primary" size="mini" @click="editRowInfo(scope.data,'fixed')" v-if="$isPowerShow('edit')">编辑</el-button>
              <el-popconfirm
                @confirm="deleteRowInfo(scope.data)"
                title="确定删除此条记录吗？"
                v-if="$isPowerShow('del') && !scope.data.is_default">
                <el-button slot="reference" type="danger" size="mini">删除</el-button>
              </el-popconfirm>
          </template>
        </tr-table>

        <el-pagination
          style="margin: 5px 0;display:flex; justify-content: flex-end;"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          ref="paginationH"
          :current-page="pageInfo.pageIndex"
          :page-sizes="[10, 20, 30, 40, 50, 100]"
          :page-size="pageInfo.pageSize"
          layout="total,sizes, prev, pager, next, jumper"
          :total="pageInfo.pageCount"
        >
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="自定义排班" name="second">
        <div class="custom-management-content">
          <el-card class="box-card left-box">
            <div
              slot="header"
              style="flex-wrap: nowrap; align-items:center;"
            >
              <p style="white-space:nowrap;">排班考勤组</p>
              <div style="margin-top:10px">
                <el-button @click="openAddPage('custom')" style="height: 30px" type="primary" size="mini"
                v-if="$isPowerShow('add')"
                  >添加</el-button
                >
                <el-button @click="editRowInfo(groupData,'custom')" style="height: 30px;margin: 0" type="primary" size="mini"
                v-if="$isPowerShow('edit') && groupId"
                  >编辑</el-button
                >
                <el-popconfirm
                  @confirm="deleteRowInfo(groupData)"
                  title="确定删除此条记录吗？"
                  v-if="$isPowerShow('del') && groupId">
                  <el-button slot="reference" style="height: 30px" type="danger" size="mini">删除</el-button>
                </el-popconfirm>
              </div>

            </div>
            <group-tree
              ref="groupTree"
              @on-tree="selectRoleTree"
            ></group-tree>
          </el-card>
          <el-card class="box-card center-box custom-box" ref="centerBox">
            <el-row>
              <el-col :span="24" class="flex-center" style="margin-bottom: 15px;">
                <span class="title">班次说明:</span>
                <div class="flex-center" style="overflow-x: auto">
                  <div v-for="(item,index) in bc_illustrate" :key="index">
                    <div class="box">{{item.cycle_name}}</div>
                  </div>
                </div>
              </el-col>
              <el-col :span="24" style="margin-bottom: 15px;">
                <span class="title">未排班时:</span>
                <el-radio-group v-model="user_select" >
                  <el-radio disabled :label="1">任意打卡</el-radio>
                  <el-radio disabled :label="2">选择班次打卡</el-radio>
                  <el-radio disabled :label="3">不可打卡</el-radio>
                </el-radio-group>
              </el-col>
            </el-row>
            <sub-req-custom
              ref="head2"
              :groupId="groupId"
              @on-ok="onSubmitCustom"
              @on-import="openfiledialog"
              @on-clear="clearCustom"
            ></sub-req-custom>
            <div :style="{'min-height':customHeight + 'px','overflow':'auto'}">
              <table cellpadding="0" v-loading="loading" style="min-width:2630px" :key="key">
                <thead>
                  <tr>
                    <th style="width:150px;height:50px;border:1px solid #333;font-size:18px;position: relative;">
                      <p style="position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);">姓名</p>
                    </th>
                    <template  v-for="(item,index) in daysList">
                      <th :key="index" style="width:80px;height:50px;border:1px solid #333">
                        <p style="margin:3px 0;font-size:18px">{{item.day}}</p>
                        <p style="font-size:18px">{{item.weekDay}}</p>
                      </th>
                    </template>
                  </tr>
                </thead>
                <tbody v-if="user_scheduling_detail.length > 0">
                  <template  v-for="(item,index) in user_scheduling_detail">
                    <tr :key="index">
                      <th style="width:150px;height:50px;border:1px solid #333;font-size:18px;position: relative;">
                        <div style="position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);width:100%">
                          {{item.user_name}}
                          <span v-if="!item.isEdit" @click="editCustom(item,index)" style="color:#409EFF;font-size:12px;cursor: pointer;">编辑</span>
                          <span v-else @click="saveCustom(item,index)" style="color:#409EFF;font-size:12px;cursor: pointer;">保存</span>
                        </div>
                      </th>
                      <template v-for="(t,i) in item.schedulings">
                        <th :key="i" style="width:80px;height:50px;border:1px solid #333;position: relative">
                          <div class="child">
                            <!-- <el-select v-if="t.edit" v-model="user_scheduling_detail[index].schedulings[i].kqbc_id">
                              <el-option 
                                v-for="item in classesList"
                                :key="item.kqbc_id"
                                :label="item.kqbc_name"
                                :value="item.kqbc_id">
                              </el-option>
                            </el-select> -->
                            <el-popover
                              popper-class="custom-popover"
                              placement="top"
                              width="200"
                              :ref="'popover'+ index + i"
                              v-if="t.edit"
                              trigger="click">
                              <div style="max-height:200px;overflow:auto">
                                <!-- <div style="text-align:center;font-size: 16px;margin-bottom: 10px;">修改员工当天班次</div> -->
                                <div v-for="(c,c_i) in bc_illustrate" :key="c_i">
                                  <div class="schedulingBox" @click="choiceChild(c,index,i)">{{c.kqbc_name}}</div>
                                </div>
                                <div style="background:#f2f2f2;color:#59d0ad" class="schedulingBox" @click="choiceChild(-1,index,i)">休息</div> 
                                <div style="background:#f2f2f2;color:#faa29b" class="schedulingBox" @click="choiceChild(0,index,i)">清空</div>
                              </div>
                              <!-- <span slot="reference" style="color:red;font-size:12px;cursor: pointer;">周期排班</span> -->
                              <div slot="reference" class="child">
                                <el-input v-model="t.kqbc_name" readonly class="child-box "></el-input>
                              </div>
                            </el-popover>
                            <div class="child-box" v-else>{{t.kqbc_name}}{{t.edit}}</div>
                          </div>
                        </th>
                      </template>
                    </tr>
                  </template>
                </tbody>
              </table>
              <div :style="{'min-height':customHeight + 'px','text-align':'center','line-height':customHeight + 'px'}" v-if="user_scheduling_detail.length == 0">
                暂无数据
              </div>
            </div>
            
          </el-card>
        </div>
      </el-tab-pane>
    </el-tabs>
    <information-dialog
      ref="informationDialog"
      :dialogBool.sync="informationDialogShow"
      :curSelecedType="curSelecedType"
      :title="informationDialogTitle"
      :shiftOptions="shiftOptions"
      :overtimeRulesOptions="overtimeRulesOptions"
      :groupType="groupType"
      @save-add-edit="saveAddEdit"
    ></information-dialog>

    <!-- <scheduling-add-dialog
      ref="schedulingAddDialog"
      :dialogBool.sync="schedulingDialogShow"
      :kqz_id="kqz_id"
      :title="schedulingTitle"
    ></scheduling-add-dialog> -->

    <!-- 上传文件 导出文件弹窗组件 -->
    <file-dialog
      :dialogBool.sync="filedialogVisible"
      :fileData="FileData"
      :isShowImportState="false"
      @on-submit-excel ="importStaffInfoExcel"
    ></file-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReqFixed from "./component/fixed/sub-req";
import subReqCustom from "./component/custom/sub-req";
import informationDialog from "./component/information-dialog";
import schedulingAddDialog from "./component/scheduling-add-dialog";
import groupTree from "./component/custom/group-tree";
  import fileDialog from '@/components/fileDialog/file-dialog'
import { formatDate, getDaysInMonth, oneDay } from "@/utils/index";
export default {
  name: "attendance-group-management",
  components: {
    subReqFixed,
    informationDialog,
    schedulingAddDialog,
    groupTree,
    subReqCustom,
    fileDialog
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      form: {},
      data: [],
      loading: false,
      addLoading: false,
      TableHeight: 500,
      informationDialogShow: false,
      curSelecedType: "",
      informationDialogTitle: "添加",
      customSettingList: [
        {
          id: 1,
          label: "名称",
          prop: "name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "人数",
          prop: "oaKqzUser",
          width: "80",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "类型",
          prop: "type_name",
          width: "80",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "考勤时间",
          prop: "kqsj",
          width: "220",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "是否默认考勤组",
          prop: "is_default",
          width: "120",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "操作",
          prop: "operation",
          width: "180",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
      ],
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
      selectedIds:[],
      shiftOptions:[], //全部的班次
      overtimeRulesOptions:[], //全部的加班规则

      activeName: 'first',
      groupId: null,
      groupData: null,
      groupType: '',
      daysList: [],
      user_scheduling_detail: [],
      customHeight: 500,
      bc_illustrate: [],
      user_select: null,
      key: null,
      classesList: [],
      filedialogVisible: false,
      FileData: {
        url: window.newHttpConfig.URL_EASYMOCK +  "/Files/TempFiles/月排班导入模板.xlsx",
      },
      customForm: {}
    };
  },
  mounted() {
    this.loadData();
    this.reqByPageOaKqbc();
    this.reqByPageLeaveRule()
    this.$nextTick(() => {
      this.setHeadFixed()
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHeadFixed()
      })
      // 长连接监听考勤班次是否改动  如若改动强制从新刷新考勤组和考勤班次
      window.SignalDom.on('UpdateKqbc', req => {
        console.log('更新班次', req)
        this.loadData();
        this.reqByPageOaKqbc();
        this.informationDialogShow = false
      })
    });
  },
  methods: {
    clearCustom() {
      this.$confirm('此操作将当前月份排班, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        
        let user_ids = []
        this.user_scheduling_detail.forEach(item => {
          user_ids.push(item.user_id)
        })
        let params = {
          context: {
            year_month: this.customForm.month,
            user_ids: user_ids
          }
        }
        console.log('params',params);
        this.$client.EmptyScheduling(params).then(res => {
          if(res.head.result == "200") {
            this.showScheduling();
            this.$message({ message: res.head.describle, type: "success" });
          }else{
            this.$message({
              showClose: true,
              message: res.head.detail,
              type: "error",
            });
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });          
      });
    },
    // 打开导入文件弹窗
    openfiledialog(){
      this.filedialogVisible = true
    },
    // 导入自定义排班Excel
    importStaffInfoExcel(val){
      if (!this.groupId) {
        this.$message({
          showClose: true,
          message: '请选择一个排班考勤组',
          type: "warning",
        });
        return
      }
      let info = this.$refs.head2.form
      let formData = new FormData();
      formData.append("file", val.file);
      formData.append("type", val.radio);
      formData.append("kqz_id", this.groupId);
      formData.append("date", formatDate(new Date(info.month), 'yyyy-MM'));
      let params = formData;
      this.$client.ReadExcelFileOaKqz(params)
      .then(res => {
        if(res.head.result == "200") {
          this.filedialogVisible = false;
          this.showScheduling()
          this.$message({ message: res.head.describle, type: "success" });
        }else{
          this.filedialogVisible = false;
          this.$message({
            showClose: true,
            message: res.head.detail,
            type: "error",
          });
        }
      })
    },
    // 单人保存
    saveCustom(item) {
      this.$confirm('立即生效：今日考勤结果将按新规则重新计算', '选择规则生效时间', {
        distinguishCancelAndClose: true,
        confirmButtonText: '立即生效',
        cancelButtonText: '明天生效'
      }).then(() => {
        this.UpdateScheduling(item,1)
      }).catch(action => {
        if(action == 'cancel') {
        this.UpdateScheduling(item,2)
        }
      });
    },
    // 更新单人排班
    UpdateScheduling(info,type) {
      this.loading = true
      let params = {
        context: {
          isEnableToday: type,
          year_month: this.customForm.month,
          user_id: info.user_id,
          kqz_id: this.groupId,
          schedulings: info.schedulings  
        }
      }
      this.$client.UpdateSchedulingOaKqz(params).then(res => {
        if (res.head.result == "200") {
          this.showScheduling()
        } else { 
          this.loading = false
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    // 修改当日排班
    choiceChild(info,index,i) {
      let obj = info
      if (info === -1) {
        obj = {
          kqbc_id: -1,
          kqbc_name: '休息',
        }
      } else if (info === 0) {
        obj = {
          kqbc_id: 0,
          kqbc_name: '',
        }
      }
      // console.log('info',JSON.parse(JSON.stringify(info)));
      this.user_scheduling_detail[index].schedulings[i].kqbc_id = obj.kqbc_id
      this.user_scheduling_detail[index].schedulings[i].kqbc_name = obj.kqbc_name
      // console.log('user_scheduling_detail',JSON.parse(JSON.stringify(this.user_scheduling_detail)));
      // 关闭弹窗
      this.$nextTick(() => {
        this.$refs[`popover${index}${i}`][0].doClose()
      })
    },
    // 启动编辑
    editCustom(info,index) {
      this.user_scheduling_detail[index].isEdit = true
      this.user_scheduling_detail[index].schedulings.forEach(item => {
        item.edit = true
      })
      this.key = new Date().getTime()
    },
    onSubmitCustom(info) {
      this.getAllDays(info.month)
      this.showScheduling()
    },
    // 获取日期数组
    getAllDays(date) {
      let year = new Date(date).getFullYear()
      let month = new Date(date).getMonth() + 1
      let days = getDaysInMonth(year,month)
      this.daysList = []
      days.forEach(item => {
        let obj = {
          day: item,
          weekDay: oneDay(year,month,item)
        }
        this.daysList.push(obj)
      });

      console.log('daysList',JSON.parse(JSON.stringify(this.daysList)));
    },
    selectRoleTree(data) {
      this.groupId  = data.id
      this.groupData = data

      this.showScheduling()
    },
    handleClick(tab,event) {
      if (tab.name == 'second') {
        this.setHeadCustom()
        if (!this.groupId) {
          this.getAllDays(formatDate(new Date(), 'yyyy-MM'))
        }
      } 
    },
    // 初始化排班数据
    getSchedulingData() {
      this.user_scheduling_detail.forEach(item => {
        if (item.schedulings.length === 0) {
          item.schedulings = Array.from({length: this.daysList.length}, (x, i) => {
            return {
              kqbc_id: 0,
              kqbc_name: '',
              day: i + 1,
            }
          })
        } else {
          if (item.is_exist === 1) {
            if (item.schedulings.length < this.daysList.length) {
              let L = this.daysList.length - item.schedulings.length
              let array = Array.from({length: L}, (x, i) => {
                return {
                  kqbc_id: 0,
                  kqbc_name: '',
                  day: i + item.schedulings.length + 1,
                }
              })
              item.schedulings = [...item.schedulings,...array]
            }
          }
        }
      })
      console.log('user_scheduling_detail',JSON.parse(JSON.stringify(this.user_scheduling_detail)));
    },
    // 打开排班
    showScheduling() {
      if (!this.groupId) {
        this.$message({
          showClose: true,
          message: '请选择一个排班考勤组',
          type: "warning",
        });
        return
      }
      this.classesList = []
      this.loading = true
      let info = this.$refs.head2.form
      this.customForm = Object.assign({},info)
      let params = {
        kqz_id: this.groupId,
        year_month: formatDate(new Date(this.customForm.month), 'yyyy-MM'),
        user_name: this.customForm.user_name
      }
      this.$client.GetScheduling({context: params}).then(res => {
        if (res.head.result == "200") {
          this.user_scheduling_detail = res.context.user_scheduling_detail
          this.user_select = res.context.user_select
          this.bc_illustrate = res.context.bc_illustrate

          let array = [
            {
              kqbc_id: -1,
              kqbc_name: '休息',
            },
            {
              kqbc_id: 0,
              kqbc_name: '',
            }
          ]
          this.classesList = [...this.bc_illustrate,...array]
          this.getSchedulingData()
          this.loading = false
        } else { 
          this.loading = false
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    // 获取全部班次
    reqByPageOaKqbc() {
      let params = {
        context:{}
      }
      this.$client.GetByPageOaKqbc(params).then(res => {
        if (res.head.result == "200") {
          this.shiftOptions = res.context.list;
          this.shiftOptions.forEach(zItem => {
            let timeStr = '';
            if(!!zItem.child && zItem.child.length) {
              zItem.child .forEach((item,index) => {
                if(index === 0) {
                  timeStr = item.up_time+ '-'+ item.down_time
                }else{
                  timeStr = timeStr + ',' + item.up_time + '-'+ item.down_time
                }
                
              });
            }
            zItem.label = zItem.name + ':' + ' ' + timeStr
          })
          this.shiftOptions.push(
            {
              id:0,
              label:'休息'
            }
          )
        } else { 
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
    // 获取的全部的加班规则
    reqByPageLeaveRule() {
      this.$client.GetDataOaJbgz().then(res => {
        if (res.head.result == "200") {
          this.overtimeRulesOptions = res.context;
        } else {
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
    onSubmit(form) {
      this.form = form
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 数据加载
    loadData() {
      this.loading = true;
      let params = {
        context:{}
      }
      params.context = Object.assign({}, this.form);
      params.context.type = 1
      params.context.page_index = this.pageInfo.pageIndex;
      params.context.page_size = this.pageInfo.pageSize;
      this.$client.GetByPageOaKqz(params)
        .then(res => {
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context.list;
            this.pageInfo.pageCount = res.context.total
          } else {
            this.loading = false;
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

    // 编辑、添加
    saveAddEdit(form) {
      this.addLoading = true
      let successrMessage = "";
      let parmas = {
        context: form
      };
      if (this.curSelecedType == "add") {
        delete parmas.context.id;
        successrMessage = "添加成功";
        this.$client
          .AddOaKqz(parmas)
          .then((res) => {
            if (res.head.result == "200") {
              if (this.groupType == 'fixed') {
                this.loadData();
              } else {
                this.$refs.groupTree.loadData()
              }
              this.informationDialogShow = false;
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
            this.addLoading = false
          })

      } else {
        successrMessage = "编辑成功";
        this.$client
        .UpdateOaKqz(parmas)
        .then((res) => {
          if (res.head.result == "200") {
            if (this.groupType == 'fixed') {
              this.loadData();
            } else {
              this.$refs.groupTree.loadData()
              this.groupId = res.context
              this.showScheduling()
            }
            this.informationDialogShow = false;
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
          this.addLoading = false
        })
      }
    },
    openAddPage(type) {
      this.curSelecedType = 'add';
      this.groupType = type
      this.informationDialogTitle = "新增考勤组";
      this.informationDialogShow = true;
    },
    // 分页切换事件
    handleCurrentChange(idx) {
      this.pageInfo.pageIndex = idx;
      this.loadData();
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = sizes;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },

    selectedRowList(list) {
      this.selectedIds = [];
      list.forEach((item,index) => {
        this.selectedIds.push(item.id)
      });
    },
    
    // 编辑
    editRowInfo(form,type) {
      this.curSelecedType = "edit";
      this.groupType = type
      this.informationDialogTitle = "编辑考勤组";
      this.informationDialogShow = true;
      this.$nextTick(() => {
        this.$refs.informationDialog.setData(form);
      })
    },
    // 删除
    deleteRowInfo(info) {
       let params = {
        context: info.id
      };
      
      this.$client.DeleteOaKqz(params)
      .then(res => {
        if (res.head.result == "200") {
          this.loadData();
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
      }).catch(err => {
        this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
      })
    },
    // 修改默认考勤组
    changeState(info) {
      if(!!info.is_default) {
        return
      }
      let params = {
        context: info.id
      };
      this.$client.UpdateDefaultOaKqz(params)
      .then(res => {
        if (res.head.result == "200") {
          this.loadData();
          this.$message({
            showClose: true,
            message: '设置成功',
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
    },
    // 计算表格高度 和初始化表头
    setHeadFixed() {
      this.canRendererTableHeader = this.customSettingList;
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        this.TableHeight = maxh - th - 90;
      }, 60);
    },
    // 计算表格高度 和初始化表头
    setHeadCustom() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head2.$el.offsetHeight;
        this.customHeight = maxh - th - 260;
      }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.attendance-group-management {
  width: 100%;
  height: 100%;
  .custom-management-content {
    width: 100%;
    height: 100%;
    display: flex;
   .box-card {
      height: 100%;
      overflow: auto;
    }

    .left-box {
      flex: 0 0 230px;
      margin: 0 5px 0 0;
      width: 230px;
      height: 100%;
    }

    .center-box {
      flex: 1;
      height: 100%;
    }
  }

  .custom-box {
    .flex-center {
      display: flex;
      align-items: center;
    }
    .title {
      color: #333;
      font-size: 18px;
      margin-right: 15px;
      white-space: nowrap;
    }
    .box { 
      margin-right: 10px;
      padding: 5px 10px;
      color: #52c4f3;
      font-size: 16px;
      min-width: 100px;
      text-align: center;
      white-space: nowrap;
    }
    .child  {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: 0;
      left: 0;
      .child-box {
        display: -webkit-box;
        overflow:hidden; //超出的文本隐藏
        text-overflow:ellipsis; //溢出用省略号显示
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }
    }
  }
  /deep/ {
    .el-input__inner {
      cursor: pointer;
    }
  }
}
</style>

<style lang="stylus" rel="stylesheet/stylus">
.custom-popover {
  .schedulingBox {
    border-radius: 5px;
    padding: 5px 10px;
    color: #000;
    font-size: 16px;
    min-width: 100px;
    text-align: center;
    border: 1px solid #e5e3e3;
    margin-bottom: 5px;
    cursor: pointer;
    overflow:hidden; //超出的文本隐藏
    text-overflow:ellipsis; //溢出用省略号显示
    white-space:nowrap; //溢出不换行
  }
}

</style>