<template lang="html">
  <div>
    <section v-if="isPermission">
  		<!--工具条-->
  		<el-row>
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
    			<el-form :inline="true" :model="filters">
    				<el-form-item>
    					<el-input v-model="filters.name" @keyup.enter.native="getUsers" placeholder="姓名"></el-input>
    				</el-form-item>
    				<el-form-item>
    					<el-button type="primary" @click="getUsers">查询</el-button>
    				</el-form-item>
    				<el-form-item>
    					<el-button type="primary" @click="handleAdd">新增</el-button>
    				</el-form-item>
    			</el-form>
    		</el-col>
      </el-row>

  		<!--列表-->
      <div class="table-wrapper">
        <el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
    			<!-- <el-table-column type="selection" width="55">
    			</el-table-column> -->

    			<el-table-column prop="user" label="姓名" sortable width="120">
    			</el-table-column>
    			<el-table-column prop="sex" label="性别" width="100" :formatter="formatSex">
    			</el-table-column>
    			<el-table-column prop="tel" label="手机" sortable width="150">
    			</el-table-column>
          <el-table-column prop="mail" label="邮箱" width="200">
    			</el-table-column>
    			<el-table-column prop="position" sortable label="职位" min-width="150">
    			</el-table-column>
    			<el-table-column label="操作" width="200">
    				<template scope="scope">
              <el-button type="primary" size="small" @click="goToManager(scope.row)">权限</el-button>
    					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
    					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
    				</template>
    			</el-table-column>
    		</el-table>
      </div>

      <!-- 弹层 -->

  		<!--编辑界面-->
  		<el-dialog
        title="编辑"
        v-model="editFormVisible"
        :close-on-click-modal="false"
        :modal-append-to-body="false"
        >
  			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
          <el-form-item label="姓名" prop="user">
  					<el-input v-model="editForm.user" auto-complete="off"></el-input>
  				</el-form-item>
          <el-form-item label="密码" prop="pass">
            <el-input type="password" v-model="editForm.pass" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="mail">
            <el-input v-model="editForm.mail"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="tel">
            <el-input v-model="editForm.tel"></el-input>
          </el-form-item>
          <el-form-item label="职位" prop="position">
            <el-select multiple v-model="editForm.position" placeholder="请选择">
              <el-option
                v-for="item in positions"
                :label="item"
                :value="item"
                :key="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
  				<el-form-item label="生日" prop="birth">
  					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.birth"></el-date-picker>
  				</el-form-item>
          <el-form-item label="性别" prop="sex">
  					<el-radio-group v-model="editForm.sex">
  						<el-radio class="radio" :label="1">男</el-radio>
  						<el-radio class="radio" :label="0">女</el-radio>
  					</el-radio-group>
  				</el-form-item>
  			</el-form>
  			<div slot="footer" class="dialog-footer">
  				<el-button @click.native="editFormVisible = false">取消</el-button>
  				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
  			</div>
  		</el-dialog>

  		<!--新增界面-->
  		<el-dialog
        title="新增"
        v-model="addFormVisible"
        :close-on-click-modal="false"
        :modal-append-to-body="false"
        >
  			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
  				<el-form-item label="姓名" prop="user">
  					<el-input v-model="addForm.user" auto-complete="off"></el-input>
  				</el-form-item>
          <el-form-item label="密码" prop="pass">
            <el-input type="password" v-model="addForm.pass" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="mail">
            <el-input v-model="addForm.mail"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="tel">
            <el-input v-model="addForm.tel"></el-input>
          </el-form-item>
          <el-form-item label="职位" prop="position">
            <el-select multiple v-model="addForm.position" placeholder="请选择">
              <el-option
                v-for="item in positions"
                :label="item"
                :value="item"
                :key="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
  				<el-form-item label="生日" prop="birth">
  					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.birth"></el-date-picker>
  				</el-form-item>
          <el-form-item label="性别" prop="sex">
  					<el-radio-group v-model="addForm.sex">
  						<el-radio class="radio" :label="1">男</el-radio>
  						<el-radio class="radio" :label="0">女</el-radio>
  					</el-radio-group>
  				</el-form-item>
  			</el-form>
  			<div slot="footer" class="dialog-footer">
  				<el-button @click.native="addFormVisible = false">取消</el-button>
  				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
  			</div>
  		</el-dialog>
  <!--
      <el-popover
        ref="popover4"
        placement="right"
        width="400"
        trigger="hover">
      </el-popover> -->


  	</section>

    <e-ban v-if="!isPermission"></e-ban>

  </div>

