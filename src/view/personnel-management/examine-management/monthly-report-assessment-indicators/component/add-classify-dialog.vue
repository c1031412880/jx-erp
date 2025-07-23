<template>
  <el-dialog
    :visible="dialogBool"
    title="经营业绩考核指标完成情况跟踪表"
    :before-close="dialogClose"
    width="80%"
    top="0"
  >
    <div class="el-dialog-div">
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        class="demo-form"
        size="mini"
      >
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="创建人:" prop="user_name">
              <el-input v-model="form.user_name" disabled placeholder="请选择所属分类"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所在部门:" prop="dept_name">
              <el-input v-model="form.dept_name" disabled placeholder="请输入类别名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请日期:" prop="request_date">
              <el-date-picker
                v-model="form.request_date"
                style="width: 100%;"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                :disabled="curType != 'add' && curType != 'all'">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="考核年份:" prop="check_year">
              <el-date-picker
                v-model="form.check_year"
                style="width: 100%;"
                type="year"
                placeholder="选择年"
                value-format="yyyy"
                :disabled="curType != 'add' && curType != 'all'">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="说明:" prop="remark">
              <el-input v-model="form.remark" clearable placeholder="请输入" :disabled="curType != 'add' && curType != 'all'"></el-input>
            </el-form-item>
          </el-col>
            <!-- 填写规则  ： 只能填写当前月份之前的 且 前一个月有数据  -->
          <el-col :span="24">
            <tx-table
              :title="'重点任务指标'"
              :data="form.key_point_tasks"
              :tableHeaderList="keynoteTableHeaderList"
              :tableType="1"
              :id="form.id"
              :isAdmin="isAdmin"
              :curType="curType"
              @on-import="onImport"
              @change-month="changeMonth"
            >
              <template slot-scope="scope" slot="check_content">
                <el-input v-if="curType == 'add' || curType == 'all'" type="textarea" v-model="scope.data.check_content" clearable ></el-input>
                <span v-else class="text" v-html="scope.data.check_content"></span>
              </template>
              <template slot-scope="scope" slot="check_detail">
                <el-input v-if="curType == 'add' || curType == 'all'" type="textarea" v-model="scope.data.check_detail" clearable></el-input>
                <span v-else class="text" v-html="scope.data.check_detail"></span>
              </template>
              <template slot-scope="scope" slot="write_person_list">
                <get-department-select
                  v-if="curType == 'add' || curType == 'all'"
                  ref="personalTree"
                  v-model="scope.data.write_person_list"
                  :placeholder="'请选择填写人'"
                  :isContainEmp="true"
                  :isCheckStrictly="false"
                ></get-department-select>
                <span v-else>{{ scope.data.write_person_name }}</span>
              </template>
              <template slot-scope="scope" slot="january">
                <el-input v-if="(curType == 'edit' || curType == 'all') && scope.data.write_person_list.indexOf(user_id) != -1 && month >= 1 " type="textarea" v-model="scope.data.january" clearable></el-input>
                <span v-else class="text" v-html="scope.data.january"></span>
              </template>
              <template slot-scope="scope" slot="february">
                <el-input v-if="(curType == 'edit' || curType == 'all') && scope.data.write_person_list.indexOf(user_id) != -1 && month >= 2 && scope.data.january" type="textarea" v-model="scope.data.february" clearable></el-input>
                <span v-else class="text" v-html="scope.data.february"></span>
              </template>
              <template slot-scope="scope" slot="march">
                <el-input v-if="(curType == 'edit' || curType == 'all') && scope.data.write_person_list.indexOf(user_id) != -1 && month >= 3 && scope.data.february" type="textarea" v-model="scope.data.march" clearable></el-input>
                <span v-else class="text" v-html="scope.data.march"></span>
              </template>
              <template slot-scope="scope" slot="april">
                <el-input v-if="(curType == 'edit' || curType == 'all') && scope.data.write_person_list.indexOf(user_id) != -1 && month >= 4 && scope.data.march" type="textarea" v-model="scope.data.april" clearable></el-input>
                <span v-else class="text" v-html="scope.data.april"></span>
              </template>
              <template slot-scope="scope" slot="may">
                <el-input v-if="(curType == 'edit' || curType == 'all') && scope.data.write_person_list.indexOf(user_id) != -1 && month >= 5 && scope.data.april" type="textarea" v-model="scope.data.may" clearable></el-input>
                <span v-else class="text" v-html="scope.data.may"></span>
              </template>
              <template slot-scope="scope" slot="june">
                <el-input v-if="(curType == 'edit' || curType == 'all') && scope.data.write_person_list.indexOf(user_id) != -1 && month >= 6 && scope.data.may" type="textarea" v-model="scope.data.june" clearable></el-input>
                <span v-else class="text" v-html="scope.data.june"></span>
              </template>
              <template slot-scope="scope" slot="july">
                <el-input v-if="(curType == 'edit' || curType == 'all') && scope.data.write_person_list.indexOf(user_id) != -1 && month >= 7 && scope.data.june" type="textarea" v-model="scope.data.july" clearable></el-input>
                <span v-else class="text" v-html="scope.data.july"></span>
              </template>
              <template slot-scope="scope" slot="august">
                <el-input v-if="(curType == 'edit' || curType == 'all') && scope.data.write_person_list.indexOf(user_id) != -1 && month >= 8 && scope.data.july" type="textarea" v-model="scope.data.august" clearable></el-input>
                <span v-else class="text" v-html="scope.data.august"></span>
              </template>
              <template slot-scope="scope" slot="september">
                <el-input v-if="(curType == 'edit' || curType == 'all') && scope.data.write_person_list.indexOf(user_id) != -1 && month >= 9 && scope.data.august" type="textarea" v-model="scope.data.september" clearable></el-input>
                <span v-else class="text" v-html="scope.data.september"></span>
              </template>
              <template slot-scope="scope" slot="october">
                <el-input v-if="(curType == 'edit' || curType == 'all') && scope.data.write_person_list.indexOf(user_id) != -1 && month >= 10 && scope.data.september" type="textarea" v-model="scope.data.october" clearable></el-input>
                <span v-else class="text" v-html="scope.data.october"></span>
              </template>
              <template slot-scope="scope" slot="november">
                <el-input v-if="(curType == 'edit' || curType == 'all') && scope.data.write_person_list.indexOf(user_id) != -1 && month >= 11 && scope.data.october" type="textarea" v-model="scope.data.november" clearable></el-input>
                <span v-else class="text" v-html="scope.data.november"></span>
              </template>
              <template slot-scope="scope" slot="december">
                <el-input v-if="(curType == 'edit' || curType == 'all') && scope.data.write_person_list.indexOf(user_id) != -1 && month >= 12 && scope.data.november" type="textarea" v-model="scope.data.december" clearable></el-input>
                <span v-else class="text" v-html="scope.data.december"></span>
              </template>
            </tx-table>
          </el-col>
          <el-col :span="24">
            <tx-table
              :title="'经济效益指标'"
              :data="form.economic_efficiencies"
              :tableHeaderList="economyTableHeaderList"
              :tableType="2"
              :id="form.id"
              :isAdmin="isAdmin"
              :curType="curType"
              @on-import="onImport"
              @change-month="changeMonth"
            >
              <template slot-scope="scope" slot="economic_indicators">
                <el-input v-if="curType == 'add' || curType == 'all'" type="textarea" v-model="scope.data.economic_indicators" clearable></el-input>
                <span v-else class="text" v-html="scope.data.economic_indicators"></span>
              </template>
              <template slot-scope="scope" slot="target_report_value">
                <el-input v-if="curType == 'add' || curType == 'all'" type="textarea" v-model="scope.data.target_report_value" clearable></el-input>
                <span v-else class="text" v-html="scope.data.target_report_value"></span>
              </template>
              <template slot-scope="scope" slot="write_person_list">
                <get-department-select
                  ref="personalTree"
                  v-model="scope.data.write_person_list"
                  :placeholder="'请选择填写人'"
                  :isContainEmp="true"
                  :isCheckStrictly="false"
                  v-if="curType == 'add' || curType == 'all'"
                ></get-department-select>
                <span v-else>{{ scope.data.write_person_name }}</span>
              </template>
              <template slot-scope="scope" slot="target_report_remark">
                <el-input v-if="curType == 'add' || curType == 'all'" type="textarea" v-model="scope.data.target_report_remark" clearable></el-input>
                <span v-else class="text" v-html="scope.data.target_report_remark"></span>
              </template>
              <template slot-scope="scope" slot="total_target_value">
                <el-input v-if="curType == 'add' || curType == 'all'" type="textarea" v-model="scope.data.total_target_value" clearable></el-input>
                <span v-else class="text" v-html="scope.data.total_target_value"></span>
              </template>
              <template slot-scope="scope" slot="total_target_remark">
                <el-input v-if="curType == 'add' || curType == 'all'" type="textarea" v-model="scope.data.total_target_remark" clearable></el-input>
                <span v-else class="text" v-html="scope.data.total_target_remark"></span>
              </template>
              <template slot-scope="scope" slot="first_quarter_value">
                <el-input v-if="(curType == 'edit' || curType == 'all') && scope.data.write_person_list.indexOf(user_id) != -1"  type="textarea" v-model="scope.data.first_quarter_value" clearable></el-input>
                <span v-else class="text" v-html="scope.data.first_quarter_value"></span>
              </template>
              <template slot-scope="scope" slot="second_quarter_value">
                <el-input v-if="(curType == 'edit' || curType == 'all') && scope.data.write_person_list.indexOf(user_id) != -1"  type="textarea" v-model="scope.data.second_quarter_value" clearable></el-input>
                <span v-else class="text" v-html="scope.data.second_quarter_value"></span>
              </template>
              <template slot-scope="scope" slot="third_quarter_value">
                <el-input v-if="(curType == 'edit' || curType == 'all') && scope.data.write_person_list.indexOf(user_id) != -1"  type="textarea" v-model="scope.data.third_quarter_value" clearable></el-input>
                <span v-else class="text" v-html="scope.data.third_quarter_value"></span>
              </template>
              <template slot-scope="scope" slot="fourth_quarter_value">
                <el-input v-if="(curType == 'edit' || curType == 'all') && scope.data.write_person_list.indexOf(user_id) != -1"  type="textarea" v-model="scope.data.fourth_quarter_value" clearable></el-input>
                <span v-else class="text" v-html="scope.data.fourth_quarter_value"></span>
              </template>
              <template slot-scope="scope" slot="january">
                <el-input v-if="(curType == 'edit' || curType == 'all') && scope.data.write_person_list.indexOf(user_id) != -1 && month >= 1 " type="textarea" v-model="scope.data.january" clearable></el-input>
                <span v-else class="text" v-html="scope.data.january"></span>
              </template>
              <template slot-scope="scope" slot="february">
                <el-input v-if="(curType == 'edit' || curType == 'all') && scope.data.write_person_list.indexOf(user_id) != -1 && month >= 2 && scope.data.january" type="textarea" v-model="scope.data.february" clearable></el-input>
                <span v-else class="text" v-html="scope.data.february"></span>
              </template>
              <template slot-scope="scope" slot="march">
                <el-input v-if="(curType == 'edit' || curType == 'all') && scope.data.write_person_list.indexOf(user_id) != -1 && month >= 3 && scope.data.february" type="textarea" v-model="scope.data.march" clearable></el-input>
                <span v-else class="text" v-html="scope.data.march"></span>
              </template>
              <template slot-scope="scope" slot="april">
                <el-input v-if="(curType == 'edit' || curType == 'all') && scope.data.write_person_list.indexOf(user_id) != -1 && month >= 4 && scope.data.march" type="textarea" v-model="scope.data.april" clearable></el-input>
                <span v-else class="text" v-html="scope.data.april"></span>
              </template>
              <template slot-scope="scope" slot="may">
                <el-input v-if="(curType == 'edit' || curType == 'all') && scope.data.write_person_list.indexOf(user_id) != -1 && month >= 5 && scope.data.april" type="textarea" v-model="scope.data.may" clearable></el-input>
                <span v-else class="text" v-html="scope.data.may"></span>
              </template>
              <template slot-scope="scope" slot="june">
                <el-input v-if="(curType == 'edit' || curType == 'all') && scope.data.write_person_list.indexOf(user_id) != -1 && month >= 6 && scope.data.may" type="textarea" v-model="scope.data.june" clearable></el-input>
                <span v-else class="text" v-html="scope.data.june"></span>
              </template>
              <template slot-scope="scope" slot="july">
                <el-input v-if="(curType == 'edit' || curType == 'all') && scope.data.write_person_list.indexOf(user_id) != -1 && month >= 7 && scope.data.june" type="textarea" v-model="scope.data.july" clearable></el-input>
                <span v-else class="text" v-html="scope.data.july"></span>
              </template>
              <template slot-scope="scope" slot="august">
                <el-input v-if="(curType == 'edit' || curType == 'all') && scope.data.write_person_list.indexOf(user_id) != -1 && month >= 8 && scope.data.july" type="textarea" v-model="scope.data.august" clearable></el-input>
                <span v-else class="text" v-html="scope.data.august"></span>
              </template>
              <template slot-scope="scope" slot="september">
                <el-input v-if="(curType == 'edit' || curType == 'all') && scope.data.write_person_list.indexOf(user_id) != -1 && month >= 9 && scope.data.august" type="textarea" v-model="scope.data.september" clearable></el-input>
                <span v-else class="text" v-html="scope.data.september"></span>
              </template>
              <template slot-scope="scope" slot="october">
                <el-input v-if="(curType == 'edit' || curType == 'all') && scope.data.write_person_list.indexOf(user_id) != -1 && month >= 10 && scope.data.september" type="textarea" v-model="scope.data.october" clearable></el-input>
                <span v-else class="text" v-html="scope.data.october"></span>
              </template>
              <template slot-scope="scope" slot="november">
                <el-input v-if="(curType == 'edit' || curType == 'all') && scope.data.write_person_list.indexOf(user_id) != -1 && month >= 11 && scope.data.october" type="textarea" v-model="scope.data.november" clearable></el-input>
                <span v-else class="text" v-html="scope.data.november"></span>
              </template>
              <template slot-scope="scope" slot="december">
                <el-input v-if="(curType == 'edit' || curType == 'all') && scope.data.write_person_list.indexOf(user_id) != -1 && month >= 12 && scope.data.november" type="textarea" v-model="scope.data.december" clearable></el-input>
                <span v-else class="text" v-html="scope.data.december"></span>
              </template>
              <template slot-scope="scope" slot="schedule">
                <el-input v-if="(curType == 'edit' || curType == 'all') && scope.data.write_person_list.indexOf(user_id) != -1" type="textarea" v-model="scope.data.schedule" clearable></el-input>
                <span v-else class="text" v-html="scope.data.schedule"></span>
              </template>
              <template slot-scope="scope" slot="remark">
                <el-input v-if="(curType == 'edit' || curType == 'all') && scope.data.write_person_list.indexOf(user_id) != -1" type="textarea" v-model="scope.data.remark" clearable></el-input>
                <span v-else class="text" v-html="scope.data.remark"></span>
              </template>
            </tx-table>
          </el-col>
          <el-col :span="24">
            <tx-table
              :title="'党建工作指标'"
              :data="form.party_buildings"
              :tableHeaderList="partyTableHeaderList"
              :tableType="3"
              :id="form.id"
              :isAdmin="isAdmin"
              :curType="curType"
              @on-import="onImport"
              @change-month="changeMonth"
            >
            <template slot-scope="scope" slot="check_content">
                <el-input v-if="curType == 'add' || curType == 'all'" type="textarea" v-model="scope.data.check_content" clearable ></el-input>
                <span v-else class="text" v-html="scope.data.check_content"></span>
              </template>
              <template slot-scope="scope" slot="check_detail">
                <el-input v-if="curType == 'add' || curType == 'all'" type="textarea" v-model="scope.data.check_detail" clearable></el-input>
                <span v-else class="text" v-html="scope.data.check_detail"></span>
              </template>
              <template slot-scope="scope" slot="write_person_list">
                <get-department-select
                  v-if="curType == 'add' || curType == 'all'"
                  ref="personalTree"
                  v-model="scope.data.write_person_list"
                  :placeholder="'请选择填写人'"
                  :isContainEmp="true"
                  :isCheckStrictly="false"
                ></get-department-select>
                <span v-else>{{ scope.data.write_person_name }}</span>
              </template>
              <template slot-scope="scope" slot="january">
                <el-input v-if="(curType == 'edit' || curType == 'all') && scope.data.write_person_list.indexOf(user_id) != -1 && month >= 1 " type="textarea" v-model="scope.data.january" clearable></el-input>
                <span v-else class="text" v-html="scope.data.january"></span>
              </template>
              <template slot-scope="scope" slot="february">
                <el-input v-if="(curType == 'edit' || curType == 'all') && scope.data.write_person_list.indexOf(user_id) != -1 && month >= 2 && scope.data.january" type="textarea" v-model="scope.data.february" clearable></el-input>
                <span v-else class="text" v-html="scope.data.february"></span>
              </template>
              <template slot-scope="scope" slot="march">
                <el-input v-if="(curType == 'edit' || curType == 'all') && scope.data.write_person_list.indexOf(user_id) != -1 && month >= 3 && scope.data.february" type="textarea" v-model="scope.data.march" clearable></el-input>
                <span v-else class="text" v-html="scope.data.march"></span>
              </template>
              <template slot-scope="scope" slot="april">
                <el-input v-if="(curType == 'edit' || curType == 'all') && scope.data.write_person_list.indexOf(user_id) != -1 && month >= 4 && scope.data.march" type="textarea" v-model="scope.data.april" clearable></el-input>
                <span v-else class="text" v-html="scope.data.april"></span>
              </template>
              <template slot-scope="scope" slot="may">
                <el-input v-if="(curType == 'edit' || curType == 'all') && scope.data.write_person_list.indexOf(user_id) != -1 && month >= 5 && scope.data.april" type="textarea" v-model="scope.data.may" clearable></el-input>
                <span v-else class="text" v-html="scope.data.may"></span>
              </template>
              <template slot-scope="scope" slot="june">
                <el-input v-if="(curType == 'edit' || curType == 'all') && scope.data.write_person_list.indexOf(user_id) != -1 && month >= 6 && scope.data.may" type="textarea" v-model="scope.data.june" clearable></el-input>
                <span v-else class="text" v-html="scope.data.june"></span>
              </template>
              <template slot-scope="scope" slot="july">
                <el-input v-if="(curType == 'edit' || curType == 'all') && scope.data.write_person_list.indexOf(user_id) != -1 && month >= 7 && scope.data.june" type="textarea" v-model="scope.data.july" clearable></el-input>
                <span v-else class="text" v-html="scope.data.july"></span>
              </template>
              <template slot-scope="scope" slot="august">
                <el-input v-if="(curType == 'edit' || curType == 'all') && scope.data.write_person_list.indexOf(user_id) != -1 && month >= 8 && scope.data.july" type="textarea" v-model="scope.data.august" clearable></el-input>
                <span v-else class="text" v-html="scope.data.august"></span>
              </template>
              <template slot-scope="scope" slot="september">
                <el-input v-if="(curType == 'edit' || curType == 'all') && scope.data.write_person_list.indexOf(user_id) != -1 && month >= 9 && scope.data.august" type="textarea" v-model="scope.data.september" clearable></el-input>
                <span v-else class="text" v-html="scope.data.september"></span>
              </template>
              <template slot-scope="scope" slot="october">
                <el-input v-if="(curType == 'edit' || curType == 'all') && scope.data.write_person_list.indexOf(user_id) != -1 && month >= 10 && scope.data.september" type="textarea" v-model="scope.data.october" clearable></el-input>
                <span v-else class="text" v-html="scope.data.october"></span>
              </template>
              <template slot-scope="scope" slot="november">
                <el-input v-if="(curType == 'edit' || curType == 'all') && scope.data.write_person_list.indexOf(user_id) != -1 && month >= 11 && scope.data.october" type="textarea" v-model="scope.data.november" clearable></el-input>
                <span v-else class="text" v-html="scope.data.november"></span>
              </template>
              <template slot-scope="scope" slot="december">
                <el-input v-if="(curType == 'edit' || curType == 'all') && scope.data.write_person_list.indexOf(user_id) != -1 && month >= 12 && scope.data.november" type="textarea" v-model="scope.data.december" clearable></el-input>
                <span v-else class="text" v-html="scope.data.december"></span>
              </template>
          </tx-table>
          </el-col>
          <el-col :span="24">
            <tx-table
              :title="'综合管理指标'"
              :data="form.comprehensive_managements"
              :tableHeaderList="comprehensiveTableHeaderList"
              :tableType="4"
              :id="form.id"
              :isAdmin="isAdmin"
              :curType="curType"
              @on-import="onImport"
              @change-month="changeMonth"
            >
            <template slot-scope="scope" slot="check_content">
                <el-input v-if="curType == 'add' || curType == 'all'" type="textarea" v-model="scope.data.check_content" clearable ></el-input>
                <span v-else class="text" v-html="scope.data.check_content"></span>
              </template>
              <template slot-scope="scope" slot="check_detail">
                <el-input v-if="curType == 'add' || curType == 'all'" type="textarea" v-model="scope.data.check_detail" clearable></el-input>
                <span v-else class="text" v-html="scope.data.check_detail"></span>
              </template>
              <template slot-scope="scope" slot="write_person_list">
                <get-department-select
                  v-if="curType == 'add' || curType == 'all'"
                  ref="personalTree"
                  v-model="scope.data.write_person_list"
                  :placeholder="'请选择填写人'"
                  :isContainEmp="true"
                  :isCheckStrictly="false"
                ></get-department-select>
                <span v-else>{{ scope.data.write_person_name }}</span>
              </template>
              <template slot-scope="scope" slot="january">
                <el-input v-if="(curType == 'edit' || curType == 'all') && scope.data.write_person_list.indexOf(user_id) != -1 && month >= 1 " type="textarea" v-model="scope.data.january" clearable></el-input>
                <span v-else class="text" v-html="scope.data.january"></span>
              </template>
              <template slot-scope="scope" slot="february">
                <el-input v-if="(curType == 'edit' || curType == 'all') && scope.data.write_person_list.indexOf(user_id) != -1 && month >= 2 && scope.data.january" type="textarea" v-model="scope.data.february" clearable></el-input>
                <span v-else class="text" v-html="scope.data.february"></span>
              </template>
              <template slot-scope="scope" slot="march">
                <el-input v-if="(curType == 'edit' || curType == 'all') && scope.data.write_person_list.indexOf(user_id) != -1 && month >= 3 && scope.data.february" type="textarea" v-model="scope.data.march" clearable></el-input>
                <span v-else class="text" v-html="scope.data.march"></span>
              </template>
              <template slot-scope="scope" slot="april">
                <el-input v-if="(curType == 'edit' || curType == 'all') && scope.data.write_person_list.indexOf(user_id) != -1 && month >= 4 && scope.data.march" type="textarea" v-model="scope.data.april" clearable></el-input>
                <span v-else class="text" v-html="scope.data.april"></span>
              </template>
              <template slot-scope="scope" slot="may">
                <el-input v-if="(curType == 'edit' || curType == 'all') && scope.data.write_person_list.indexOf(user_id) != -1 && month >= 5 && scope.data.april" type="textarea" v-model="scope.data.may" clearable></el-input>
                <span v-else class="text" v-html="scope.data.may"></span>
              </template>
              <template slot-scope="scope" slot="june">
                <el-input v-if="(curType == 'edit' || curType == 'all') && scope.data.write_person_list.indexOf(user_id) != -1 && month >= 6 && scope.data.may" type="textarea" v-model="scope.data.june" clearable></el-input>
                <span v-else class="text" v-html="scope.data.june"></span>
              </template>
              <template slot-scope="scope" slot="july">
                <el-input v-if="(curType == 'edit' || curType == 'all') && scope.data.write_person_list.indexOf(user_id) != -1 && month >= 7 && scope.data.june" type="textarea" v-model="scope.data.july" clearable></el-input>
                <span v-else class="text" v-html="scope.data.july"></span>
              </template>
              <template slot-scope="scope" slot="august">
                <el-input v-if="(curType == 'edit' || curType == 'all') && scope.data.write_person_list.indexOf(user_id) != -1 && month >= 8 && scope.data.july" type="textarea" v-model="scope.data.august" clearable></el-input>
                <span v-else class="text" v-html="scope.data.august"></span>
              </template>
              <template slot-scope="scope" slot="september">
                <el-input v-if="(curType == 'edit' || curType == 'all') && scope.data.write_person_list.indexOf(user_id) != -1 && month >= 9 && scope.data.august" type="textarea" v-model="scope.data.september" clearable></el-input>
                <span v-else class="text" v-html="scope.data.september"></span>
              </template>
              <template slot-scope="scope" slot="october">
                <el-input v-if="(curType == 'edit' || curType == 'all') && scope.data.write_person_list.indexOf(user_id) != -1 && month >= 10 && scope.data.september" type="textarea" v-model="scope.data.october" clearable></el-input>
                <span v-else class="text" v-html="scope.data.october"></span>
              </template>
              <template slot-scope="scope" slot="november">
                <el-input v-if="(curType == 'edit' || curType == 'all') && scope.data.write_person_list.indexOf(user_id) != -1 && month >= 11 && scope.data.october" type="textarea" v-model="scope.data.november" clearable></el-input>
                <span v-else class="text" v-html="scope.data.november"></span>
              </template>
              <template slot-scope="scope" slot="december">
                <el-input v-if="(curType == 'edit' || curType == 'all') && scope.data.write_person_list.indexOf(user_id) != -1 && month >= 12 && scope.data.november" type="textarea" v-model="scope.data.december" clearable></el-input>
                <span v-else class="text" v-html="scope.data.december"></span>
              </template>
          </tx-table>
          </el-col>
          <el-col :span="24">
            <el-form-item label="特别加分项:">
              <el-input v-model="form.extra_point" type="textarea" placeholder="请输入特别加分项"
                :autosize="{minRows: 4, maxRows: 4}" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="特别扣分项:">
              <el-input v-model="form.deduction_point" type="textarea" placeholder="请输入特别扣分项"
                :autosize="{minRows: 4, maxRows: 4}" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: 20px">
            <image-file-upload 
              :images="form.thumbnail_imgs"
              :files="form.files_list"
              @files-update-success="filesUpdateSuccess"
              @images-update-success="imagesUpdateSuccess"></image-file-upload>
          </el-col>
          <el-col :span="24" style="display:flex;align-items:center;padding-bottom:10px" v-if="canInitiated && isAdmin">
            <div style="float:left;width: 6px;height: 18px; background: #409EFF;"></div>
            <p style="margin-left:5px;color:#000;font-size:14px;">处理流程</p>
          </el-col>
          <el-col :span="24" v-if="canInitiated && isAdmin">
            <el-checkbox v-model="form.enable_flow" :true-label="2" :false-label="1">发起处理流程:</el-checkbox>
            <approve-step 
              v-if="form.enable_flow == 2"
              ref="approveStep"
              :showTitle="false"
              @on-users="setUsers" 
              :form_data="form" 
              :object_id="5240">
            </approve-step>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer" v-if="curType != 'detail'">
      <el-button @click="dialogClose" size="mini">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('form')" size="mini">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import imageFileUpload from "@/components/imageFileUpload/index";
