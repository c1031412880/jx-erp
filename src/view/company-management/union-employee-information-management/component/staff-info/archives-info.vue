<template>
  <div class="archives-info" style="height:400px;overflow-x:hidden">
    <el-form ref="elForm" :model="formData" :rules="rules" size="mini" label-width="115px">
      <el-row>
        
        <el-col :span="8">
          <el-form-item label="所属工会:" prop="affiliated_trade">
            <el-input v-model="formData.affiliated_trade" placeholder="请输入所属工会" :disabled="this.curChangeType == 'detail'"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="工会职务:" prop="trade_post">
            <tr-select-dictionaries
              v-model="formData.trade_post"
              :classKey="'岗位级别'"
              :placeholder="'请选择职务'"
              :isMultiple="false"
              :disabled="this.curChangeType == 'detail'"
            ></tr-select-dictionaries>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="加入工会时间:" prop="join_trade">
            <el-date-picker
              v-model="formData.join_trade"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期"
              :disabled="this.curChangeType == 'detail'">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="会员证号:" prop="trade_code">
            <el-input v-model="formData.trade_code" placeholder="请输入会员证号" :disabled="this.curChangeType == 'detail'"></el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="8">
          <el-form-item label="是否为困难职工:" prop="is_difficulty">
            <el-select v-model="formData.is_difficulty" placeholder="请选择是否为困难职工" clearable :disabled="this.curChangeType == 'detail'">
              <el-option 
                v-for="(item, index) in isStaffRepresentativeOptions" 
                :key="index" 
                :label="item.name"
                :value="item.value" >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col> -->
        <el-col :span="8">
          <el-form-item label="入选日期:" prop="join_difficulty">
            <el-date-picker
              v-model="formData.join_difficulty"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择困难职工入选日期"
              disabled>
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="入选次数:" prop="difficulty_count">
            <el-input-number v-model="formData.difficulty_count" placeholder="请填写困难职工入选次数" clearable
              :style="{width: '100%'}" :controls="false" disabled></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="家庭人口数:" prop="house_number">
            <el-input-number v-model="formData.house_number" placeholder="请填写家庭人口数" clearable
              :style="{width: '100%'}" :controls="false" :disabled="this.curChangeType == 'detail'"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="合同类型:" prop="d_labor_contract_type ">
            <el-select v-model="formData.d_labor_contract_type" clearable placeholder="请选择合同类型" :disabled="true">
            <el-option
              v-for="item in contractOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="合同开始日期:" prop="d_labor_contract_begin">
            <el-date-picker
              v-model="formData.d_labor_contract_begin"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择合同开始日期"
              :disabled="true">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="合同结束日期:" prop="d_labor_contract ">
            <el-date-picker
              v-model="formData.d_labor_contract"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择合同结束日期"
              :disabled="curChangeType == 'detail' || formData.d_labor_contract_type  != 1">
            </el-date-picker>
          </el-form-item>
        </el-col>

        <!-- <el-col :span="16">
          <el-form-item label="劳动合同期限:" prop="labor_contract_time">
            <el-date-picker
              v-model="formData.labor_contract_time"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              placeholder="选择劳动合同期限"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :clearable="false"
              :disabled="true">
            </el-date-picker>
          </el-form-item>
        </el-col> -->
        <el-col :span="8">
          <el-form-item label="试用期:" prop="qualify_period">
            <tr-select-dictionaries
              v-model="formData.qualify_period"
              :classKey="'试用期期限'"
              :placeholder="'请选择试用期期限'"
              :isMultiple="false"
              :disabled="true"
              @change="changeProbation"
            ></tr-select-dictionaries>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="计划转正日期:" prop="plan_regular_date">
            <el-date-picker
              v-model="formData.plan_regular_date"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择计划转正日期"
              :disabled="true">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="实际转正日期:" prop="real_regular_date">
            <el-date-picker
              v-model="formData.real_regular_date"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择实际转正日期"
              :disabled="true">
            </el-date-picker>
          </el-form-item>
        </el-col> 
        <el-col :span="8">
          <el-form-item label="户口性质:" prop="c_account_type">
            <tr-select-dictionaries
                v-model="formData.c_account_type"
                :classKey="'户口性质'"
                :placeholder="'请选择户口性质'"
                :isMultiple="false"
                :disabled="true"
              ></tr-select-dictionaries>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="城镇:" prop="c_city">
            <el-input v-model="formData.c_city" placeholder="请输入城镇" clearable
              :style="{width: '100%'}" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="籍贯:" prop="c_hometown">
            <el-input v-model="formData.c_hometown" placeholder="请输入籍贯" clearable
              :style="{width: '100%'}" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="民族:" prop="c_nation">
            <el-input v-model="formData.c_nation" placeholder="请填写民族" clearable
              :style="{width: '100%'}" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="身高（CM）:" prop="i_height">
            <el-input v-model="formData.i_height" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="formData.i_height = $event.target.value" placeholder="请填写身高（CM）" clearable
              :style="{width: '100%'}" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="婚姻:" prop="c_marry">
            <el-select v-model="formData.c_marry" placeholder="请选择" clearable :style="{width: '100%'}" :disabled="true">
              <el-option v-for="(item, index) in marryOptions"             
                :key="index"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="8">
          <el-form-item label="血型:" prop="c_blood_type">
            <el-select v-model="formData.c_blood_type" placeholder="请选择" clearable :style="{width: '100%'}" :disabled="true">
              <el-option v-for="(item, index) in bloodTypeOptions"             
                :key="index"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col> -->
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="是否当过兵:" prop="i_is_join_army">
            <el-select v-model="formData.i_is_join_army" placeholder="请选择是否当过兵" clearable :style="{width: '100%'}" :disabled="true">
              <el-option v-for="(item, index) in isJoinArmyOptions" :key="index" :label="item.name"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="参军开始时间:" prop="d_join_army_begin">
            <el-date-picker
              v-model="formData.d_join_army_begin"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              @change="selectedJoinArmyDate"
              disabled>
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="参军结束时间:" prop="d_join_army">
            <el-date-picker
              v-model="formData.d_join_army"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              @change="selectedJoinArmyDate"
              disabled>
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="军龄（月）:" prop="join_army_age">
            <el-input-number v-model="formData.join_army_age" placeholder="请填写军龄" clearable
              :style="{width: '100%'}" :controls="false" disabled></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <!-- <el-col :span="16">
          <el-form-item label="参军时间:" prop="cjsj">
            <el-date-picker
              v-model="formData.cjsj"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :clearable="false"
              :disabled="true">
            </el-date-picker>
          </el-form-item>
        </el-col> -->
        <!-- <el-col :span="8">
          <el-form-item label="是否农业粮:" prop="i_is_nyl">
            <el-select v-model="formData.i_is_nyl" placeholder="请选择是否农业粮" clearable :style="{width: '100%'}" :disabled="true">
              <el-option v-for="(item, index) in isNylOptions" :key="index" :label="item.name"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col> -->
        <el-col :span="8">
          <el-form-item label="政治面貌:" prop="c_political">
            <el-select v-model="formData.c_political" placeholder="请选择政治面貌" clearable :style="{width: '100%'}" :disabled="true">
              <el-option v-for="(item, index) in politicalOptions" :key="index" :label="item.name"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="入党（团）时间:" prop="d_join_party">
            <el-date-picker v-model="formData.d_join_party" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
              :style="{width: '100%'}" placeholder="请选择入党（团）时间" clearable :disabled="true"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="党员备注:" prop="c_party_remark">
            <el-input v-model="formData.c_party_remark" type="textarea" placeholder="请输入党员备注"
              :autosize="{minRows: 1, maxRows: 1}" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="其他组织:" prop="c_other_org">
            <el-input v-model="formData.c_other_org" placeholder="请输入其他组织" clearable :style="{width: '100%'}" :disabled="true">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="加入时间:" prop="d_other_date">
            <el-date-picker v-model="formData.d_other_date" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
              :style="{width: '100%'}" placeholder="请选择入当选时间" clearable :disabled="true"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="是否职工代表:" prop="i_is_staff_representative">
            <el-select v-model="formData.i_is_staff_representative" placeholder="请输入是否职工代表" clearable :style="{width: '100%'}" :disabled="true">
              <el-option v-for="(item, index) in isStaffRepresentativeOptions" :key="index" :label="item.name"
                :value="item.value" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="当选时间:" prop="d_be_elected">
            <el-date-picker v-model="formData.d_be_elected" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
              :style="{width: '100%'}" placeholder="请选择入当选时间" clearable :disabled="true"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="当选层次:" prop="c_be_elected_layer">
            <el-input v-model="formData.c_be_elected_layer" placeholder="请输入当选层次" clearable
              :style="{width: '100%'}" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="8">
          <el-form-item label="工资卡号:" prop="c_salary_card">
            <el-input v-model="formData.c_salary_card" placeholder="请输入工资卡号" clearable
              :style="{width: '100%'}" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="社保账号:" prop="c_social_card">
            <el-input v-model="formData.c_social_card" placeholder="请输入社保账号" clearable
              :style="{width: '100%'}" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="公积金账号:" prop="c_reserve_account">
            <el-input v-model="formData.c_reserve_account" placeholder="请输入公积金账号" clearable
              :style="{width: '100%'}" :disabled="true"></el-input>
          </el-form-item>
        </el-col> -->
        <el-col :span="8">
          <el-form-item label="社保缴纳:" prop="i_socialpay">
            <el-input v-model="formData.i_socialpay" placeholder="请输入社保缴纳" clearable
              :style="{width: '100%'}" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        
        
        
        <!-- <el-col :span="8">
          <el-form-item label="是否管理岗:" prop="i_is_manager">
            <el-select v-model="formData.i_is_manager" placeholder="请选择是否管理岗" clearable :style="{width: '100%'}" :disabled="true">
              <el-option v-for="(item, index) in isManagerOptions" :key="index" :label="item.name"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col> -->
        <el-col :span="8">
          <el-form-item label="进企方式:" prop="c_enterprise_type">
            <!-- <tr-select-dictionaries
              v-model="formData.c_enterprise_type"
              :classKey="'进企方式'"
              :placeholder="'请选择进企方式'"
              :isMultiple="false"
              :disabled="true"
            ></tr-select-dictionaries> -->
            <el-input v-model="formData.c_enterprise_type" placeholder="请输入进企方式" clearable
              :style="{width: '100%'}" :disabled="true"></el-input>
          </el-form-item>
        </el-col> 
        <el-col :span="24">
          <el-form-item label="户籍地址:" prop="c_account_area">
            <el-input v-model="formData.c_account_area" placeholder="请输入户籍地址" clearable
              :style="{width: '100%'}" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="现住址:" prop="c_home_address">
            <el-input v-model="formData.c_home_address" placeholder="请输入现住址" clearable
              :style="{width: '100%'}" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="8">
          <el-form-item label="工会职务:" prop="union_position">
            <tr-select-dictionaries
              v-model="formData.union_position"
              :classKey="'工会职务'"
              :placeholder="'请选择工会职务'"
              :isMultiple="false"
              :disabled="true"
            ></tr-select-dictionaries>
          </el-form-item>
        </el-col>  -->
        
        <el-col :span="8">
          <el-form-item label="全日制学历:" prop="c_full_education">
            <tr-select-dictionaries
              v-model="formData.c_full_education"
              :classKey="'最高学历'"
              :placeholder="'请选择全日制学历'"
              :isMultiple="false"
              :disabled="true"
            ></tr-select-dictionaries>
          </el-form-item>
        </el-col> 
        <el-col :span="8">
          <el-form-item label="毕业院校:" prop="c_school">
            <el-input v-model="formData.c_school" placeholder="请输入毕业院校" clearable
              :style="{width: '100%'}" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="所学专业:" prop="c_major">
            <el-input v-model="formData.c_major" placeholder="请输入所学专业" clearable
              :style="{width: '100%'}" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="最高学历:" prop="c_highest_education">
            <tr-select-dictionaries
              v-model="formData.c_highest_education"
              :classKey="'最高学历'"
              :placeholder="'请选择最高学历'"
              :isMultiple="false"
              :disabled="true"
            ></tr-select-dictionaries>
          </el-form-item>
        </el-col> 
        <el-col :span="8">
          <el-form-item label="毕业院校:" prop="c_highest_school">
            <el-input v-model="formData.c_highest_school" placeholder="请输入最高学历毕业院校" clearable
              :style="{width: '100%'}" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="所学专业:" prop="c_highest_major">
            <el-input v-model="formData.c_highest_major" placeholder="请输入最高学历所学专业" clearable
              :style="{width: '100%'}" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="紧急联系人姓名:" prop="c_emergency_contact">
            <el-input v-model="formData.c_emergency_contact" placeholder="请输入紧急联系人姓名" clearable
              :style="{width: '100%'}" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系人关系:" prop="c_contact_relationship">
            <el-input v-model="formData.c_contact_relationship" placeholder="请输入联系人关系" clearable
              :style="{width: '100%'}" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系人电话:" prop="c_contact_phone">
            <el-input v-model="formData.c_contact_phone" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="formData.c_contact_phone = $event.target.value" placeholder="请输入联系人电话" clearable
              :style="{width: '100%'}" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="职称或职业资格:" prop="c_title">
            <el-input v-model="formData.c_title" placeholder="请输入职称或职业资格" clearable
              :style="{width: '100%'}" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="国际评定的专业技术等级:" prop="c_social_title_level" class="long-lable show-flex-box-r">
            <el-input v-model="formData.c_social_title_level" placeholder="国际评定的专业技术等级" clearable
              :style="{width: '100%'}" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="国家评定的技能等级:" prop="c_national_title_level" class="long-lable show-flex-box-r">
            <el-input v-model="formData.c_national_title_level" placeholder="请输入国家评定的技能等级" clearable
              :style="{width: '100%'}" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="其他专业技能:" prop="c_other_skill">
            <el-input v-model="formData.c_other_skill" placeholder="请输入其他专业技能" clearable
              :style="{width: '100%'}" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="24">
          <el-form-item label="培训:" prop="c_train">
            <el-input v-model="formData.c_train" placeholder="请输入员工接受的培训" clearable
              :style="{width: '100%'}" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="担保人:" prop="c_bondsman">
            <el-input v-model="formData.c_bondsman" placeholder="请输入担保人姓名" clearable
              :style="{width: '100%'}" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="与其关系:" prop="c_bonds_relationship">
            <el-input v-model="formData.c_bonds_relationship" placeholder="请输入与担保人关系" clearable
              :style="{width: '100%'}" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="担保人单位或住址:" prop="c_bonds_address" class="long-lable show-flex-box-r">
            <el-input v-model="formData.c_bonds_address" placeholder="请输入担保人单位或住址" clearable
              :style="{width: '100%'}" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注:" prop="c_da_remark">
            <el-input v-model="formData.c_da_remark" placeholder="请输入备注" clearable
              :style="{width: '100%'}" :disabled="true"></el-input>
          </el-form-item>
        </el-col> -->
              
            
      
        <!-- <el-col :span="8">
          <el-form-item label="文化程度:" prop="c_degree_of_education">
            <el-input v-model="formData.c_degree_of_education" placeholder="请输入文化程度" clearable
              :style="{width: '100%'}" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="个人身份:" prop="c_personal_identity">
            <el-input v-model="formData.c_personal_identity" placeholder="请输入个人身份" clearable
              :style="{width: '100%'}" :disabled="true"></el-input>
          </el-form-item>
        </el-col>  -->
      </el-row> 
    </el-form>
  </div>
