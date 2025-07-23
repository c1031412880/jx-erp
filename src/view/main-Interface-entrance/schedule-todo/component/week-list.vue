<template>
  <div class="week-list">
    <div class="head-box">
      <span style="margin-right:60px;font-size:16px;text-align:center;">{{value.getFullYear()}} 年 {{value.getMonth() + 1}} 月</span>
      <!-- <el-radio-group v-model="radio" @change="selectWeekType" size="mini">
        <el-radio-button label="last">{{this.curSelectType == 'week' ? '上 周' : '昨 天'}}</el-radio-button>
        <el-radio-button label="this">{{this.curSelectType == 'week' ? '本 周' : '今 天'}}</el-radio-button>
        <el-radio-button label="next">{{this.curSelectType == 'week' ? '下 周' : '明 天'}}</el-radio-button>
      </el-radio-group> -->
      <el-button-group>
        <el-button type="" size="mini" @click="selectWeekType('last')">{{this.curSelectType == 'week' ? '上 周' : '昨 天'}}</el-button>
        <el-button type="" size="mini" @click="selectWeekType('this')">{{this.curSelectType == 'week' ? '本 周' : '今 天'}}</el-button>
        <el-button type="" size="mini" @click="selectWeekType('next')">{{this.curSelectType == 'week' ? '下 周' : '明 天'}}</el-button>
      </el-button-group>
    </div>
    <div class="content-list">
      <tr-table
        :data="data"
        :loading="loading"
        :indexShow="false"
        :selectionShow="false"
        :TableHeight="TableHeight"
        :isShowBottomOptions="false"
        :tableHeaderList="canRendererTableHeader">
        <template slot-scope="scope" :slot="weekInfo[strWeek[0]]">
          <div v-for="item in scope.data[weekInfo[strWeek[0]]]" :key="item.id">
            <div v-if="item.start_time.slice(11, 13) == scope.data.time.slice(0, 2)">
              <el-popover
                placement="left"
                width="360"
                :ref="refNamePopover+item.id">
                <div class="second-popover">
                  <div style="display: flex;align-items: center;">
                    <div style="height: 14px; width: 8px; background-color:#169BD5;margin-right:10px;"></div>
                    <p>{{item.title}}</p>
                  </div>
                  <p><span>时间：</span><span>{{item.start_time + '~' + item.end_time}}</span></p>
                  <p><span>人员：</span><span>{{item.play_user_name}}</span></p>
                  <p><span>地点：</span><span>{{item.address}}</span></p>
                  <p><span>内容：</span><span>{{item.detail}}</span></p>
                </div>
                <div style="text-align: right; margin: 0">
                  <el-button @click="openScheduleDetail(item)" type="" size="mini" plain>查看详情</el-button>
                  <el-button @click="updateScheduleInfo(item)" v-show="item.created_id == user_id" type="primary" size="mini" plain>编辑</el-button>
                  <el-popconfirm
                    @confirm="deleteSchedule(item)"
                    title="确认删除?">
                    <el-button v-show="item.created_id == user_id" type="danger" size="mini" slot="reference" plain>删除</el-button>
                  </el-popconfirm>
                </div>
                <div slot="reference" style="display:flex;align-items: center;cursor:pointer;">
                  <div :style="{'margin-right':'5px','width':'6px','height':'6px','border-radius': '50%','background-color': !!item.color ? item.color : '#030303','flex-shrink': 0,}"></div>
                  <div :style="{'white-space':'nowrap','overflow': 'hidden','text-overflow': 'ellipsis','text-decoration': item.state == 3 ? 'line-through' : 'blink'}">{{item.title}}</div>
                </div>
              </el-popover>
            </div>
          </div>
        </template>
        <template slot-scope="scope" :slot="weekInfo[strWeek[1]]">
          <div v-for="item in scope.data[weekInfo[strWeek[1]]]" :key="item.id">
            <div v-if="item.start_time.slice(11, 13) == scope.data.time.slice(0, 2)">
              <el-popover
                placement="left"
                width="360"
                :ref="refNamePopover+item.id">
                <div class="second-popover">
                  <div style="display: flex;align-items: center;">
                    <div style="height: 14px; width: 8px; background-color:#169BD5;margin-right:10px;"></div>
                    <p>{{item.title}}</p>
                  </div>
                  <p><span>时间：</span><span>{{item.start_time + '~' + item.end_time}}</span></p>
                  <p><span>人员：</span><span>{{item.play_user_name}}</span></p>
                  <p><span>地点：</span><span>{{item.address}}</span></p>
                  <p><span>内容：</span><span>{{item.detail}}</span></p>
                </div>
                <div style="text-align: right; margin: 0">
                  <el-button @click="openScheduleDetail(item)" type="" size="mini" plain>查看详情</el-button>
                  <el-button @click="updateScheduleInfo(item)" v-show="item.created_id == user_id" type="primary" size="mini" plain>编辑</el-button>
                  <el-popconfirm
                    @confirm="deleteSchedule(item)"
                    title="确认删除?">
                    <el-button v-show="item.created_id == user_id" type="danger" size="mini" slot="reference" plain>删除</el-button>
                  </el-popconfirm>
                </div>
                <div slot="reference" style="display:flex;align-items: center;cursor:pointer;">
                  <div :style="{'margin-right':'5px','width':'6px','height':'6px','border-radius': '50%','background-color': !!item.color ? item.color : '#030303','flex-shrink': 0,}"></div>
                  <div :style="{'white-space':'nowrap','overflow': 'hidden','text-overflow': 'ellipsis','text-decoration': item.state == 3 ? 'line-through' : 'blink'}">{{item.title}}</div>
                </div>
              </el-popover>
            </div>
          </div>
        </template>
        <template slot-scope="scope" :slot="weekInfo[strWeek[2]]">
          <div v-for="item in scope.data[weekInfo[strWeek[2]]]" :key="item.id">
            <div v-if="item.start_time.slice(11, 13) == scope.data.time.slice(0, 2)">
              <el-popover
                placement="left"
                width="360"
                :ref="refNamePopover+item.id">
                <div class="second-popover">
                  <div style="display: flex;align-items: center;">
                    <div style="height: 14px; width: 8px; background-color:#169BD5;margin-right:10px;"></div>
                    <p>{{item.title}}</p>
                  </div>
                  <p><span>时间：</span><span>{{item.start_time + '~' + item.end_time}}</span></p>
                  <p><span>人员：</span><span>{{item.play_user_name}}</span></p>
                  <p><span>地点：</span><span>{{item.address}}</span></p>
                  <p><span>内容：</span><span>{{item.detail}}</span></p>
                </div>
                <div style="text-align: right; margin: 0">
                  <el-button @click="openScheduleDetail(item)" type="" size="mini" plain>查看详情</el-button>
                  <el-button @click="updateScheduleInfo(item)" v-show="item.created_id == user_id" type="primary" size="mini" plain>编辑</el-button>
                  <el-popconfirm
                    @confirm="deleteSchedule(item)"
                    title="确认删除?">
                    <el-button v-show="item.created_id == user_id" type="danger" size="mini" slot="reference" plain>删除</el-button>
                  </el-popconfirm>
                </div>
                <div slot="reference" style="display:flex;align-items: center;cursor:pointer;">
                  <div :style="{'margin-right':'5px','width':'6px','height':'6px','border-radius': '50%','background-color': !!item.color ? item.color : '#030303','flex-shrink': 0,}"></div>
                  <div :style="{'white-space':'nowrap','overflow': 'hidden','text-overflow': 'ellipsis','text-decoration': item.state == 3 ? 'line-through' : 'blink'}">{{item.title}}</div>
                </div>
              </el-popover>
            </div>
          </div>
        </template>
        <template slot-scope="scope" :slot="weekInfo[strWeek[3]]">
          <div v-for="item in scope.data[weekInfo[strWeek[3]]]" :key="item.id">
            <div v-if="item.start_time.slice(11, 13) == scope.data.time.slice(0, 2)">
              <el-popover
                placement="left"
                width="360"
                :ref="refNamePopover+item.id">
                <div class="second-popover">
                  <div style="display: flex;align-items: center;">
                    <div style="height: 14px; width: 8px; background-color:#169BD5;margin-right:10px;"></div>
                    <p>{{item.title}}</p>
                  </div>
                  <p><span>时间：</span><span>{{item.start_time + '~' + item.end_time}}</span></p>
                  <p><span>人员：</span><span>{{item.play_user_name}}</span></p>
                  <p><span>地点：</span><span>{{item.address}}</span></p>
                  <p><span>内容：</span><span>{{item.detail}}</span></p>
                </div>
                <div style="text-align: right; margin: 0">
                  <el-button @click="openScheduleDetail(item)" type="" size="mini" plain>查看详情</el-button>
                  <el-button @click="updateScheduleInfo(item)" v-show="item.created_id == user_id" type="primary" size="mini" plain>编辑</el-button>
                  <el-popconfirm
                    @confirm="deleteSchedule(item)"
                    title="确认删除?">
                    <el-button v-show="item.created_id == user_id" type="danger" size="mini" slot="reference" plain>删除</el-button>
                  </el-popconfirm>
                </div>
                <div slot="reference" style="display:flex;align-items: center;cursor:pointer;">
                  <div :style="{'margin-right':'5px','width':'6px','height':'6px','border-radius': '50%','background-color': !!item.color ? item.color : '#030303','flex-shrink': 0,}"></div>
                  <div :style="{'white-space':'nowrap','overflow': 'hidden','text-overflow': 'ellipsis','text-decoration': item.state == 3 ? 'line-through' : 'blink'}">{{item.title}}</div>
                </div>
              </el-popover>
            </div>
          </div>
        </template>
        <template slot-scope="scope" :slot="weekInfo[strWeek[4]]">
          <div v-for="item in scope.data[weekInfo[strWeek[4]]]" :key="item.id">
            <div v-if="item.start_time.slice(11, 13) == scope.data.time.slice(0, 2)">
              <el-popover
                placement="left"
                width="360"
                :ref="refNamePopover+item.id">
                <div class="second-popover">
                  <div style="display: flex;align-items: center;">
                    <div style="height: 14px; width: 8px; background-color:#169BD5;margin-right:10px;"></div>
                    <p>{{item.title}}</p>
                  </div>
                  <p><span>时间：</span><span>{{item.start_time + '~' + item.end_time}}</span></p>
                  <p><span>人员：</span><span>{{item.play_user_name}}</span></p>
                  <p><span>地点：</span><span>{{item.address}}</span></p>
                  <p><span>内容：</span><span>{{item.detail}}</span></p>
                </div>
                <div style="text-align: right; margin: 0">
                  <el-button @click="openScheduleDetail(item)" type="" size="mini" plain>查看详情</el-button>
                  <el-button @click="updateScheduleInfo(item)" v-show="item.created_id == user_id" type="primary" size="mini" plain>编辑</el-button>
                  <el-popconfirm
                    @confirm="deleteSchedule(item)"
                    title="确认删除?">
                    <el-button v-show="item.created_id == user_id" type="danger" size="mini" slot="reference" plain>删除</el-button>
                  </el-popconfirm>
                </div>
                <div slot="reference" style="display:flex;align-items: center;cursor:pointer;">
                  <div :style="{'margin-right':'5px','width':'6px','height':'6px','border-radius': '50%','background-color': !!item.color ? item.color : '#030303','flex-shrink': 0,}"></div>
                  <div :style="{'white-space':'nowrap','overflow': 'hidden','text-overflow': 'ellipsis','text-decoration': item.state == 3 ? 'line-through' : 'blink'}">{{item.title}}</div>
                </div>
              </el-popover>
            </div>
          </div>
        </template>
        <template slot-scope="scope" :slot="weekInfo[strWeek[5]]">
          <div v-for="item in scope.data[weekInfo[strWeek[5]]]" :key="item.id">
            <div v-if="item.start_time.slice(11, 13) == scope.data.time.slice(0, 2)">
              <el-popover
                placement="left"
                width="360"
                :ref="refNamePopover+item.id">
                <div class="second-popover">
                  <div style="display: flex;align-items: center;">
                    <div style="height: 14px; width: 8px; background-color:#169BD5;margin-right:10px;"></div>
                    <p>{{item.title}}</p>
                  </div>
                  <p><span>时间：</span><span>{{item.start_time + '~' + item.end_time}}</span></p>
                  <p><span>人员：</span><span>{{item.play_user_name}}</span></p>
                  <p><span>地点：</span><span>{{item.address}}</span></p>
                  <p><span>内容：</span><span>{{item.detail}}</span></p>
                </div>
                <div style="text-align: right; margin: 0">
                  <el-button @click="openScheduleDetail(item)" type="" size="mini" plain>查看详情</el-button>
                  <el-button @click="updateScheduleInfo(item)" v-show="item.created_id == user_id" type="primary" size="mini" plain>编辑</el-button>
                  <el-popconfirm
                    @confirm="deleteSchedule(item)"
                    title="确认删除?">
                    <el-button v-show="item.created_id == user_id" type="danger" size="mini" slot="reference" plain>删除</el-button>
                  </el-popconfirm>
                </div>
                <div slot="reference" style="display:flex;align-items: center;cursor:pointer;">
                  <div :style="{'margin-right':'5px','width':'6px','height':'6px','border-radius': '50%','background-color': !!item.color ? item.color : '#030303','flex-shrink': 0,}"></div>
                  <div :style="{'white-space':'nowrap','overflow': 'hidden','text-overflow': 'ellipsis','text-decoration': item.state == 3 ? 'line-through' : 'blink'}">{{item.title}}</div>
                </div>
              </el-popover>
            </div>
          </div>
        </template>
        <template slot-scope="scope" :slot="weekInfo[strWeek[6]]">
          <div v-for="item in scope.data[weekInfo[strWeek[6]]]" :key="item.id">
            <div v-if="item.start_time.slice(11, 13) == scope.data.time.slice(0, 2)">
              <el-popover
                placement="left"
                width="360"
                :ref="refNamePopover+item.id">
                <div class="second-popover">
                  <div style="display: flex;align-items: center;">
                    <div style="height: 14px; width: 8px; background-color:#169BD5;margin-right:10px;"></div>
                    <p>{{item.title}}</p>
                  </div>
                  <p><span>时间：</span><span>{{item.start_time + '~' + item.end_time}}</span></p>
                  <p><span>人员：</span><span>{{item.play_user_name}}</span></p>
                  <p><span>地点：</span><span>{{item.address}}</span></p>
                  <p><span>内容：</span><span>{{item.detail}}</span></p>
                </div>
                <div style="text-align: right; margin: 0">
                  <el-button @click="openScheduleDetail(item)" type="" size="mini" plain>查看详情</el-button>
                  <el-button @click="updateScheduleInfo(item)" v-show="item.created_id == user_id" type="primary" size="mini" plain>编辑</el-button>
                  <el-popconfirm
                    @confirm="deleteSchedule(item)"
                    title="确认删除?">
                    <el-button v-show="item.created_id == user_id" type="danger" size="mini" slot="reference" plain>删除</el-button>
                  </el-popconfirm>
                </div>
                <div slot="reference" style="display:flex;align-items: center;cursor:pointer;">
                  <div :style="{'margin-right':'5px','width':'6px','height':'6px','border-radius': '50%','background-color': !!item.color ? item.color : '#030303','flex-shrink': 0,}"></div>
                  <div :style="{'white-space':'nowrap','overflow': 'hidden','text-overflow': 'ellipsis','text-decoration': item.state == 3 ? 'line-through' : 'blink'}">{{item.title}}</div>
                </div>
              </el-popover>
            </div>
          </div>
        </template>
      </tr-table>
    </div>
    <div class="dialog-div">
      <add-schedule-event 
        ref="scheduleEvent"
        :title="'编辑日程'"
        @save-add-edit="saveScheduleEvent"
        :dialogBool.sync="addScheduleEventVisible">
      </add-schedule-event>
      <schedule-detail-dialog 
        ref="scheduleDetail" 
        :user_id="user_id"
        @on-commit="loadData"
        :dialogBool.sync="scheduleDetailVisible">
        <!-- @save-add-edit="saveScheduleType" -->
      </schedule-detail-dialog>
      <el-dialog
        title="编辑日程或计划"
        :visible.sync="dialogVisible"
        width="300px">
        <el-form :model="baseForm">
          <el-form-item prop="type">
            <el-radio v-model="baseForm.type" :label="1">编辑本次日程</el-radio>
            <el-radio v-model="baseForm.type" :label="2">编辑计划</el-radio>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="updatePlaybill('form')">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="删除日程或计划"
        :visible.sync="delVisible"
        width="300px">
        <el-form :model="delForm">
          <el-form-item prop="type">
            <el-radio v-model="delForm.type" :label="1">删除本次日程</el-radio>
            <el-radio v-model="delForm.type" :label="2">删除计划</el-radio>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="delVisible = false">取 消</el-button>
          <el-button type="primary" @click="deleteComment('form')">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { getUser } from "@/utils/auth";
