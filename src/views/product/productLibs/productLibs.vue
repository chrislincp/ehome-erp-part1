<template lang="html">
  <section>
    <el-tabs
      :class="mainInfoVisiable?'proViewUp':'proViewDown'"
      @tab-click="tabChange" type="border-card"
      >
      <el-tab-pane
        class="product_tabs"
        :key="item.p1"
        v-for="item in nav"
        :label="item.name1"
        >
      <div class="tab-filters">
        <el-select v-model="item.selected" placeholder="请选择">
         <el-option
           v-for="option in item.options"
           :label="option.name2"
           :value="option.p2"
           :key="option.p2"
           @click.native="navSelected(option.types, option.p2)"
           >
         </el-option>
       </el-select>

       <el-radio-group
        class="tab_typeSelect"
        @change="typeSelected"
        v-model="typeSelect">
         <el-radio label="全部"></el-radio>
         <el-radio v-for="type in types" :label="type" :key="type"></el-radio>
       </el-radio-group>
       <!-- 切换列表形式 -->
       <el-button @click="listChange" class="fa listChangeBtn" :class="[isList ? 'fa-bars' : 'fa-th-large']"></el-button>
     	 <el-form class="search_form" :inline="true" :model="filters">
     	   <el-form-item>
     		   <el-input v-model="filters.name" @keyup.enter.native="proSearch" placeholder="搜索"></el-input>
     		 </el-form-item>
     		 <el-form-item>
     			 <el-button type="primary" @click="proSearch">查询</el-button>
     		 </el-form-item>
     	</el-form>
      </div>

       <!-- 条形列表形式 -->

       <el-table
       class="tab_text_list"
        v-show="isList"
        :data = "productsList"
        >
         <el-table-column
          align="center"
          prop="model"
          label="主型号"
          :show-overflow-tooltip = "true">
        </el-table-column>
          <el-table-column align="center" prop="submodel" label="子型号"></el-table-column>
          <el-table-column align="center" prop="brand" label="品牌"></el-table-column>
          <el-table-column align="center" prop="name" label="品名"></el-table-column>
          <el-table-column align="center" :formatter="currencyFilter" prop="price" label="价格"></el-table-column>
          <el-table-column align="center" prop="size" label="尺寸"></el-table-column>
          <el-table-column align="center" prop="material" label="材质"></el-table-column>
       </el-table>


       <!-- 缩略图列表形式 -->
       <el-row
        class="tab_thumb_list"
        v-show="!isList"
        v-loading="listLoading"
        >
         <el-col
           class="tab_thumb_col"
           v-for="(item, index) in products"
           :key="item"
           :xs="24"
           :sm="12"
           :md="8"
           :lg="6"
           >
           <el-card class="tab_thumb_cards" :body-style="{ padding: '0px' }">
             <div
               class="product-item"
               @click="imgChecked(item.list[0])"
               :style="`background-image: url(${item.list[0].urlimg})`"
             >
              <label class="imgSelected" v-show="item.selected">
                <i class="el-icon-check"></i>
              </label>
             </div>
             <div class="card-info">
               <span class="textOverflow">型号：{{item.list[0].model}}-{{item.list[0].name}}
                 <!-- <i
                   class="fa favorite"
                   :class="[item.fav == 0 ? 'fa-heart-o' : 'fa-heart fav']"
                   @click="collect(item)"
                   >
                 </i> -->
               </span>
               <span class="textOverflow">尺寸：{{item.list[0].size}}</span>
               <span>
                 价格：{{item.list[0].price | currencyFilter}}
               </span>
               <div class="btns">
                 <el-button @click="showMainImg(item.ID)" type="text">图片</el-button>
                 <el-button @click="showMainInfo(item.list)" type="text">更多</el-button>
               </div>
             </div>
               <!-- <span>{{checkList[card.submodel]}}</span> -->
           </el-card>
         </el-col>
       </el-row>



      </el-tab-pane>

      <!--工具条-->
      <el-col :span="24" class="toolbar product_toolbar">
          <el-button
            class="settle_button"
            @click="priceList"
            type="danger"
            >
          结算
        </el-button>
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
    </el-tabs >

    <!-- 详细信息 -->
    <transition name="fade" mode="out-in">
      <div v-show="mainInfoVisiable" class="v-bottom-tab">
        <div class="mainInfo">
          <div @click="mainInfoClose" class="v-bottom-tab-close">
            <i class="el-icon-close"></i>
          </div>
          <div class="img">
            <img :src="mainInfo[0].urlimg || ''" alt="">
          </div>
          <div class="list">
            <el-table
             class="list_table"
             :data="mainInfo"
             >
              <el-table-column align="center" width="60">
                <template scope="scope">
                  <el-checkbox v-model="scope.row.checked" @change="checked(scope.row)"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column align="center" calss="tooltip" prop="submodel" label="子型号" width="200"></el-table-column>
              <el-table-column align="center" prop="brand" label="品牌" width="100"></el-table-column>
              <el-table-column align="center" prop="name" label="品名" width="120"></el-table-column>
              <el-table-column align="center" prop="price" :formatter="currencyFilter" label="价格" width="90"></el-table-column>
              <el-table-column align="center" prop="size" label="尺寸" width="150"></el-table-column>
              <el-table-column align="center" prop="material" label="材质" min-width="120"></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </transition>

    <!-- 图片详情 -->

    <el-dialog
      v-model="MainImageVisible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      size="large"
      >
      <el-tabs type="card">
        <el-tab-pane label="图片">
          <div class="mainImageBody" v-show="carouselArr.length > 0">
            <!-- <el-carousel
              :interval="2000"
              arrow="always"
              :autoplay="false"
              indicator-position="none"
              v-loading="mainImageLoading"
              v-show="carouselArr.length > 0"
              >
              <el-carousel-item
                v-for="item in carouselArr"
                :style="`background-image: url(${item.photo_url}?id=${item.ID})`"
                :key="item.ID"
                :class="item.width >= item.height ? 'width' : 'height'"
                style="display: block"
                >
              </el-carousel-item>
            </el-carousel> -->
            <!-- <rd-swipe :swipe="swipe">
              <div
                  class="rd-swipe-item"
                  :class="item.width >= item.height ? 'width' : 'height'"
                  :style="`background-image: url(${item.photo_url}?id=${item.ID})`"
                  v-for="(item, index) in carouselArr">
              </div>
          </rd-swipe> -->

          <swiper
            v-loading="mainImageLoading"
            class="mySwiper"
            :options="swiperOption"
            ref="mySwiper"
            >
            <!-- slides -->
            <swiper-slide
              :class="item.width > item.height ? 'width' : 'height'"
              :style="`background-image: url(${item.photo_url}?id=${item.ID})`"
              v-for="(item, index) in carouselArr"
              :key="index"
              >
            </swiper-slide>
            <!-- Optional controls -->
            <!-- <div class="swiper-pagination"  slot="pagination"></div> -->
            <div class="swiper-button-prev" slot="button-prev"></div>
            <div class="swiper-button-next" slot="button-next"></div>
            <!-- <div class="swiper-scrollbar"   slot="scrollbar"></div> -->
          </swiper>
          </div>
        </el-tab-pane>
        <!-- <el-tab-pane label="3D">
          <h1></h1>
          <div class="color:0x000000" width="100%" height="100%">
            <div id="myCar"></div>
          </div>
        </el-tab-pane> -->
      </el-tabs>
    </el-dialog>

    <!-- 结算列表清单 -->
    <el-dialog
      title="清单"
      v-model="settlementFormVisiable"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      class="settle_dialog"
      size="large"
      >
      <el-table
        class="settle_dialog_table"
        v-loading="priceLoading"
        :data="priceForm"
        >
        <el-table-column align="center" width="136" label="图片">
          <template scope="scope">
            <img :src="scope.row.urlimg" alt="">
          </template>
        </el-table-column>
        <el-table-column align="center" :show-overflow-tooltip="true" prop="submodel" width="160" label="型号"></el-table-column>
        <el-table-column align="center" prop="name" width="100" label="品名"></el-table-column>
        <el-table-column align="center" prop="price" :formatter="currencyFilter" min-width="100" label="价格"></el-table-column>
        <el-table-column align="center" width="130" label="数量">
          <template scope="scope">
            <el-button icon="minus" @click="decrease(scope.row,scope.row.num)" size="mini"></el-button>
            <el-input size="mini" v-model="scope.row.num" style="width:35px;" ></el-input>
            <el-button icon="plus" @click="increase(scope.row,scope.row.num)" size="mini"></el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" width="150" label="区域">
          <template scope="scope">
            <el-select v-model="scope.row.room" placeholder="请选择">
              <el-option
                v-for="item in rooms"
                :label="item"
                :value="item"
                :key="item"
                >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" width="80" label="操作">
          <template scope="scope">
            <el-button size="small" type="danger" @click="removeSingle(scope.row)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="v-dialog-foot">
        <div class="totalPrice">
          <span>总价：{{totalPrice | currencyFilter}}</span>
        </div>
        <div class="btns">
          <el-button class="report" type="success" @click="reportExcel">导出EXCEL</el-button>
          <el-button class="save" type="primary" @click="saveProductsOpen">保存</el-button>
          <el-button class="newFile" type="primary" @click="createCustomerOpen">新建</el-button>
        </div>
        <div @click="similarVisiable = !similarVisiable" class="isShowSimilar">
          <i :class="[similarVisiable ? 'el-icon-arrow-up' : 'el-icon-arrow-down']"></i>
        </div>
      </div>
      <div v-show="similarVisiable" class="similar-wrapper">
        <p v-show="noSimilar">暂无相关方案</p>
        <div v-for="item in similar" class="similar-item" :key="item.ID">
          <a
            target="_blank"
            class="similarImg"
            :style="`background-image: url(${item.imgpath})`"
            :href="item.url"
            >
          </a>
        </div>
      </div>
    </el-dialog>

    <!-- 清单保存层 -->

    <el-dialog
      title="保存"
      v-model="saveProductsFormVisible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      size="tiny"
      >
      <el-select v-model="customerSelected">
        <el-option
          v-for="item in customersData"
          :label="item.customer"
          :value="item.oid"
          :key="ID"
          >
        </el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="saveProductsFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="saveMyProducts" :loading="saveProductsLoading">提交</el-button>
      </div>
    </el-dialog>

  <!-- 新建客户清单 -->

    <el-dialog
      title="新建"
      v-model="createCustomerVisible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      size="tiny"
      >
      <el-form
        :model="customerInfo"
        :rules="customerInfoRules"
        ref="customerInfo"
        label-width="80px"
        >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="customerInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="tel">
          <el-input v-model="customerInfo.tel"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="mark">
          <el-input type="textarea" v-model="customerInfo.mark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="createCustomerVisible = false">取消</el-button>
        <el-button type="primary" @click.native="createMyCustomer" :loading="createCustomerLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { getUserListPage, getProductList, getNav, getPriceForm, collection, getCustomers, saveProducts,addCustomer, getMainImage, getFilter } from '../../../api/api'