</template>
<script>
import { getMonthBeforeFormatAndDay, compareDate, getGapMonth } from '@/utils/index'
export default {
  components: {},
  props: {
    curChangeType:{
      type: String,
      default: 'add'
    }
  },
  data() {
    return {
      marryOptions:[
        { value: "已婚", name: "已婚" },
        { value: "未婚", name: "未婚" },
        { value: "离异", name: "离异" },
        { value: "丧偶", name: "丧偶" },
      ],
      bloodTypeOptions:[
        { value: "A", name: "A" },
        { value: "B", name: "B" },
        { value: "O", name: "O" },
        { value: "AB", name: "AB" },
      ],
      isJoinArmyOptions:[
        { value: 1, name: "是" },
        { value: 0, name: "否" },
      ],
      isNylOptions:[
        { value: 1, name: "是" },
        { value: 0, name: "否" },
      ],
      politicalOptions:[
        { value: "群众", name: "群众" },
        { value: "团员", name: "团员" },
        { value: "党员", name: "党员" },
        { value: "预备党员", name: "预备党员" },
      ],
      isStaffRepresentativeOptions:[
        { value: 1, name: "是" },
        { value: 0, name: "否" },
      ],
      isManagerOptions:[
        { value: 1, name: "是" },
        { value: 0, name: "否" },
      ],
      accountTypeOptions:[
        { value: "农业户口", name: "农业户口" },
        { value: "非农业户口", name: "非农业户口" },
      ],
      contractOptions:[
        { value: 1, name: "固定期限劳动合同" },
        { value: 2, name: "非固定期限劳动合同" },
        { value: 3, name: "至退休合同" },
      ],
      date:[],
      formData: {
        affiliated_trade: '',
        trade_post: '',
        join_trade: '',
        trade_code: '',
        // is_difficulty: '',
        join_difficulty: '',
        difficulty_count: '',
        house_number: '',
        d_labor_contract_type: '',
        d_labor_contract_begin : '',
        d_labor_contract : '',
        qualify_period: '',
        plan_regular_date: '',
        real_regular_date:'',
        join_army_age:'',
        c_nation: '',
        i_height: '',
        c_marry: '',
        c_blood_type: '',
        i_is_join_army: '',
        d_join_army_begin: '',
        d_join_army: '',
        // i_is_nyl: '',
        c_political: '',
        d_join_party: '',
        c_party_remark: '',
        c_other_org: '',
        d_other_date: '', //加入其他组织时间
        i_is_staff_representative:'',
        d_be_elected: '',
        c_be_elected_layer: '',
        // c_degree_of_education: '',
        c_salary_card: '',
        // c_personal_identity: '',
        c_social_card: '',
        c_reserve_account: '',
        i_socialpay : '',
        c_hometown: '',
        c_city: '', //城镇
        c_account_type: '',
        i_is_manager: '',
        c_account_area: '',
        c_home_address: '',
        c_full_education: '',
        c_school: '',
        c_major: '',
        c_highest_education: '',
        c_highest_school: '',
        c_highest_major: '',
        c_emergency_contact: '',
        c_contact_relationship: '',
        c_contact_phone: '',
        c_title: '',
        c_social_title_level: '',
        c_national_title_level: '',
        c_other_skill: '',
        c_train: '',
        c_bondsman: '',
        c_bonds_relationship: '',
        c_bonds_address: '',
        c_da_remark: '',

        c_enterprise_type:'',
      },
      rules: {
        // trade: [
        //   { required: true, message: "请输入所属工会", trigger: "change" },
        // ],
        // join_trade: [
        //   { required: true, message: "请选择加入公会时间", trigger: "change" },
        // ],
      },
      staffAge:'', //员工年龄
      joinTime: '' // 入职时间
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 初始化数据
    resetData(){ 
      Object.assign(this.$data, this.$options.data());
      this.$refs['elForm'].resetFields()
      this.staffAge = 0;
    },
    // 选择
    selectedTime: function() {
      if(this.date && this.date.length>0) {
        this.formData.d_from = this.date[0];
        this.formData.d_end = this.date[1];
      }else{
        this.formData.d_from = '';
        this.formData.d_end = '';
      }
    },
    // 数据回显
    setData(val){
      this.staffAge = val.age
      // Object.assign(this.$data, this.$options.data());
      Object.keys(val).forEach(key => {
        if (this.formData.hasOwnProperty(key)) {
          this.formData[key] = val[key]
        }
      })
      // this.formData.c_health_state = val.c_health_state,
      // this.formData.c_nation = val.c_nation,
      // this.formData.i_height = val.i_height,
      // this.formData.c_marry = val.c_marry,
      // this.formData.c_blood_type = val.c_blood_type,
      // this.formData.i_is_join_army = val.i_is_join_army,
      // this.formData.i_is_nyl = val.i_is_nyl,
      // this.formData.c_political = val.c_political,
      // this.formData.d_join_party = val.d_join_party,
      // this.formData.c_party_remark= val.c_party_remark,
      // this.formData.c_other_org = val.c_other_org,
      // this.formData.d_other_date = val.d_other_date,
      // this.formData.i_is_staff_representative = val.i_is_staff_representative,
      // this.formData.d_be_elected =  val.d_be_elected,
      // this.formData.c_be_elected_layer = val.c_be_elected_layer,
      // this.formData.c_degree_of_education = val.c_degree_of_education,
      // this.formData.c_personal_identity = val.c_personal_identity,
      // this.formData.c_salary_card = val.c_salary_card,
      // this.formData.c_social_card = val.c_social_card,
      // this.formData.c_reserve_account =  val.c_reserve_account,
      // this.formData.c_hometown =  val.c_hometown,
      // this.formData.i_is_manager =  val.i_is_manager,
      // this.formData.c_city = val.c_city,
      // this.formData.c_account_type = val.c_account_type;

      // this.formData.c_account_area = val.c_account_area;
      // this.formData.c_home_address = val.c_home_address;
      // this.formData.c_top_education = val.c_top_education;
      // this.formData.c_school = val.c_school;
      // this.formData.c_major = val.c_major;
      // this.formData.c_emergency_contact = val.c_emergency_contact;
      // this.formData.c_contact_relationship = val.c_contact_relationship;
      // this.formData.c_contact_phone = val.c_contact_phone;
      // this.formData.c_title = val.c_title;
      // this.formData.c_social_title_level = val.c_social_title_level;
      // this.formData.c_national_title_level = val.c_national_title_level;
      // this.formData.c_other_skill = val.c_other_skill;
      // this.formData.c_train = val.c_train;
      // this.formData.c_bondsman = val.c_bondsman;
      // this.formData.c_bonds_relationship = val.c_bonds_relationship;
      // this.formData.c_bonds_address = val.c_bonds_address;
      // this.formData.c_da_remark = val.c_da_remark;

    },
    // 监听试用期期限
    changeProbation(value) {
      if (!this.formData.d_labor_contract_begin) return 
      switch (value.c_name) {
        case "1个月":
          this.formData.plan_regular_date = getMonthBeforeFormatAndDay(1,this.formData.d_labor_contract_begin)
          break;
        case "2个月":
          this.formData.plan_regular_date = getMonthBeforeFormatAndDay(2,this.formData.d_labor_contract_begin)
          break;
        case "3个月":
          this.formData.plan_regular_date = getMonthBeforeFormatAndDay(3,this.formData.d_labor_contract_begin)
          break;
        case "4个月":
          this.formData.plan_regular_date = getMonthBeforeFormatAndDay(4,this.formData.d_labor_contract_begin)
          break;
        case "5个月":
          this.formData.plan_regular_date = getMonthBeforeFormatAndDay(5,this.formData.d_labor_contract_begin)
          break;
        case "6个月":
          this.formData.plan_regular_date = getMonthBeforeFormatAndDay(6,this.formData.d_labor_contract_begin)
          break;
        case "其他":
          this.formData.plan_regular_date = ''
          break
        default:
          break;
      }
    },
    // 计算军龄
    selectedJoinArmyDate() {
      if(this.formData.d_join_army_begin && this.formData.d_join_army) {
        let isTrue = compareDate(this.formData.d_join_army_begin, this.formData.d_join_army)
        console.log(isTrue);
        if(isTrue) {
          // 结束时间大，计算军龄
          let TD = getGapMonth(this.formData.d_join_army_begin, this.formData.d_join_army)
          this.formData.join_army_age = Number(TD.toFixed(1))
          // console.log(TD, this.formData.join_army_age);
        }else{
          // 结束时间小，清空
          this.$message.warning('参军结束时间不能小于参军开始时间')
          this.formData.d_join_army = ''
        }
      }
    },
    // 给父级页面提供得获取本页数据
    getData() {
      return new Promise((resolve, reject) => {
        this.$refs['elForm'].validate(valid => {
          if (!valid) {
            reject({
              result: 400,
              msg: '获取失败,带星号的为必填项'
            })
            return
          }
          resolve({ 
            formData: this.formData,
            result:200,
            msg: '获取成功'

          })
        })
      })
    },
  }
}

</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.long-lable {

}
.archives-info /deep/ .el-input{
  width: 150px;
}

.archives-info /deep/ .el-input--mini{
  width: 165px;
}

.long-lable /deep/ .el-form-item__label{
  width: 180px !important;
}
.long-lable /deep/ .el-form-item__content {
   width: 585px !important;
   margin-left: 0px !important;
}
.contract_time {
  /deep/ .el-date-editor {
    width: 100%;
  }
  /deep/ .el-input__icon {
    display: none;
  }
  /deep/ .el-range-input {
    width: 65px;
  }
  /deep/ .el-range-separator {
    width: 20px;
  }
}
</style>

