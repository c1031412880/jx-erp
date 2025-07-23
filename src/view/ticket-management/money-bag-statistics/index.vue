<template>
  <div class="money-bag-statistics">
    <div class="money-bag-statistics-content">
      <el-tabs v-model="activeName">
        <el-tab-pane label="按线路汇总" name="first" lazy>
          <sub-req
            ref="lineHead"
            :activeName="activeName"
            @on-ok="onSubmit"
            @on-export="exportExcel"
            @on-import="importExcel">
          </sub-req>

          <tr-table
            :selectionShow="false"
            :data="lineData"
            :tableHeaderList="lineCustomSettingList"
            :TableHeight="TableHeight"
            :loading="loading"
            :frontFixedNum="frontFixedNum"
            :backFixedNum="0"
            :isShowSummary="true"
            :sumTotal="lineSumTotal"
            :sumColumnIndex="[3]">
            <template slot-scope="scope" slot="total_fee">
              <el-button type="text" @click="getDetailData(scope.data, 'line_id')">{{ scope.data.total_fee }}</el-button>
            </template>
          </tr-table>

          <el-pagination
            style="margin: 5px 0;display:flex; justify-content: flex-end;"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            ref="linePaginationH"
            :current-page="linePageInfo.pageIndex"
            :page-sizes="[10, 20, 30, 40, 50, 100]"
            :page-size="linePageInfo.pageSize"
            layout="total,sizes, prev, pager, next, jumper"
            :total="linePageInfo.pageCount">
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="按车辆汇总" name="second" lazy>
          <sub-req
            ref="vehHead"
            :activeName="activeName"
            @on-ok="onSubmit"
            @on-export="exportExcel">
          </sub-req>

          <tr-table
            :selectionShow="false"
            :data="vehData"
            :tableHeaderList="vehCustomSettingList"
            :TableHeight="TableHeight"
            :loading="loading"
            :frontFixedNum="frontFixedNum"
            :backFixedNum="0"
            :isShowSummary="true"
            :sumTotal="vehSumTotal"
            :sumColumnIndex="[4]">
            <template slot-scope="scope" slot="total_fee">
              <el-button type="text" @click="getDetailData(scope.data, 'vehicle_id')">{{ scope.data.total_fee }}</el-button>
            </template>
          </tr-table>

          <el-pagination
            style="margin: 5px 0;display:flex; justify-content: flex-end;"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            ref="vehPaginationH"
            :current-page="vehPageInfo.pageIndex"
            :page-sizes="[10, 20, 30, 40, 50, 100]"
            :page-size="vehPageInfo.pageSize"
            layout="total,sizes, prev, pager, next, jumper"
            :total="vehPageInfo.pageCount">
          </el-pagination>
        </el-tab-pane>
      </el-tabs>
    </div>

    <information-dialog
      :dialogBool.sync="informationDialogShow"
      :requestData="requestData">
    </information-dialog>

    <!-- 上传文件 导出文件弹窗组件 -->
    <file-dialog
      :dialogBool.sync="fileDialogVisible"
      :fileData="FileData"
      :typeMessage="'相同日期线路车辆记录'"
      @on-submit-excel="importICExcel"
    ></file-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import {getDate, formatTime} from '@/utils/index'