import {getWeekDataList, getYearWeek,formatTime} from '@/utils/index'
import addScheduleEvent from "./add-schedule-event"
import scheduleDetailDialog from "./schedule-detail-dialog"
export default {
  props: {
    value: '',
    curSelectType: {
      type: String,
      default: 'week'
    },
    schedule_type: '',
    schedule_title: '',
  },
  components: {
    addScheduleEvent,
    scheduleDetailDialog
  },
  data() {
    return {
      user_id: 0,
      radio: 'this',
      data: [],
      loading: false,
      TableHeight: 500,
      canRendererTableHeader: null,
      strWeek: ['周日','周一','周二','周三','周四','周五','周六'],
      weekInfo: getWeekDataList(this.value),
      refNamePopover: 'popover-', // popover ref名称前缀
      addScheduleEventVisible: false,
      scheduleDetailVisible: false,
      dialogVisible: false,
      baseForm: {
        id: '',
        type: 1
      },
      selectRow: {},
      delVisible: false,
      delForm: {
        type: 1
      }
    }
  },
  mounted() {
    let userInfo = JSON.parse(getUser());
    this.user_id = Number(userInfo.user_id)
    this.setTableHeader()
    this.$nextTick(() => {
      this.setHead()
      this.loadData()
    })
  },
  watch: {
    curSelectType(val) {
      // console.log(val);
      this.setTableHeader()
      this.setHead()
      this.loadData()
    }
  },
  methods: {
    // 设置表头和列表信息
    setTableHeader() {
      let week = '第' + getYearWeek(this.value) + '周'
      if(this.curSelectType == 'week') {
        this.canRendererTableHeader = [
          {
            id: 1,
            label: week,
            prop: "time",
            width: "80",
            align: "center",
            signIndex: 0,
            sortable: false,
            notTooltip: true,
          },
          {
            id: 2,
            label: '周一 ' + this.weekInfo['周一'].slice(5, 10),
            prop: this.weekInfo['周一'],
            width: "100",
            align: "center",
            signIndex: 1,
            notTooltip: true,
          },
          {
            id: 3,
            label: '周二 ' + this.weekInfo['周二'].slice(5, 10),
            prop: this.weekInfo['周二'],
            width: "100",
            align: "center",
            signIndex: 2,
            notTooltip: true,
          },
          {
            id: 4,
            label: '周三 ' + this.weekInfo['周三'].slice(5, 10),
            prop: this.weekInfo['周三'],
            width: "100",
            align: "center",
            signIndex: 3,
            notTooltip: true,
          },
          {
            id: 5,
            label: '周四 ' + this.weekInfo['周四'].slice(5, 10),
            prop: this.weekInfo['周四'],
            width: "100",
            align: "center",
            signIndex: 4,
            notTooltip: true,
          },
          {
            id: 6,
            label: '周五 ' + this.weekInfo['周五'].slice(5, 10),
            prop: this.weekInfo['周五'],
            width: "100",
            align: "center",
            signIndex: 5,
            notTooltip: true,
          },
          {
            id: 7,
            label: '周六 ' + this.weekInfo['周六'].slice(5, 10),
            prop: this.weekInfo['周六'],
            width: "100",
            align: "center",
            signIndex: 6,
            notTooltip: true,
          },
          {
            id: 8,
            label: '周日 ' + this.weekInfo['周日'].slice(5, 10),
            prop: this.weekInfo['周日'],
            width: "100",
            align: "center",
            signIndex: 7,
            notTooltip: true,
          },
        ]
      }else {
        let title = this.value.getMonth() + 1 + '月' + this.value.getDate() + '日' + ' ' + this.strWeek[this.value.getDay()]
        this.canRendererTableHeader = [
          {
            id: 1,
            label: week,
            prop: "time",
            width: "80",
            align: "center",
            signIndex: 0,
            sortable: false,
            notTooltip: true,
          },
          {
            id: 2,
            label: title,
            prop: formatTime(this.value),
            width: "260",
            align: "center",
            signIndex: 1,
            notTooltip: true,
          },
        ]
      }
      let arr = []
        for(let i = 0; i < 24; i++) {
          let time = i < 10 ? '0' + i : i
          let obj = {
            time: time + ':00'
          }
          arr.push(obj)
        }
        this.data = arr
      // console.log(week, this.weekInfo, this.canRendererTableHeader);
    },
    // 获取数据
    loadData() {
      let params = {context: {}}
      params.context.start_time = this.curSelectType == 'week' ? this.weekInfo['周一'] : formatTime(this.value)
      params.context.end_time = this.curSelectType == 'week' ? this.weekInfo['周日'] + ' 23:59:59' : formatTime(this.value) + ' 23:59:59'
      params.context.schedule_type = this.schedule_type
      params.context.schedule_title = this.schedule_title
      this.$client.GetUserScheduleScheduleManage(params)
        .then(res => { 
          if (res.head.result == "200") {
            let arr = []
            for(let i = 0; i < 25; i++) {
              let time = i < 10 ? '0' + i : i
              let obj = {
                time: time + ':00'
              }
              let info = Object.assign(obj, res.context)
              arr.push(info)
            }
            this.data = arr
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch(err => {
          // console.log(err);
          this.$message({
            showClose: true,
            message: err.body.describle,
            type: "error",
          });
        })
    },
    // 切换周及日
    selectWeekType(val) {
      let date = new Date()
      let time = 24 * 60 * 60 * 1000
      switch (val) {
        case 'last':
          date = this.curSelectType == 'week' ? new Date(this.value.getTime() - 7*time) : new Date(this.value.getTime() - time)
          break;
        case 'next':
          date = this.curSelectType == 'week' ? new Date(this.value.getTime() + 7*time) : new Date(this.value.getTime() + time)
          break;
        default:
          break;
      }
      // console.log(date, formatTime(date));
      this.$emit('on-set', date)
      this.weekInfo = getWeekDataList(date)
      setTimeout(() => {
        this.setTableHeader()
        this.loadData()
      }, 30);
    },
    // 删除
    deleteSchedule(row) {
      if(row.repeat_type == 210) {
        let params = {context: row.id}
        this.$client.DelScheduleManage(params)
          .then(res => { 
            if (res.head.result == "200") {
              this.closeRefPopover(row.id)
              this.getScheduleData()
              this.$message({
                showClose: true,
                message: '删除成功',
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
      }else {
        this.delForm.type = 1
        this.selectRow = Object.assign({}, row)
        this.delVisible = true
      }
    },
    // 删除日程
    deleteComment() {
      let delHttp = {
        1: 'DelScheduleManage',
        2: 'DelPlanScheduleManage',
      }
      let params = {context: this.delForm.type == 1 ? this.selectRow.id : this.selectRow.plan_id}
      this.$client[delHttp[this.delForm.type]](params)
        .then(res => { 
          this.delVisible = false
          if (res.head.result == "200") {
            this.closeRefPopover(this.selectRow.id)
            this.$emit('update-tree')
            this.loadData()
            this.$message({
              showClose: true,
              message: '删除成功',
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
          // console.log(err);
          this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
    },
    // 打开详情
    openScheduleDetail(row) {
      let params ={
        id: row.id,
        type: 1
      }
      this.$client.GetScheduleByIDScheduleManage(params)
        .then(res => { 
          if (res.head.result == "200") {
            // this.closeRefPopover(row.id)
            this.scheduleDetailVisible = true
            this.$refs.scheduleDetail.setData(res.context)
            if(!row.is_read) {
              // 日程已读
              this.setScheduleRead(row.id)
            }
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch(err => {
          console.log(err);
          this.$message({
            showClose: true,
            message: err.body.describle,
            type: "error",
          });
        })
    },
    // 编辑日程
    updateScheduleInfo(row) {
      this.selectRow = Object.assign({}, row)
      if(row.repeat_type == 210) {
        this.baseForm.type = 1
        this.updatePlaybill()
      }else {
        this.dialogVisible = true
      }
      // console.log(this.baseForm);
      // this.addScheduleEventVisible = true
      // let info = Object.assign({}, row)
      // this.$refs['scheduleEvent'].setData(info)
    },
    updatePlaybill() {
      this.baseForm.id = this.baseForm.type == 1 ? this.selectRow.id : this.selectRow.plan_id
      let params = Object.assign({}, this.baseForm)
      this.$client.GetScheduleByIDScheduleManage(params)
        .then(res => { 
          if (res.head.result == "200") {
            let info = Object.assign({}, res.context)
            this.addEventTitle = '编辑日程'
            this.addScheduleEventVisible = true
            this.$refs['scheduleEvent'].setData(info)
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch(err => {
          console.log(err);
          this.$message({
            showClose: true,
            message: err.body.describle,
            type: "error",
          });
        })
    },
    // 保存创建日程
    saveScheduleEvent(form) {
      let httpObj = {
        1: 'AddScheduleManage',
        2: 'EditScheduleManage'
      }
      let params = {context: {}}
      params.context = form
      this.$client[httpObj[this.baseForm.type]](params)
        .then(res => { 
          this.dialogVisible = false
          if (res.head.result == "200") {
            this.addScheduleEventVisible = false
            this.$emit('update-tree')
            this.loadData()
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch(err => {
          // console.log(err);
          this.$message({
            showClose: true,
            message: err.body.describle,
            type: "error",
          });
        })
    },
    // 调已读接口
    setScheduleRead(id) {
      this.$client.ReadScheduleManage({context: id})
        .then(res => { 
          if (res.head.result == "200") {
            this.loadData()
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
    },
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        this.TableHeight = maxh - 73;
        // console.log(maxh);
      }, 60);
    },
    // 关闭相应popover
    closeRefPopover(id) {
      let refName = this.refNamePopover + id;
			// console.log('删除当前数据', id);
			// console.log('删除当前数据ref', this.$refs[refName]);
			// 通过操作dom树，关闭popover
			this.$refs[refName][0].doClose();
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.week-list {
  width: 100%;
  height: 100%;
  .head-box {
    padding: 12px 20px;
    border-bottom: 1px solid #ebeef5;
    display: flex;
    align-items: center;
  }
  .content-list {
    height: calc(100% - 53px);
    padding: 10px 20px;
  }
}
/deep/ .el-table__header > .cell {
  white-space:wrap;/* 规定文本是否折行 */
}
</style>