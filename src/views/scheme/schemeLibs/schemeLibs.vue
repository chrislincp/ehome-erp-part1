610<template lang="html">
  <section>
    <!-- 查询栏 -->
    <el-row>
      <el-col class="toolbar scheme_toolbar_filter">
        <el-form :inline="true">
          <el-form-item>
            <el-cascader
              clearable
              :options="developers"
              v-model="developerSelect"
              @change="developersChange">
            </el-cascader>
          </el-form-item>
          <el-form-item>
            <el-select
              clearable
              @change="brandChange"
              v-model="brandSelect"
              placeholder="请选择"
              >
             <el-option
               v-for="item in brands"
               :label="item"
               :value="item"
               :key="item"
               >
             </el-option>
           </el-select>
          </el-form-item>
          <el-form-item>
            <el-radio-group
             @change="roomSelected"
             class="scheme_toolbar_roomSelect"
             v-model="roomSelect">
              <el-radio label="全部"></el-radio>
              <el-radio v-for="item in rooms" :label="item" :key="item"></el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 方案列表 -->
    <el-row v-loading="schemeLoading">
      <el-col
        class="scheme_thumbs"
        v-for="(item, index) in schemes"
        :key="index"
        :xs="24"
        :sm="12"
        :md="8"
        :lg="6"
        >
        <el-card class="scheme_thumbs_cards" :body-style="{ padding: '0px' }">
          <div
            @click="schDetailShow(item)"
            class="schemeLink"
            :style="item.imgurl ? `background-image: url(${item.imgurl}-prolow)` : ''"
            >
          </div>
          <div class="card-info">
            <span class="textOverflow name">{{item.name}}</span>
            <span class="textOverflow designer">
              {{item.designer}}
              <el-button
                v-if="showSchemeEditBtn"
                class="edit"
                type="text"
                @click.native="editMyScheme(item)"
                >
                编辑
              </el-button>
              <el-button
                class="collect"
                type="text"
                @click.native="isCollected(item)"
                >
                收藏
              </el-button>
            </span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24" class="toolbar scheme_toolbar_pagination">
   			<el-pagination
          id="pagination"
          layout="total, prev, pager, next"
          :current-page="page"
          @current-change="handleCurrentChange"
          :page-size="20"
          :total="total"
          >
   			</el-pagination>
   		</el-col>
    </el-row>

    <!--  弹层  -->
    <el-dialog
      v-model="schDetailVisiable"
      :modal-append-to-body="false"
      >
      <div class="schDetail-wrap">
        <header class="schDetail-head">
          <div
            class="detail_link"
            :style="`background-image: url(${schDetailInfo.imgurl})`"
            @click="showViewWay = true"
            >
            <div class="mask" v-show="showViewWay">
              <div class="view_wrap">
                <div class="view_top">
                  观看方式
                </div>
                <div class="view_body">
                    <div class="body_left">
                      <a class="link_icon" style="background-image: url(/static/img/360.png)" :href="schDetailInfo.panorama" target="_blank"></a>
                      <span class="title">全景</span>
                    </div>
                    <div class="body_right">
                      <div @click="showVideo(schDetailInfo)" class="link_icon" style="background-image: url(/static/img/video.png)" href="#"></div>
                      <span class="title">视频</span>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        <div class="schDetail-body">
          <div class="schDetail-desc-wrap">
            <h1>方案描述</h1>
            <article class="schDetail-desc">
              {{schDetailInfo.describe}}
            </article>
          </div>
        </div>
        <footer class="schDetail-foot">
          <h1>家具列表</h1>
          <el-table v-loading.body="priceListLoading" :data="schDetailModelList">
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="model" label="型号"></el-table-column>
            <el-table-column prop="brand" label="品牌"></el-table-column>
            <el-table-column prop="num" label="数量"></el-table-column>
            <el-table-column :formatter="currencyFilter" prop="price" label="单价"></el-table-column>
            <el-table-column :formatter="currencyFilter" prop="totalPrice" label="总价"></el-table-column>
          </el-table>
        </footer>
      </div>
    </el-dialog>


    <!-- 收藏弹层 -->
    <el-dialog
      title="收藏"
      v-model="collectVisible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      size="tiny"
      >
      <div class="collectCheck">
        <el-checkbox-group v-model="checkList">
          <el-checkbox label="我的收藏"></el-checkbox>
          <el-checkbox label="客户收藏"></el-checkbox>
        </el-checkbox-group>

      </div>
      <div class="myCustomerCollect" style="margin-top: 10px;">
        <el-select v-show="checkList.indexOf('客户收藏') != -1" v-model="customerCollect" placeholder="请选择">
          <el-option
            v-for="item in myCustomers"
            :label="item"
            :value="item"
            :key="item"
            >
        </el-option>
        </el-select>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="collectVisible = false">取消</el-button>
        <el-button type="primary" @click.native="collectSchemeSubmit" :loading="collectLoading">提交</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="视频"
      v-model="videoVisible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      >
      <div class="video_viewport">
        <iframe frameborder="0" width="640" height="498" :src="videoUrl" allowfullscreen></iframe>
      </div>
    </el-dialog>


    <!-- 方案编辑 -->
    <el-dialog
      title="编辑"
      v-model="editSchemeFormVisible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      >
      <el-form
        class="schemeEditForm"
        :inline="true"
        :model="editSchemeForm"
        label-width="80px"
        :rules="editSchemeFormRules"
        ref="editSchemeForm"
        >
        <el-form-item prop="name" label="方案名">
          <el-input v-model="editSchemeForm.name"></el-input>
        </el-form-item>
        <el-form-item  label="开发商">
          <el-input v-model="editSchemeForm.developers"></el-input>
        </el-form-item>
        <el-form-item label="型号">
          <el-input v-model="editSchemeForm.arrmodel"></el-input>
        </el-form-item>
        <el-form-item label="品牌">
          <el-input v-model="editSchemeForm.brand"></el-input>
        </el-form-item>
        <el-form-item label="面积">
          <el-input v-model="editSchemeForm.housesize"></el-input>
        </el-form-item>
        <el-form-item label="风格">
          <el-input v-model="editSchemeForm.style"></el-input>
        </el-form-item>
        <el-form-item label="楼盘">
          <el-cascader
            :options="developers"
            v-model="schemeDeveloperSelect"
            @change="schemeDevelopersChange">
          </el-cascader>
        </el-form-item>
        <el-form-item label="房间">
          <el-select v-model="schemeRoomSelect" placeholder="请选择">
            <el-option
              v-for="room in rooms"
              :key="room"
              :label="room"
              :value="room"
              @click.native="roomChange"
              >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="全景">
          <el-input v-model="editSchemeForm.panorama"></el-input>
        </el-form-item>
        <el-form-item label="省">
          <el-input placeholder="浙江省" v-model="editSchemeForm.province"></el-input>
        </el-form-item>
        <el-form-item label="市">
          <el-input placeholder="宁波市" v-model="editSchemeForm.city"></el-input>
        </el-form-item>
        <el-form-item label="区">
          <el-input placeholder="海曙区" v-model="editSchemeForm.district"></el-input>
        </el-form-item>
        <el-form-item label="可见性">
          <el-checkbox v-model="editSchemeForm.visibility"></el-checkbox>
          <!-- <el-input placeholder="0 or 1" v-model="editSchemeForm.visibility"></el-input> -->
        </el-form-item>
      </el-form>
      <el-form
        :model="editSchemeForm"
        label-width="80px"
        >
        <el-form-item label="描述">
          <el-input :rows="5" type="textarea" v-model="editSchemeForm.describe"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editSchemeFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="schemeEditSubmit" :loading="schemeEditLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { getUserListPage, getSchemeList, getModelList, getFilter, collection, getCustomers, collectScheme, editScheme } from '../../../api/api'
