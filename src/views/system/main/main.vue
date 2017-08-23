<template lang="html">
  <section>
    <el-row class="main_info_view">
      <el-col :span="18">
        <el-row>
          <el-col class="self_info_wrap" :span="16">
            <e-box class="self_info" title="我的信息">
              <div class="info-wrap">
                <div class="info-item-left">
                  <div class="info-avatar">
                    <img :src="avatarUrl" alt="">
                  </div>
                </div>

                <div class="info-item-right">
                  <div class="info-right-head">
                    <span class="info-name">
                      <h1>
                        {{user.user}}
                        <i class="fa sexIcon" :class="user.sex == 1 ? 'fa-mars' : 'fa-venus'"></i>
                      </h1>
                    </span>
                    <span class="info-edit">
                      <el-button size="small" @click="handleEdit">编辑个人信息</el-button>
                    </span>
                  </div>
                  <div class="info-right-body">
                    <div class="info-right-main">
                      <p><span>邮箱：</span>{{user.mail}}</p>
                      <p><span>手机：</span>{{user.tel}}</p>
                      <p><span>公司：</span>{{user.agent}}</p>
                    </div>
                  </div>
                </div>
              </div>
            </e-box>
          </el-col>

          <el-col :span="8">
            <e-box class="self_resource" title="我的资源">
              <e-tag style="marginTop: 14px;" title="代金券" :num="user.coupon" unit="张"></e-tag>
              <e-tag style="marginTop: 10px;" title="商城积分" :num="user.points"></e-tag>
              <e-tag style="marginTop: 10px;" title="设计积分" :num="user.dpoints"></e-tag>
            </e-box>
          </el-col>

          <el-col v-if="schemeVisible" :span="24">
            <el-tabs type="border-card" @tab-click="tabChange">
              <el-tab-pane class="self_scheme" label="我的方案">
                <div class="create_Scheme">
                  <el-button type="primary" @click="createScheme">创建方案</el-button>
                </div>

                <div class="mySchemes">
                  <el-row>
                    <el-col
                      class="schemes_wrap"
                      :span="5"
                      v-for="(item, index) in schemes"
                      :offset="index % 4 == 0 ? 0 : 1"
                      :key="index"
                      >
                      <el-card
                        class="scheme_cards"
                        :body-style="{ padding: '0px' }"
                        >
                        <div
                          class="schemeLink"
                          :style="item.imgurl ? `background-image: url(${item.imgurl}-prolow?rnd=${parseInt(Math.random() * 1000)})` : ''"
                          @click="schDetailShow(item, 1)"
                          >
                        </div>
                        <div class="card-info">
                          <span class="textOverflow scheme_name">{{item.name}}</span>
                          <span class="editBtns">
                            <el-button @click="editMyScheme(item)" type="text">编辑</el-button>
                            <el-button @click="deleteMyScheme(item)" type="text">删除</el-button>
                          </span>
                        </div>
                      </el-card>
                    </el-col>
                  </el-row>
                </div>
                <div style="margin-top: 10px;">
                  <el-pagination
                    small
                    id="pagination"
                    layout="prev, pager, next"
                    :current-page="page"
                    @current-change="handleCurrentChange"
                    :page-size="8"
                    :total="total"
                    style="float: right;"
                    >
                  </el-pagination>
                </div>
              </el-tab-pane>
              <el-tab-pane class="self_material" label="我的素材">
                <header class="create_material">
                  <el-button @click.native="toMaterialUpload" type="primary">
                    素材上传
                  </el-button>
                </header>
                <div class="myMaterials">
                  <el-row>
                    <el-col
                      class="materials_wrap"
                      :span="5"
                      v-for="(item, index) in materials"
                      :offset="index % 4 == 0 ? 0 : 1"
                      :key="index"
                      >
                      <el-card
                        class="material_cards"
                        :body-style="{ padding: '0px' }"
                        >
                        <div
                          class="materialLink"
                          :style="`background-image: url(${item.PictureAddress})`"
                          @click="materialDetailShow(item)"
                          >
                        </div>
                        <div class="card-info">
                          <span class="textOverflow material_name">{{item.Title}}</span>
                          <span class="editBtns">
                            <el-button @click="editMyMaterial(item)" type="text">编辑</el-button>
                            <el-button @click="deleteMyMaterial(item)" type="text">删除</el-button>
                          </span>
                        </div>
                      </el-card>
                    </el-col>
                  </el-row>
                </div>

                <div style="margin-top: 10px;">
                  <el-pagination
                    small
                    id="pagination"
                    layout="prev, pager, next"
                    :current-page="matPage"
                    @current-change="materialCurrentChange"
                    :page-size="8"
                    :total="matTotal"
                    style="float: right;"
                    >
                  </el-pagination>
                </div>
              </el-tab-pane>
              <el-tab-pane  class="self_customers" label="我的客户">
                <header class="create_customer">
                  <el-button type="primary" @click="createCustomer">创建客户</el-button>
                  <el-radio-group
                    @change="customerRadioSelect"
                    class="customer_radio_g"
                    v-model="customerRadio"
                    >
                    <el-radio :label="0">全部订单</el-radio>
                    <el-radio :label="1"><i class="fa fa-circle completed"></i> 完成订单</el-radio>
                    <el-radio :label="2"><i class="fa fa-circle uncompleted"></i> 待办订单</el-radio>
                    <el-radio :label="3"><i class="fa fa-circle temporary"></i> 潜在订单</el-radio>
                  </el-radio-group>
                </header>
                <div class="myCustomers">
                  <div class="customers_wrap">
                    <el-table :data="customerTableData">
                      <el-table-column align="center" width="120" :formatter="dateFilter" prop="createDate" label="创建日期" sortable></el-table-column>
                      <el-table-column align="center" width="100" prop="customer" label="称呼" sortable></el-table-column>
                      <el-table-column align="center" width="130" prop="tel" label="手机"></el-table-column>
                      <el-table-column align="center" width="100" prop="brand" sortable label="品牌"></el-table-column>
                      <el-table-column align="center" prop="status" min-width="40" label="状态">
                        <template scope="scope">
                          <i class="fa fa-circle" :class="[scope.row.status == 1 ? 'completed' : scope.row.status == 0 ? 'uncompleted' : 'temporary']"></i>
                        </template>
                      </el-table-column>
                      <el-table-column align="center" width="80" label="详情">
                        <template scope="scope">
                          <el-button
                            size="small"
                            type="primary"
                            @click="showCustomerInfo(scope.row)"
                            >
                            查看
                          </el-button>
                        </template>
                      </el-table-column>
                      <el-table-column align="center" width="80" label="方案">
                        <template scope="scope">
                          <el-button
                            size="small"
                            type="primary"
                            @click="showCustomerSchemes(scope.row.schemes, scope.row.oid)"
                            >
                            方案
                          </el-button>
                        </template>
                      </el-table-column>
                      <el-table-column align="center" width="80" label="清单">
                        <template scope="scope">
                          <el-button
                            size="small"
                            type="primary"
                            @click="showCustomerProducts(scope.row)"
                            :disabled="scope.row.examine == 1 ? true : false"
                            >
                            清单
                          </el-button>
                        </template>
                      </el-table-column>
                      <el-table-column align="center" width="80" label="更多">
                        <template scope="scope">
                          <el-button
                            size="small"
                            type="primary"
                            @click="showCustomerMore(scope.row)"
                            :disabled="scope.row.examine == 1 ? true : false"
                            >
                            编辑
                          </el-button>
                        </template>
                      </el-table-column>
                      <el-table-column align="center" width="80" label="删除">
                        <template scope="scope">
                          <el-button
                            size="small"
                            type="danger"
                            @click="deleteCustomerRow(scope.row)"
                            >
                            删除
                          </el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane class="self_collection" label="我的收藏">
                <div class="myCollect">
                  <el-row>
                    <el-col
                      class="collect_wrap"
                      :span="5"
                      v-for="(item, index) in collect"
                      :offset="index % 4 == 0 ? 0 : 1"
                      :key="index"
                      >
                      <el-card class="scheme_cards" :body-style="{ padding: '0px' }">
                        <div
                          @click="schDetailShow(item, 1)"
                          class="schemeLink"
                          :style="item.imgurl ? `background-image: url(${item.imgurl}-prolow)` : ''"
                          >
                        </div>
                        <div class="card-info">
                          <span class="textOverflow name">{{item.name}}</span>
                          <span class="textOverflow designer">
                            {{item.designer}}
                            <el-button style="float: right;" @click="cancelCollect(index, item.projectid, 1)" type="text">取消</el-button>
                          </span>
                        </div>
                      </el-card>
                    </el-col>
                  </el-row>
                </div>
              </el-tab-pane>

              <!-- 订单审核 -->

              <el-tab-pane class="order_audit" label="订单审核" v-if="orderVisible">
                <header class="order_audit_head">
                  <el-radio-group @change="searchOrderList" v-model="auditRadio">
                    <el-radio :label="0">未审核</el-radio>
                    <el-radio :label="1">已审核</el-radio>
                  </el-radio-group>
                </header>
                <div class="order_audit_body">
                  <el-table :data="orderAuditTable">
                    <el-table-column align="center" width="150" prop="oid" label="订单号"></el-table-column>
                    <el-table-column align="center" width="100" prop="customer" label="客户"></el-table-column>
                    <el-table-column align="center" width="130" prop="tel" label="手机"></el-table-column>
                    <el-table-column align="center" width="130" prop="wechat" label="微信"></el-table-column>
                    <el-table-column align="center" width="100" prop="brand" label="品牌"></el-table-column>
                    <el-table-column align="center" min-width="100" prop="sellername" label="销售"></el-table-column>
                    <el-table-column align="center" width="80" label="详情">
                      <template scope="scope">
                        <el-button
                          size="small"
                          type="primary"
                          @click="showCustomerInfo(scope.row)"
                          >
                          查看
                        </el-button>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" width="100" label="审核">
                      <template scope="scope">
                        <el-button
                          size="small"
                          type="primary"
                          @click="auditShow(scope.row)"
                          :disabled="scope.row.examine == 1 ? true : false"
                          >
                          {{scope.row.examine == 1 ? '已审核' : '审核'}}
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </el-tab-pane>
            </el-tabs>

          </el-col>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row style="paddingLeft: 10px;">
          <el-col :span="24">
            <el-tabs type="border-card" style="height: 200px;">
              <el-tab-pane class="new_schemes_notice" label="方案公告">
                <p
                  @click="schDetailShow(item, 1)"
                  class="new_scheme_link textOverflow"
                  v-for="item in newSchemes"
                  :key="item.ID"
                >
                <span class="date">{{item.date}}</span>
                <span class="content">方案{{item.name}}已上传！</span>
              </p>
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>

        <!-- 销量排行榜 -->


        <!-- <el-row class="ranking_wrap">
          <el-col :span="24">
            <el-tabs type="border-card">
              <el-tab-pane label="产品销量">
                <p
                  class="productsRnak textOverflow"
                  v-for="(item, index) in salesCharts"
                  @click="productsRankShow(item)"
                >
                <span class="ranking" :class="index < 3 ? 'rankTop' : 'rankBottom'">{{index + 1}}</span>
                <span class="rankname">{{item.brand}}{{item.name}}({{item.submodel}})</span>
              </p>
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row> -->
      </el-col>
    </el-row>


  <!-- 弹层 -->


  <!-- 产品销量排行榜详情弹层 -->
  <el-dialog title="详情"
    :modal-append-to-body="false"
    v-model="productsRankVisible"
    >
    <img style="width: 100%;" :src="productsRankData.urlimg" alt="">
    <el-table :data="productsRankArr">
      <el-table-column align="center" label="型号" prop="submodel"></el-table-column>
      <el-table-column align="center" label="品牌" prop="brand"></el-table-column>
      <el-table-column align="center" label="品名" prop="name"></el-table-column>
      <el-table-column align="center" label="价格" prop="price"></el-table-column>
      <el-table-column align="center" label="尺寸" prop="size"></el-table-column>
      <el-table-column align="center" label="材质" prop="material"></el-table-column>
    </el-table>
  </el-dialog>
  <!--个人信息编辑界面-->
  <el-dialog title="编辑" :modal-append-to-body="true" v-model="editFormVisible" :close-on-click-modal="false">
    <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
      <el-form-item label="头像上传">
        <el-upload
          class="avatar-uploader"
          action="/api/Avatar/avatarUpload.php"
          :show-file-list="false"
          :data="avatarData"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="avatarUrl" :src="avatarUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
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
      <el-form-item label="公司" prop="agent">
        <el-input v-model="editForm.agent"></el-input>
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


  <!-- 方案编辑 -->
  <el-dialog
    title="编辑"
    v-model="editSchemeFormVisible"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    >
    <!-- <div class="schemeUpload" style="margin-bottom: 15px;">
      <div class="uploadLabel">
        上传
      </div>
      <el-upload
        action="/api/Avatar/scheme/schemeUpload.php"
        list-type="picture-card"
        :before-upload="beforeSchemeUpload"
        :on-preview="schemeUploadPreview"
        :on-remove="schemeRemove"
        :on-success="schemeUploadSuccess"
        :data="schemeUploadData"
        ref="upload"
        >
        <i class="el-icon-plus"></i>
      </el-upload>
    </div> -->
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
          v-model="developerSelect"
          @change="developersChange">
        </el-cascader>
      </el-form-item>
      <el-form-item prop="room" label="房间">
        <el-select v-model="roomSelect" placeholder="请选择">
          <el-option
            v-for="room in rooms"
            :label="room"
            :value="room"
            @click.native="roomChange"
            :key="room"
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

  <!-- 素材详情 -->
  <el-dialog
    title="详情"
    v-model="materialDetailVisible"
    >
    <header><img style="width: 100%;" :src="materialDetailInfo.PictureAddress" alt=""></header>
  </el-dialog>

  <!-- 素材编辑 -->
  <el-dialog
    title="编辑"
    v-model="editMaterialFormVisible"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    >
    <el-form
      class="materialEditForm"
      :model="editMaterialForm"
      label-width="80px"
      :rules="editMaterialFormRules"
      ref="editMaterialForm"
      >
      <el-form-item label="标题">
        <el-input v-model="editMaterialForm.Title"></el-input>
      </el-form-item>
      <el-form-item label="内容">
        <el-input :row="3" type="textarea" v-model="editMaterialForm.Article"></el-input>
      </el-form-item>
      <el-form-item label="来源">
        <el-input v-model="editMaterialForm.Source"></el-input>
      </el-form-item>
      <el-form-item label="类型">
        <el-select
          v-model="typeSelect"
          placeholder="请选择"
          >
         <el-option
           v-for="item in matTypes"
           :label="item"
           :value="item"
           :key="item"
           >
         </el-option>
       </el-select>
      </el-form-item>
      <el-form-item label="标签">
        <el-input v-model="tagInput" placeholder="按回车自动生成标签" @keyup.enter.native="newTag"></el-input>
        <el-tag
          v-for="(tag, index) in classify"
          :key="index"
          :closable="true"
          type="primary"
          @close="closeTag(index)"
          style="margin-right: 5px;"
        >
        {{tag}}
        </el-tag>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="editMaterialFormVisible = false">取消</el-button>
      <el-button type="primary" @click.native="materialEditSubmit" :loading="materialEditLoading">提交</el-button>
    </div>
  </el-dialog>

  <!-- 创建个人客户 -->
  <el-dialog
    title="创建客户"
    :modal-append-to-body="false"
    v-model="createCustomerVisible"
    :close-on-click-modal="false"
    >
    <el-form
      :model="createCustomerForm"
      :rules="createCustomerFormRules"
      ref="createCustomerForm"
      label-width="80px"
      >
      <el-form-item label="姓名" prop="name">
        <el-input v-model="createCustomerForm.name" placeholder="客户姓名"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="tel">
        <el-input v-model="createCustomerForm.tel" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item label="微信">
        <el-input v-model="createCustomerForm.wx" placeholder="微信号"></el-input>
      </el-form-item>
      <el-form-item label="楼盘">
        <el-input v-model="createCustomerForm.building"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="createCustomerForm.mark" type="textarea"></el-input>
      </el-form-item>
    </el-form>
    <el-form :model="createCustomerForm" label-width="80px" inline>
      <el-form-item label="品牌">
        <el-select v-model="createCustomerForm.brand" placeholder="请选择">
           <el-option
            v-for="item in brands"
            :label="item"
            :value="item"
            :key="item"
            >
           </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="createCustomerForm.status" placeholder="请选择">
          <el-option label="完成订单" value="1"></el-option>
          <el-option label="待办订单" value="0"></el-option>
          <el-option label="潜在订单" value="-1"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="createCustomerVisible = false">取消</el-button>
      <el-button type="primary" @click.native="createCustomerSubmit" :loading="createCustomerLoading">提交</el-button>
    </div>
  </el-dialog>

  <!-- 编辑个人客户信息 -->
  <el-dialog
    title="订单编辑"
    :modal-append-to-body="false"
    v-model="editCustomerVisible"
    :close-on-click-modal="false"
    >
    <!-- <header>
      <p>订单号：{{editCustomerForm.oid}} <span>创建日期：{{editCustomerForm.createDate}}</span></p>
    </header> -->
    <el-form
      :model="editCustomerForm"
      rules="editCustomerFormRules"
      ref="editCustomerForm"
      label-width="80px"
      >
      <el-form-item label="姓名" prop="name">
        <el-input v-model="editCustomerForm.customer" placeholder="客户姓名"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="tel">
        <el-input v-model="editCustomerForm.tel" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item label="微信">
        <el-input v-model="editCustomerForm.wechat" placeholder="微信号"></el-input>
      </el-form-item>
      <el-form-item label="楼盘">
        <el-input v-model="editCustomerForm.building" placeholder="楼盘信息"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="editCustomerForm.mark" type="textarea"></el-input>
      </el-form-item>
    </el-form>
    <el-form :model="editCustomerForm" label-width="80px" inline>
      <el-form-item label="品牌">
        <el-select v-model="editCustomerForm.brand" placeholder="请选择">
           <el-option
            v-for="item in brands"
            :label="item"
            :value="item"
            :key="item"
            >
           </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="editCustomerForm.status" placeholder="请选择">
          <el-option label="完成订单" value="1"></el-option>
          <el-option label="待办订单" value="0"></el-option>
          <el-option label="潜在订单" value="-1"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="editCustomerVisible = false">取消</el-button>
      <el-button type="primary" @click.native="editCustomerSubmit" :loading="editCustomerLoading">提交</el-button>
    </div>
  </el-dialog>

  <!-- 客户产品清单 -->
  <el-dialog
    title="清单"
    :modal-append-to-body="false"
    v-model="productsListVisible"
    :close-on-click-modal="false"
    size="large"
    >
    <el-table :data="productsList">
      <el-table-column align="center" width="136" label="图片">
        <template scope="scope">
          <img style="width: 100%; margin-top: 5px;" :src="scope.row.urlimg" alt="">
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
    <div class="totalPrice">
      <p>总价：{{totalPrice | currencyFilter}}</p>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button style="float:left" type="success" @click="reportExcel">导出EXCEL</el-button>
      <el-button @click.native="productsListVisible = false">取消</el-button>
      <el-button type="primary" @click.native="saveProductsList" :loading="productsListLoading">保存</el-button>
    </div>
  </el-dialog>

  <!-- 客户方案收藏列表 -->

  <el-dialog
    title="方案"
    v-model="schemesListVisible"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    size="large"
    >
    <el-row>
      <el-col
        class="scheme_thumbs"
        :sm="24"
        :md="12"
        :lg="8"
        v-for="(item, index) in schemesList"
        :key="index"
      >
      <el-card class="scheme_thumbs_cards" :body-style="{ padding: '0px' }">
        <div
          @click="schDetailShow(item, 0)"
          class="schemeLink"
          :style="item.imgurl ? `background-image: url(${item.imgurl}-prolow)` : ''"
          >
        </div>
        <div class="card-info">
          <span class="textOverflow name">{{item.name}}</span>
          <span class="textOverflow designer">
            {{item.designer}}
            <el-button style="float: right;" @click="cancelCollect(index, item.projectid, 0)" type="text">取消</el-button>
          </span>
        </div>
      </el-card>
      </el-col>
    </el-row>
  </el-dialog>

  <!-- 方案详情 -->
  <el-dialog
    v-model="schDetailVisiable"
    :modal-append-to-body="false"
    @close="closeSchDetail"
    >
    <div class="schDetail-wrap">
      <header class="schDetail-head">
        <div
          class="detail_link"
          :style="schDetailInfo.imgurl ? `background-image: url(${schDetailInfo.imgurl})` : ''"
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

  <el-dialog
    title="详情"
    v-model="customerInfoVisible"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    size="large"
    >
    <header class="customer_order_header">
      <p class="order_list_num">
        <span style="float: right">订单号：<i style="text-decoration: underline">{{customerInfoData.oid}}</i></span>
      </p>
    </header>
    <el-table :data="customerInfoTable" style="margin-bottom: 10px;">
      <el-table-column align="center" prop="createDate" label="创建日期"></el-table-column>
      <el-table-column align="center" prop="finishDate" label="结算日期"></el-table-column>
      <el-table-column align="center" prop="customer" label="客户"></el-table-column>
      <el-table-column align="center" prop="tel" label="手机"></el-table-column>
      <el-table-column align="center" prop="wechat" label="微信"></el-table-column>
      <el-table-column align="center" prop="brand" label="品牌"></el-table-column>
      <el-table-column align="center" label="状态">
        <template scope="scope">
          {{scope.row.status == 1 ? '完成订单' : scope.row.status == 0 ? '待办订单' : '潜在订单'}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="审核">
        <template scope="scope">
          {{scope.row.examine == 1 ? '已审核' : '未审核'}}
        </template>
      </el-table-column>
    </el-table>
    <el-table :data="productsList" v-loading.body="customerInfoListLoading">
      <el-table-column align="center" prop="name" label="名称"></el-table-column>
      <el-table-column align="center" prop="submodel" label="型号"></el-table-column>
      <el-table-column align="center" prop="brand" label="品牌"></el-table-column>
      <el-table-column align="center" prop="room" label="区域"></el-table-column>
      <el-table-column align="center" prop="num" label="数量"></el-table-column>
      <el-table-column align="center" :formatter="currencyFilter" prop="price" label="单价"></el-table-column>
      <el-table-column align="center" :formatter="currencyFilter" prop="totalPrice" label="总价"></el-table-column>
    </el-table>
    <footer>
      <p><span class="title">楼盘信息：</span>{{customerInfoData.building}}</p>
      <p><span class="title">备注：</span>{{customerInfoData.mark | spaceReplace}}</p>
    </footer>
  </el-dialog>


  <el-dialog
    title="订单审核"
    v-model="orderAuditVisible"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    size="small"
    >
    <div class="step">
      <el-steps :space="100" :active="orderActive" finish-status="success">
        <el-step title="step 1" description="订金预付阶段"></el-step>
        <el-step title="step 2" description="尾款付款阶段"></el-step>
      </el-steps>
    </div>
    <div class="order_content">
      <div class="depositStep" v-if="orderActive == 0">
        订金：<el-input v-model="deposit" placeholder="请输入订金金额"></el-input>
      </div>
      <div class="retainageStep" v-if="orderActive == 1">
        尾款：<el-input v-model="retainage" placeholder="请输入尾款金额"></el-input>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="orderAuditVisible = false">取消</el-button>
      <el-button
        type="primary"
        :disabled="(orderActive == 0 && deposit == '') || (orderActive == 1 && retainage == '') || (orderActive  > 1)"
        @click.native="saveStep"
        >
        保存
      </el-button>
    </div>
  </el-dialog>
  </section>
</template>

<script>
import { schemeNotice, productsRank, getUserListPage, editUser, schemeUpload, getFilter, addScheme, getSchemes, editScheme, removeScheme, getMaterials,editMaterial, removeMaterial, getCustomers, addCustomer, editCustomer,getCustomerProducts, saveProducts, getCustomerSchemes, removeCustomerScheme, getMySchemesCollect, getModelList, getOrderList, orderAudit, sendMsg, removeCustomer } from '../../../api/api'
import util from '../../../common/js/util.js'
import EBox from '../../../components/box/box'
import ETag from '../../../components/tag/tag'
import EDialog from '../../../components/dialog/dialog'
import qs from "qs"
export default {
  data () {
    return {
      user: {},
      salesCharts: [],
      productsRankVisible: false,
      productsRankData: {},
      productsRankArr: [],
      newSchemes: [],
      rooms: [],
      brands: [],
      roomSelect: '',
      developers: [],
      developerSelect: [],
      editForm: {},
      editFormVisible: false,
      editLoading: false,
      avatarUrl: '',
      avatarData: {},
      editFormRules: {
        // user: [
        //   { required: true, message: '请输入姓名', trigger: 'blur' }
        // ],
        pass: [
          { required: true, message: '请输入密码' }
        ],
        mail: [
          { required: true, message: '请输入邮箱地址' },
          { type: 'email', message: '请输入正确的邮箱地址' }
        ],
        tel: [
          { required: true, message: '请输入手机' }
        ]
      },
      schemeUploadData: {},
      schemeVisible: true,
      schemes: [],
      editSchemeFormVisible: false,
      editSchemeForm: {},
      schemeEditLoading: false,
      editSchemeFormRules: {
        name: [
          { required: true, message: '方案名不能为空！' }
        ],
        room: [
          { required: true, message: '请选择房间' }
        ]
      },
      materials: [],
      matTypes: [],
      classify: [],
      typeSelect: '',
      tagInput: '',
      editMaterialFormVisible: false,
      editMaterialForm: {},
      editMaterialFormRules: {

      },
      materialEditLoading: false,
      materialDetailVisible: false,
      materialDetailInfo: {},
      customerRadio: 0,
      customerInfoVisible: false,
      customerInfoData: {},
      customerInfoTable: [],
      customerTableData: [],
      createCustomerVisible: false,
      createCustomerLoading: false,
      createCustomerForm: {
        name: '',
        tel: '',
        wx: '',
        brand: '',
        building: '',
        status: '',
        mark: ''
      },
      createCustomerFormRules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        tel: [{ required: true, message: '请输入手机号', trigger: 'blur' }]
      },
      editCustomerVisible: false,
      editCustomerLoading: false,
      editCustomerForm: {},
      editCustomerFormRules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        tel: [{ required: true, message: '请输入手机号', trigger: 'blur' }]
      },
      productsList: [],
      productsListVisible: false,
      customerProid: '',
      productsListLoading: false,
      totalPrice: 0,
      schemesList: [],
      schemesListVisible: false,
      schemeShowOid: '',
      schemesListLoading: false,
      collect: [],
      schDetailVisiable: false,
      isCustomerSch: false,
      schDetailInfo: {},
      schDetailModelList: [],
      priceListLoading: false,
      customerInfoListLoading: false,
      auditRadio: 0,
      orderAuditTable: [],
      orderAuditVisible: false,
      orderAuditRow: {},
      orderActive: 0,
      orderVisible: false,
      deposit: '',
      retainage: '',
      page: 1,
      total: 0,
      matPage: 1,
      matTotal: 0,
      dialogImageUrl: '',
      dialogVisible: false,
      videoVisible: false,
      showViewWay: false,
    }
  },
  methods: {
    tabChange (e) {
      if (e.index == 2) {
        this.getMyCustomers()
      }else if (e.index == 4) {
        this.getMyOrderList()
      }
    },
    getUser () {
      var user = sessionStorage.getItem('user')
      if (user) {
        user = JSON.parse(user)
        let para = { uid: user.id, name: user.name }
        getUserListPage(para).then(res => {
          this.user = res.data.users[0]
          this.user.avatar = user.avatar
          this.avatarUrl = `${this.user.avatar}?rnd=${parseInt(Math.random() * 1000)}`
          let pos = this.user.position.split(';')
          this.user.keys.indexOf('root') == -1 ? this.orderVisible = false : this.orderVisible = true
          // for (let i of pos) {
          //   if (i == '设计') this.schemeVisible = true
          // }
        })
      }
    },
    getProductsRank () {
      productsRank().then(res => {
        this.salesCharts = res.data
      })
    },
    productsRankShow (row) {
      this.productsRankArr = []
      this.productsRankArr[0] = row
      this.productsRankData = row
      this.productsRankVisible = true
    },
    getNewSchemes () {
      schemeNotice().then(res => {
        this.newSchemes = res.data
      })
    },
    handleEdit () {
      this.avatarData = { uid: this.user.ID }
      this.editForm =  Object.assign({}, this.user)
      this.editForm.position = this.editForm.position.split(';')
      this.editFormVisible = true
    },
    // 头像上传
    handleAvatarSuccess(res, file) {
      this.avatarUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    // 编辑信息
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
            this.getUser()
            this.avatarUrl = `${this.user.avatar}?rnd=${parseInt(Math.random() * 1000)}`
          })
        }
      });
    },
    // 方案创建
    createScheme () {
      this.$prompt('请输入方案名', '提示', {
        confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: '',
          inputValidator: function (val) {
            if (!val) return '方案名不能为空！'
          }
      }).then(({value}) => {
        let para = { projectid: Date.parse(new Date()) / 1000, designer: this.user.user, name: value }
        let params = { para }
        addScheme(qs.stringify(params)).then(res => {
          let { code, msg } = res
          if (code == 200) {
            this.$message({
              type: 'success',
              message: msg
            })
            this.getMySchemes()
          }
        })
      }).catch(() => {
        this.$message({
            type: 'info',
            message: '取消输入'
          });
      })
    },
    getMySchemes () {
      var user = JSON.parse(sessionStorage.getItem('user'))
      let para = { developers: user.name, page: this.page}
      getSchemes(para).then(res => {
        if (res.data.length > 0) {
          this.schemes = res.data
          this.total = res.data[0].total
        }else {
          this.schemes = []
          this.total = 0
        }
      })
    },
    // 显示方案编辑页面
    editMyScheme (item) {
      this.editSchemeForm = Object.assign({}, item)
      if (item. D1 == 0) {
        this.developerSelect = []
      }else {
        this.developerSelect = [item.D1, item.D2]
      }
      if (this.editSchemeForm.visibility == 0) this.editSchemeForm.visibility = false
        else this.editSchemeForm.visibility = true

      let projectid = item.projectid
      this.schemeUploadData = { projectid }
      this.roomSelect = item.room
      this.editSchemeFormVisible = true
    },

    developersChange (val) {
      this.editSchemeForm.D1 = val[0]
      this.editSchemeForm.D2 = val[1]
    },
    roomChange () {
      this.editSchemeForm.room = this.roomSelect
    },
    // 方案编辑提交
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
            this.getMySchemes()
          })
        }
      });
    },
    // 方案删除
    deleteMyScheme (item) {
      this.$confirm('确认删除该方案吗？', '提示', {
        type: 'warning'
      }).then(() => {
        let para = { projectid: item.projectid }
        removeScheme(para).then(res => {
          let { code, msg } =res.data
          if (code == 200) {
            this.$message({
              message: msg,
              type: 'success'
            })
            this.getMySchemes()
          }
        })
      }).catch( () => {
        this.$message({
            type: 'info',
            message: '取消删除'
          });
      })
    },
    // 方案上传页面
    toMaterialUpload () {
      let user = sessionStorage.getItem('user')
      localStorage.setItem('user', user)
      window.open('/picture/upload.html')
    },
    // 分页选择
    handleCurrentChange(val) {
      this.page = val;
      this.getMySchemes();
    },
    materialCurrentChange(val) {
      this.matPage = val
      this.getMyMaterials()
    },
    beforeSchemeUpload (file) {
      let projectid = this.editSchemeForm.projectid
      this.schemeUploadData = { projectid }
    },
    schemeUploadPreview (file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    schemeUploadSuccess (res, file, fileList) {

    },
    schemeRemove () {
      this.$refs.upload.clearFiles()
    },
    getMyMaterials () {
      var user = JSON.parse(sessionStorage.getItem('user'))
      let para = { uid: user.id, page: this.matPage }
      getMaterials(para).then(res => {
        if (res.data.length > 0) {
          this.materials = res.data
          this.matTotal = res.data[0].total
        }else {
          this.materials = []
          this.matTotal = 0
        }
      })
    },
    materialDetailShow(item) {
      this.materialDetailInfo = item
      this.materialDetailVisible = true
    },
    // 打开素材编辑页面
    editMyMaterial (item) {
      this.editMaterialForm = Object.assign({}, item)
      if (this.editMaterialForm.classify == '#' || this.editMaterialForm.classify == '') this.classify = []
      else this.classify = this.editMaterialForm.classify.split('#')
      this.typeSelect = this.editMaterialForm.type
      this.editMaterialFormVisible = true
    },
    // 添加标签
    newTag () {
      this.classify.push(this.tagInput)
      this.tagInput = ''
    },
    // 删除标签
    closeTag (index) {
      this.classify.splice(index, 1)
    },
    // 素材编辑提交
    materialEditSubmit () {
      this.materialEditLoading = true
      this.editMaterialForm.classify = this.classify.join('#')
      this.editMaterialForm.type = this.typeSelect
      let para = Object.assign({}, this.editMaterialForm)
      let params = { para }
      editMaterial(qs.stringify(params)).then(res => {
        this.materialEditLoading = false
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
        this.editMaterialFormVisible = false
        this.getMyMaterials()
      })
    },
    deleteMyMaterial (item) {
      this.$confirm('确认删除该素材吗？', '提示', {
        type: 'warning'
      }).then(() => {
        let para = { mid: item.id }
        removeMaterial(para).then(res => {
          let { code, msg } =res.data
          if (code == 200) {
            this.$message({
              message: msg,
              type: 'success'
            })
            this.getMyMaterials()
          }
        })
      }).catch( () => {
        this.$message({
            type: 'info',
            message: '取消删除'
          });
      })
    },

    // 我的客户
    getMyCustomers () {
      var user = JSON.parse(sessionStorage.getItem('user'))
      let para = { uid: user.id, select: this.customerRadio, all: 1 }
      getCustomers(para).then(res => {
        if (res.data.length > 0) this.customerTableData = res.data
        else this.customerTableData = []
      })
    },
    createCustomer () {
      this.createCustomerForm = {
        name: '',
        tel: '',
        wx: '',
        brand: '',
        building: '',
        status: '',
        mark: ''
      }
      this.createCustomerVisible = true
    },
    createCustomerSubmit () {
      this.$refs.createCustomerForm.validate((valid) => {
        if (valid) {
          this.createCustomerLoading = true
          let para = Object.assign({}, this.createCustomerForm)
          para.uname = this.user.user
          para.uid = this.user.ID
          let params = { para }
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
            this.$refs['createCustomerForm'].resetFields()
            this.createCustomerLoading = false
            this.createCustomerVisible = false
            this.getMyCustomers()
          })
        }
      });
    },
    customerRadioSelect () {
      this.getMyCustomers()
    },
    showCustomerInfo (row) {
      this.customerInfoTable = []
      this.customerInfoTable[0] = row
      this.customerInfoData = row
      this.customerInfoVisible = true
      this.customerInfoListLoading = true
      let para = {products: row.products, type: 1}
      let roomsObj = row.rooms == '' ? {} : JSON.parse(row.rooms)
      getCustomerProducts(para).then(res => {
        for (let i of res.data) i.room = roomsObj[i.ID]
        this.productsList = res.data
        this.customerInfoListLoading = false
      })
    },
    showCustomerProducts (row) {
      this.totalPrice = 0
      let para = { products: row.products, type: 0 }
      this.customerProid = row.oid
      let roomsObj = row.rooms == '' ? {} : JSON.parse(row.rooms)
      getCustomerProducts(para).then(res => {
        for (let i of res.data) {
          this.totalPrice += i.totalPrice
          i.room = roomsObj[i.ID]
        }
        this.productsList = res.data
        this.productsListVisible = true
      })
    },
    // 价格过滤
    currencyFilter (row, column) {
      let val = row[column.property]
      if (val != undefined) return (val + '').split("").reverse().join("").replace(/(\d{3})(?=[^$])/g, "$1,").split("").reverse().join("");
    },
    // 日期过滤
    dateFilter (row, column) {
      let val = row[column.property]
      return val.substring(0, 10)
    },
    // 减少个数
    decrease (row,num) {
      num -= 0
      if(num > 1) {
        num -= 1
        row.num = num
        let price = row.price - 0
        this.totalPrice  -= price
      }else if (num == 1) {
        let index = this.productsList.indexOf(row)
        this.productsList.splice(index, 1)
        this.totalPrice -= row.num * row.price
      }
    },
    // 增加个数
    increase (row,num) {
      num -= 0
      num += 1
      row.num = num
      let price = row.price - 0
      this.totalPrice  += price

    },
    removeSingle (row) {
      let index = this.productsList.indexOf(row)
      this.productsList.splice(index, 1)
      this.totalPrice -= row.num * row.price
    },
    // 保存产品清单
    saveProductsList () {
      this.productsListLoading = true
      let arr = []
      let roomObj = {}
      for (let i of this.productsList) {
        roomObj[i.ID] = i.room
        for (let k = 0; k < i.num; k++) {
          arr.push(i.ID)
        }
      }
      let [products, rooms] = [arr.join(';'), roomObj == {} ? '' : JSON.stringify(roomObj)]
      let params = { oid: this.customerProid, products, rooms, update: 0}
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
        this.getMyCustomers()
        this.productsListLoading = false
        this.productsListVisible = false
      })
    },
    reportExcel () {
      let wrap = []
      let totalPrice = this.totalPrice
      let totalNum = 0
      for (let i of this.productsList) {
        let index = this.productsList.indexOf(i)
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
        {"value": this.productsList.length+1, "type":"ROW_HEADER"},
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
    showCustomerSchemes (schemes, oid) {
      let para = { oid }
      this.schemeShowOid = oid
      getCustomerSchemes(para).then(res => {
        if (res.data) {
          this.schemesList = res.data
          // for (let i of this.schemesList) {
          //   i.imgpath = `/panor/src/upload/${i.imgpath}`
          // }
        }else {
          this.schemesList = []
        }
        this.schemesListVisible = true
      })
    },
    cancelCollect (index, pid, user) {
      let arr = []
      let uid, oid, schemes
      if (user == 0) {
        this.schemesList.splice(index, 1)
        for (let i of this.schemesList) arr.push(i.projectid)
        schemes = arr.join(';')
        oid = this.schemeShowOid
        uid = 0
        let para = { schemes, pid, oid, uid }
        removeCustomerScheme(qs.stringify(para)).then(res => {
          let { code, msg } = res
          if (code == 200) {
            this.$message({
              type: 'success',
              message: msg
            })
          }
        })
      }else if (user == 1) {
        this.$confirm('是否取消收藏？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.collect.splice(index, 1)
          for (let i of this.collect) arr.push(i.projectid)
          schemes = arr.join(';')
          oid = 0
          uid = JSON.parse(sessionStorage.getItem('user')).id
          let para = { schemes, pid, oid, uid }
          removeCustomerScheme(qs.stringify(para)).then(res => {
            let { code, msg } = res
            if (code == 200) {
              this.$message({
                type: 'success',
                message: msg
              })
            }
            this.getMyCollect()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消操作'
          })
        })
      }
    },
    // 方案详情
    schDetailShow (item, user) {
      this.showViewWay = false
      this.schDetailModelList = []
      this.schDetailInfo = {}
      if (user == 0) {
        this.isCustomerSch = true
        this.schemesListVisible = false
        setTimeout(() => {
          this.schDetailVisiable = true
        }, 300)
      }else {
        this.isCustomerSch = false
        this.schDetailVisiable = true
      }
      this.priceListLoading = true
      // let projectid = item.projectid
      let para = { projectid: item.projectid }
      getModelList(para).then(res => {
        this.schDetailInfo = res.data.detail
        this.schDetailModelList = res.data.model
        this.priceListLoading = false
      })
    },
    closeSchDetail () {
      if (this.isCustomerSch == true) {
        setTimeout(() => {
          this.schemesListVisible = true
        }, 300)
      }
    },
    showCustomerMore (row) {
      this.editCustomerForm = row
      this.editCustomerVisible = true
    },
    editCustomerSubmit () {
      this.$refs.editCustomerForm.validate((valid) => {
        if (valid) {
          this.editCustomerLoading = true
          let para = Object.assign({}, this.editCustomerForm)
          let params = { para }
          editCustomer(qs.stringify(params)).then(res => {
            this.editCustomerLoading = false
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
            this.$refs['editCustomerForm'].resetFields()
            this.editCustomerVisible = false
            this.getMyCustomers()
          })
        }
      });
    },
    getMyCollect () {
      let uid = JSON.parse(sessionStorage.getItem('user')).id
      let para = {uid}
      getMySchemesCollect(para).then(res => {
        if (res.data.length > 0) {
          this.collect = res.data
          // for (let i of this.collect) {
          //   i.imgpath = `/panor/src/upload/${i.imgpath}`
          // }
        }else {
          this.collect = []
        }

      })
    },
    getMyOrderList () {
      let para = { examine: this.auditRadio }
      getOrderList(para).then(res => {
        this.orderAuditTable = res.data
      })
    },
    searchOrderList () {
      this.getMyOrderList()
    },
    auditShow (row) {
      this.orderAuditRow = Object.assign({}, row)
      this.orderActive = row.step
      this.deposit = ''
      this.retainage = ''
      this.orderAuditVisible = true
    },
    deleteCustomerRow (row) {
      this.$confirm('确认删除该订单？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let para = {oid: row.ID}
        removeCustomer(para).then(res => {
          let { code, msg } = res.data
          if (code == 200) {
            this.$message({
              type: 'success',
              message: msg
            })
            this.getMyCustomers()
          }
        })
      })
    },
    nextStep () {
      this.orderActive -= 0
      this.orderActive++
    },
    saveStep () {
      this.$confirm('确认是否执行此操作', '审核', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action == 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';
            this.nextStep()
            let para = { oid: this.orderAuditRow.oid, products: this.orderAuditRow.products, step: this.orderActive }
            orderAudit(qs.stringify(para)).then(res => {
              instance.confirmButtonLoading = false;
              this.orderAuditVisible = false
              done()
              let { code, msg } = res
              if (code == 200) {
                this.$message({
                  type: 'success',
                  message: msg
                })
                this.getMyOrderList()
                let [step, cash, tel] = [this.orderActive, this.orderActive == 1 ? this.deposit : this.retainage, this.orderAuditRow.tel]
                let para = {tel, step, cash }
                sendMsg(para).then(res => {
                  console.log(res.data)
                })
              }
            })
          }else {
            done()
          }
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
        this.schDetailVisiable = false
        setTimeout(() => {
          this.videoVisible = true
        }, 300)
      }
    }
  },
  components: {
    'e-box': EBox,
    'e-tag': ETag,
    'e-dialog': EDialog
  },
  mounted () {
    this.getUser()
    this.getProductsRank()
    this.getNewSchemes()
    this.getMySchemes()
    this.getMyMaterials()
    this.getMyCollect()
    // this.getMyCustomers()
    // this.getMyOrderList()
    getFilter().then(res => {
      this.brands = res.data.brands
      this.rooms = res.data.rooms
      this.developers = res.data.developers
      this.matTypes = res.data.type
    })
  }
}
</script>

