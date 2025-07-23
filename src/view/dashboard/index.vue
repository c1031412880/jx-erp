<template>
  <div class="dashboard-container">
    <!-- 快速通道 -->
    <el-row :gutter="10">
      <el-col :span="24">
        <app-list></app-list>
      </el-col>
      <el-col :span="12">
        <demo-box title="新闻管理"> 
          <new-list></new-list>
        </demo-box>
      </el-col>
      <el-col :span="6">
        <demo-box title="基层动态"> 
          <base-list></base-list>
        </demo-box>
      </el-col>
      <el-col :span="6">
        <demo-box title="公司公告"> 
          <announcement-list></announcement-list>
        </demo-box>
      </el-col>
      <el-col :span="8">
        <demo-box title="工作事项" :showAllBtn="false" :contextClass="'content-second'"> 
          <work-list></work-list>
        </demo-box>
      </el-col>
      <el-col :span="8">
        <demo-box title="企业资源" :showAllBtn="false" :contextClass="'content-second'"> 
          <bus-list></bus-list>
        </demo-box>
      </el-col>
      <el-col :span="8">
        <demo-box title="公交营运分析" :showAllBtn="false" :contextClass="'content-second'"> 
          <operation-list></operation-list>
        </demo-box>
      </el-col>
      <el-col :span="8">
        <demo-box title="营收分析" :showAllBtn="false" :contextClass="'content-second'"> 
          <revenue-list></revenue-list>
        </demo-box>
      </el-col>
      <el-col :span="8">
        <demo-box title="服务分析" :showAllBtn="false" :contextClass="'content-second'"> 
          <service-list></service-list>
        </demo-box>
      </el-col>
      <el-col :span="8">
        <demo-box title="安全分析" :showAllBtn="false" :contextClass="'content-second'"> 
          <safe-list></safe-list>
        </demo-box>
      </el-col>
      <el-col :span="8">
        <demo-box title="机务分析" :showAllBtn="false" :contextClass="'content-second'"> 
          <energy-list></energy-list>
        </demo-box>
      </el-col>
      <el-col :span="8">
        <demo-box title="维修分析" :showAllBtn="false" :contextClass="'content-second'"> 
          <maintenance-list></maintenance-list>
        </demo-box>
      </el-col>
      <el-col :span="8">
        <demo-box title="物资分析" :showAllBtn="false" :contextClass="'content-second'"> 
          <material-list></material-list>
        </demo-box>
      </el-col>
      <el-col :span="8">
        <demo-box title="企业管理" :showAllBtn="false" :contextClass="'content-second'"> 
          <company-list></company-list>
        </demo-box>
      </el-col>
      <el-col :span="8">
        <demo-box title="人事分析" :showAllBtn="false" :contextClass="'content-second'"> 
          <person-list></person-list>
        </demo-box>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import demoBox from './component/demo-box'
import appList from './component/app-list'
import newList from './component/new-list'
import baseList from './component/base-list'
import announcementList from './component/announcement-list'
import workList from './component/work-list'
import busList from './component/bus-list'
import operationList from './component/operation-list'
import revenueList from './component/revenue-list'
import serviceList from './component/service-list'
import safeList from './component/safe-list'
import energyList from './component/energy-list'
import maintenanceList from './component/maintenance-list'
import materialList from './component/material-list'
import companyList from './component/company-list'
import personList from './component/person-list'
export default {
  name: 'dashboard',
  components: {
    demoBox,
    appList,
    newList,
    baseList,
    announcementList,
    workList,
    busList,
    operationList,
    revenueList,
    serviceList,
    safeList,
    energyList,
    maintenanceList,
    materialList,
    companyList,
    personList
  },
  data() {
    return {}
  },

  mounted() {},

  methods: {},
  watch: {}
}
</script>

<style rel="stylesheet/stylus" lang="stylus" scoped>
.dashboard-container {
  width: 100%;
  background: #E0E1E5;
}
</style>
