<template>
  <div class="superior-department show-flex-box-c">
    <h3>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;下级部门</h3>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- <span>卡片名称</span> -->
        <el-button style="margin-left: 10px" type="primary" size="mini"
          @click="addOrganizationInfo"
          :disabled="isShowadjustSort"
          v-if="$isPowerShow('add')"
          >添加子组织</el-button
        >
        <el-button type="primary" size="mini" @click="adjustSort" v-if="$isPowerShow('sort')"
          >{{isShowadjustSort? '保存':'调整排序'}}</el-button
        >
      </div>
      <div v-if="departmentList.length > 0">
        <ul class="department-list show-flex-box-c" v-if="!isShowadjustSort">
          <li
            class="department-item show-flex-box-r"
            v-for="(item, index) in departmentList"
            :key="index"
            @click="selectedOrganiation(item)"
          >
            <span>{{ item.dept_name }}</span>
            <i class="el-icon-arrow-right"></i>
          </li>
        </ul>
        <div class="adjust-sort-content" v-else>
          <table-draggable-sort
            :defaultSortProps="defaultSortProps"
            :TableHeight="300"
            :tableConfig="tableConfig"
            :dataInfoList="departmentList"
          ></table-draggable-sort>
        </div>
      </div>
      <div v-else>
        <div class="show-flex-box-r show-flex-center" style="height: 200px">
          <span style="font-size: 14px; color:#909399;">此组织、部门暂无下级组织、部门</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script type="text/ecmascript-6">
import tableDraggableSort from "@/components/tableDraggableSort";
export default {
  props: {
    departmentList: [Array],
  },
  components: {
    tableDraggableSort
  },
  data() {
    return {
      isShowadjustSort: false,
      tableConfig: {
        tableItems: [
          {
            label: "部门",
            prop: "label",
            width: "360",
            align: "left",
          },
          {
            label: "拖动顺序调整",
            prop: "sort",
            width: "190",
            align: "center",
          },
          // {
          //   label: "操作",
          //   prop: "operate",
          //   width: "160",
          //   align: "center",
          // },
        ],
      },
      newTableData:[],
      defaultSortProps:{
        value: "dept_id",
        label: "dept_name",
        sort: "sort",
      }
    };
  },
  methods: {
    // 更新排序
    updateSortInfo(tableData) {
      // console.log(tableData);
      // this.newTableData= JSON.parse(JSON.stringify(tableData))
      this.newTableData = []; 
      tableData.forEach(item => {
        // delete item.label
        let obj = {
          id: item.value,
          sort: item.sort,
        };
        this.newTableData.push(obj)
      });
    },
    adjustSort() {
      if(this.isShowadjustSort) {
        // 保存
        if(this.newTableData.length > 0) {
          this.$emit('update-sore-event', this.newTableData, 'department')
        }
      }else{
        this.$emit('have-other-sore')
      }
      this.isShowadjustSort = !this.isShowadjustSort;
    },
    addOrganizationInfo() {
      this.$emit('add-organization-info',"add")
    },
    // 选择组织部门
    selectedOrganiation(organiationInfo) {
      this.$emit('selected-organization-info',organiationInfo)
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.superior-department {
  h3 {
    margin-bottom: 20px;
  }
}

.department-list {
  width: 100%;

  .department-item {
    width: 100%;
    height: 32px;
    border: 1px #eee solid;
    margin-bottom: 10px;
    cursor: pointer;
    align-items: center;

    >span {
      flex-grow: 1;
      padding: 20px;
      line-height: 15px;
      font-size: 14px;
    }

    >i {
      flex-shrink: 0;
      margin-right: 20px;
    }
  }

  .department-item:hover {
    background: #eee;
  }
}
</style>
