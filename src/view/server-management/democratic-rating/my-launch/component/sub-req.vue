<template>
  <div v-cloak>
    <el-form :inline="true" size="mini" :model="form" ref="form">
      <el-row>
        <el-form-item label="评分季度" prop="score_year">
          <div style="display: flex;width: 100%;">
            <el-date-picker
              v-model="form.score_year"
              value-format="yyyy"
              format="yyyy"
              type="year"
              placeholder="选择年">
            </el-date-picker>
            <el-select v-model="form.score_season" placeholder="请选择季度" clearable>
              <el-option
                v-for="item in quarterList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="被评分驾驶员" prop="driver_ids">
          <get-driver-select-tree
            ref="personalTree"
            v-model="form.driver_ids"
            :isShowCheckbox="true"
            :placeholder="'请选择驾驶员'"
            :isExportMultiple="true"
            :isCheckStrictly="false"
          ></get-driver-select-tree>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.data_state" placeholder="请选择状态" clearable>
            <el-option
              v-for="item in stateList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm()" icon="el-icon-refresh-right">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('add')" type="primary">添加</el-button>
        </el-form-item>
        <el-form-item>
          <el-popconfirm
            @confirm="onBtn('delete')"
            title="确定删除选中的数据吗？"
            v-if="$isPowerShow('del')">
            <el-button slot="reference" type="primary" icon="el-icon-delete" size="mini">删除</el-button>
          </el-popconfirm>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";
import {formatDate} from '@/utils'
export default {
  components: {
    getDriverSelectTree
  },
  data() {
    return {
      form: {
        score_year: formatDate(new Date,'yyyy'),
        score_season: '',
        driver_ids: [],
        data_state: '',
        tab_type: 2
      },
      stateList: [
        {
          label: '草稿',
          value: 1
        },
        {
          label: '审批中',
          value: 2
        },
        {
          label: '审批拒绝',
          value: -1
        },
        {
          label: '撤回',
          value: -2
        },
        {
          label: '未开始',
          value: 3
        },
        {
          label: '评分中',
          value: 4
        },
        {
          label: '已结束',
          value: 5
        },
      ],
      quarterList: [
        {
          label: '第一季度',
          value: 1
        },
        {
          label: '第二季度',
          value: 2
        },
        {
          label: '第三季度',
          value: 3
        },
        {
          label: '第四季度',
          value: 4
        }
      ],
    };
  },
  mounted() {
    this.onSubmit()
  },
  methods: {
    // 查询
    onSubmit() {
      let info = {...this.form};
      this.$emit("on-ok", info);
    },
    resetForm() {
      this.$refs.personalTree.onClear()
      Object.assign(this.$data, this.$options.data());
      this.onSubmit()
    },
    onBtn(type) {
      this.$emit(`on-${type}`)
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