import qs from "qs"

export default {
  data () {
    return {
      isList: false,
      listLoading: false,
      priceLoading: false,
      nav: [],
      rooms: [],
      p2: '',
      filters: {
        name: ''
      },
      products: [],
      productsList: [],
      productCollect: [],
      types: [],
      typeSelect: '全部',
      mainInfo: [{urlimg: ''}],
      mainInfoVisiable: false,
      page: 1,
      total: 0,
      checkList: {},
      settlementFormVisiable: false,
      settlementForm: [],
      priceForm: [],
      similar: [],
      similarVisiable: false,
      noSimilar: true,
      totalPrice: 0,
      saveProductsList: '',
      saveProductsFormVisible: false,
      customersData: [],
      customerSelected: '',
      saveProductsLoading: false,
      createCustomerVisible: false,
      createCustomerLoading: false,
      customerInfo: {
        name: '',
        tel: '',
        mark: '',
        uname: '',
        uid: '',
        products: ''
      },
      MainImageVisible: false,
      mainImageLoading: false,
      carouselArr: [],
      swiperOption: {
          // NotNextTick is a component's own property, and if notNextTick is set to true, the component will not instantiate the swiper through NextTick, which means you can get the swiper object the first time (if you need to use the get swiper object to do what Things, then this property must be true)
          // notNextTick是一个组件自有属性，如果notNextTick设置为true，组件则不会通过NextTick来实例化swiper，也就意味着你可以在第一时间获取到swiper对象，假如你需要刚加载遍使用获取swiper对象来做什么事，那么这个属性一定要是true
          notNextTick: true,
          // swiper configs 所有的配置同swiper官方api配置
          // autoplay: 3000,
          // direction : 'vertical',
          grabCursor : true,
          setWrapperSize :true,
          autoHeight: false,
          // pagination : '.swiper-pagination',
          // paginationClickable :true,
          prevButton:'.swiper-button-prev',
          nextButton:'.swiper-button-next',
          // scrollbar:'.swiper-scrollbar',
          mousewheelControl : true,
          observeParents:true,
          // if you need use plugins in the swiper, you can config in here like this
          // 如果自行设计了插件，那么插件的一些配置相关参数，也应该出现在这个对象中，如下debugger
          // debugger: true,
          // swiper callbacks
          // swiper的各种回调函数也可以出现在这个对象中，和swiper官方一样
          // onTransitionStart(swiper){
          //   console.log(swiper)
          // },
          // more Swiper configs and callbacks...
          // ...
        },
      threeD: [],
      customerInfoRules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        tel: [{ required: true, message: '请输入手机号', trigger: 'blur' }]
      },
    }
  },
  components: {

  },
  beforeCreate () {
    getNav().then(res => {
      this.nav = res.data
    })
  },
  methods: {
    // 获取products数据
    getProd () {
      this.listLoading = true
      let type = ''
      if (this.typeSelect == '全部') type = 'all'
      else type = this.typeSelect
      let para = { p2: this.p2, page: this.page, type, name: this.filters.name }
      // console.log(para)
      this.productsList = []
      getProductList(para).then(res => {
        this.total = res.data[0].total
        if (this.total > 0) {
          for (let i of res.data) {
            // if (this.productCollect.indexOf(i.list[0].ID) == -1) i.fav = 0
            // else i.fav = 1
            this.productCollect.indexOf(i.list[0].ID) == -1 ? i.fav = 0 : i.fav = 1
            let list = i.list
            this.productsList = this.productsList.concat(list)
            if (list[0].urlimg.slice(-3) != 'jpg') list[0].urlimg = '/static/img/NotFound.jpg'
            for (let i of list) {
              let key = i.ID
              if (this.checkList[key] == true) i.checked = true
            }
          }
          this.products = res.data
          this.selected()
          this.mainInfoVisiable = false
          this.$nextTick(() => this.listLoading = false)
        }else {
          this.$message({
            message: '暂无数据',
            type: 'info'
          })
          this.listLoading = false
          this.products = []
        }
      })
    },
    // 导航下拉菜单选择
    navSelected (types, p2) {
      this.types = types
      this.p2 = p2
      this.page = 1
      this.typeSelect = '全部'
      this.mainInfo = [{urlimg: ''}]
      this.mainInfoVisiable = false
      this.filters.name = ''
      this.getProd();
    },
    // 分类选择
    typeSelected () {
      this.page = 1
      this.filters.name = ''
      this.getProd()
    },
    // 分页选择
    handleCurrentChange(val) {
      this.page = val;
      this.getProd();
    },
    proSearch () {
      this.page = 1
      this.getProd()
    },
    // 切换列表型号
    listChange () {
      this.isList = !this.isList
    },
    // 减少个数
    decrease (row,num) {
      num -= 0
      if(num > 0) {
        num -= 1
        row.num = num
        let price = row.price - 0
        row.totalPrice = row.num * price
        this.totalPrice  -= price
      }
    },
    // 增加个数
    increase (row,num) {
      num -= 0
      num += 1
      row.num = num
      let price = row.price - 0
      row.totalPrice = row.num * price
      this.totalPrice  += price

    },
    // 清除products
    tabChange (e) {
      this.nav[e.index].selected = ''
      this.products = []
      this.page = 1
      this.p2 = ''
      this.total = 0
      this.listLoading = false
    },
    // 查看详情
    showMainInfo (item) {
      this.mainInfo = item
        if (this.mainInfoVisiable == false) this.mainInfoVisiable = true
    },
    showMainImg (id) {
      this.carouselArr = []

      let para = { mid: id }
      getMainImage(para).then(res => {
        if (res.data.carousel.length != 0) {
          this.MainImageVisible = true
          this.mainImageLoading = true
          this.carouselArr = res.data.carousel
          this.threeD = res.data.threeD
          this.$nextTick(() => {
            setTimeout(() => {
              this.mainImageLoading = false
            }, 300)
          })
        }else {
          this.$message({
            type: 'warning',
            message: '此产品暂无图片'
          })
        }

        // this.show3d(id)
      })
    },
    mainInfoClose () {
      this.mainInfoVisiable = false
    },

    checked (item, index) {
      let key = item.ID
      let checked = item.checked
      if (!this.checkList[key]) {
        this.checkList[key] = true
        checked = true
      }else {
        this.checkList[key] = !this.checkList[key]
        checked = !checked
      }
      this.selected()
    },
    imgChecked (item) {
      let key = item.ID
      let checked = item.checked
      if (!this.checkList[key]) {
        this.checkList[key] = true
        checked = true
      }else {
        this.checkList[key] = !this.checkList[key]
        checked = !checked
      }
      item.checked = checked
      this.selected()
    },
    // 图片选中
    selected () {
      let products = this.products
      for (let i = 0; i < products.length; i++) {
        let list = products[i].list
        let count = 0
        for (let j in list) {
          if (list[j].checked == true) count += 1
        }
        if (count > 0) products[i].selected = true
        else products[i].selected = false
      }
    },
    collect (item) {
      let id = item.list[0].ID
      let uid = JSON.parse(sessionStorage.getItem('user')).id
      let para = {type: 'product', pid: id, uid, fav: item.fav}
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
    // 价格列表
    priceList () {
      this.priceLoading = true
      this.settlementForm = []
      this.totalPrice = 0
      for (let i in this.checkList) {
        if(this.checkList[i] == true) this.settlementForm.push(i)
      }
      if (this.settlementForm.length > 0) {
        let para = { list: this.settlementForm }
        getPriceForm(para).then(res => {
          for (let i of res.data.list) {
            let price = i.price - 0
            this.totalPrice += price
            i.room = ''
            i.totalPrice = price * i.num
          }
          this.priceForm = res.data.list

          if (res.data.similar.length > 0) {
            this.noSimilar = false
            for (let i of res.data.similar) {
              i.imgpath = `/panor/src/upload/${i.imgpath}`
              i.url = `/panor/src/detail/detail.html?id=${i.projectid}`
            }
          }else this.noSimilar = true
          this.similar = res.data.similar
        })
      }else {
        this.priceForm = []
        this.similar = []
        this.noSimilar = true
      }
      this.priceLoading = false
      this.settlementFormVisiable = true
    },
    // 移除清单产品
    removeSingle (row) {
      let key = row.ID
      let model = row.model
      this.totalPrice -= row.price
      this.checkList[key] = false
      for (let i = 0; i < this.settlementForm.length; i++) {
        if (this.settlementForm[i] == key) {
          this.settlementForm.splice(i, 1)
          this.priceForm.splice(i, 1)
          if (this.priceForm.length == 0) this.noSimilar = true
        }

      }
      for (let i of this.products) {
        if (i.model == model) {
          let list = i.list
          let count = 0
          for (let k of list) {
            if (k.ID == key) k.checked = false
            if (k.checked == true) count += 1
          }
          if (count == 0) i.selected = false
        }
      }
    },
    reportExcel () {
      let wrap = []
      let totalPrice = this.totalPrice
      let totalNum = 0
      for (let i of this.priceForm) {
        let index = this.priceForm.indexOf(i)
        totalNum += i.num
        let item = []
        item = [
          {"value": index+1, "type":"ROW_HEADER"},
          {"value": i.room, "type":"ROW_HEADER"},
          {"value": `<img src="${i.urlimg}-100" alt="">`, "type":"ROW_HEADER"},
          {"value": i.submodel, "type":"ROW_HEADER"},
          {"value": i.name, "type":"ROW_HEADER"},
          {"value": i.size, "type":"ROW_HEADER"},
          {"value": i.material, "type":"ROW_HEADER"},
          {"value": i.num, "type":"ROW_HEADER"},
          {"value": i.price, "type":"ROW_HEADER"},
          {"value": i.totalPrice, "type":"ROW_HEADER"}
        ]
        wrap.push(item)
      }
      let lastItem = [
        {"value": this.priceForm.length+1, "type":"ROW_HEADER"},
        {"value": '', "type":"ROW_HEADER"},
        {"value": '', "type":"ROW_HEADER"},
        {"value": '', "type":"ROW_HEADER"},
        {"value": '', "type":"ROW_HEADER"},
        {"value": '', "type":"ROW_HEADER"},
        {"value": '', "type":"ROW_HEADER"},
        {"value": totalNum, "type":"ROW_HEADER"},
        {"value": '', "type":"ROW_HEADER"},
        {"value": totalPrice, "type":"ROW_HEADER"}
      ]
      wrap.push(lastItem)
      var data = {
                   "title":[
                       {"value":"序号", "type":"ROW_HEADER_HEADER", "datatype":"string"},
                       {"value":"区域", "type":"ROW_HEADER_HEADER", "datatype":"string"},
                       {"value":"图片", "type":"ROW_HEADER_HEADER", "datatype":"string"},
                       {"value":"型号", "type":"ROW_HEADER_HEADER", "datatype":"string"},
                       {"value":"品名", "type":"ROW_HEADER_HEADER", "datatype":"string"},
                       {"value":"尺寸", "type":"ROW_HEADER_HEADER", "datatype":"string"},
                       {"value":"材质", "type":"ROW_HEADER_HEADER", "datatype":"string"},
                       {"value":"数量", "type":"ROW_HEADER_HEADER", "datatype":"string"},
                       {"value":"单价", "type":"ROW_HEADER_HEADER", "datatype":"string"},
                       {"value":"总价", "type":"ROW_HEADER_HEADER", "datatype":"string"}
                   ],
                   "data": wrap
               };
               if(data == '')
                   return;
               this.JSONToExcelConvertor(data.data, "Report", data.title);
    },
    JSONToExcelConvertor(JSONData, FileName, ShowLabel) {
           //先转化json
           var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
           var excel = '<table border="1">';
           //设置表头
           var row = "<tr>";
           for (var i = 0, l = ShowLabel.length; i < l; i++) {
               row += "<td style='color: #ccc; background: #333; text-align: center; height: 40px;'>" + ShowLabel[i].value + '</td>';
           }
           //换行
           excel += row + "</tr>";
           //设置数据
           for (var i = 0; i < arrData.length; i++) {
               var row = "<tr>";
               for (var index in arrData[i]) {
                   var value = arrData[i][index].value === "." ? "" : arrData[i][index].value;
                   var line = ''
                   index == 2 ? line = '<td style="text-align: center; width: 100px; height: 100px;">' + value + '</td>' : line = '<td style="text-align: center; height: 100px;">' + value + '</td>'
                   row += line
               }
               excel += row + "</tr>";
           }
           excel += "</table>";
           var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>";
           excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
           excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel';
           excelFile += '; charset=UTF-8">';
           excelFile += "<head>";
           excelFile += "<!--[if gte mso 9]>";
           excelFile += "<xml>";
           excelFile += "<x:ExcelWorkbook>";
           excelFile += "<x:ExcelWorksheets>";
           excelFile += "<x:ExcelWorksheet>";
           excelFile += "<x:Name>";
           excelFile += "{worksheet}";
           excelFile += "</x:Name>";
           excelFile += "<x:WorksheetOptions>";
           excelFile += "<x:DisplayGridlines/>";
           excelFile += "</x:WorksheetOptions>";
           excelFile += "</x:ExcelWorksheet>";
           excelFile += "</x:ExcelWorksheets>";
           excelFile += "</x:ExcelWorkbook>";
           excelFile += "</xml>";
           excelFile += "<![endif]-->";
           excelFile += "</head>";
           excelFile += "<body>";
           excelFile += excel;
           excelFile += "</body>";
           excelFile += "</html>";
           var uri = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(excelFile);
           var link = document.createElement("a");
           link.href = uri;
           link.style = "visibility:hidden";
           link.download = FileName + ".xls";
           document.body.appendChild(link);
           link.click();
           document.body.removeChild(link);
    },

    currencyFilter (row, column) {
      let val = row[column.property]
      if (val != undefined) return (val + '').split("").reverse().join("").replace(/(\d{3})(?=[^$])/g, "$1,").split("").reverse().join("");
    },
    saveProductsOpen () {
      let arr = []
      for (let i of this.priceForm) {
        for(let k = 0; k < i.num; k++) {
          arr.push(i.ID)
        }
      }
      let products = arr.join(';')
      this.saveProductsList = products
      this.loadCustomers()
      this.settlementFormVisiable = false
      setTimeout(() => {
        this.customerSelected = ''
        this.saveProductsFormVisible = true
      },300)
    },
    loadCustomers () {
      let user = JSON.parse(sessionStorage.getItem('user'))
      let para = { uid: user.id, select: 0, all: 0 }
      getCustomers(para).then(res => {
        let arr = []
        for (let i of res.data) {
          let obj = {
            customer: i.customer,
            oid: i.oid
          }
           arr.push(obj)
        }
        this.customersData = arr
      })
    },
    saveMyProducts () {
      this.saveProductsLoading = true
      let rooms = {}
      for (let i of this.priceForm) rooms[i.ID] = i.room
      rooms = rooms == {} ? '' : JSON.stringify(rooms)
      let params = { oid: this.customerSelected, products: this.saveProductsList, rooms, update: 1 }

      saveProducts(qs.stringify(params)).then(res => {

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
        this.saveProductsLoading = false
        this.saveProductsFormVisible = false
      })
    },
    createCustomerOpen () {
      let user = JSON.parse(sessionStorage.getItem('user'))
      this.customerInfo = {
        name: '',
        tel: '',
        mark: '',
        uname: user.name,
        uid: user.id,
        products: '',
        rooms: ''
      }
      this.settlementFormVisiable = false
      setTimeout(() => {
        this.createCustomerVisible = true
      },300)
    },
    createMyCustomer () {
      this.$refs.customerInfo.validate((valid) => {
        if (valid) {
          this.createCustomerLoading = true
          let arr = []
          for (let i of this.priceForm) {
            for (let k = 0; k < i.num; k++) {
              arr.push(i.ID)
            }
          }
          let products = arr.join(';')
          let rooms = {}
          for (let i of this.priceForm) rooms[i.ID] = i.room
          this.customerInfo.products = products
          this.customerInfo.rooms = rooms == {} ? '' : JSON.stringify(rooms)
          let para = Object.assign({}, this.customerInfo)
          let params = {para}
          addCustomer(qs.stringify(params)).then(res => {
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
            this.$refs['customerInfo'].resetFields()
            this.createCustomerLoading = false
            this.createCustomerVisible = false
          })
        }
      })
    },
    show3d (id) {
      let len = this.threeD.length
      let path = `http://picture.ehometd.com/obj/${id}/`
      $(document).ready(function(){
        $("#myCar").vc3dEye({
          imagePath:path,
          totalImages:len,
          imageExtension:"jpg"
        })
      })
    }
  },
  mounted () {
    let user = JSON.parse(sessionStorage.getItem('user'))
    let para = { name: user.name, uid: user.id }
    getUserListPage(para).then(res => {
      if (res.data.users[0].favorite_g) this.productCollect = res.data.users[0].favorite_g.split(';')
      else this.productCollect = []
    })
      getFilter().then(res => {
        this.rooms = res.data.rooms
      })
  }
}
</script>