import txTable from "./tx-table";
import { getUser } from '@/utils/auth';
import { formatDate,deepCopy} from '@/utils/index';  
import approveStep from '@/components/approve-echo/approve-step2'
export default {
  components: {
    imageFileUpload,
    txTable,
    getDepartmentSelect,
    approveStep
  },
  props: {
    dialogBool: Boolean,
    curType: [String],
  },
  data() {
    return {
      group_name: '全部',
      showTitle: "",
      form: {
        id: 0,
        user_id: "",
        user_name: "",
        dept_id: '',
        dept_name: '',
        request_date:'',
        check_year:'',
        remark:'',
        extra_point:'',
        deduction_point:'',
        thumbnail_imgs: [],
        files_list: [],
        key_point_tasks: [],
        economic_efficiencies: [],
        party_buildings: [],
        comprehensive_managements: [],
        write_person_list: [],
        enable_flow: 1
      },
      rules: {
        user_name: [
          {
            required: true,
            message: "请输入最终提醒时间",
            trigger: "change",
          },
        ],
        dept_name: [
          {
            required: true,
            message: "请输入所在部门",
            trigger: "change",
          },
        ],
        request_date: [
          {
            required: true,
            message: "请选择申请日期",
            trigger: "change",
          },
        ],
        check_year: [
          {
            required: true,
            message: "请选择考核年份",
            trigger: "change",
          },
        ],
      },
      keynoteTableHeaderList: [
        {
          id: 1,
          label: "考核内容",
          prop: "check_content",
          width: "160",
          align: "center",
          signIndex: 0,
        },
        {
          id: 2,
          label: "考核细则",
          prop: "check_detail",
          width: "160",
          align: "center",
          signIndex: 1,
        },
        {
          id: 3,
          label: "填写人",
          prop: "write_person_list",
          width: "160",
          align: "center",
          signIndex: 2,
        },
        {
          id: 4,
          label: "1月",
          prop: "january",
          width: "160",
          align: "center",
          signIndex: 3,
          key: 1
        },
        {
          id: 5,
          label: "2月",
          prop: "february",
          width: "160",
          align: "center",
          signIndex: 4,
          key: 2
        },
        {
          id: 6,
          label: "3月",
          prop: "march",
          width: "160",
          align: "center",
          signIndex: 5,
          key: 3
        },
        {
          id: 7,
          label: "4月",
          prop: "april",
          width: "160",
          align: "center",
          signIndex: 6,
          key: 4
        },
        {
          id: 8,
          label: "5月",
          prop: "may",
          width: "160",
          align: "center",
          signIndex: 7,
          key: 5
        },
        {
          id: 9,
          label: "6月",
          prop: "june",
          width: "160",
          align: "center",
          signIndex: 8,
          key: 6
        },
        {
          id: 10,
          label: "7月",
          prop: "july",
          width: "160",
          align: "center",
          signIndex: 9,
          key: 7
        },
        {
          id: 11,
          label: "8月",
          prop: "august",
          width: "160",
          align: "center",
          signIndex: 10,
          key: 8
        },
        {
          id: 12,
          label: "9月",
          prop: "september",
          width: "160",
          align: "center",
          signIndex: 11,
          key: 9
        },
        {
          id: 13,
          label: "10月",
          prop: "october",
          width: "160",
          align: "center",
          signIndex: 12,
          key: 10
        },
        {
          id: 14,
          label: "11月",
          prop: "november",
          width: "160",
          align: "center",
          signIndex: 13,
          key: 11
        },
        {
          id: 15,
          label: "12月",
          prop: "december",
          width: "160",
          align: "center",
          signIndex: 14,
          key: 12
        },
      ],
      economyTableHeaderList: [
        {
          id: 1,
          label: "经济指标",
          prop: "economic_indicators",
          width: "160",
          align: "center",
          signIndex: 0,
        },
        {
          id: 2,
          label: "目标上报值",
          prop: "target_report_value",
          width: "160",
          align: "center",
          signIndex: 1,
        },
        {
          id: 3,
          label: "填写人",
          prop: "write_person_list",
          width: "160",
          align: "center",
          signIndex: 2,
        },
        {
          id: 4,
          label: "目标上报说明",
          prop: "target_report_remark",
          width: "160",
          align: "center",
          signIndex: 3,
        },
        {
          id: 5,
          label: "年度目标值(集团下达)",
          prop: "write_person_list",
          width: "160",
          align: "center",
          signIndex: 4,
          nestedTablesHeader:[
            {
              id: 101,
              label: "总下达",
              prop: "total_target_value",
              width: "180",
              align: "center",
              signIndex: 100,
            },
            {
              id: 102,
              label: "目标下达值说明",
              prop: "total_target_remark",
              width: "180",
              align: "center",
              signIndex: 101,
            },
            {
              id: 103,
              label: "第一季度",
              prop: "first_quarter_value",
              width: "180",
              align: "center",
              signIndex: 102,
            },
            {
              id: 104,
              label: "第二季度",
              prop: "second_quarter_value",
              width: "180",
              align: "center",
              signIndex: 103,
            },
            {
              id: 105,
              label: "第三季度",
              prop: "third_quarter_value",
              width: "180",
              align: "center",
              signIndex: 104,
            },
            {
              id: 106,
              label: "第四季度",
              prop: "fourth_quarter_value",
              width: "180",
              align: "center",
              signIndex: 105,
            },
          ]
        },
        {
          id: 6,
          label: "年度目标值(集团下达)",
          prop: "monthly",
          width: "160",
          align: "center",
          signIndex: 5,
          nestedTablesHeader:[
            {
              id: 107,
              label: "1月",
              prop: "january",
              width: "160",
              align: "center",
              signIndex: 106,
              key: 1
            },
            {
              id: 108,
              label: "2月",
              prop: "february",
              width: "160",
              align: "center",
              signIndex: 107,
              key: 2
            },
            {
              id: 109,
              label: "3月",
              prop: "march",
              width: "160",
              align: "center",
              signIndex: 108,
              key: 3
            },
            {
              id: 110,
              label: "4月",
              prop: "april",
              width: "160",
              align: "center",
              signIndex: 109,
              key: 4
            },
            {
              id: 111,
              label: "5月",
              prop: "may",
              width: "160",
              align: "center",
              signIndex: 110,
              key: 5
            },
            {
              id: 112,
              label: "6月",
              prop: "june",
              width: "160",
              align: "center",
              signIndex: 111,
              key: 6
            },
            {
              id: 113,
              label: "7月",
              prop: "july",
              width: "160",
              align: "center",
              signIndex: 112,
              key: 7
            },
            {
              id: 114,
              label: "8月",
              prop: "august",
              width: "160",
              align: "center",
              signIndex: 113,
              key: 8
            },
            {
              id: 115,
              label: "9月",
              prop: "september",
              width: "160",
              align: "center",
              signIndex: 114,
              key: 9
            },
            {
              id: 116,
              label: "10月",
              prop: "october",
              width: "160",
              align: "center",
              signIndex: 115,
              key: 10
            },
            {
              id: 117,
              label: "11月",
              prop: "november",
              width: "160",
              align: "center",
              signIndex: 116,
              key: 11
            },
            {
              id: 118,
              label: "12月",
              prop: "december",
              width: "160",
              align: "center",
              signIndex: 117,
              key: 12
            },
          ]
        },
        {
          id: 7,
          label: "完成比例%",
          prop: "schedule",
          width: "160",
          align: "center",
          signIndex: 6,
        },
        {
          id: 8,
          label: "备注",
          prop: "remark",
          width: "160",
          align: "center",
          signIndex: 7,
        },
      ],
      partyTableHeaderList: [
        {
          id: 1,
          label: "考核内容",
          prop: "check_content",
          width: "160",
          align: "center",
          signIndex: 0,
        },
        {
          id: 2,
          label: "考核细则",
          prop: "check_detail",
          width: "160",
          align: "center",
          signIndex: 1,
        },
        {
          id: 3,
          label: "填写人",
          prop: "write_person_list",
          width: "160",
          align: "center",
          signIndex: 2,
        },
        {
          id: 4,
          label: "1月",
          prop: "january",
          width: "160",
          align: "center",
          signIndex: 3,
          key: 1
        },
        {
          id: 5,
          label: "2月",
          prop: "february",
          width: "160",
          align: "center",
          signIndex: 4,
          key: 2
        },
        {
          id: 6,
          label: "3月",
          prop: "march",
          width: "160",
          align: "center",
          signIndex: 5,
          key: 3
        },
        {
          id: 7,
          label: "4月",
          prop: "april",
          width: "160",
          align: "center",
          signIndex: 6,
          key: 4
        },
        {
          id: 8,
          label: "5月",
          prop: "may",
          width: "160",
          align: "center",
          signIndex: 7,
          key: 5
        },
        {
          id: 9,
          label: "6月",
          prop: "june",
          width: "160",
          align: "center",
          signIndex: 8,
          key: 6
        },
        {
          id: 10,
          label: "7月",
          prop: "july",
          width: "160",
          align: "center",
          signIndex: 9,
          key: 7
        },
        {
          id: 11,
          label: "8月",
          prop: "august",
          width: "160",
          align: "center",
          signIndex: 10,
          key: 8
        },
        {
          id: 12,
          label: "9月",
          prop: "september",
          width: "160",
          align: "center",
          signIndex: 11,
          key: 9
        },
        {
          id: 13,
          label: "10月",
          prop: "october",
          width: "160",
          align: "center",
          signIndex: 12,
          key: 10
        },
        {
          id: 14,
          label: "11月",
          prop: "november",
          width: "160",
          align: "center",
          signIndex: 13,
          key: 11
        },
        {
          id: 15,
          label: "12月",
          prop: "december",
          width: "160",
          align: "center",
          signIndex: 14,
          key: 12
        },
      ],
      comprehensiveTableHeaderList: [
        {
          id: 1,
          label: "考核内容",
          prop: "check_content",
          width: "160",
          align: "center",
          signIndex: 0,
        },
        {
          id: 2,
          label: "考核细则",
          prop: "check_detail",
          width: "160",
          align: "center",
          signIndex: 1,
        },
        {
          id: 3,
          label: "填写人",
          prop: "write_person_list",
          width: "160",
          align: "center",
          signIndex: 2,
        },
        {
          id: 4,
          label: "1月",
          prop: "january",
          width: "160",
          align: "center",
          signIndex: 3,
          key: 1
        },
        {
          id: 5,
          label: "2月",
          prop: "february",
          width: "160",
          align: "center",
          signIndex: 4,
          key: 2
        },
        {
          id: 6,
          label: "3月",
          prop: "march",
          width: "160",
          align: "center",
          signIndex: 5,
          key: 3
        },
        {
          id: 7,
          label: "4月",
          prop: "april",
          width: "160",
          align: "center",
          signIndex: 6,
          key: 4
        },
        {
          id: 8,
          label: "5月",
          prop: "may",
          width: "160",
          align: "center",
          signIndex: 7,
          key: 5
        },
        {
          id: 9,
          label: "6月",
          prop: "june",
          width: "160",
          align: "center",
          signIndex: 8,
          key: 6
        },
        {
          id: 10,
          label: "7月",
          prop: "july",
          width: "160",
          align: "center",
          signIndex: 9,
          key: 7
        },
        {
          id: 11,
          label: "8月",
          prop: "august",
          width: "160",
          align: "center",
          signIndex: 10,
          key: 8
        },
        {
          id: 12,
          label: "9月",
          prop: "september",
          width: "160",
          align: "center",
          signIndex: 11,
          key: 9
        },
        {
          id: 13,
          label: "10月",
          prop: "october",
          width: "160",
          align: "center",
          signIndex: 12,
          key: 10
        },
        {
          id: 14,
          label: "11月",
          prop: "november",
          width: "160",
          align: "center",
          signIndex: 13,
          key: 11
        },
        {
          id: 15,
          label: "12月",
          prop: "december",
          width: "160",
          align: "center",
          signIndex: 14,
          key: 12
        },
      ],

      month: '', // 当前月份
      // 历史数据
      key_point_tasks_old: [],
      economic_efficiencies_old: [],
      party_buildings_old: [],
      comprehensive_managements_old: [],
      isAdmin: false,
      user_id: null,
      nodes: [],

      // 历史表头数据  
      keynoteTableHeaderList_old: [],
      economyTableHeaderList_old: [],
      partyTableHeaderList_old: [],
      comprehensiveTableHeaderList_old: [],

    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        window.removeEventListener('keydown',this.handleClick)
        Object.assign(this.$data, this.$options.data());
      } else {
        if (getUser()) {
          let userInfo = JSON.parse(getUser());
          this.user_id = Number(userInfo.user_id);
          this.form.user_id = Number(userInfo.user_id);
          this.form.user_name = userInfo.user_name
          this.form.dept_id = Number(userInfo.department_id);
          this.form.dept_name = userInfo.dept_name
        }

        this.form.request_date = formatDate(new Date(),'yyyy-MM-dd')
        this.form.check_year = formatDate(new Date(),'yyyy')

        this.month = new Date().getMonth() + 1
        

        this.keynoteTableHeaderList_old = deepCopy(this.keynoteTableHeaderList)
        this.economyTableHeaderList_old = deepCopy(this.economyTableHeaderList)
        this.partyTableHeaderList_old = deepCopy(this.partyTableHeaderList)
        this.comprehensiveTableHeaderList_old = deepCopy(this.comprehensiveTableHeaderList)
        window.addEventListener('keydown',this.handleClick)
      }
    },
  },
  computed: {
    // 填写完12月才能发起流程 
    canInitiated() {
      let success = false
      if (this.form.key_point_tasks.length > 0) {
        this.form.key_point_tasks.forEach(item => {
          if (item.december) {
            success = true
          } else {
            success = false
          }
        })
      }
      if (this.form.economic_efficiencies.length > 0) {
        this.form.economic_efficiencies.forEach(item => {
          if (item.december) {
            success = true
          } else {
            success = false
          }
        })
      }
      if (this.form.party_buildings.length > 0) {
        this.form.party_buildings.forEach(item => {
          if (item.december) {
            success = true
          } else {
            success = false
          }
        })
      }
      if (this.form.comprehensive_managements.length > 0) {
        this.form.comprehensive_managements.forEach(item => {
          if (item.december) {
            success = true
          } else {
            success = false
          }
        })
      }

      return success
    },
  },
  methods: {
    setData(info,isAdmin) {
      this.isAdmin = isAdmin
      for (const key in info) {
        if (Object.hasOwnProperty.call(this.form, key)) {
          this.form[key] = info[key]          
        }
      }
      this.form.check_year = this.form.check_year + ''
      // 如果是查看详情  或者 管理员  或者 是发起者 则不过滤数据
      if (this.curType == 'detail' || isAdmin || this.user_id == info.user_id) {
        
      } else {
        // 拆分 是否包含填写人的数据
        this.key_point_tasks_old = info.key_point_tasks.filter(item => {
          return item.write_person_list.indexOf(this.user_id) == -1
        })
        this.economic_efficiencies_old = info.economic_efficiencies.filter(item => {
          return item.write_person_list.indexOf(this.user_id) == -1
        })
        this.party_buildings_old = info.party_buildings.filter(item => {
          return item.write_person_list.indexOf(this.user_id) == -1
        })
        this.comprehensive_managements_old = info.comprehensive_managements.filter(item => {
          return item.write_person_list.indexOf(this.user_id) == -1
        })

        this.form.key_point_tasks = this.form.key_point_tasks.filter(item => {
          return item.write_person_list.indexOf(this.user_id) !== -1
        })
        this.form.economic_efficiencies = this.form.economic_efficiencies.filter(item => {
          return item.write_person_list.indexOf(this.user_id) !== -1
        })
        this.form.party_buildings = this.form.party_buildings.filter(item => {
          return item.write_person_list.indexOf(this.user_id) !== -1
        })
        this.form.comprehensive_managements = this.form.comprehensive_managements.filter(item => {
          return item.write_person_list.indexOf(this.user_id) !== -1
        })

      }
    },
    onImport(list,type) {
      switch (type) {
        case 1:
          this.form.key_point_tasks = [...this.form.key_point_tasks,...list]
          this.form.key_point_tasks.forEach((item,index) => {
            item.sort = index + 1
          });
        break;
        case 2:
          this.form.economic_efficiencies = [...this.form.economic_efficiencies,...list]
          this.form.economic_efficiencies.forEach((item,index) => {
            item.sort = index + 1
          });
        break;
        case 3:
          this.form.party_buildings = [...this.form.party_buildings,...list]
          this.form.party_buildings.forEach((item,index) => {
            item.sort = index + 1
          });
        break;
        case 4:
          this.form.comprehensive_managements = [...this.form.comprehensive_managements,...list]
          this.form.comprehensive_managements.forEach((item,index) => {
            item.sort = index + 1
          });
        break;
        default:
          break;
      }
    },
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    updatePlaybill(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = {...this.form};
          this.assemblyIndicators(info)
          this.getWritePersonList(info)
          let params = {
            form_data: info,
            step_data: info.enable_flow == 2 ? this.nodes : null
          }
          console.log(JSON.parse(JSON.stringify(params)));
          this.$emit("save-add-edit-organization",params);
        } else {
          return false;
        }
      });
    },
    // 组装指标数据   并排序
    assemblyIndicators(info) {
      info.key_point_tasks = [...info.key_point_tasks,...this.key_point_tasks_old]
      info.economic_efficiencies = [...info.economic_efficiencies,...this.economic_efficiencies_old]
      info.party_buildings = [...info.party_buildings,...this.party_buildings_old]
      info.comprehensive_managements = [...info.comprehensive_managements,...this.comprehensive_managements_old]

      info.key_point_tasks.sort((a,b) => {
        return a.sort - b.sort
      })
      info.economic_efficiencies.sort((a,b) => {
        return a.sort - b.sort
      })
      info.party_buildings.sort((a,b) => {
        return a.sort - b.sort
      })
      info.comprehensive_managements.sort((a,b) => {
        return a.sort - b.sort
      })
    },
    getWritePersonList(info) {
      let list = [] 
      info.key_point_tasks.forEach(item => {
        list = [...list,...item.write_person_list]
      })
      info.economic_efficiencies.forEach(item => {
        list = [...list,...item.write_person_list]
      })
      info.party_buildings.forEach(item => {
        list = [...list,...item.write_person_list]
      })
      info.comprehensive_managements.forEach(item => {
        list = [...list,...item.write_person_list]
      })
      console.log(list);
      info.write_person_list = [...new Set(list)]
    },
    // 上传图片
    imagesUpdateSuccess(val) {
      let obj = ''
      let list = []
      val.forEach(item => {
        obj = {
          thumbnail_url: item.thumbnail_url ? item.thumbnail_url : null,
          url: item.url ? item.url : item,
        }
        list.push(obj)
      })
      this.form.thumbnail_imgs = list
    },
    // 上传文件
    filesUpdateSuccess(filesList) {
      this.form.files_list = filesList;
    },
    handleClick(e) {
      // 禁用 Tab按键    指标输入框会有点问题
      if (e.key === 'Tab') {
        e.preventDefault()
      }
    },
    // 修改月份 

    changeMonth(monthInfo,tableType) {
      let monthList =  monthInfo[tableType]
      console.log("monthList",monthList);
      switch (tableType) {
        // 过滤 不存在key  或者 在选中的月份列表中 
        case 1:
          if (monthList.length > 0) {
            this.keynoteTableHeaderList = this.keynoteTableHeaderList_old.filter(item => {
              return  !item.key || monthList.indexOf(item.key) != -1
            })
          } else {
            this.keynoteTableHeaderList = deepCopy(this.keynoteTableHeaderList_old)
          }
          break;
          // 存在二级目录 数据处理不一样 
        case 2:
          if (monthList.length > 0) {
            this.economyTableHeaderList = deepCopy(this.economyTableHeaderList_old)
            this.economyTableHeaderList.forEach(item => {
              // 只需修改  月份 
              if (item.prop == 'monthly') {
                item.nestedTablesHeader = item.nestedTablesHeader.filter(item => {
                  return monthList.indexOf(item.key) != -1
                })
              }
            })
          } else {
            this.economyTableHeaderList = deepCopy(this.economyTableHeaderList_old)
          }
          break;
        case 3:
          if (monthList.length > 0) {
            this.partyTableHeaderList = this.partyTableHeaderList_old.filter(item => {
              return  !item.key || monthList.indexOf(item.key) != -1
            })
          } else {
            this.partyTableHeaderList = deepCopy(this.partyTableHeaderList_old)
          }
          break;
        case 4:
          if (monthList.length > 0) {
            this.comprehensiveTableHeaderList = this.comprehensiveTableHeaderList_old.filter(item => {
              return  !item.key || monthList.indexOf(item.key) != -1
            })
          } else {
            this.comprehensiveTableHeaderList = deepCopy(this.comprehensiveTableHeaderList_old)
          }
          break;
      
        default:
          break;
      }
    },
    // 接收流程节点
    setUsers(data) {
      this.nodes = data
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.text {
  white-space: pre;
}
</style>


