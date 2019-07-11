<style lang="less">
@import "../../styles/common.less";
@import "../../styles/table.less";
</style>
<template>
  <div>
    <Row>
      <Card>
        <p slot="title">
          <Icon type="md-person"></Icon>查询审计
        </p>
        <Row>
          <Col span="24">
            <Form inline>
              <FormItem>
                <Input placeholder="工单编号" v-model="find.text"></Input>
              </FormItem>
              <FormItem>
                <DatePicker format="yyyy-MM-dd HH:mm" type="datetimerange" placeholder="请选择查询的时间范围"
                            v-model="find.picker" @on-change="find.picker=$event" style="width: 250px" :editable="false"></DatePicker>
              </FormItem>
              <FormItem>
                <Button type="success" @click="queryData">查询</Button>
                <Button type="primary" @click="queryCancel">重置</Button>
              </FormItem>
            </Form>
            <Table border :columns="columns" :data="table_data" stripe size="small"></Table>
          </Col>
        </Row>
        <br>
        <Page :total="page_number" show-elevator @on-change="currentpage" :page-size="20"></Page>
      </Card>
    </Row>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  name: 'put',
  data () {
    return {
      columns: [
        {
          title: '工单编号:',
          key: 'WorkId',
          sortable: true
        },
        {
          title: '查询人',
          key: 'Username'
        },
        {
          title: '查询人姓名',
          key: 'Realname'
        },
        {
          title: '工单说明',
          key: 'Text'
        },
        {
          title: '提交时间:',
          key: 'Date',
          sortable: true
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    size: 'small',
                    type: 'text'
                  },
                  on: {
                    click: () => {
                      this.$router.push({
                        name: 'querylist',
                        query: {
                          workid: params.row.WorkId,
                          user: params.row.Username
                        }
                      });
                    }
                  }
                },
                '详细信息'
              )
            ]);
          }
        }
      ],
      page_number: 1,
      computer_room: this.$config.computer_room,
      table_data: [],
      find: {
        picker: [],
        text: '',
        valve: false
      }
    };
  },
  methods: {
    currentpage (vl = 1) {
      axios.put(`${this.$config.url}/audit/query/fetch/record`, {
        page: vl,
        find: this.find
      })
        .then(res => {
          [this.table_data, this.page_number] = [res.data.data, res.data.page];
        })
        .catch(error => {
          this.$config.err_notice(this, error);
        });
    },
    queryData () {
      this.find.valve = true
      this.currentpage()
    },
    queryCancel () {
      this.find = this.$config.clearPicker(this.find)
      this.currentpage()
    }
  },
  mounted () {
    this.currentpage();
  }
};
</script>