import subReq from "./component/sub-req";
import fileDialog from "@/components/fileDialog/file-dialog";
import informationDialog from "./component/information-dialog"
export default {
  name: 'money-bag-statistics',
  components: {
    subReq,
    fileDialog,
    informationDialog
  },
  data() {
    return {
      linePageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      vehPageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      form: {},
      activeName: "first",
      lineData: [],
      vehData: [],
      loading: false,
      TableHeight: 500,
      frontFixedNum: 1, //前几行固定
      informationDialogShow: false,
      requestData: {},
      fileDialogVisible: false,
      FileData: {
        url: `${window.newHttpConfig.URL_EASYMOCK}/Files/TempFiles/IC卡导入模板.xlsx`,
      },
      httpGetObj: {
        'first': 'GetLineSummaryDayPurse',
        'second': 'GetVehicleSummaryDayPurse'
      },
      httpExportObj: {
        'first': 'LineSummaryExportDayPurse',
        'second': 'VehicleSummaryExportDayPurse'
      },
      lineSumTotal: {
        3: ''
      },
      vehSumTotal: {
        4: ''
      },
      lineCustomSettingList: [
        {
          id: 1,
          label: "时间",
          prop: "date",
          width: "130",
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
          sortable: true,
        },
        {
          id: 3,
          label: "现金",
          prop: "total_fee",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: true,
        },
        {
          id: 4,
          label: "IC卡消费汇总",
          prop: "ICtotal_fee",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
          nestedTablesHeader: [
            {
              id: 1,
              label: "普通卡",
              prop: "com_car",
              width: "120",
              align: "center",
              signIndex: 0,
              sortable: false,
              nestedTablesHeader: [
                {
                  id: 1,
                  label: "人次",
                  prop: "common_order",
                  width: "60",
                  align: "users",
                  signIndex: 0,
                  sortable: false,
                },
                {
                  id: 2,
                  label: "金额",
                  prop: "common_fee",
                  width: "60",
                  align: "center",
                  signIndex: 1,
                  sortable: false,
                },
              ]
            },
            {
              id: 2,
              label: "老年卡",
              prop: "old_car",
              width: "120",
              align: "center",
              signIndex: 1,
              sortable: false,
              nestedTablesHeader: [
                {
                  id: 1,
                  label: "人次",
                  prop: "old_order",
                  width: "60",
                  align: "users",
                  signIndex: 0,
                  sortable: false,
                },
                {
                  id: 2,
                  label: "金额",
                  prop: "old_fee",
                  width: "60",
                  align: "center",
                  signIndex: 1,
                  sortable: false,
                },
              ]
            },
            {
              id: 3,
              label: "免乘卡",
              prop: "ride_car",
              width: "120",
              align: "center",
              signIndex: 2,
              sortable: false,
              nestedTablesHeader: [
                {
                  id: 1,
                  label: "人次",
                  prop: "ride_order",
                  width: "60",
                  align: "users",
                  signIndex: 0,
                  sortable: false,
                },
                {
                  id: 2,
                  label: "金额",
                  prop: "ride_fee",
                  width: "60",
                  align: "center",
                  signIndex: 1,
                  sortable: false,
                },
              ]
            },
            {
              id: 4,
              label: "拥军卡",
              prop: "army_car",
              width: "120",
              align: "center",
              signIndex: 3,
              sortable: false,
              nestedTablesHeader: [
                {
                  id: 1,
                  label: "人次",
                  prop: "army_order",
                  width: "60",
                  align: "users",
                  signIndex: 0,
                  sortable: false,
                },
                {
                  id: 2,
                  label: "金额",
                  prop: "army_fee",
                  width: "60",
                  align: "center",
                  signIndex: 1,
                  sortable: false,
                },
              ]
            },
            {
              id: 5,
              label: "成人月票卡",
              prop: "adult_car",
              width: "120",
              align: "center",
              signIndex: 4,
              sortable: false,
              nestedTablesHeader: [
                {
                  id: 1,
                  label: "人次",
                  prop: "adult_order",
                  width: "60",
                  align: "users",
                  signIndex: 0,
                  sortable: false,
                },
                {
                  id: 2,
                  label: "金额",
                  prop: "fee",
                  width: "60",
                  align: "center",
                  signIndex: 1,
                  sortable: false,
                  nestedTablesHeader: [
                    {
                      id: 1,
                      label: "钱包区",
                      prop: "adult_fee",
                      width: "60",
                      align: "users",
                      signIndex: 0,
                      sortable: false,
                    },
                    {
                      id: 2,
                      label: "月票区",
                      prop: "adult_ticket",
                      width: "60",
                      align: "center",
                      signIndex: 1,
                      sortable: false,
                    },
                  ]
                },
              ]
            },
            {
              id: 6,
              label: "员工卡",
              prop: "staff_car",
              width: "120",
              align: "center",
              signIndex: 5,
              sortable: false,
              nestedTablesHeader: [
                {
                  id: 1,
                  label: "人次",
                  prop: "staff_order",
                  width: "60",
                  align: "users",
                  signIndex: 0,
                  sortable: false,
                },
                {
                  id: 2,
                  label: "金额",
                  prop: "staff_fee",
                  width: "60",
                  align: "center",
                  signIndex: 1,
                  sortable: false,
                },
              ]
            },
            {
              id: 7,
              label: "畅通卡",
              prop: "unblocked_car",
              width: "120",
              align: "center",
              signIndex: 6,
              sortable: false,
              nestedTablesHeader: [
                {
                  id: 1,
                  label: "人次",
                  prop: "unblocked_order",
                  width: "60",
                  align: "users",
                  signIndex: 0,
                  sortable: false,
                },
                {
                  id: 2,
                  label: "金额",
                  prop: "unblocked_fee",
                  width: "60",
                  align: "center",
                  signIndex: 1,
                  sortable: false,
                },
              ]
            },
            {
              id: 8,
              label: "老人免费卡",
              prop: "old_free_car",
              width: "120",
              align: "center",
              signIndex: 7,
              sortable: false,
              nestedTablesHeader: [
                {
                  id: 1,
                  label: "人次",
                  prop: "old_free_order",
                  width: "60",
                  align: "users",
                  signIndex: 0,
                  sortable: false,
                },
                {
                  id: 2,
                  label: "金额",
                  prop: "old_free_fee",
                  width: "60",
                  align: "center",
                  signIndex: 1,
                  sortable: false,
                },
              ]
            },
            {
              id: 9,
              label: "学生卡",
              prop: "student_car",
              width: "120",
              align: "center",
              signIndex: 8,
              sortable: false,
              nestedTablesHeader: [
                {
                  id: 1,
                  label: "人次",
                  prop: "student_order",
                  width: "60",
                  align: "users",
                  signIndex: 0,
                  sortable: false,
                },
                {
                  id: 2,
                  label: "金额",
                  prop: "student_fee",
                  width: "60",
                  align: "center",
                  signIndex: 1,
                  sortable: false,
                },
              ]
            },
            {
              id: 10,
              label: "月卡",
              prop: "month_car",
              width: "120",
              align: "center",
              signIndex: 9,
              sortable: false,
              nestedTablesHeader: [
                {
                  id: 1,
                  label: "人次",
                  prop: "month_order",
                  width: "60",
                  align: "users",
                  signIndex: 0,
                  sortable: false,
                },
                {
                  id: 2,
                  label: "钱包区",
                  prop: "month_wallet_car",
                  width: "60",
                  align: "center",
                  signIndex: 1,
                  sortable: false,
                  nestedTablesHeader: [
                    {
                      id: 1,
                      label: "人次",
                      prop: "month_wallet_order",
                      width: "60",
                      align: "users",
                      signIndex: 0,
                      sortable: false,
                    },
                    {
                      id: 2,
                      label: "金额",
                      prop: "month_wallet_fee",
                      width: "60",
                      align: "center",
                      signIndex: 1,
                      sortable: false,
                    },
                  ]
                },
                {
                  id: 3,
                  label: "月票区",
                  prop: "month_ticket_car",
                  width: "60",
                  align: "center",
                  signIndex: 2,
                  sortable: false,
                  nestedTablesHeader: [
                    {
                      id: 1,
                      label: "人次",
                      prop: "month_ticket_order",
                      width: "60",
                      align: "users",
                      signIndex: 0,
                      sortable: false,
                    },
                    {
                      id: 2,
                      label: "金额",
                      prop: "month_ticket_fee",
                      width: "60",
                      align: "center",
                      signIndex: 1,
                      sortable: false,
                    },
                  ]
                },
              ]
            },
            {
              id: 11,
              label: "季卡",
              prop: "season_car",
              width: "120",
              align: "center",
              signIndex: 10,
              sortable: false,
              nestedTablesHeader: [
                {
                  id: 1,
                  label: "人次",
                  prop: "season_order",
                  width: "60",
                  align: "users",
                  signIndex: 0,
                  sortable: false,
                },
                {
                  id: 2,
                  label: "钱包区",
                  prop: "season_wallet_car",
                  width: "60",
                  align: "center",
                  signIndex: 1,
                  sortable: false,
                  nestedTablesHeader: [
                    {
                      id: 1,
                      label: "人次",
                      prop: "season_wallet_order",
                      width: "60",
                      align: "users",
                      signIndex: 0,
                      sortable: false,
                    },
                    {
                      id: 2,
                      label: "金额",
                      prop: "season_wallet_fee",
                      width: "60",
                      align: "center",
                      signIndex: 1,
                      sortable: false,
                    },
                  ]
                },
                {
                  id: 3,
                  label: "月票区",
                  prop: "season_ticket_car",
                  width: "60",
                  align: "center",
                  signIndex: 2,
                  sortable: false,
                  nestedTablesHeader: [
                    {
                      id: 1,
                      label: "人次",
                      prop: "season_ticket_order",
                      width: "60",
                      align: "users",
                      signIndex: 0,
                      sortable: false,
                    },
                    {
                      id: 2,
                      label: "金额",
                      prop: "season_ticket_fee",
                      width: "60",
                      align: "center",
                      signIndex: 1,
                      sortable: false,
                    },
                  ]
                },
              ]
            },
            {
              id: 12,
              label: "年卡",
              prop: "year_car ",
              width: "120",
              align: "center",
              signIndex: 11,
              sortable: false,
              nestedTablesHeader: [
                {
                  id: 1,
                  label: "人次",
                  prop: "year_order",
                  width: "60",
                  align: "users",
                  signIndex: 0,
                  sortable: false,
                },
                {
                  id: 2,
                  label: "钱包区",
                  prop: "year_wallet_car",
                  width: "60",
                  align: "center",
                  signIndex: 1,
                  sortable: false,
                  nestedTablesHeader: [
                    {
                      id: 1,
                      label: "人次",
                      prop: "year_wallet_order",
                      width: "60",
                      align: "users",
                      signIndex: 0,
                      sortable: false,
                    },
                    {
                      id: 2,
                      label: "金额",
                      prop: "year_wallet_fee",
                      width: "60",
                      align: "center",
                      signIndex: 1,
                      sortable: false,
                    },
                  ]
                },
                {
                  id: 3,
                  label: "月票区",
                  prop: "year_ticket_car",
                  width: "60",
                  align: "center",
                  signIndex: 2,
                  sortable: false,
                  nestedTablesHeader: [
                    {
                      id: 1,
                      label: "人次",
                      prop: "year_ticket_order",
                      width: "60",
                      align: "users",
                      signIndex: 0,
                      sortable: false,
                    },
                    {
                      id: 2,
                      label: "金额",
                      prop: "year_ticket_fee",
                      width: "60",
                      align: "center",
                      signIndex: 1,
                      sortable: false,
                    },
                  ]
                },
              ]
            },
            {
              id: 13,
              label: "市区年卡",
              prop: "citizen_car",
              width: "120",
              align: "center",
              signIndex: 12,
              sortable: false,
              nestedTablesHeader: [
                {
                  id: 1,
                  label: "人次",
                  prop: "citizen_order",
                  width: "60",
                  align: "users",
                  signIndex: 0,
                  sortable: false,
                },
                {
                  id: 2,
                  label: "钱包区",
                  prop: "citizen_wallet_car",
                  width: "60",
                  align: "center",
                  signIndex: 1,
                  sortable: false,
                  nestedTablesHeader: [
                    {
                      id: 1,
                      label: "人次",
                      prop: "citizen_wallet_order",
                      width: "60",
                      align: "users",
                      signIndex: 0,
                      sortable: false,
                    },
                    {
                      id: 2,
                      label: "金额",
                      prop: "citizen_wallet_fee",
                      width: "60",
                      align: "center",
                      signIndex: 1,
                      sortable: false,
                    },
                  ]
                },
                {
                  id: 3,
                  label: "月票区",
                  prop: "citizen_ticket_car",
                  width: "60",
                  align: "center",
                  signIndex: 2,
                  sortable: false,
                  nestedTablesHeader: [
                    {
                      id: 1,
                      label: "人次",
                      prop: "citizen_ticket_order",
                      width: "60",
                      align: "users",
                      signIndex: 0,
                      sortable: false,
                    },
                    {
                      id: 2,
                      label: "金额",
                      prop: "citizen_ticket_fee",
                      width: "60",
                      align: "center",
                      signIndex: 1,
                      sortable: false,
                    },
                  ]
                },
              ]
            },
            {
              id: 14,
              label: "公务年卡",
              prop: "public_car",
              width: "120",
              align: "center",
              signIndex: 13,
              sortable: false,
              nestedTablesHeader: [
                {
                  id: 1,
                  label: "人次",
                  prop: "public_order",
                  width: "60",
                  align: "users",
                  signIndex: 0,
                  sortable: false,
                },
                {
                  id: 2,
                  label: "钱包区",
                  prop: "public_wallet_car",
                  width: "60",
                  align: "center",
                  signIndex: 1,
                  sortable: false,
                  nestedTablesHeader: [
                    {
                      id: 1,
                      label: "人次",
                      prop: "public_wallet_order",
                      width: "60",
                      align: "users",
                      signIndex: 0,
                      sortable: false,
                    },
                    {
                      id: 2,
                      label: "金额",
                      prop: "public_wallet_fee",
                      width: "60",
                      align: "center",
                      signIndex: 1,
                      sortable: false,
                    },
                  ]
                },
                {
                  id: 3,
                  label: "月票区",
                  prop: "public_ticket_car",
                  width: "60",
                  align: "center",
                  signIndex: 2,
                  sortable: false,
                  nestedTablesHeader: [
                    {
                      id: 1,
                      label: "人次",
                      prop: "public_ticket_order",
                      width: "60",
                      align: "users",
                      signIndex: 0,
                      sortable: false,
                    },
                    {
                      id: 2,
                      label: "金额",
                      prop: "public_ticke_fee",
                      width: "60",
                      align: "center",
                      signIndex: 1,
                      sortable: false,
                    },
                  ]
                },
              ]
            },
            {
              id: 15,
              label: "公交卡小计",
              prop: "bus_card_car",
              width: "120",
              align: "center",
              signIndex: 14,
              sortable: false,
              nestedTablesHeader: [
                {
                  id: 1,
                  label: "人次",
                  prop: "bus_card_order",
                  width: "60",
                  align: "users",
                  signIndex: 0,
                  sortable: false,
                },
                {
                  id: 2,
                  label: "金额",
                  prop: "bus_card_fee",
                  width: "60",
                  align: "center",
                  signIndex: 1,
                  sortable: false,
                },
              ]
            },
            {
              id: 16,
              label: "银行卡",
              prop: "bank_car",
              width: "120",
              align: "center",
              signIndex: 15,
              sortable: false,
              nestedTablesHeader: [
                {
                  id: 1,
                  label: "刷卡",
                  prop: "bank_card_car",
                  width: "60",
                  align: "users",
                  signIndex: 0,
                  sortable: false,
                  nestedTablesHeader: [
                    {
                      id: 1,
                      label: "人次",
                      prop: "bank_card_order",
                      width: "60",
                      align: "users",
                      signIndex: 0,
                      sortable: false,
                      
                    },
                    {
                      id: 2,
                      label: "金额",
                      prop: "bank_card_fee",
                      width: "60",
                      align: "center",
                      signIndex: 1,
                      sortable: false,
                    },
                  ]
                },
                {
                  id: 2,
                  label: "支付宝",
                  prop: "ali_car",
                  width: "60",
                  align: "center",
                  signIndex: 1,
                  sortable: false,
                  nestedTablesHeader: [
                    {
                      id: 1,
                      label: "人次",
                      prop: "ali_order",
                      width: "60",
                      align: "users",
                      signIndex: 0,
                      sortable: false,
                      
                    },
                    {
                      id: 2,
                      label: "金额",
                      prop: "ali_fee",
                      width: "60",
                      align: "center",
                      signIndex: 1,
                      sortable: false,
                    },
                  ]
                },
                {
                  id: 3,
                  label: "微信",
                  prop: "we_car",
                  width: "60",
                  align: "center",
                  signIndex: 2,
                  sortable: false,
                  nestedTablesHeader: [
                    {
                      id: 1,
                      label: "人次",
                      prop: "we_order",
                      width: "60",
                      align: "users",
                      signIndex: 0,
                      sortable: false,
                      
                    },
                    {
                      id: 2,
                      label: "金额",
                      prop: "we_fee",
                      width: "60",
                      align: "center",
                      signIndex: 1,
                      sortable: false,
                    },
                  ]
                },
                {
                  id: 4,
                  label: "丰收互联",
                  prop: "foison_car",
                  width: "60",
                  align: "center",
                  signIndex: 3,
                  sortable: false,
                  nestedTablesHeader: [
                    {
                      id: 1,
                      label: "人次",
                      prop: "foison_order",
                      width: "60",
                      align: "users",
                      signIndex: 0,
                      sortable: false,
                      
                    },
                    {
                      id: 2,
                      label: "金额",
                      prop: "foison_fee",
                      width: "60",
                      align: "center",
                      signIndex: 1,
                      sortable: false,
                    },
                  ]
                },
                {
                  id: 5,
                  label: "公交云",
                  prop: "bus_cloud_car",
                  width: "60",
                  align: "center",
                  signIndex: 4,
                  sortable: false,
                  nestedTablesHeader: [
                    {
                      id: 1,
                      label: "人次",
                      prop: "bus_cloud_order",
                      width: "60",
                      align: "users",
                      signIndex: 0,
                      sortable: false,
                      
                    },
                    {
                      id: 2,
                      label: "金额",
                      prop: "bus_cloud_fee",
                      width: "60",
                      align: "center",
                      signIndex: 1,
                      sortable: false,
                    },
                  ]
                },
                {
                  id: 6,
                  label: "微信快乘车",
                  prop: "wx_bus_car",
                  width: "60",
                  align: "center",
                  signIndex: 5,
                  sortable: false,
                  nestedTablesHeader: [
                    {
                      id: 1,
                      label: "人次",
                      prop: "wx_bus_order",
                      width: "60",
                      align: "users",
                      signIndex: 0,
                      sortable: false,
                      
                    },
                    {
                      id: 2,
                      label: "金额",
                      prop: "wx_bus_fee",
                      width: "60",
                      align: "center",
                      signIndex: 1,
                      sortable: false,
                    },
                  ]
                },
              ]
            },
            {
              id: 17,
              label: "银行卡小计",
              prop: "bank_order_car",
              width: "120",
              align: "center",
              signIndex: 16,
              sortable: false,
              nestedTablesHeader: [
                {
                  id: 1,
                  label: "人次",
                  prop: "bank_order",
                  width: "60",
                  align: "users",
                  signIndex: 0,
                  sortable: false,
                },
                {
                  id: 2,
                  label: "金额",
                  prop: "bank_fee",
                  width: "60",
                  align: "center",
                  signIndex: 1,
                  sortable: false,
                },
              ]
            },
            {
              id: 18,
              label: "第三代社保卡",
              prop: "social_car",
              width: "120",
              align: "center",
              signIndex: 17,
              sortable: false,
              nestedTablesHeader: [
                {
                  id: 1,
                  label: "普通卡",
                  prop: "social_card_car",
                  width: "60",
                  align: "users",
                  signIndex: 0,
                  sortable: false,
                  nestedTablesHeader: [
                    {
                      id: 1,
                      label: "人次",
                      prop: "social_card_order",
                      width: "60",
                      align: "users",
                      signIndex: 0,
                      sortable: false,
                    },
                    {
                      id: 2,
                      label: "金额",
                      prop: "social_card_fee",
                      width: "60",
                      align: "center",
                      signIndex: 1,
                      sortable: false,
                    },
                  ]
                },
                {
                  id: 2,
                  label: "免费卡",
                  prop: "social_free_car",
                  width: "60",
                  align: "center",
                  signIndex: 1,
                  sortable: false,
                  nestedTablesHeader: [
                    {
                      id: 1,
                      label: "人次",
                      prop: "social_free_order",
                      width: "60",
                      align: "users",
                      signIndex: 0,
                      sortable: false,
                    },
                    {
                      id: 2,
                      label: "金额",
                      prop: "social_free_fee",
                      width: "60",
                      align: "center",
                      signIndex: 1,
                      sortable: false,
                    },
                  ]
                },
                {
                  id: 3,
                  label: "老年免费卡",
                  prop: "social_old_car",
                  width: "60",
                  align: "center",
                  signIndex: 2,
                  sortable: false,
                  nestedTablesHeader: [
                    {
                      id: 1,
                      label: "人次",
                      prop: "social_old_order",
                      width: "60",
                      align: "users",
                      signIndex: 0,
                      sortable: false,
                    },
                    {
                      id: 2,
                      label: "金额",
                      prop: "social_old_fee",
                      width: "60",
                      align: "center",
                      signIndex: 1,
                      sortable: false,
                    },
                  ]
                },
              ]
            },
            {
              id: 19,
              label: "社保卡总计",
              prop: "social_security_car",
              width: "60",
              align: "center",
              signIndex: 18,
              sortable: false,
              nestedTablesHeader: [
                {
                  id: 1,
                  label: "人次",
                  prop: "social_order",
                  width: "60",
                  align: "users",
                  signIndex: 0,
                  sortable: false,
                },
                {
                  id: 2,
                  label: "金额",
                  prop: "social_fee",
                  width: "60",
                  align: "center",
                  signIndex: 1,
                  sortable: false,
                },
              ]
            },
            {
              id: 20,
              label: "交通部",
              prop: "ministry_car",
              width: "60",
              align: "center",
              signIndex: 19,
              sortable: false,
              nestedTablesHeader: [
                {
                  id: 1,
                  label: "本地卡",
                  prop: "traffic_local_car",
                  width: "60",
                  align: "users",
                  signIndex: 0,
                  sortable: false,
                  nestedTablesHeader: [
                    {
                      id: 1,
                      label: "人次",
                      prop: "traffic_local_order",
                      width: "60",
                      align: "users",
                      signIndex: 0,
                      sortable: false,
                    },
                    {
                      id: 2,
                      label: "金额",
                      prop: "traffic_local_fee",
                      width: "60",
                      align: "center",
                      signIndex: 1,
                      sortable: false,
                    },
                  ]
                },
                {
                  id: 2,
                  label: "异地卡",
                  prop: "traffic_field_car",
                  width: "60",
                  align: "center",
                  signIndex: 1,
                  sortable: false,
                  nestedTablesHeader: [
                    {
                      id: 1,
                      label: "人次",
                      prop: "traffic_field_order",
                      width: "60",
                      align: "users",
                      signIndex: 0,
                      sortable: false,
                    },
                    {
                      id: 2,
                      label: "金额",
                      prop: "traffic_field_fee",
                      width: "60",
                      align: "center",
                      signIndex: 1,
                      sortable: false,
                    },
                  ]
                },
              ]
            },
            {
              id: 21,
              label: "交通部卡总计",
              prop: "traffic_car",
              width: "60",
              align: "center",
              signIndex: 20,
              sortable: false,
              nestedTablesHeader: [
                {
                  id: 1,
                  label: "人次",
                  prop: "traffic_order",
                  width: "60",
                  align: "users",
                  signIndex: 0,
                  sortable: false,
                },
                {
                  id: 2,
                  label: "金额",
                  prop: "traffic_fee",
                  width: "60",
                  align: "center",
                  signIndex: 1,
                  sortable: false,
                },
              ]
            },
            {
              id: 22,
              label: "总计",
              prop: "total_car",
              width: "60",
              align: "center",
              signIndex: 21,
              sortable: false,
              nestedTablesHeader: [
                {
                  id: 1,
                  label: "人次",
                  prop: "total_order",
                  width: "60",
                  align: "users",
                  signIndex: 0,
                  sortable: false,
                },
                {
                  id: 2,
                  label: "金额",
                  prop: "ic_total_fee",
                  width: "60",
                  align: "center",
                  signIndex: 1,
                  sortable: false,
                },
              ]
            },
          ]
        },
      ],
      vehCustomSettingList: [
        {
          id: 1,
          label: "时间",
          prop: "date",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "车牌号",
          prop: "lp_num",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "自编号",
          prop: "self_num",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: true,
        },
        {
          id: 4,
          label: "现金",
          prop: "total_fee",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: true,
        },
        {
          id: 4,
          label: "IC卡消费汇总",
          prop: "ICtotal_fee",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
          nestedTablesHeader: [
            {
              id: 1,
              label: "普通卡",
              prop: "com_car",
              width: "120",
              align: "center",
              signIndex: 0,
              sortable: false,
              nestedTablesHeader: [
                {
                  id: 1,
                  label: "人次",
                  prop: "common_order",
                  width: "60",
                  align: "users",
                  signIndex: 0,
                  sortable: false,
                },
                {
                  id: 2,
                  label: "金额",
                  prop: "common_fee",
                  width: "60",
                  align: "center",
                  signIndex: 1,
                  sortable: false,
                },
              ]
            },
            {
              id: 2,
              label: "老年卡",
              prop: "old_car",
              width: "120",
              align: "center",
              signIndex: 1,
              sortable: false,
              nestedTablesHeader: [
                {
                  id: 1,
                  label: "人次",
                  prop: "old_order",
                  width: "60",
                  align: "users",
                  signIndex: 0,
                  sortable: false,
                },
                {
                  id: 2,
                  label: "金额",
                  prop: "old_fee",
                  width: "60",
                  align: "center",
                  signIndex: 1,
                  sortable: false,
                },
              ]
            },
            {
              id: 3,
              label: "免乘卡",
              prop: "ride_car",
              width: "120",
              align: "center",
              signIndex: 2,
              sortable: false,
              nestedTablesHeader: [
                {
                  id: 1,
                  label: "人次",
                  prop: "ride_order",
                  width: "60",
                  align: "users",
                  signIndex: 0,
                  sortable: false,
                },
                {
                  id: 2,
                  label: "金额",
                  prop: "ride_fee",
                  width: "60",
                  align: "center",
                  signIndex: 1,
                  sortable: false,
                },
              ]
            },
            {
              id: 4,
              label: "拥军卡",
              prop: "army_car",
              width: "120",
              align: "center",
              signIndex: 3,
              sortable: false,
              nestedTablesHeader: [
                {
                  id: 1,
                  label: "人次",
                  prop: "army_order",
                  width: "60",
                  align: "users",
                  signIndex: 0,
                  sortable: false,
                },
                {
                  id: 2,
                  label: "金额",
                  prop: "army_fee",
                  width: "60",
                  align: "center",
                  signIndex: 1,
                  sortable: false,
                },
              ]
            },
            {
              id: 5,
              label: "成人月票卡",
              prop: "adult_car",
              width: "120",
              align: "center",
              signIndex: 4,
              sortable: false,
              nestedTablesHeader: [
                {
                  id: 1,
                  label: "人次",
                  prop: "adult_order",
                  width: "60",
                  align: "users",
                  signIndex: 0,
                  sortable: false,
                },
                {
                  id: 2,
                  label: "金额",
                  prop: "fee",
                  width: "60",
                  align: "center",
                  signIndex: 1,
                  sortable: false,
                  nestedTablesHeader: [
                    {
                      id: 1,
                      label: "钱包区",
                      prop: "adult_fee",
                      width: "60",
                      align: "users",
                      signIndex: 0,
                      sortable: false,
                    },
                    {
                      id: 2,
                      label: "月票区",
                      prop: "adult_ticket",
                      width: "60",
                      align: "center",
                      signIndex: 1,
                      sortable: false,
                    },
                  ]
                },
              ]
            },
            {
              id: 6,
              label: "员工卡",
              prop: "staff_car",
              width: "120",
              align: "center",
              signIndex: 5,
              sortable: false,
              nestedTablesHeader: [
                {
                  id: 1,
                  label: "人次",
                  prop: "staff_order",
                  width: "60",
                  align: "users",
                  signIndex: 0,
                  sortable: false,
                },
                {
                  id: 2,
                  label: "金额",
                  prop: "staff_fee",
                  width: "60",
                  align: "center",
                  signIndex: 1,
                  sortable: false,
                },
              ]
            },
            {
              id: 7,
              label: "畅通卡",
              prop: "unblocked_car",
              width: "120",
              align: "center",
              signIndex: 6,
              sortable: false,
              nestedTablesHeader: [
                {
                  id: 1,
                  label: "人次",
                  prop: "unblocked_order",
                  width: "60",
                  align: "users",
                  signIndex: 0,
                  sortable: false,
                },
                {
                  id: 2,
                  label: "金额",
                  prop: "unblocked_fee",
                  width: "60",
                  align: "center",
                  signIndex: 1,
                  sortable: false,
                },
              ]
            },
            {
              id: 8,
              label: "老人免费卡",
              prop: "old_free_car",
              width: "120",
              align: "center",
              signIndex: 7,
              sortable: false,
              nestedTablesHeader: [
                {
                  id: 1,
                  label: "人次",
                  prop: "old_free_order",
                  width: "60",
                  align: "users",
                  signIndex: 0,
                  sortable: false,
                },
                {
                  id: 2,
                  label: "金额",
                  prop: "old_free_fee",
                  width: "60",
                  align: "center",
                  signIndex: 1,
                  sortable: false,
                },
              ]
            },
            {
              id: 9,
              label: "学生卡",
              prop: "student_car",
              width: "120",
              align: "center",
              signIndex: 8,
              sortable: false,
              nestedTablesHeader: [
                {
                  id: 1,
                  label: "人次",
                  prop: "student_order",
                  width: "60",
                  align: "users",
                  signIndex: 0,
                  sortable: false,
                },
                {
                  id: 2,
                  label: "金额",
                  prop: "student_fee",
                  width: "60",
                  align: "center",
                  signIndex: 1,
                  sortable: false,
                },
              ]
            },
            {
              id: 10,
              label: "月卡",
              prop: "month_car",
              width: "120",
              align: "center",
              signIndex: 9,
              sortable: false,
              nestedTablesHeader: [
                {
                  id: 1,
                  label: "人次",
                  prop: "month_order",
                  width: "60",
                  align: "users",
                  signIndex: 0,
                  sortable: false,
                },
                {
                  id: 2,
                  label: "钱包区",
                  prop: "month_wallet_car",
                  width: "60",
                  align: "center",
                  signIndex: 1,
                  sortable: false,
                  nestedTablesHeader: [
                    {
                      id: 1,
                      label: "人次",
                      prop: "month_wallet_order",
                      width: "60",
                      align: "users",
                      signIndex: 0,
                      sortable: false,
                    },
                    {
                      id: 2,
                      label: "金额",
                      prop: "month_wallet_fee",
                      width: "60",
                      align: "center",
                      signIndex: 1,
                      sortable: false,
                    },
                  ]
                },
                {
                  id: 3,
                  label: "月票区",
                  prop: "month_ticket_car",
                  width: "60",
                  align: "center",
                  signIndex: 2,
                  sortable: false,
                  nestedTablesHeader: [
                    {
                      id: 1,
                      label: "人次",
                      prop: "month_ticket_order",
                      width: "60",
                      align: "users",
                      signIndex: 0,
                      sortable: false,
                    },
                    {
                      id: 2,
                      label: "金额",
                      prop: "month_ticket_fee",
                      width: "60",
                      align: "center",
                      signIndex: 1,
                      sortable: false,
                    },
                  ]
                },
              ]
            },
            {
              id: 11,
              label: "季卡",
              prop: "season_car",
              width: "120",
              align: "center",
              signIndex: 10,
              sortable: false,
              nestedTablesHeader: [
                {
                  id: 1,
                  label: "人次",
                  prop: "season_order",
                  width: "60",
                  align: "users",
                  signIndex: 0,
                  sortable: false,
                },
                {
                  id: 2,
                  label: "钱包区",
                  prop: "season_wallet_car",
                  width: "60",
                  align: "center",
                  signIndex: 1,
                  sortable: false,
                  nestedTablesHeader: [
                    {
                      id: 1,
                      label: "人次",
                      prop: "season_wallet_order",
                      width: "60",
                      align: "users",
                      signIndex: 0,
                      sortable: false,
                    },
                    {
                      id: 2,
                      label: "金额",
                      prop: "season_wallet_fee",
                      width: "60",
                      align: "center",
                      signIndex: 1,
                      sortable: false,
                    },
                  ]
                },
                {
                  id: 3,
                  label: "月票区",
                  prop: "season_ticket_car",
                  width: "60",
                  align: "center",
                  signIndex: 2,
                  sortable: false,
                  nestedTablesHeader: [
                    {
                      id: 1,
                      label: "人次",
                      prop: "season_ticket_order",
                      width: "60",
                      align: "users",
                      signIndex: 0,
                      sortable: false,
                    },
                    {
                      id: 2,
                      label: "金额",
                      prop: "season_ticket_fee",
                      width: "60",
                      align: "center",
                      signIndex: 1,
                      sortable: false,
                    },
                  ]
                },
              ]
            },
            {
              id: 12,
              label: "年卡",
              prop: "year_car ",
              width: "120",
              align: "center",
              signIndex: 11,
              sortable: false,
              nestedTablesHeader: [
                {
                  id: 1,
                  label: "人次",
                  prop: "year_order",
                  width: "60",
                  align: "users",
                  signIndex: 0,
                  sortable: false,
                },
                {
                  id: 2,
                  label: "钱包区",
                  prop: "year_wallet_car",
                  width: "60",
                  align: "center",
                  signIndex: 1,
                  sortable: false,
                  nestedTablesHeader: [
                    {
                      id: 1,
                      label: "人次",
                      prop: "year_wallet_order",
                      width: "60",
                      align: "users",
                      signIndex: 0,
                      sortable: false,
                    },
                    {
                      id: 2,
                      label: "金额",
                      prop: "year_wallet_fee",
                      width: "60",
                      align: "center",
                      signIndex: 1,
                      sortable: false,
                    },
                  ]
                },
                {
                  id: 3,
                  label: "月票区",
                  prop: "year_ticket_car",
                  width: "60",
                  align: "center",
                  signIndex: 2,
                  sortable: false,
                  nestedTablesHeader: [
                    {
                      id: 1,
                      label: "人次",
                      prop: "year_ticket_order",
                      width: "60",
                      align: "users",
                      signIndex: 0,
                      sortable: false,
                    },
                    {
                      id: 2,
                      label: "金额",
                      prop: "year_ticket_fee",
                      width: "60",
                      align: "center",
                      signIndex: 1,
                      sortable: false,
                    },
                  ]
                },
              ]
            },
            {
              id: 13,
              label: "市区年卡",
              prop: "citizen_car",
              width: "120",
              align: "center",
              signIndex: 12,
              sortable: false,
              nestedTablesHeader: [
                {
                  id: 1,
                  label: "人次",
                  prop: "citizen_order",
                  width: "60",
                  align: "users",
                  signIndex: 0,
                  sortable: false,
                },
                {
                  id: 2,
                  label: "钱包区",
                  prop: "citizen_wallet_car",
                  width: "60",
                  align: "center",
                  signIndex: 1,
                  sortable: false,
                  nestedTablesHeader: [
                    {
                      id: 1,
                      label: "人次",
                      prop: "citizen_wallet_order",
                      width: "60",
                      align: "users",
                      signIndex: 0,
                      sortable: false,
                    },
                    {
                      id: 2,
                      label: "金额",
                      prop: "citizen_wallet_fee",
                      width: "60",
                      align: "center",
                      signIndex: 1,
                      sortable: false,
                    },
                  ]
                },
                {
                  id: 3,
                  label: "月票区",
                  prop: "citizen_ticket_car",
                  width: "60",
                  align: "center",
                  signIndex: 2,
                  sortable: false,
                  nestedTablesHeader: [
                    {
                      id: 1,
                      label: "人次",
                      prop: "citizen_ticket_order",
                      width: "60",
                      align: "users",
                      signIndex: 0,
                      sortable: false,
                    },
                    {
                      id: 2,
                      label: "金额",
                      prop: "citizen_ticket_fee",
                      width: "60",
                      align: "center",
                      signIndex: 1,
                      sortable: false,
                    },
                  ]
                },
              ]
            },
            {
              id: 14,
              label: "公务年卡",
              prop: "public_car",
              width: "120",
              align: "center",
              signIndex: 13,
              sortable: false,
              nestedTablesHeader: [
                {
                  id: 1,
                  label: "人次",
                  prop: "public_order",
                  width: "60",
                  align: "users",
                  signIndex: 0,
                  sortable: false,
                },
                {
                  id: 2,
                  label: "钱包区",
                  prop: "public_wallet_car",
                  width: "60",
                  align: "center",
                  signIndex: 1,
                  sortable: false,
                  nestedTablesHeader: [
                    {
                      id: 1,
                      label: "人次",
                      prop: "public_wallet_order",
                      width: "60",
                      align: "users",
                      signIndex: 0,
                      sortable: false,
                    },
                    {
                      id: 2,
                      label: "金额",
                      prop: "public_wallet_fee",
                      width: "60",
                      align: "center",
                      signIndex: 1,
                      sortable: false,
                    },
                  ]
                },
                {
                  id: 3,
                  label: "月票区",
                  prop: "public_ticket_car",
                  width: "60",
                  align: "center",
                  signIndex: 2,
                  sortable: false,
                  nestedTablesHeader: [
                    {
                      id: 1,
                      label: "人次",
                      prop: "public_ticket_order",
                      width: "60",
                      align: "users",
                      signIndex: 0,
                      sortable: false,
                    },
                    {
                      id: 2,
                      label: "金额",
                      prop: "public_ticke_fee",
                      width: "60",
                      align: "center",
                      signIndex: 1,
                      sortable: false,
                    },
                  ]
                },
              ]
            },
            {
              id: 15,
              label: "公交卡小计",
              prop: "bus_card_car",
              width: "120",
              align: "center",
              signIndex: 14,
              sortable: false,
              nestedTablesHeader: [
                {
                  id: 1,
                  label: "人次",
                  prop: "bus_card_order",
                  width: "60",
                  align: "users",
                  signIndex: 0,
                  sortable: false,
                },
                {
                  id: 2,
                  label: "金额",
                  prop: "bus_card_fee",
                  width: "60",
                  align: "center",
                  signIndex: 1,
                  sortable: false,
                },
              ]
            },
            {
              id: 16,
              label: "银行卡",
              prop: "bank_car",
              width: "120",
              align: "center",
              signIndex: 15,
              sortable: false,
              nestedTablesHeader: [
                {
                  id: 1,
                  label: "刷卡",
                  prop: "bank_card_car",
                  width: "60",
                  align: "users",
                  signIndex: 0,
                  sortable: false,
                  nestedTablesHeader: [
                    {
                      id: 1,
                      label: "人次",
                      prop: "bank_card_order",
                      width: "60",
                      align: "users",
                      signIndex: 0,
                      sortable: false,
                      
                    },
                    {
                      id: 2,
                      label: "金额",
                      prop: "bank_card_fee",
                      width: "60",
                      align: "center",
                      signIndex: 1,
                      sortable: false,
                    },
                  ]
                },
                {
                  id: 2,
                  label: "支付宝",
                  prop: "ali_car",
                  width: "60",
                  align: "center",
                  signIndex: 1,
                  sortable: false,
                  nestedTablesHeader: [
                    {
                      id: 1,
                      label: "人次",
                      prop: "ali_order",
                      width: "60",
                      align: "users",
                      signIndex: 0,
                      sortable: false,
                      
                    },
                    {
                      id: 2,
                      label: "金额",
                      prop: "ali_fee",
                      width: "60",
                      align: "center",
                      signIndex: 1,
                      sortable: false,
                    },
                  ]
                },
                {
                  id: 3,
                  label: "微信",
                  prop: "we_car",
                  width: "60",
                  align: "center",
                  signIndex: 2,
                  sortable: false,
                  nestedTablesHeader: [
                    {
                      id: 1,
                      label: "人次",
                      prop: "we_order",
                      width: "60",
                      align: "users",
                      signIndex: 0,
                      sortable: false,
                      
                    },
                    {
                      id: 2,
                      label: "金额",
                      prop: "we_fee",
                      width: "60",
                      align: "center",
                      signIndex: 1,
                      sortable: false,
                    },
                  ]
                },
                {
                  id: 4,
                  label: "丰收互联",
                  prop: "foison_car",
                  width: "60",
                  align: "center",
                  signIndex: 3,
                  sortable: false,
                  nestedTablesHeader: [
                    {
                      id: 1,
                      label: "人次",
                      prop: "foison_order",
                      width: "60",
                      align: "users",
                      signIndex: 0,
                      sortable: false,
                      
                    },
                    {
                      id: 2,
                      label: "金额",
                      prop: "foison_fee",
                      width: "60",
                      align: "center",
                      signIndex: 1,
                      sortable: false,
                    },
                  ]
                },
                {
                  id: 5,
                  label: "公交云",
                  prop: "bus_cloud_car",
                  width: "60",
                  align: "center",
                  signIndex: 4,
                  sortable: false,
                  nestedTablesHeader: [
                    {
                      id: 1,
                      label: "人次",
                      prop: "bus_cloud_order",
                      width: "60",
                      align: "users",
                      signIndex: 0,
                      sortable: false,
                      
                    },
                    {
                      id: 2,
                      label: "金额",
                      prop: "bus_cloud_fee",
                      width: "60",
                      align: "center",
                      signIndex: 1,
                      sortable: false,
                    },
                  ]
                },
                {
                  id: 6,
                  label: "微信快乘车",
                  prop: "wx_bus_car",
                  width: "60",
                  align: "center",
                  signIndex: 5,
                  sortable: false,
                  nestedTablesHeader: [
                    {
                      id: 1,
                      label: "人次",
                      prop: "wx_bus_order",
                      width: "60",
                      align: "users",
                      signIndex: 0,
                      sortable: false,
                      
                    },
                    {
                      id: 2,
                      label: "金额",
                      prop: "wx_bus_fee",
                      width: "60",
                      align: "center",
                      signIndex: 1,
                      sortable: false,
                    },
                  ]
                },
              ]
            },
            {
              id: 17,
              label: "银行卡小计",
              prop: "bank_order_car",
              width: "120",
              align: "center",
              signIndex: 16,
              sortable: false,
              nestedTablesHeader: [
                {
                  id: 1,
                  label: "人次",
                  prop: "bank_order",
                  width: "60",
                  align: "users",
                  signIndex: 0,
                  sortable: false,
                },
                {
                  id: 2,
                  label: "金额",
                  prop: "bank_fee",
                  width: "60",
                  align: "center",
                  signIndex: 1,
                  sortable: false,
                },
              ]
            },
            {
              id: 18,
              label: "第三代社保卡",
              prop: "social_car",
              width: "120",
              align: "center",
              signIndex: 17,
              sortable: false,
              nestedTablesHeader: [
                {
                  id: 1,
                  label: "普通卡",
                  prop: "social_card_car",
                  width: "60",
                  align: "users",
                  signIndex: 0,
                  sortable: false,
                  nestedTablesHeader: [
                    {
                      id: 1,
                      label: "人次",
                      prop: "social_card_order",
                      width: "60",
                      align: "users",
                      signIndex: 0,
                      sortable: false,
                    },
                    {
                      id: 2,
                      label: "金额",
                      prop: "social_card_fee",
                      width: "60",
                      align: "center",
                      signIndex: 1,
                      sortable: false,
                    },
                  ]
                },
                {
                  id: 2,
                  label: "免费卡",
                  prop: "social_free_car",
                  width: "60",
                  align: "center",
                  signIndex: 1,
                  sortable: false,
                  nestedTablesHeader: [
                    {
                      id: 1,
                      label: "人次",
                      prop: "social_free_order",
                      width: "60",
                      align: "users",
                      signIndex: 0,
                      sortable: false,
                    },
                    {
                      id: 2,
                      label: "金额",
                      prop: "social_free_fee",
                      width: "60",
                      align: "center",
                      signIndex: 1,
                      sortable: false,
                    },
                  ]
                },
                {
                  id: 3,
                  label: "老年免费卡",
                  prop: "social_old_car",
                  width: "60",
                  align: "center",
                  signIndex: 2,
                  sortable: false,
                  nestedTablesHeader: [
                    {
                      id: 1,
                      label: "人次",
                      prop: "social_old_order",
                      width: "60",
                      align: "users",
                      signIndex: 0,
                      sortable: false,
                    },
                    {
                      id: 2,
                      label: "金额",
                      prop: "social_old_fee",
                      width: "60",
                      align: "center",
                      signIndex: 1,
                      sortable: false,
                    },
                  ]
                },
              ]
            },
            {
              id: 19,
              label: "社保卡总计",
              prop: "social_security_car",
              width: "60",
              align: "center",
              signIndex: 18,
              sortable: false,
              nestedTablesHeader: [
                {
                  id: 1,
                  label: "人次",
                  prop: "social_order",
                  width: "60",
                  align: "users",
                  signIndex: 0,
                  sortable: false,
                },
                {
                  id: 2,
                  label: "金额",
                  prop: "social_fee",
                  width: "60",
                  align: "center",
                  signIndex: 1,
                  sortable: false,
                },
              ]
            },
            {
              id: 20,
              label: "交通部",
              prop: "ministry_car",
              width: "60",
              align: "center",
              signIndex: 19,
              sortable: false,
              nestedTablesHeader: [
                {
                  id: 1,
                  label: "本地卡",
                  prop: "traffic_local_car",
                  width: "60",
                  align: "users",
                  signIndex: 0,
                  sortable: false,
                  nestedTablesHeader: [
                    {
                      id: 1,
                      label: "人次",
                      prop: "traffic_local_order",
                      width: "60",
                      align: "users",
                      signIndex: 0,
                      sortable: false,
                    },
                    {
                      id: 2,
                      label: "金额",
                      prop: "traffic_local_fee",
                      width: "60",
                      align: "center",
                      signIndex: 1,
                      sortable: false,
                    },
                  ]
                },
                {
                  id: 2,
                  label: "异地卡",
                  prop: "traffic_field_car",
                  width: "60",
                  align: "center",
                  signIndex: 1,
                  sortable: false,
                  nestedTablesHeader: [
                    {
                      id: 1,
                      label: "人次",
                      prop: "traffic_field_order",
                      width: "60",
                      align: "users",
                      signIndex: 0,
                      sortable: false,
                    },
                    {
                      id: 2,
                      label: "金额",
                      prop: "traffic_field_fee",
                      width: "60",
                      align: "center",
                      signIndex: 1,
                      sortable: false,
                    },
                  ]
                },
              ]
            },
            {
              id: 21,
              label: "交通部卡总计",
              prop: "traffic_car",
              width: "60",
              align: "center",
              signIndex: 20,
              sortable: false,
              nestedTablesHeader: [
                {
                  id: 1,
                  label: "人次",
                  prop: "traffic_order",
                  width: "60",
                  align: "users",
                  signIndex: 0,
                  sortable: false,
                },
                {
                  id: 2,
                  label: "金额",
                  prop: "traffic_fee",
                  width: "60",
                  align: "center",
                  signIndex: 1,
                  sortable: false,
                },
              ]
            },
            {
              id: 22,
              label: "总计",
              prop: "total_car",
              width: "60",
              align: "center",
              signIndex: 21,
              sortable: false,
              nestedTablesHeader: [
                {
                  id: 1,
                  label: "人次",
                  prop: "total_order",
                  width: "60",
                  align: "users",
                  signIndex: 0,
                  sortable: false,
                },
                {
                  id: 2,
                  label: "金额",
                  prop: "ic_total_fee",
                  width: "60",
                  align: "center",
                  signIndex: 1,
                  sortable: false,
                },
              ]
            },
          ]
        },
      ],
      tableList: ['date','line_id','line_name','lp_num','self_num','vehicle_id']
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead();
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
    // 查询
    onSubmit(val) {
      this.form = Object.assign({}, val);
      this.loadData();
    },
    // 数据加载
    loadData() {
      this.loading = true;
      let params = Object.assign({}, this.form);
      params.page_index = this.activeName === 'first' ? this.linePageInfo.pageIndex : this.vehPageInfo.pageIndex;
      params.page_size = this.activeName === 'first' ?  this.linePageInfo.pageSize : this.vehPageInfo.pageSize;
      this.$client[this.httpGetObj[this.activeName]](params).then(res => {
        if(res.head.result == '200') {
          this.loading = false;
          let info = JSON.parse(JSON.stringify(res.context.list));
          info.forEach((item, index)=> {
            if(!!item.month_purse) {
              for(let key in item.month_purse) {
                if(this.tableList.indexOf(key) === -1) {
                  info[index][key] = item.month_purse[key]
                }
              }
            }
          })
          console.log(info);
          if(this.activeName == 'first') {
            this.lineData = info;
            this.linePageInfo.pageCount = res.context.total
            this.lineSumTotal = {
              3: res.context.total_fee
            }
          }else{
            this.vehData = info;
            this.vehPageInfo.pageCount = res.context.total
            this.vehSumTotal = {
              4: res.context.total_fee
            }
          }
        }else {
          this.loading = false;
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    // 导出
    exportExcel(form) {
      let params = Object.assign({}, form);
      params.page_index = this.activeName === 'first' ? this.linePageInfo.pageIndex : this.vehPageInfo.pageIndex;
      params.page_size = this.activeName === 'first' ?  this.linePageInfo.pageSize : this.vehPageInfo.pageSize;
      this.$client[this.httpExportObj[this.activeName]](params)
      .then(res => {
         if (res.head.result == "200") {
            window.location.href = res.context;
            this.$message({ message: "导出成功", type: "success" });
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
      }).catch(err => {
        this.$message({ message: "导出失败", type: "error" });
      })
    },
    // 导入
    importExcel() {
      this.fileDialogVisible = true;
    },
    // 导入信息Excel
    importICExcel(val) {
      let formData = new FormData();
      formData.append("file", val.file);
      formData.append("type", val.radio);
      let params = formData;
      console.log(params)
      this.$client.ICImportDayPurse(params).then((res) => {
        if (res.head.result == "200") {
          this.form = {};
          // 重置信息
          this.pageInfo.pageIndex = 1;
          this.pageInfo.pageCount = 0;
          this.$refs.head.resetForm();
          this.loadData();
          this.fileDialogVisible = false;
          this.$message({ message: res.head.describle, type: "success" });
        } else {
          this.fileDialogVisible = false;
          let errorData = [];
          const h = this.$createElement;
          errorData.push(h("p", null, res.head.describle));
          this.$msgbox({
            title: "提示",
            message: h("div", null, errorData),
            confirmButtonText: "确定",
          });
        }
      });
    },
    // 查看明细
    getDetailData(row, type) {
      console.log(row, type);
      this.requestData = {}
      // this.requestData.date_start = row.date.slice(0, 4) + '-' + row.date.slice(4, 6) + '-' + row.date.slice(6, 8) + ' 00:00:00'
      // this.requestData.date_end = row.date.slice(10, 14) + '-' + row.date.slice(14, 16) + '-' + row.date.slice(16, 18) + ' 23:59:59'
      if(type === 'line_id') {
        this.requestData.line_id =  row.line_id
      }else {
        this.requestData.vehicle_ids = [row.vehicle_id]
      }
      if(row.date) {
        let year = row.date.slice(0,4)
        let month = row.date.slice(5,7)
        this.requestData.date_start = formatTime(new Date(year, month - 1, 1)) + ' 00:00:00' 
        this.requestData.date_end = formatTime(new Date(year, month, 0)) + ' 23:59:59'
        this.informationDialogShow = true
        // console.log(year, month);
      }
      // console.log(this.requestData);
    },
    // 分页切换事件
    handleCurrentChange(idx) {
      if(this.activeName == 'first') {
        this.linePageInfo.pageIndex = idx
      }else{
        this.vehPageInfo.pageIndex = idx
      }
      this.loadData();
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      if(this.activeName == 'first') {
        this.linePageInfo.pageIndex = 1
        this.linePageInfo.pageSize = sizes;
        this.linePageInfo.pageCount = 0;
      }else{
        this.vehPageInfo.pageIndex = 1
        this.vehPageInfo.pageSize = sizes;
        this.vehPageInfo.pageCount = 0;
      }
      this.loadData();
    },
    // 计算表格高度 和初始化表头
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.activeName === 'first' ? this.$refs.lineHead.$el.offsetHeight : this.$refs.vehHead.$el.offsetHeight;
        let ph = this.activeName === 'first' ?  this.$refs.linePaginationH.$el.offsetHeight : this.$refs.vehPaginationH.$el.offsetHeight;
        this.TableHeight = maxh - th - ph - 55;
        // console.log(this, maxh, th, ph);
      }, 60);
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.money-bag-statistics
  height: 100%
  width: 100%

</style>