<style lang="scss">
.completed {
  color: #13CE66;
}
.uncompleted {
  color: #F7BA2A;
}
.temporary {
  color: #999;
}
.fa-times-circle {
  color: #FF4949;
}
.fa-check-circle {
  color: #13CE66;
}
.main_info_view {
  margin: 10px 10px 0 10px;
  .self_info_wrap {
    padding-right: 10px;
    .self_info {
      height: 180px;
      .info-wrap {
        height: 150px;
        margin-top: 10px;
        display: flex;
        .info-item-left {
          flex: 0 0 150px;
          .info-avatar {
            width: 150px;
            height: 150px;
            img {
              width: 100%;
              height: 100%;
              border-radius: 7px;
            }
          }
        }
        .info-item-right {
          margin-left: 20px;
          flex: auto;
          display: flex;
          flex-flow: column;
          .info-right-head {
            height: 30px;
            line-height: 30px;
            padding-bottom: 10px;
            border-bottom: 1px solid #ccc;
            .info-name {
              h1 {
                display: inline;
                margin: 0;
                .sexIcon {
                  margin-left: 5px;
                  font-weight: 700;
                }
                .fa-mars {
                  color:#20a0ff;
                }
                .fa-venus {
                  color: pink;
                }
              }
            }
            .info-edit {
              float: right;
            }
          }
          .info-right-body {
            flex: auto;
            .info-right-main {
              p{
               font-size: 1em;
             }
             span {
               font-weight: 700;
             }
            }
          }
        }
      }
    }
  }
  .self_resource {
    height: 180px;
  }
  .self_scheme, .self_material, .self_customers, .self_collection, .order_audit {
    &.self_customers {
      max-height: 500px;
      overflow-y: scroll;
    }
    .create_Scheme, .create_material, .create_customer {
      margin: 10px 10px 10px 0;
      .customer_radio_g {
        margin-left: 20px;
      }
    }
    .mySchemes, .myMaterials, .myCollect {
      .schemes_wrap, .materials_wrap, .collect_wrap {
        margin-top: 10px;
        .scheme_cards, .material_cards {
          position: relative;
          .schemeLink, .materialLink {
            border-bottom: 1px solid #ccc;
            display: inline-block;
            width: 100%;
            height: 0;
            padding-bottom: 56.25%;
            background-repeat: no-repeat;
            background-position: center;
            background-size: 100%;
            cursor: pointer;
            transition: all .3s ease-in-out;
          }
          .card-info {
            padding: 10px;
            .scheme_name, .material_name {
              display: block;
            }
            .editBtns {
              float: right;
              text-align: right;
            }
            .designer {
              font-size: 12px;
              color: #333;
              height: 25px;
              line-height: 25px;
            }
          }
        }
      }
    }
    .order_audit_head {

    }
    .order_audit_body {
      margin-top: 10px;
    }
  }
  .new_schemes_notice {
    .new_scheme_link {
      color: #333;
      text-decoration: none;
      font-size: 12px;
      cursor: pointer;
      .date {
        margin-right: 10px;
      }
      .content {

      }
    }
    .new_scheme_link:hover {
      color: #58B7FF;
    }
  }
  .ranking_wrap {
    padding-left: 10px;
    margin-top: 10px;
    .productsRnak {
      color: #333;
      text-decoration: none;
      font-size: 12px;
      cursor: pointer;
      .ranking {
        display: inline-block;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        margin-right: 10px;
        color: #fff;
      }
      .rankTop {
        background-color: #20a0ff;
      }
      .rankBottom {
        background-color: #ccc;
      }
      .rankname:hover {
        color: #58B7FF;
      }
    }

  }
}

.avatar-uploader {
  .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .el-upload:hover {
      border-color: #20a0ff;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 100px;
      height: 100px;
      line-height: 100px;
      text-align: center;
    }
}

.customer_order_header {
  .order_list_num {
    margin: 0;
    overflow: hidden;
  }
  .customer_order_info {
    list-style: none;
    padding-left: 0;
    li {
      display: inline-block;
      width: 33%;
    }
  }
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
}

.schemeEditForm input {
  width: 192px;
}

.uploadLabel {
  float: left;
  display: inline-block;
  width: 68px;
  padding-right: 12px;
  text-align: right;
}

.depositStep, .retainageStep {
  margin-top: 30px;
  .el-input {
    width: calc(100% - 42px);
  }
}
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

</style>