<style lang="scss">

  .product_tabs {
    .tab-filters {
      .tab_typeSelect {
        display: inline-block;
        margin-left: 20px;
      }
      .listChangeBtn {
        float: right;
      }
      .search_form {
        float: right;
        .el-form-item {
          margin-bottom: 0;
        }
      }
    }
    .tab_text_list {
      width: 100%;
      margin: 10px 0;
    }
    .tab_thumb_list {
      margin-top: 10px;
      .tab_thumb_col {
        margin-bottom: 10px;
        .tab_thumb_cards {
          width: 80%;
          margin: 0 auto;
          position: relative;
          .product-item {
            display: inline-block;
            width: 100%;
            height: 0;
            border-bottom: 1px solid #ccc;
            padding-bottom: 100%;
            background-repeat: no-repeat;
            background-position: center;
            background-size: 100% 100%;
            transition: all .3s ease-in-out;
            .imgSelected {
              position: absolute;
              right: -15px;
              top: -6px;
              width: 40px;
              height: 24px;
              background: #20a0ff;
              text-align: center;
              transform: rotate(45deg);
              box-shadow: 0 0 1pc 1px rgba(0,0,0,.2);
              i {
                font-size: 12px;
                margin-top: 11px;
                transform: rotate(-45deg) scale(.8);
                color: #fff;
              }
            }
          }
          .card-info {
            padding: 14px;
            position: relative;
            .favorite {
              cursor: pointer;
              float: right;
            }
            .fav {
              color: #FF0000;
            }
            span {
              display: block;
              width: 100%;
              font-size: 12px;
            }
            .btns {
              display: inline-block;
              float: right;
            }
          }
        }
      }
    }
  }

  .product_toolbar {
    .settle_button {
      float: right;
      margin-left: 10px;
    }
    #pagination {
      float: right;
    }
  }

  .v-bottom-tab {
    width: calc(100% - 60px);
    height: 200px;
    position: fixed;
    bottom: 0;
    background: #fff;
    border-radius: 2px;
    box-shadow: 0 1px 3px rgba(0,0,0,.3);
    box-sizing: border-box;
    .mainInfo {
      width: 100%;
      height: 100%;
      position: relative;
      .v-bottom-tab-close {
        cursor: pointer;
        color: #000;
        font-size: 14px;
        position: absolute;
        padding: 20px;
      }
      .img {
        width: 200px;
        height: 200px;
        float: left;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .list {
        width: calc(100% - 200px);
        height: 100%;
        overflow: auto;
        float: left;
        .list_table {
          width: 100%;
          .tooltip {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }

  .settle_dialog {
    .settle_dialog_table {
      img {
        width: 100px;
        height: 100px;
        margin: 4px auto;
      }
    }
    .v-dialog-foot {
      margin-top: 15px;
      width: 100%;
      overflow: hidden;
      .totalPrice {

      }
      .btns {
        .report {
          float: left;
        }
        .save {
          float: right;
        }
        .newFile {
          float: right;
          margin-right: 10px;
        }
      }
      .isShowSimilar {
        float: right;
        padding: 10px;
        cursor: pointer;
        clear: both;
      }
    }
    .similar-wrapper {
      width: 100%;
      height: 120px;
      border: 1px solid #ccc;
      margin-top: 10px;
      /*overflow-x: scroll;*/
      p {
        font-size: 20px;
        text-align: center;
        line-height: 120px;
        margin: 0;
      }
      .similar-item {
        width: 100px;
        height: 100px;
        float: left;
        margin: 10px;
        .similarImg {
          display: inline-block;
          width: 100%;
          height: 100%;
          background-size: 178% 100%;
          background-repeat: no-repeat;
          background-position: center;
        }
      }
    }
  }



.proViewUp {
  padding-bottom: 205px;
}
.proViewDown {
  padding-bottom: 0;
}

.mainImageBody {
  width: 100%;
  height: 0;
  padding-bottom: 56.25%;
  position: relative;
  .mySwiper {
    width: 100%;
    height: 100%;
    position: absolute !important;
  }
  .width {
    width: 100%;
    height: 100%;
    background-position: center;
    background-size: 100%;
    background-repeat: no-repeat;
  }
  .height {
    height: 100%;
    background-position: center;
    background-size: auto 100%;
    background-repeat: no-repeat;
  }
}

/*相似产品*/






</style>
