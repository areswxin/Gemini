<template>
  <div>

    <Menu width="auto" @on-select="currentPageTab" :active-name="currentPageName" accordion>
      <MenuItem name="main">
        <Row>
          <Col span="12"><img src="../assets/logo_s.png" width="90%"> </Col>
          <Col span="12" style="font-weight: bold;font-size: 20px;padding-top: 20px;">Yearning</Col>
        </Row>
      </MenuItem>
      <MenuItem name="home_index">
        <Icon type="md-home" :size="iconSize"></Icon>
        <span class="layout-text">首页</span>
      </MenuItem>
      <MenuItem name="myorder">
        <Icon type="md-person" :size="iconSize"></Icon>
        <span class="layout-text">我的工单</span>
      </MenuItem>
      <template v-for="item in menuList">
        <Submenu v-if="item.children.length>=1 && item.name !== 'main'" :name="item.name" :key="item.path">
          <template slot="title">
            <Icon :type="item.icon" :size="iconSize"></Icon>
            <span class="layout-text">{{ item.title }}</span>
          </template>
          <template v-for="child in item.children">
            <template v-if="filtermenulist[child.name] === '1'">
              <MenuItem :name="child.name" :key="child.name" style="margin-left: -5%">
                <Icon :type="child.icon" :size="iconSize" :key="child.name"></Icon>
                <span class="layout-text" :key="child.name + 1">{{ child.title }}</span>
              </MenuItem>
            </template>
          </template>
        </Submenu>
      </template>
      <Menu-item name="login">
        <Icon type="md-log-out" :size="iconSize"></Icon>
        <span class="layout-text">退出</span>
      </Menu-item>
    </Menu>
  </div>
</template>
<script>
  //
  import util from '../libs/util'
  import axios from 'axios'

  export default {
    name: 'sidebarMenu',
    props: {
      menuList: Array,
      iconSize: Number
    },
    data () {
      return {
        filtermenulist: {
          'ddl': '',
          'dml': '',
          'indexedit': '',
          'query': '1',
          'management-user': '',
          'management-database': '',
          'audit-audit': '1',
          'audit-record': '1',
          'audit-permissions': '1',
          'search_order': '1',
          'query-review': '1',
          'query-audit': '1',
          'setting': '1',
          'authGroup': '1'
        }
      }
    },
    computed: {
      currentPageName () {
        return this.$store.state.currentPageName
      }
    },
    methods: {
      currentPageTab (val) {
        if (val === 'login') {
          localStorage.removeItem('pageOpenedList');
          sessionStorage.clear();
          this.$router.push({
            name: 'login'
          })
        } else {
          util.openPage(this, val)
        }
      }
    },
    created () {
      axios.post(`${this.$config.url}/dash/initMenu`)
        .then(res => {
          let c = res.data.c;
          let s = res.data.s;
          this.filtermenulist.ddl = c.ddl;
          this.filtermenulist.dml = c.dml;
          this.filtermenulist['management-user'] = c.user;
          this.filtermenulist['management-database'] = c.base;
          this.filtermenulist['query'] = c.query;
          this.filtermenulist.setting = s.setting;
          this.filtermenulist.authGroup = s.group
        })
    }
  }
</script>

<style>
  span {
    font-weight: bold;
  }
  .f-log {
    font-weight: bold;
    font-size: 30px;
    padding: 16px 6px 0;
  }
</style>
