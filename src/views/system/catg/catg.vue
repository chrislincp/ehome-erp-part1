<template lang="html">
    <section>
      <el-col :span="24" class="toolbar">
  			<el-button type="primary" @click="addMainCatg">新增主栏目</el-button>
  		</el-col>
      <el-col :span="24">
        <el-tree
          v-loading="listLoading"
          highlight-current
          default-expand-all
          :data="data"
          :props="defaultProps"
          :expand-on-click-node="true"
          :render-content="renderContent"
          >
        </el-tree>
      </el-col>

      <!--  编辑页面  -->
      <el-dialog title="编辑" v-model="editCatgVisible" size="tiny">
        <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
          <el-form-item label="名称" prop="title">
            <el-input placeholder="栏目名称" v-model="editForm.title"></el-input>
          </el-form-item>
          <el-form-item label="排序">
            <el-input-number v-model="editForm.ps" size="small" :min="0" :max="99999"></el-input-number>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="editClose">取消</el-button>
          <el-button type="primary" @click.native="edit" :loding="editLoding">确定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="新增" v-model="addCatgVisible" size="tiny">
        <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
          <el-form-item label="名称" prop="title">
            <el-input placeholder="栏目名称" v-model="addForm.title"></el-input>
          </el-form-item>
          <el-form-item label="排序">
            <el-input-number v-model="addForm.ps" size="small" :min="0" :max="99999"></el-input-number>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addCatgVisible = false">取消</el-button>
          <el-button type="primary" @click.native="add" :loding="addLoading">确定</el-button>
        </div>
      </el-dialog>
    </section>
</template>

<script>
  import { getCatgList, editCatg, addCatg, detailCatg } from '../../../api/api'
  import qs from 'qs'
  // let id = 1000
  export default {
    data () {
      return {
        listLoading: true,
        data: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        // 新增
        addCatgVisible: false,
        addLoading: false,
        addForm: {
          title: '',
          ps: '99999',
          pid: ''
        },
        addFormRules: {
          title: [
            {
              required: true,
              message: '请输入栏目名',
              trigger: 'blur'
            }
          ]
        },
        // 编辑内容
        editCatgVisible: false,
        editLoding: false,
        editForm: {
          title: '',
          id: '',
          ps: ''
        },
        editFormRules: {
          title: [
            {
              required: true,
              message: '请输入栏目名',
              trigger: 'blur'
            }
          ]
        }
    }
  },

  methods:{
    getList () {
      getCatgList().then( res => {
        console.log(res.data)
        this.listLoading = false
        this.data = res.data
      }).catch(err => {

      })
    },
    // 增加栏目
    success (code, msg) {

    },
    add () {
      var that = this
      that.$refs.addForm.validate((valid) => {
        if (valid) {
          let para = that.addForm
          console.log(para)
          addCatg(qs.stringify(para)).then(res => {
            console.log(qs.stringify(para))
            console.log(res)
            let { code, msg } = res
            if (code == 200) {
              that.$message({
                type: 'success',
                message: msg
              })
              that.addForm = {
                title: '',
                ps: '99999',
                pid: ''
              }
              that.$refs['addForm'].resetFields();
              that.addLoading = false
              that.addCatgVisible = false
              that.listLoading = true
              that.getList()
            }else {
              that.$message({
                type: 'error',
                message: msg
              })
              that.addForm = {
                title: '',
                ps: '99999',
                pid: ''
              }
              that.$refs['addForm'].resetFields();
              that.addLoading = false
              that.addCatgVisible = false

            }
          })
        }
      })

    },

    addMainCatg () {
      var that = this
      this.addCatgVisible = true
      that.addForm.pid = 0
    },

// 编辑栏目
    edit () {
      var that = this
      that.$refs.editForm.validate((valid) => {
        if (valid) {
          let para = that.editForm
          that.editLoading = true
          console.log(para)
          console.log(qs.stringify(para))
          editCatg(qs.stringify(para)).then(res => {
            let { code, msg } = res
            console.log(res)
            if (code == 200) {
              that.$message({
                type: 'success',
                message: msg
              })
              that.$refs['editForm'].resetFields()
              that.editForm = { title: '', id: '', ps: ''}
              that.editLoading = false
              that.editCatgVisible = false
              that.listLoading = true
              that.getList()
            }else {
              that.$message({
                type: 'error',
                message: msg
              })
              that.$refs['editForm'].resetFields()
              that.editForm = { title: '', id: '', ps: ''}
              that.editLoading = false
              that.editCatgVisible = false
            }
          })
        }
      })

    },

    detail (id) {
      var that = this
      let para = {
        id: id
      }
      // that.editCatgVisible = true
      detailCatg(para).then(res => {
        console.log(res.data)
        that.editForm = res.data
        that.editCatgVisible = true
      })
    },
    editClose () {
      this.editCatgVisible = false
      this.editForm = {}
    },
    renderContent(h, { node, data, store }) {
      var that = this
      if (node.data.pid == 0) {
        return h('span', [
          h('span', node.label),
          h('span', {
            attrs: {
              style:"float: right; margin-right: 20px"
            }
          },
          [
            h('el-button', {
              attrs: {
                size: 'mini',
                plain: true,
                type: 'success'
              },
              on: {
                click (event) {
                  event.stopPropagation()
                  that.addCatgVisible = true
                  that.addForm.pid = node.data.id
                }
              }
            }, '新增'),
            h('el-button', {
              attrs: {
                size: 'mini',
                plain: true,
                type: 'primary'
              },
              on: {
                click (event) {
                  event.stopPropagation()
                  // that.edit(node.label, node.data.id)
                  that.detail(node.data.id)
                }
              }
            }, '编辑')
          ]),
        ]);
      }else {
        return h('span', [
          h('span', node.label),
          h('span', {
            attrs: {
              style:"float: right; margin-right: 20px"
            }
          }, [
            h('el-button', {
              attrs: {
                size: 'mini',
                plain: true,
                type: 'primary'
              },
              on: {
                click (event) {
                  event.stopPropagation()
                  // that.edit(node.label, node.data.id)
                  that.detail(node.data.id)
                }
              }
            }, '编辑')
          ])
        ])
      }

    }
  },
  mounted () {
    this.getList()
  }
};
</script>

<style lang="scss">

</style>