import EDialog from '../../../components/dialog/dialog'
import qs from "qs"

export default {
  data() {
    return {
      schemes: [],
      schemeCollect:[],
      schemeLoading: false,
      developers: [],
      developerSelect: [],
      D2: '',
      brands: [],
      brandSelect: '',
      rooms: [],
      roomSelect: '全部',
      page: 1,
      total: 0,
      schDetailVisiable: false,
      priceListLoading: false,
      schDetailInfo: {},
      schDetailModelList: [],
      collectVisible: false,
      checkList: [],
      myChecked: false,
      myCustomerChecked: false,
      collectLoading: false,
      collectedScheme: '',
      customerCollect: '',
      myCustomers: [],
      videoVisible: false,
      showViewWay: false,
      schemeDeveloperSelect: [],
      editSchemeForm: {},
      editSchemeFormVisible: false,
      schemeEditLoading: false,
      editSchemeFormRules: {
        name: [
          { required: true, message: '方案名不能为空！' }
        ],
      },
      schemeRoomSelect: '',
      showSchemeEditBtn: false,
      videoUrl: ''
    }
  },
  beforeCreate () {
    getFilter().then(res => {
      this.developers = res.data.developers
      this.brands = res.data.brands
      this.rooms = res.data.rooms
    })
  },
  components: {
    'e-dialog': EDialog
  },
  methods: {
    getCollect () {
      let user = JSON.parse(sessionStorage.getItem('user'))
      let para = { name: user.name, uid: user.id }
      getUserListPage(para).then(res => {
        if (res.data.users[0].favorite_p) this.schemeCollect = res.data.users[0].favorite_p.split(';')
        else this.schemeCollect = []
      })
    },
    loadCustomers () {
      let user = JSON.parse(sessionStorage.getItem('user'))
      let para = { uid: user.id, select: 0, all: 1 }
      getCustomers(para).then(res => {
        let arr = []
        for (let i of res.data) arr.push(i.customer)
        this.myCustomers = arr
      })
    },
    getScheme () {
      this.schemeLoading = true
      let para = { D2: this.D2, brand: this.brandSelect, room: this.roomSelect, page: this.page }
      getSchemeList(para).then(res => {
        if (res.data.length > 0) {
          // for (var i of res.data) {
          //   if (this.schemeCollect.indexOf(i.projectid) == -1) i.collected = 0
          //   else i.collected = 1
          // }
          this.schemes = res.data
          this.total = res.data[0].total
        }else {
          this.schemes = []
          this.total = 0
          this.$message({
            type: 'info',
            message: '暂无数据'
          })
        }
        this.$nextTick(() => this.schemeLoading = false)
      })
    },
    developersChange (val) {
      this.page = 1
      if (val.length > 0) {
        this.D2 = val[1]
      }else {
        this.D2 = ''
      }
      this.getScheme()
    },
    // 品牌选择
    brandChange() {
      this.page = 1
      this.getScheme()
    },
    roomSelected () {
      this.page = 1
      this.getScheme()
    },
    // 分页选择
    handleCurrentChange(val) {
      this.page = val;
      this.getScheme()
    },
    isCollected (item) {
      this.checkList = []
      this.customerCollect = ''
      this.collectedScheme = item.projectid
      this.collectVisible = true
    },
    collectSchemeSubmit () {
      this.collectLoading = true
      let me, customer
      let pid = this.collectedScheme
      let cname = this.customerCollect
      let uid = JSON.parse(sessionStorage.getItem('user')).id
      this.checkList.indexOf('我的收藏') == -1 ? me = 0 : me = 1
      this.checkList.indexOf('客户收藏') == -1 ? customer = 0 : customer = 1
      let para = { me, customer, pid, cname, uid }
      let params = {para}
      collectScheme(qs.stringify(params)).then(res => {
        let { code, msg } = res
        if (code == 200) {
          this.$message({
            type: 'success',
            message: msg
          })
          this.collectLoading = false
          this.collectVisible = false
          this.getCollect()
        }else {
          this.$message({
            type: 'warning',
            message: msg
          })
          this.collectLoading = false
        }
      })
    },
    schDetailShow (item) {
      this.showViewWay = false
      this.schDetailVisiable = true
      this.priceListLoading = true
      this.schDetailInfo = item
      let projectid = item.projectid
      let para = { projectid }
      getModelList(para).then(res => {
        this.schDetailModelList = res.data.model
        this.priceListLoading = false
      })
    },
    currencyFilter (row, column) {
      let val = row[column.property]
      if (val != undefined) return (val + '').split("").reverse().join("").replace(/(\d{3})(?=[^$])/g, "$1,").split("").reverse().join("");
    },
    // 显示方案编辑页面
    editMyScheme (item) {
      this.editSchemeForm = Object.assign({}, item)
      if (item. D1 == 0) {
        this.schemeDeveloperSelect = []
      }else {
        this.schemeDeveloperSelect = [item.D1, item.D2]
      }
      if (this.editSchemeForm.visibility == 0) this.editSchemeForm.visibility = false
        else this.editSchemeForm.visibility = true

      let projectid = item.projectid
      this.schemeRoomSelect = item.room
      this.editSchemeFormVisible = true
    },
    schemeDevelopersChange (val) {
      this.editSchemeForm.D1 = val[0]
      this.editSchemeForm.D2 = val[1]
    },
    roomChange () {
      this.editSchemeForm.room = this.schemeRoomSelect
    },
    schemeEditSubmit () {
      this.$refs.editSchemeForm.validate((valid) => {
        if (valid) {
          this.schemeEditLoading = true
          let para = Object.assign({}, this.editSchemeForm)
          para.imgpath = `project/${para.projectid}/${para.projectid}.jpg`
          if (para.visibility == true) para.visibility = 1
          else para.visibility = 0
          let params = { para }
          editScheme(qs.stringify(params)).then(res => {
            this.schemeEditLoading = false
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
            this.$refs['editSchemeForm'].resetFields()
            this.editSchemeFormVisible = false
            // this.$refs['upload'].clearFiles()
            this.getScheme()
          })
        }
      });
    },
    collect (item) {
      let id = item.projectid
      let uid = JSON.parse(sessionStorage.getItem('user')).id
      let para = {type: 'scheme', sid: id, uid, fav: item.fav}
      let params = { para }
      collection(qs.stringify(params)).then(res =>{
        let {code,fav, msg} = res
        if (code == 200) {
          item.fav = fav
          this.$message({
            type: 'success',
            message: msg
          })
        }
      })
    },
    showVideo (row) {
      if (row.VideoUrl == '') {
        this.$message({
          type: 'warning',
          message: '暂无相关视频'
        })
      }else {
        this.videoUrl = row.VideoUrl
        this.schDetailVisiable = false
        setTimeout(() => {
          this.videoVisible = true
        }, 300)
      }
    }
  },
  mounted() {
    let user = JSON.parse(sessionStorage.getItem('user'))
    if (user.keys.includes('f03') || user.keys.includes('root')) this.showSchemeEditBtn = true
    else this.showSchemeEditBtn = false
    this.getCollect()
    this.loadCustomers()
    this.getScheme()
  }
}
</script>

