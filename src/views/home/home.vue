<style lang="less">
  @import "../../styles/home.less";
  @import "../../styles/common.less";
</style>
<template>
  <div>
    <Row>
      <Col class-name="padding-left-5">
        <Row>
          <Col span="6">
            <div>
              <div class="card bg-gradient-danger card-img-holder text-white">
                <Row>
                  <div class="card-body">
                    <img src="../../assets/circle.svg" class="card-img-absolute " alt="circle-image"/>
                    <Col span="11">
                      <Icon type="md-person-add" size="40"/>
                      <h1>平台用户数</h1>
                    </Col>
                    <Col span="8" offset="5">
                      <infor-card id-name="transfer_count0" :end-val="count.createUser"></infor-card>
                    </Col>
                  </div>
                </Row>
              </div>
            </div>
          </Col>
          <Col span="6" class-name="padding-left-5">
            <div>
              <div class="card bg-gradient-primary card-img-holder text-white">
                <Row>
                  <div class="card-body">
                    <img src="../../assets/circle.svg" class="card-img-absolute " alt="circle-image"/>
                    <Col span="11">
                      <Icon type="md-podium" size="40"/>
                      <h1>数据源</h1>
                    </Col>
                    <Col span="8" offset="5">
                      <infor-card id-name="transfer_count1" :end-val="count.source"></infor-card>
                    </Col>
                  </div>
                </Row>
              </div>
            </div>
          </Col>
          <Col span="6" class-name="padding-left-5">
            <div>
              <div class="card bg-gradient-info card-img-holder text-white">
                <Row>
                  <div class="card-body">
                    <img src="../../assets/circle.svg" class="card-img-absolute " alt="circle-image"/>
                    <Col span="11">
                      <Icon type="md-shuffle" size="40"/>
                      <h1>工单总数</h1>
                    </Col>
                    <Col span="8" offset="5">
                      <infor-card id-name="transfer_count2" :end-val="count.order"></infor-card>
                    </Col>
                  </div>
                </Row>
              </div>
            </div>
          </Col>
          <Col span="6" class-name="padding-left-5">
            <div>
              <div class="card bg-gradient-success card-img-holder text-white">
                <Row>
                  <div class="card-body">
                    <img src="../../assets/circle.svg" class="card-img-absolute " alt="circle-image"/>
                    <Col span="11">
                      <Icon type="md-search" size="40"/>
                      <h1>查询总数</h1>
                    </Col>
                    <Col span="8" offset="5">
                      <infor-card id-name="transfer_count3" :end-val="count.query"></infor-card>
                    </Col>
                  </div>
                </Row>
              </div>
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
    <br>
    <Row style="margin-left: 0.5%">
      <Col span="7">
        <Card>
          <p slot="title" class="card-title">
            <Icon type="md-person" size="24"/>
            个人信息
          </p>
          <userinfomation></userinfomation>
        </Card>
      </Col>
      <Col span="8" style="margin-left: 1%">
        <Card>
          <p slot="title" class="card-title">
            <Icon type="md-pie"/>
            工单提交统计
          </p>
          <div class="data-source-row">
            <data-source-pie :dml="this.count.dml" :ddl="this.count.ddl" :query="this.count.query"></data-source-pie>
          </div>
        </Card>
      </Col>
      <Col span="8" style="margin-left: 1%">
        <Card>
          <p slot="title" class="card-title">
            <Icon type="md-pie"/>
            高频库/Top5
          </p>
          <div class="data-source-row">
            <Table border :columns="columnsTop5" :data="dataTop5" stripe></Table>
          </div>
        </Card>
      </Col>
    </Row>


    <Row class="margin-top-10">
      <Col span="24" style="margin-left: 0.5%">
        <Card>
          <p slot="title" class="card-title">
            <Icon type="md-map"></Icon>
            工单趋势
          </p>
          <div class="data-source-row">
            <dataSourceaxis></dataSourceaxis>
          </div>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
  import axios from 'axios'
  import dataSourcePie from '../../components/dataSourcePie.vue'
  import dataSourceaxis from '../../components/dataSourceAxis'
  import inforCard from '../../components/inforCard.vue'
  import userinfomation from '../personalCenter/own-space'

  export default {
    components: {
      dataSourcePie,
      inforCard,
      dataSourceaxis,
      userinfomation

    },
    data () {
      return {
        dataTop5: [
        ],
        columnsTop5: [
          {
            title: '数据库',
            key: 'DataBase'
          },
          {
            title: '审核工单数',
            key: 'C'
          }
        ],
        toDoList: [{
          title: ''
        }],
        count: {
          createUser: 0,
          order: 0,
          source: 0,
          query: 0,
          ddl: 0,
          dml: 0
        },
        newToDoItemValue: '',
        time: '',
        username: sessionStorage.getItem('user'),
        board: {
          'title': ['1.DDL语句生成', '2.SQL语句审核及回滚', '3.工单流程化', '4.可视化数据查询', '5.细粒度的权限划分']
        }
      }
    },
    methods: {
      formatDate () {
        let date = new Date();
        let month = date.getMonth() + 1;
        this.time = date.getFullYear() + '/' + month + '/' + date.getDate() + '  ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
      }
    },
    mounted () {
      axios.get(`${this.$config.url}/dash/count`)
        .then(res => {
          this.count.createUser = res.data.u;
          this.count.order = res.data.o;
          this.count.source = res.data.s;
          this.count.query = res.data.q;
          this.dataTop5 = res.data.top;
        })
        .catch(error => {
          this.$config.err_notice(this, error)
        })
      this.formatDate()
    }
  }
</script>
