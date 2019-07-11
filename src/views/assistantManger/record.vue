<style lang="less">
  @import "../../styles/common.less";
  @import "../../styles/table.less";
</style>
<template>
  <div>
    <Row>
      <Card>
        <p slot="title">
          <Icon type="md-send"></Icon>
          历史工单执行记录
        </p>
        <Form inline ref="queryForm">
          <FormItem>
            <Input placeholder="工单说明" v-model="find.text" @on-keyup.enter="queryData"></Input>
          </FormItem>
          <FormItem>
            <DatePicker format="yyyy-MM-dd HH:mm" type="datetimerange" placeholder="请选择查询的时间范围"
                        v-model="find.picker" @on-change="find.picker=$event" style="width: 250px"
                        :editable="false"></DatePicker>
          </FormItem>
          <FormItem>
            <Button type="success" @click="queryData">查询</Button>
            <Button type="primary" @click="queryCancel">重置</Button>
          </FormItem>
        </Form>
        <Row>
          <Col span="24">
            <Table
              border
              :columns="tabcolumns"
              :data="dataInfo"
              class="tabletop"
              style="background: #5cadff"
            >
              <template slot-scope="{ row }" slot="action">
                <div>
                  <Button type="success" @click="openOrder(row)" size="small" ghost>
                    详细信息
                  </Button>
                </div>
              </template>
            </Table>
            <br>
            <Page
              :total="this.page_number"
              show-elevator
              @on-change="currentPage"
              :page-size="20"
              ref="page"
            ></Page>
          </Col>
        </Row>
      </Card>
    </Row>
  </div>
</template>
<script>
  import axios from 'axios'
  //
  export default {
    name: 'Record',
    data () {
      return {
        tabcolumns: [
          {
            title: '工单',
            key: 'WorkId'
          },
          {
            title: '工单说明',
            key: 'Text',
            tooltip: true
          },
          {
            title: '执行时间',
            key: 'ExecuteTime',
            sortType: 'desc'
          },
          {
            title: '申请人',
            key: 'Username'
          },
          {
            title: '真实姓名',
            key: 'RealName'
          },
          {
            title: '审核/执行人',
            key: 'Assigned'
          },
          {
            title: '执行人',
            key: 'Executor'
          },
          {
            title: '环境',
            key: 'IDC'
          },
          {
            title: '连接名称',
            key: 'Source'
          },
          {
            title: '库名',
            key: 'DataBase'
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            slot: 'action'
          }
        ],
        dataInfo: [],
        page_number: 1,
        find: {
          picker: [],
          valve: false,
          text: ''
        }
      }
    },
    methods: {
      currentPage (vl = 1) {
        axios.put(`${this.$config.url}/audit/record`, {
          page: vl,
          find: this.find
        })
          .then(res => {
            if (!res.data.multi) {
              for (let i = 0; i < this.tabcolumns.length; i++) {
                if (this.tabcolumns[i].key === 'Executor') {
                  this.tabcolumns.splice(i, 1)
                }
              }
            }
            this.dataInfo = res.data.data;
            this.dataInfo.forEach((item) => {
              (item.Backup === 1) ? item.Backup = '是' : item.Backup = '否'
            });
            this.page_number = parseInt(res.data.page)
          })
          .catch(error => {
            this.$config.err_notice(this, error)
          })
      },
      queryData () {
        this.find.valve = true;
        this.currentPage()
      },
      queryCancel () {
        this.find = this.$config.clearPicker(this.find);
        this.$refs.page.currentPage = 1;
        this.currentPage()
      },
      openOrder (row) {
        this.$router.push({
          name: 'orderlist',
          query: {
            workid: row.WorkId,
            status: row.Status
          }
        })
      }
    },
    mounted () {
      this.currentPage()
    }
  }
</script>