<style lang="scss">

  .scheme_toolbar_filter {
    padding-bottom: 0;
    .scheme_toolbar_roomSelect {
      display: inline-block;
      margin-left: 20px;
    }
  }

  .scheme_thumbs {
    padding: 10px;
    .scheme_thumbs_cards {
      position: relative;
      width: 95%;
      margin: 0 auto;
      .schemeLink {
        border-bottom: 1px solid #ccc;
        display: inline-block;
        width: 100%;
        height: 0;
        padding-bottom: 56.25%;
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% 100%;
        cursor: pointer;
        transition: all .3s ease-in-out;
      }
      .card-info {
        padding: 5px 10px;
        position: relative;
        .name {

        }
        .designer {
          font-size: 12px;
          color: #333;
          height: 25px;
          line-height: 25px;
          .collect {
            float: right;
          }
          .edit {
            float: right;
            margin-left: 10px;
          }
        }
      }
    }
  }

  .scheme_toolbar_pagination {
    margin: 0;
    #pagination {
      float: right;
    }
  }

 /*编辑页面*/
 .schDetail-wrap {
   .schDetail-head {
     .detail_link {
       display: block;
       width: 100%;
       height: 0;
       padding-bottom: 56.25%;
       background-repeat: no-repeat;
       background-position: center;
       background-size: 100% 100%;
       border: 1px solid #ccc;
       position: relative;
       .mask {
         width: 100%;
         height: 100%;
         position: absolute;
         background: rgba(0, 0, 0, 0.5);
         .view_wrap {
           width: 60%;
           height: 0;
           padding-bottom: 33.75%;
           border: 2px solid #fff;
           border-radius: 10px;
           position: absolute;
           left: calc(20% - 2px);
           top: calc(20% - 2px);
           .view_top {
             width: 100%;
             height: 30%;
             position: absolute;
             top: 0;
             color: #fff;
             font-size: 20px;
             text-align: center;
             line-height: 60px;
           }
           .view_body {
             width: 100%;
             height: 70%;
             position: absolute;
             top: 30%;
             .body_left,.body_right {
               width: calc(50% - 2px);
               display: inline-block;
               height: 100%;
               position: relative;
               .link_icon {
                 display: block;
                 width: 40%;
                 height: 0;
                 padding-bottom: 40%;
                 margin: 0 auto;
                 background-repeat: no-repeat;
                 background-size: 100%;
                 background-position: center;
                 cursor: pointer;
               }
               .title {
                 color: #fff;
                 position: absolute;
                 top: 60%;
                 left: calc(50% - 14px);
               }
             }
           }
         }
       }
     }
   }
   .schDetail-body {
     .schDetail-desc-wrap {
       .schDetail-desc {
         text-indent: 2em;
       }
     }
   }
 }

 .el-icon-circle-close {
   z-index: 99;
 }
.video_viewport {
  width: 640px;
  height: 498px;
  margin: 0 auto;
}

</style>
