<template lang="html">
  <div class="survey_container">
    <section v-if="isPermission">
      <!--工具条-->
      <el-row>
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
          <el-form :inline="true" :model="filters">
            <el-form-item>
              <el-input v-model="filters.tel" @keyup.enter.native="getUsers" placeholder="手机号"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getUsers">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-radio-group
               @change="progressChange"
               class="scheme_toolbar_roomSelect"
               v-model="progressSelect">
                <el-radio label="全部"></el-radio>
                <el-radio v-for="item in progress" :label="item" :key="item"></el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <!--列表-->
      <div class="table-wrapper">
        <el-table :data="users" style="width: 100%;">
    			<el-table-column prop="name" align="center" label="姓名" width="100">
    			</el-table-column>
    			<el-table-column prop="tel" align="center" label="手机" width="140">
    			</el-table-column>
    			<el-table-column prop="favorite_style" align="center" label="风格" width="100">
    			</el-table-column>
          <el-table-column prop="budget" align="center" label="预算" width="100">
    			</el-table-column>
          <el-table-column prop="uptime" align="center" label="提交时间" width="200">
    			</el-table-column>
          <el-table-column prop="progress" label="联系情况" align="center" width="100" >
    			</el-table-column>
          <el-table-column prop="building" align="center" label="楼盘" min-width="200">
    			</el-table-column>
          <el-table-column label="操作" align="center" width="80">
    				<template scope="scope">
                <el-button
                  size="small"
                  type="primary"
                  @click="showUserInfo(scope.row)"
                  >
                  操作
                </el-button>
    				</template>
    			</el-table-column>
    		</el-table>
      </div>
      <!-- 分页条 -->
      <el-col :span="24" class="toolbar product_toolbar">
   			<el-pagination
          id="pagination"
          layout="total, prev, pager, next"
          :current-page="page"
          @current-change="handleCurrentChange"
          :page-size="25"
          :total="total"
          >
   			</el-pagination>
   		</el-col>

      <el-dialog
        title="详情"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        v-model="mainInfoVisible"
        >
        <el-form label-width="80px">
          <el-form-item label="联系情况">
            <el-select v-model="select.progress" placeholder="请选择">
              <el-option
                v-for="item in progress"
                :label="item"
                :value="item"
                :key="item"
                >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="isAppoint" label="委托">
            <el-select v-model="select.sales" placeholder="请选择">
              <el-option
                v-for="item in sales"
                :label="item.user"
                :value="item.ID"
                :key="item.ID"
                >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="mainInfoVisible = false">取消</el-button>
          <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
        </div>
      </el-dialog>

    </section>
    <e-ban v-if="!isPermission"></e-ban>
  </div>
</template>

<script>
import { getSales, getSurveyUsers, surveySubmit} from '../../../api/api'
import EBan from '../../../components/ban/ban'
import qs from 'qs'
export default {
  data () {
    return {
      isPermission: false,
      isAppoint: false,
      filters: {
        tel: ''
      },
      users: [],
      sales: [],
      progress: ['未联系','有意向','没意向','没回复'],
      progressSelect: '全部',
      mainInfo: {},
      mainInfoVisible: false,
      editLoading: false,
      select: {
        progress: '',
        sales: ''
      },
      total: 0,
      page: 1
    }
  },
  methods: {
    getSalesList () {
      getSales().then(res => {
        this.sales = res.data
      })
    },
    getSurveyUsersList () {
      let para = {page: this.page, progress: this.progressSelect, tel: this.filters.tel}
      if (para.progress == '全部') para.progress = ''
      getSurveyUsers(para).then(res => {
        for (let i of res.data.users) i.sale = ''
        this.users = res.data.users
        this.total = res.data.total
      })
    },
    handleCurrentChange (val) {
      this.page = val
      this.getSurveyUsersList()
    },
    showUserInfo (row) {
      this.mainInfo = Object.assign({}, row)
      this.select = {
        progress: this.mainInfo.progress,
        sales: ''
      }
      this.mainInfoVisible = true
    },
    editSubmit () {
      if (this.select.progress == '' && this.select.sales == '') {
        this.$message({
          type: 'warning',
          message: '暂无内容修改'
        })
      }else {
        this.editLoading = true
        let para = {
          sid: this.mainInfo.ID,
          progress: this.select.progress,
          sales: this.select.sales
        }
        let params = { para }
        surveySubmit(qs.stringify(params)).then(res => {
          let {code, msg} = res
          if (code == 200) {
            this.$message({
              type: 'success',
              message: msg
            })
            this.editLoading = false
            this.mainInfoVisible = false
            this.getSurveyUsersList()
          }
        })
      }
    },
    progressChange () {
      this.page = 1
      this.getSurveyUsersList()
    },
    getUsers () {
      this.page = 1
      this.getSurveyUsersList()
    }
  },
  components: {
    'e-ban': EBan
  },
  mounted () {
    let user = JSON.parse(sessionStorage.getItem('user'))
    if (user.position.includes('销售') || user.keys.includes('root') ) this.isPermission = true
    else this.isPermission = false
    if (user.keys.includes('x01') || user.keys.includes('root')) this.isAppoint = true
    else this.isAppoint = false
    if (this.isPermission) {
      this.getSalesList()
      this.getSurveyUsersList()
    }
  }
}
</script>

<style lang="scss">
</style>
