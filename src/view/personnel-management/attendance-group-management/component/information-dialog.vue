<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    :close-on-click-modal="false"
    width="950px"
    
  >
    <div class="el-dialog-div">
      <el-form :model="form" :rules="basicRules" ref="form" label-width="160px" size="mini">
        <el-form-item label="考勤组名称:" prop="name">
          <el-input v-model="form.name" placeholder="请输入考勤组名称"></el-input>
        </el-form-item>
        <el-form-item label="参与考勤人员:" prop="user_index">
           <get-users-select
              ref="personalTree"
              v-model="form.user_index"
              :width="'700'"
              :show_all="true"
              :isShowCheckbox="true"
              :placeholder="'请选择参与考勤人员'"
              :isExportMultiple="true"
              :isCheckStrictly="false"
            ></get-users-select>
        </el-form-item>
        <el-form-item label="自动加入考勤组部门:" prop="oaKqzDept">
          <get-department-select
              ref="oaKqzDeptTree"
              v-model="form.oaKqzDept"
              :width="'700'"
              :isShowCheckbox="true"
              :placeholder="'请选择参与考勤组部门'"
              :isContainEmp="false"
              :isExportMultiple="true"
              :isCheckStrictly="false"
            ></get-department-select>
        </el-form-item>
        <el-card class="box-card">
          <el-tabs v-model="groupType" >
            <el-tab-pane label="固定考勤（考勤打卡时间相同）" name="fixed" v-if="groupType == 'fixed'">
              <div class="show-flex-box-c">
                <strong style="margin-bottom: 8px">工作日设置：<span style="color:#909399;font-size:12px;">如若系统有班次存在，默认周一周五自动选择系统中的第一个班次、周六，周日休息</span></strong>
                <tr-table
                  :selectionShow="false"
                  :indexShow="false"
                  :data="data"
                  :tableHeaderList="canRendererTableHeader"
                  :isShowBottomOptions="false"
                  :TableHeight="300"
                  :loading="false"
                  :frontFixedNum="0"
                  :backFixedNum="0"
                  @on-select-change-row="selectedRowList"
                  :isFixedEmptyPlaceholder="false"
                >
                  <template slot-scope="scope" slot="kqbc_id">
                    <el-select v-model="scope.data.kqbc_id" placeholder="请选择班次时间段" size="mini" style="width:400px;">
                      <el-option
                        v-for="item in shiftOptions"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </template>
                  <!-- <template slot-scope="scope" slot="operation">
                      <el-button type="primary" size="mini" @click="changeShift(scope.data,scope.index)">更改班次</el-button>
                  </template> -->
                </tr-table>
              </div>
              <div class="show-flex-box-c">
                <div class="show-flex-box-r" style="align-items:center;margin:15px 0;">
                  <strong>特殊日期：</strong>
                  <el-button @click="addFirstDate()" type="primary" icon="el-icon-plus" size="mini" style="margin:0 15px">添加</el-button>
                  <span>必须打卡日期</span>
                </div>
                <tr-table
                  :selectionShow="false"
                  :indexShow="false"
                  :data="specialDateDataFrist"
                  :tableHeaderList="canRendererTableHeaderFirst"
                  :isShowBottomOptions="false"
                  :TableHeight="150"
                  :loading="false"
                  :frontFixedNum="0"
                  :backFixedNum="0"
                  :isFixedEmptyPlaceholder="false"
                >
                <template slot-scope="scope" slot="ts_date">
                   <el-date-picker
                    v-model="scope.data.ts_date"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                    size="mini"
                  >
                  </el-date-picker>
                </template>
                <template slot-scope="scope" slot="kqbc_id">
                  <el-select v-model="scope.data.kqbc_id" placeholder="请选择班次时间段" size="mini" style="width:250px;">
                    <el-option
                      v-for="item in shiftOptions"
                      :key="item.id"
                      :label="item.label"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </template>
                <template slot-scope="scope" slot="remark">
                  <el-input v-model="scope.data.remark" placeholder="备注" style="width:150px" size="mini"></el-input>
                </template>
                  <template slot-scope="scope" slot="operation">
                      <el-popconfirm
                        @confirm="deleteFristKqbcRowInfo(scope.data,scope.index)"
                        title="确定删除此条记录吗？">
                        <el-button slot="reference" type="danger" size="mini">删除</el-button>
                      </el-popconfirm>
                  </template>
                </tr-table>
              </div>
              <div class="show-flex-box-c">
                <div class="show-flex-box-r" style="align-items:center;margin:15px 0;">
                  <strong>特殊日期：</strong>
                  <el-button @click="addSecondDate()" type="primary" icon="el-icon-plus" size="mini" style="margin:0 15px">添加</el-button>
                  <span>无须打卡日期</span>
                </div>
                <tr-table
                  :selectionShow="false"
                  :indexShow="false"
                  :data="specialDateDataSecond"
                  :tableHeaderList="canRendererTableHeaderThird"
                  :isShowBottomOptions="false"
                  :TableHeight="150"
                  :loading="false"
                  :frontFixedNum="0"
                  :backFixedNum="0"
                  :isFixedEmptyPlaceholder="false"
                >
                  <template slot-scope="scope" slot="ts_date">
                    <el-date-picker
                      v-model="scope.data.ts_date"
                      type="date"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      placeholder="选择日期"
                      size="mini"
                    >
                    </el-date-picker>
                  </template>
                  <template slot-scope="scope" slot="remark">
                    <el-input v-model="scope.data.remark" placeholder="备注" style="width:250px" size="mini"></el-input>
                  </template>
                  <template slot-scope="scope" slot="operation">
                      <el-popconfirm
                        @confirm="deleteSecondKqbcRowInfo(scope.data,scope.index)"
                        title="确定删除此条记录吗？">
                        <el-button slot="reference" type="danger" size="mini">删除</el-button>
                      </el-popconfirm>
                  </template>
                </tr-table>
              </div>
            </el-tab-pane>
            <el-tab-pane label="排班制（自定义设置考勤时间）" name="custom" v-if="groupType == 'custom'">
              <el-form-item label="考勤班次:" prop="oaKqzDept">
                <el-select v-model="form.scheduling_kqbc" style="width:100%" multiple placeholder="请选择">
                  <el-option
                    v-for="item in classesData"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="">
                <p>
                  <el-radio v-model="form.user_select" :label="1">未排班,可以随便打卡</el-radio>
                </p>
                <p>
                  <el-radio v-model="form.user_select" :label="2">未排班时,员工可选择班次打卡</el-radio>
                </p>
                <p>
                  <el-radio v-model="form.user_select" :label="3">未排班,员工不可打卡</el-radio>
                </p>
              </el-form-item>
              <!-- <div class="show-flex-box-c">
                <div class="show-flex-box-r" style="align-items:center;margin:15px 0;">
                  <strong>排班周期：</strong>
                  <el-button @click="addScheduling()" v-show="form.scheduling_kqbc.length > 0" type="primary" icon="el-icon-plus" size="mini" style="margin:0 15px">添加</el-button>
                </div>
                <tr-table
                  :selectionShow="false"
                  :indexShow="false"
                  :data="form.scheduling_cycle"
                  :tableHeaderList="schedulingTableHeader"
                  :isShowBottomOptions="false"
                  :TableHeight="200"
                  :loading="false"
                  :frontFixedNum="0"
                  :backFixedNum="0"
                  :isFixedEmptyPlaceholder="false"
                  :key="key"
                >
                 <template slot-scope="scope" slot="cycle_bc">
                    <p v-html="scope.data.cycle_bc" style="max-height:70px;overflow: auto"></p>
                  </template>
                  <template slot-scope="scope" slot="operation">
                    <el-button type="text" size="mini" @click="addScheduling(scope.data,scope.index)">设置</el-button>
                    <el-button type="text" size="mini" @click="delScheduling(scope.index)">删除</el-button>
                  </template>
                </tr-table>
              </div> -->
            </el-tab-pane>
          </el-tabs>
        </el-card>
        <el-form-item label="考勤方式:" prop="oaKqzDept" style="margin-top:20px;">
          <el-checkbox-group v-model="form.clock_mode">
            <el-checkbox :label="1" disabled>地点打卡</el-checkbox>
            <el-checkbox :label="2">是否需要拍照打卡</el-checkbox>
            <el-checkbox :label="3">是否允许外勤打卡</el-checkbox>
            <el-checkbox :label="4">外勤是否需要拍照</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="考勤地点:" prop="oaKqzDept" style="margin-top:20px;">
          <div class="show-flex-box-r" style="align-items:center;margin-bottom: 15px;">
            <el-button @click="openAddPlace()" type="primary" icon="el-icon-plus" size="mini" style="margin:0 15px">添加</el-button>
            <span>可添加多个考勤地点</span>
          </div>
          <tr-table
            :selectionShow="false"
            :indexShow="false"
            :data="form.oaKqzAddress"
            :tableHeaderList="canRendererTableHeaderSecond"
            :isShowBottomOptions="false"
            :TableHeight="150"
            :loading="false"
            :frontFixedNum="0"
            :backFixedNum="0"
            :isFixedEmptyPlaceholder="false"
          >
          <template slot-scope="scope" slot="address">
             <el-input v-model="scope.data.address" placeholder="考勤地点" style="width:200px"></el-input>
          </template>
          <template slot-scope="scope" slot="range">
              <el-input v-model="scope.data.range" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="scope.data.range = $event.target.value" placeholder="范围" style="width:120px">
              <template slot="append">米</template>
              </el-input>
          </template>
          <template slot-scope="scope" slot="operation">
            <el-button type="text" size="mini" @click="openAddPlace(scope.data,scope.index)">编辑</el-button>
            <el-popconfirm
              @confirm="deletePlaceRowInfo(scope.data,scope.index)"
              title="确定删除此条记录吗？">
              <el-button slot="reference" type="text" size="mini">删除</el-button>
            </el-popconfirm>
          </template>
            
          </tr-table>
        </el-form-item>

        <el-form-item label="加班规则:" prop="oaKqzDept" style="margin-top:20px;">
          <div class="overtime-select">
            <el-select v-model="form.overtime_id" clearable placeholder="请选择加班规则" >
              <el-option
                v-for="item in overtimeRulesOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
          
        </el-form-item>
      </el-form>
    </div>


    <select-place-dialog ref="selectPlaceDialog" :dialogBool.sync="isShowSelectPlaceDialog" @save-place="savePlace"></select-place-dialog>
    <scheduling-dialog 
      ref="schedulingDialog" 
      :schedulingKeys="form.scheduling_kqbc"
      :classesData="classesData"
      :dialogBool.sync="schedulingDialog" 
      @save-place="saveScheduling">
    </scheduling-dialog>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import getUsersSelect from "@/components/base/formModel/tree/get-department-select-tree2";