</template>

<script>
import { getUserListPage, removeUser, editUser, addUser } from '../../../api/api'
import qs from "qs"
import util from '../../../common/js/util.js'
import EBan from '../../../components/ban/ban'
import EDialog from '../../../components/dialog/dialog'
export default {
  data() {
    return {
      isPermission: false,
      filters: {
        name: ''
      },
      users: [],
      tableHeight: 0,
      total: 0,
      page: 1,
      listLoading: false,
      sels: [],//列表选中列

      editFormVisible: false,//编辑界面是否显示
      editLoading: false,
      editFormRules: {
        user: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        pass: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        mail: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
        ],
        tel: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ]
      },


      //编辑界面数据
      editForm: {
        user: '',
        pass: '',
        tel: '',
        sex: 1,
        mail: '',
        position: [],
        birth: ''
      },

      addFormVisible: false,//新增界面是否显示
      addLoading: false,
      addFormRules: {
        user: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        pass: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        mail: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
        ],
        tel: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ]
      },

      //新增界面数据
      positions: [],
      addForm: {
        user: '',
        pass: '',
        tel: '',
        sex: 1,
        mail: '',
        position: [],
        birth: ''
      }
    }
  },
  components: {
    'e-ban': EBan,
    'e-dialog': EDialog
  },
  methods: {
    //性别显示转换
    formatSex: function (row, column) {
      return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getUsers();
    },
    //获取用户列表
    getUsers() {
      let para = {
        // page: this.page,
        name: this.filters.name,
        uid: ''
      };
      this.listLoading = true;
      getUserListPage(para).then((res) => {
        this.total = res.data.total;
        this.users = res.data.users.reverse();
        this.positions = res.data.positions
        // let CH = document.documentElement.clientHeight
        // this.tableHeight = CH - 150
        this.listLoading = false;
      });

    },
    //删除
    handleDel: function (index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true;
        //NProgress.start();
        let para = { uid: row.ID };
        removeUser(para).then((res) => {
          this.listLoading = false;
          //NProgress.done();
          let { code, msg } = res.data
          if (code == 200) {
            this.$message({
              message: msg,
              type: 'success'
            });
          }
          this.getUsers();
        });
      }).catch(() => {

      });
    },
    //显示编辑界面
    handleEdit (index, row) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row)
      this.editForm.position = this.editForm.position.split(';')
    },
    //显示新增界面
    handleAdd () {
      this.addFormVisible = true;
      this.addForm = {
        user: '',
        pass: '',
        tel: '',
        sex: 1,
        mail: '',
        position: [],
        birth: ''
      };
    },
    //编辑
    editSubmit () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.editLoading = true
          let para = Object.assign({}, this.editForm)
          para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd')
          let params = { para }
          editUser(qs.stringify(params)).then(res => {
            this.editLoading = false
            let { code, msg } = res
            if (code == 200) {
              this.$message({
                type: 'success',
                message: msg
              })
            }else {
              this.$message({
                type: 'error',
                message: msg
              })
            }
            this.$refs['editForm'].resetFields()
            this.editFormVisible = false
            this.getUsers()
          })
        }
      });
    },
    //新增
    addSubmit () {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.addLoading = true
          let para = Object.assign({}, this.addForm)
          para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
          // para.birth = Date.parse(para.birth)
          // util.formatDate.format(new Date(1492531200), 'yyyy-MM-dd')
          let params = { para }
          addUser(qs.stringify(params)).then(res => {
            this.addLoading = false
            let { code, msg } = res
            if (code == 200) {
              this.$message({
                type: 'success',
                message: msg
              })
            }else {
              this.$message({
                type: 'error',
                message: msg
              })
            }
            this.$refs['addForm'].resetFields();
            this.addFormVisible = false;
            this.getUsers();
          })
        }
      })
    },
    selsChange (sels) {
      this.sels = sels;
    },
    goToManager (row) {
      window.open( `http://www.ehometd.com/ML/Manager/index.html?ID=${row.ID}`)
    }
  },
  mounted() {
    let user = JSON.parse(sessionStorage.getItem('user'))
    if (user.keys.indexOf('root') != -1) this.isPermission = true
    else this.isPermission = false
    if (this.isPermission) this.getUsers()
  }
}
</script>

<style lang="css">
.el-icon-circle-check {
  color: #13CE66;
}
.el-icon-circle-close {
  color: #FF4949;
}
.table-wrapper {
  /*overflow-y: scroll;
  width: 100%;*/
  padding: 10px;
}

</style>
