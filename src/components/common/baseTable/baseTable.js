import React, { PureComponent } from 'react'
import { DropOption } from 'components'
import { Table} from 'antd'

class BaseTable extends PureComponent {

  render() {
    const { i18n, ...tableProps } = this.props

    const columns = []

    return (
      <Table
        {...tableProps}
        pagination={{
          ...tableProps.pagination,
          showTotal: total => i18n.t`Total ${total} Items`,
        }}
        className={}
        bordered
        scroll={{ x: 1200 }}
        columns={columns}
        simple
        rowKey={record => record.id}
      />
    )
  }
}

export default BaseTable


