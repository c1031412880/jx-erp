<template>
  <div class="public-form">
    <sub-req
      ref="head"
      :active_name="active_name"
      @on-ok="onSubmit">
    </sub-req>
    <div class="show-box">
      <span>已选审批单：</span>
      <div class="title-tag">
        <el-tag 
        style="margin: 0 5px 5px 0" size="mini" effect="dark" type="success" 
        v-for="item in selectRowList" 
        :key="item.code">{{ item.code }}</el-tag>
      </div>
    </div>
    <el-tabs v-model="active_name" @tab-click="handleClick" style="height:100%;">
      <el-tab-pane label="我处理的" name="first" key="wochuli" lazy>
        <cor-box :height="carHeight">
          <table-date ref="myDeal" :approvalFormVisible="approvalFormVisible" :relevances="selectRowList" :currentType="active_name" @on-out="getSelectRow"></table-date>
        </cor-box>
      </el-tab-pane>
      <el-tab-pane label="我待处理的" name="fourth" key="wodaichuli" lazy>
        <cor-box :height="carHeight">
          <table-date ref="myPending" :approvalFormVisible="approvalFormVisible" :relevances="selectRowList" :currentType="active_name" @on-out="getSelectRow"></table-date>
        </cor-box>
      </el-tab-pane>
      <el-tab-pane label="我发起的" name="second" key="wofaqi" lazy>
        <cor-box :height="carHeight">
          <table-date ref="myCreate" :approvalFormVisible="approvalFormVisible" :relevances="selectRowList" :currentType="active_name" @on-out="getSelectRow"></table-date>
        </cor-box>
      </el-tab-pane>
      <el-tab-pane label="抄送我的" name="third" key="chaosong" lazy>
        <cor-box :height="carHeight">
          <table-date ref="myCopy" :approvalFormVisible="approvalFormVisible" :relevances="selectRowList" :currentType="active_name" @on-out="getSelectRow"></table-date>
        </cor-box>
      </el-tab-pane>
    </el-tabs>
    <div class="footer-box">
      <el-button size="small" @click="closeDialog">取 消</el-button>
      <el-button size="small" type="primary" @click="ok()">确 定</el-button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import corBox from './component/cor-box'
import tableDate from "./component/tableDate"
import subReq from "./component/sub-req";
import { deepCopy } from '@/utils/index';
export default {
  components: { corBox, tableDate,subReq },
  props: {
    approvalFormVisible: {
      type: Boolean,
      default: false
    },
    interType: '',
    relevances: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      active_name: 'second',
      carHeight: 600,
      selectRowList: [],
      selectListInfo: {
        'first': [],
        'second': [],
        'third': [],
        'fourth': [],
      },
      activeType: {
        'first': 'myDeal',
        'second': 'myCreate',
        'third': 'myCopy',
        'fourth': 'myPending',
      },
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.selectRowList = deepCopy(this.relevances)
      this.relevances.forEach(item => {
        if (this.selectListInfo[item.active_name]) {
          this.selectListInfo[item.active_name].push(item)
        }
      });
      this.setBoxHeight()
    })
  },
  methods: {
    // 提交查询
    onSubmit(form) {
      if (this.active_name === 'fourth') {
        delete form.state
      }
      this.$refs[this.activeType[this.active_name]].loadData(form)
    },
    ok() {
      if(!this.selectRowList.length) {
        this.$message({showClose: true, message: '请选择要关联的审批单', type: "error",});
      }else {
        this.$emit('on-out', this.selectRowList)
        this.handleClick()
      }
    },
    getSelectRow(list,oldList) {
      let arr = []
      this.selectRowList = []
      if (list.length > 0) {
        list.forEach(item => {
          item.isClick = true
          item.active_name = this.active_name
        });
      }
      arr = oldList.filter(item => {return (!item.isClick && item.active_name == this.active_name)})
      for (const key in this.selectListInfo) {
        if (Object.hasOwnProperty.call(this.selectListInfo, key)) {
          this.selectListInfo[key].forEach((item,index) => {
            if (list.length > 0) {
              list.forEach(child =>{
                if (item.code == child.code && item.active_name !== child.active_name) {
                  this.selectListInfo[key].splice(index,1)
                }
              })
            }
          })
        }
      }
      this.selectListInfo[this.active_name] = deepCopy([...list,...arr])
      for (const key in this.selectListInfo) {
        if (Object.hasOwnProperty.call(this.selectListInfo, key)) {
          this.selectRowList = this.unique([...this.selectRowList,...this.selectListInfo[key]])
        }
      }

    },
    //去重
    unique(arr) {
      let map = new Map();
      for (let item of arr) {
        map.set(item.code, item);
      }
      return [...map.values()];
    },
    handleClick(tab, event) {
      this.$nextTick(() => {
        this.$refs[this.activeType[this.active_name]].echoSelect(true)
      })
      // this.relevances = []
      // if(!!this.$refs.myDeal) {
      //   this.$refs.myDeal.reset()
      // }
      // if(!!this.$refs.myCreate) {
      //   this.$refs.myCreate.reset()
      // }
      // if(!!this.$refs.myCopy) {
      //   this.$refs.myCopy.reset()
      // }
      // this.$nextTick(() => {
      //   this.$refs[this.activeType[this.active_name]].loadData()
      // })
    },
    setBoxHeight() {
      // let th = this.$refs.head.offsetHeight;
      this.carHeight = this.$el.offsetHeight - 55
    },
    closeDialog() {
      this.$emit('on-close')
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.public-form
  height: 75vh;
  width: 100%;
  .footer-box
    display: flex;
    justify-content: center;
    align-content: center;
  .show-box
    width: 100%;
    display: flex;
    margin-bottom: 10px;
    align-items: center;
    .title-tag
      flex: 1; 
      overflow: hidden;
</style>