import selectPlaceDialog from "./select-place-dialog";
import schedulingDialog from "./scheduling-dialog";
export default {
  components: {
    getDepartmentSelect,
    selectPlaceDialog,
    getUsersSelect,
    schedulingDialog
  },
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "编辑",
    },
    shiftOptions: { //全部的班次
      type: Array,
      default: () => []
    },
    overtimeRulesOptions: { //全部的加班规则
      type: Array,
      default: () => []
    },
    curSelecedType: [String],
    groupType: [String],
  },
  mounted() {
  },
  data() {
    return {
      canRendererTableHeader:[
        {
          id: 1,
          label: "工作日",
          prop: "name",
          width: "80",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "班次时间段",
          prop: "kqbc_id",
          width: "180",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        // {
        //   id: 3,
        //   label: "操作",
        //   prop: "operation",
        //   width: "80",
        //   align: "center",
        //   signIndex: 2,
        //   sortable: false,
        // },
      ],
      canRendererTableHeaderFirst:[
        {
          id: 1,
          label: "特殊日期",
          prop: "ts_date",
          width: "180",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "班次时间段",
          prop: "kqbc_id",
          width: "250",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "备注",
          prop: "remark",
          width: "150",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "操作",
          prop: "operation",
          width: "80",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
      ],
      canRendererTableHeaderThird:[
        {
          id: 1,
          label: "特殊日期",
          prop: "ts_date",
          width: "200",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "备注",
          prop: "remark",
          width: "180",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "操作",
          prop: "operation",
          width: "80",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
      ],
      canRendererTableHeaderSecond:[
        {
          id: 1,
          label: "考勤地址",
          prop: "address",
          width: "160",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "经度",
          prop: "lon",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "纬度",
          prop: "lat",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "有效范围",
          prop: "range",
          width: "140",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "操作",
          prop: "operation",
          width: "80",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
      ],
      data:[
        {
          id:1,
          name:"周一",
          sort:1,
          kqbc_id: 0
        },
        {
          id:2,
          name:"周二",
          sort:2,
          kqbc_id: 0
        },
        {
          id:3,
          name:"周三",
          sort: 3,
          kqbc_id: 0
        },
        {
          id:4,
          name:"周四",
          sort:4,
          kqbc_id: 0
        },
        {
          id:5,
          name:"周五",
          sort:5,
          kqbc_id: 0
        },
        {
          id:6,
          name:"周六",
          sort:6,
          kqbc_id: 0
        },
        {
          id:7,
          name:"周日",
          sort:7,
          kqbc_id: 0
        },
      ],
      specialDateDataFrist:[
        // {
        //   ts_date:'',
        //   kqbc_id:'',
        //   remark:'',
        // }
      ], //特殊需打卡日期数据
      specialDateDataSecond:[
        // {
        //   ts_date:'',
        //   kqbc_id:'',
        //   remark:'',
        // }
      ], //特殊无需打卡日期数据
      form: {
        id: "",
        name: "",
        is_default: 0,
        oaKqzWeek:[], //考勤工作日班次
        user_index: [], 
        oaKqzUser: [], //参与考勤人员
        oaKqzDept:[], //自动加入考勤组部门
        oaKqzTsrq:[], //特殊日期

        clock_mode:[1,2,3,4], //考勤方式

        oaKqzAddress:[], //打卡地点
        overtime_id:'', //加班id

        scheduling_kqbc: [],
        user_select: 1,
        scheduling_cycle: [], //排班周期
      },
      basicRules: {
        name: [
          { required: true, message: "请输入考勤组名称", trigger: "change" },
        ],
        oaKqzUser: [
          { required: true, message: "请选择参与考勤人员", trigger: "change" },
        ],
      },
      isShowSelectPlaceDialog:false,

      classesData: [],
      schedulingTableHeader:[
        {
          id: 1,
          label: "周期名称",
          prop: "cycle_name",
          width: "180",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "周期班次",
          prop: "cycle_bc",
          width: "250",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "周期天数",
          prop: "cycle_days",
          width: "80",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "操作",
          prop: "operation",
          width: "120",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
      ],
      schedulingDialog: false,
      schedulingType: '',
      schedulingIndex: 0,
      key: null,

      placeType: 'add',
      placeIndex: null
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        this.$refs.personalTree.onClear();
        this.$refs.oaKqzDeptTree.onClear();
        Object.assign(this.$data, this.$options.data());
      }else{
        this.GetByPageOaKqbc()
        if(this.curSelecedType == 'add') {
          this.configDefaultShift()
        }
        this.$nextTick(() => {
          this.$refs.form.clearValidate();
        })
      }
    },
  },
  methods: {
    // 添加排班
    saveScheduling(form) {
      let info = ''
      info = this.getCycleInfo(form.tableData)
      let obj = {
        cycle_name: form.name,
        cycle_details: form.tableData,
        cycle_days: form.tableData.length,
        cycle_bc: info
      }
      if (this.schedulingType === 'add') {
        this.form.scheduling_cycle.push(obj)
      } else if (this.schedulingType === 'edit') {
        this.form.scheduling_cycle[this.schedulingIndex] = obj
      }
      this.key = new Date().getTime()
    },
    // 获取周期班次
    getCycleInfo(list) {
      let data = []
      list.forEach(item => {
        this.classesData.forEach(t => {
          if (item.kqbc_id === t.id) {
            data.push(t)
          }
        })
        if (item.kqbc_id == -1) {
          data.push(-1)
        }
      })

      let info = ''
      data.forEach(item =>{
        // 休息
        if (item === -1) {
          info += '休息 <br/>' 
        } else { 
          let name = item.name
          let time = []
          let obj = ''
          item.child.forEach(child => {
            time.push(child.up_time + '-' + child.down_time)
          })
          obj = name + ' ' + time.toString() + '<br/>'
          info += obj
        }
      })
      return info 
    },
    // 打开排班
    addScheduling(row,index) {
      if (!!row) {
        this.$refs.schedulingDialog.form.name = row.cycle_name
        this.$refs.schedulingDialog.form.tableData = row.cycle_details
        this.schedulingType = 'edit'
        this.schedulingIndex = index
      } else {
        this.schedulingType = 'add'
      }

      this.$nextTick(() => {
        this.schedulingDialog = true
      })
    },
    // 删除排班
    delScheduling(index) {
      this.form.scheduling_cycle.splice(index,1)
    },
    // 获取班次
    GetByPageOaKqbc() {
      let params = {
        context: {
          page_index: 1,
          page_size: 99
        }
      }
      this.$client.GetByPageOaKqbc(params).then(res => {
        if (res.head.result == "200") {
          this.classesData = res.context.list;
          this.classesData.forEach(zItem => {
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
        }
      })
    },
    dialogClose() {
      this.$refs.personalTree.onClear();
      this.$refs.oaKqzDeptTree.onClear();
      this.$emit("update:dialogBool", false);
    },
    configDefaultShift() {
      if(!!this.shiftOptions && this.shiftOptions.length) {
        let fristIds = this.shiftOptions[0].id
        this.data.forEach((item,index) => {
          if(index < 5) {
            item.kqbc_id = fristIds
          }
        });
      }
    },
    selectedRowList(list) {
      this.selectedIds = [];
      list.forEach((item,index) => {
        this.selectedIds.push(item.id)
      });
    },
    // 打开更换班次弹窗
    changeShift(row,index) {
    
    },
    deleteRowInfo(row) {
    
    },
    // 添加必须打卡特殊日期
    addFirstDate() {
      let obj = {
          ts_date:'',
          kqbc_id: this.shiftOptions[0].id,
          remark:'',
        }
      this.specialDateDataFrist.push(obj)
    },
    // 删除必须打卡特殊日期
    deleteFristKqbcRowInfo(row,index) {
      this.specialDateDataFrist.splice(index,1)
    },
    // 添加无须打卡特殊日期
    addSecondDate() {
      let obj = {
        ts_date:'',
        kqbc_id: 0,
        remark:'',
      }
      this.specialDateDataSecond.push(obj)
    },
    // 删除必须打卡特殊日期
    deleteSecondKqbcRowInfo(row,index) {
      this.specialDateDataSecond.splice(index,1)
    },
    // 打开地图选择考勤地点
    openAddPlace(row,index) {
      this.isShowSelectPlaceDialog = true
      this.placeType = 'add'
      if (!! row) {
        this.$nextTick(() => {
          this.placeType = 'edit'
          this.placeIndex = index
          this.$refs.selectPlaceDialog.addPlace(row)
        })
      }
    },
    // 保存考勤地点
    savePlace(form) {
      if (this.placeType === 'edit') {
        this.form.oaKqzAddress[this.placeIndex].address = form.address
        this.form.oaKqzAddress[this.placeIndex].lon = form.lon
        this.form.oaKqzAddress[this.placeIndex].lat = form.lat
      } else {
       this.form.oaKqzAddress.push(form)
      }
      this.isShowSelectPlaceDialog = false
    },
    // 删除考勤地点
    deletePlaceRowInfo(row,index) {
      this.form.oaKqzAddress.splice(index,1)
    },

    // 数据编辑回显示
    setData(info) {
      let val = JSON.parse(JSON.stringify(info))
      for (const key in this.form) {
        if (Object.hasOwnProperty.call(val, key)) {
          this.form[key] = val[key];
          if (info.type == 1) {
            if(key == 'oaKqzWeek') {
              this.data = []
              let weekMap = {
                1:'周一',
                2:'周二',
                3:'周三',
                4:'周四',
                5:'周五',
                6:'周六',
                7:'周日',
              }
              val[key].forEach(item => {
                let dataObj = {
                    id:item.sort,
                    name:weekMap[item.sort],
                    sort:item.sort,
                    kqbc_id: item.kqbc_id
                  }
                this.data.push(dataObj)
              })
            }
            if(key == 'oaKqzTsrq' && !!val[key] && val[key].length) {
              val[key].forEach(element => {
                  if(element.type == 1) {
                    this.specialDateDataFrist.push(element)
                  }
                  if(element.type == 2) {
                    this.specialDateDataSecond.push(element)
                  }
              });
            }else{
              this.form.oaKqzTsrq = []
            }
          }
        }
      }
      this.form.type = info.type
      this.$nextTick(() =>{
        this.$refs.form.clearValidate();
      })
    },

    // 确定保存
    updatePlaybill(formName) {
      if (this.groupType === 'fixed') {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            try{
              this.specialDateDataFrist.forEach((item,index) => {
                if(item.ts_date === '') {
                  this.$message({
                    message: `第${index+1}必须打卡中的“特殊日期”为必选项`,
                    type: 'warning'
                  });
                  throw new Error("ending")
                }
              })
              this.specialDateDataSecond.forEach((item,index) => {
                if(item.ts_date === '') {
                  this.$message({
                    message: `第${index+1}无须打卡中的“特殊日期”为必选项`,
                    type: 'warning'
                  });
                  throw new Error("ending")
                }
              })
            }catch(e) {
              if(e.message == "ending"){
                return
              }
            }
            this.form.oaKqzUser = []
            if (this.form.user_index.length > 0) {
              this.form.user_index.forEach(item => {
                this.form.oaKqzUser.push(Number(item.split('-')[1]))
              })
            }
            let info = JSON.parse(JSON.stringify(this.form))
            info.oaKqzWeek = this.data.map(item => {
              let obj = {
                sort: item.sort,
                kqbc_id: item.kqbc_id
              }
              return obj
            })
            if(this.specialDateDataFrist.length){
              info.oaKqzTsrq.push({
                type: 1,
                detail: this.specialDateDataFrist
              })
            }
            if(this.specialDateDataSecond.length) {
              info.oaKqzTsrq.push({
                type: 2,
                detail: this.specialDateDataSecond
              })
            }
            info.type = 1
            this.$confirm('立即生效：今日考勤结果将按新规则重新计算', '选择规则生效时间', {
              distinguishCancelAndClose: true,
              confirmButtonText: '立即生效',
              cancelButtonText: '明天生效'
            }).then(() => {
                info.isEnableToday = 1
                this.$emit("save-add-edit", info);
              }).catch(action => {
                if(action == 'cancel') {
                  info.isEnableToday = 2
                  this.$emit("save-add-edit", info);
                }
              });
          } else {
            return false;
          }
        });
      } else {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // if (this.form.scheduling_cycle.length == 0) {
            //   this.$message({
            //     message: '排班周期不能为空',
            //     type: 'warning'
            //   });
            //   return false
            // }
            this.form.oaKqzUser = []
            if (this.form.user_index.length > 0) {
              this.form.user_index.forEach(item => {
                this.form.oaKqzUser.push(Number(item.split('-')[1]))
              })
            }
            let info = JSON.parse(JSON.stringify(this.form))
            info.type = 2

            info.isEnableToday = 1
            this.$confirm('此操作将修改当前排班, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$emit("save-add-edit", info);
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消修改'
              });          
            });
          }else {
            return false;
          }
        })
      }
    },
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div{
  height: 400px;
  overflow-y: scroll;
}
.overtime-select /deep/ .el-input {
  width: 700px;
}
</style>

