<template lang="html">
  <div class="chart_container">
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
    			</el-form>
    		</el-col>
      </el-row>

  		<!--列表-->
      <div class="table-wrapper">
        <el-table :data="users" style="width: 100%;">
    			<el-table-column prop="user" align="center" label="姓名">
    			</el-table-column>
    			<el-table-column prop="tel" align="center" label="手机">
    			</el-table-column>
    			<el-table-column prop="referrerName" align="center" label="推荐人">
    			</el-table-column>
          <el-table-column prop="uptime" align="center" label="提交时间" min-width="200">
    			</el-table-column>
    			<el-table-column label="操作" align="center" width="150">
    				<template scope="scope">
    					<el-button @click="deleteUser(scope.row.ID)" type="text"><i class="fa fa-trash-o"></i></el-button>
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
    </section>
    <e-ban v-if="!isPermission"></e-ban>
  </div>
</template>

<script>
import { referrer, dataDelete } from '../../../api/api'
import EBan from '../../../components/ban/ban'
export default {
  data () {
    return {
      isPermission: false,
      users: [],
      total:0,
      page: 1,
      filters: {
        tel: ''
      }
    }
  },
  methods: {
    getReferrer () {
      let user = JSON.parse(sessionStorage.getItem('user'))
      let para = {uid: user.id, page: this.page, tel: this.filters.tel}
      referrer(para).then(res => {
        if (res.data[0].total != 0) {
          if (res.data.length == undefined) {
            res.data.length = res.data[0].total
            this.users = Array.from(res.data)
          }else {
            this.users = res.data
          }
          this.total = res.data[0].total
        }else {
          this.users = []
          this.total = 0
        }

      })
    },
    handleCurrentChange (val) {
      this.page = val
      this.getReferrer()
    },
    getUsers () {
      this.page = 1
      this.getReferrer()
    },
    deleteUser (uid) {
      let para = {uid}
      this.$confirm('是否删除此数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        dataDelete(para).then(res => {
          let { code, msg } = res.data
          if (code == 200) {
            this.$message({
              type: 'success',
              message: msg
            })
          }
          this.getReferrer()
        })
      }).catch(() => {
        this.$message({
           type: 'info',
           message: '已取消删除'
         })
      })
    }
  },
  components: {
    'e-ban': EBan
  },
  mounted () {
    let user = JSON.parse(sessionStorage.getItem('user'))
    if (user.keys.includes('root') ) this.isPermission = true
    else this.isPermission = false
    if (this.isPermission) this.getReferrer()
  }
}
</script>

<style lang="scss">

</style>
