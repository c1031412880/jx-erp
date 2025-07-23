
<template>
  <div style="height:100%; overflow-x: hidden">
    <tr-table
      ref="table"
      :selectionShow="false"
      :data="data"
      :tableHeaderList="tableHeaderList"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
    >
      <template slot-scope="scope" slot="operation">
        <el-button type="primary" size="mini" @click="staffRowInfo(scope.data)"
          >详情</el-button
        >
        <el-button type="primary" size="mini" @click="editStaffInfo(scope.data)"
          >编辑</el-button
        >
        <el-popconfirm
          @confirm="tableDel(scope.data)"
          title="是否人确认员工离职？"
        >
          <el-button
            slot="reference"
            type="danger"
            size="mini"
            style="margin-left: 10px"
            >离职</el-button
          >
        </el-popconfirm>
      </template>
    </tr-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: [

        ],
      frontFixedNum: 0,
      backFixedNum: 0,
      TableHeight: 500,
      loading: false,
      tableHeaderList: [
        {
          id: 1,
          label: "工单号码",
          prop: "work_code",
          width: "120",
          align: "center",
          signIndex: 0,
          sortable: true,
        },
        {
          id: 2,
          label: "报修类别",
          prop: "type_child_name",
          width: "120",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
        {
          id: 3,
          label: "报修日期",
          prop: "repair_time",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "完工日期",
          prop: "finish_time",
          width: "120",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "维修项目",
          prop: "item_name",
          width: "170",
          align: "center",
          signIndex: 4,
          sortable: true,
        },
      ],
    };
  },

  methods: {
    setData(val){
       this.$client.getrOrderList({vehicle_id:val.vehicle_id})
      .then(res => {
        if (res.head.result == "200") {
          // this.orderStatus = res.context.index
          this.data =res.context.list
          console.log(res.context)
          if(this.data.length>0){
           this.data.forEach(item => {
              let item_name = []
             if(item.repair_items.length>0){
               item.repair_items.forEach(element => {
                 item_name.push(element.item_name)
               });
             }
             this.$set(item,'item_name',item_name.join('、'))
          })
        
          
          }
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        };
      })
    },
    resetData(){
      // this.data = ''
    },
  },
};
</script>
<style lang='scss' scoped>
</style>