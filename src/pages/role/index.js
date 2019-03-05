import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Table, Modal} from 'antd'
import { router } from 'utils'
import { Page, DropOption } from 'components'
import styles from './index.less'
import RoleModal from './components/Modal'
import { withI18n } from '@lingui/react'
import { stringify } from 'qs'

@withI18n()
@connect(({ role, loading }) => ({ role, loading }))
class Role extends PureComponent {
  render() {
    const { location, dispatch, role, i18n, loading } = this.props
    const { query, pathname } = location
    const {
      pagination,
      currentItem,
      selectedRowKeys,
      modalType,
      modalVisible,
      list
    } = role
    const { confirm } = Modal
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        render: text => <a href="">{text}</a>
      },{
        title: '邮箱',
        dataIndex: 'email',
        key: 'email'
      },{
        title: '地址',
        dataIndex: 'address',
        key: 'address'
      },{
        title: '操作',
        key: 'operation',
        render: (text, record) => {
          return (
            <DropOption
              onMenuClick={e => handleMenuClick(record, e)}
              menuOptions={[
                { key: '1', name: i18n.t`Update` },
                { key: '2', name: i18n.t`Delete` },
              ]}
            />
          )
        },
      }
    ]

    const handleRefresh = newQuery => {
      router.push({
        pathname,
        search: stringify(
          {
            ...query,
            ...newQuery,
          },
          { arrayFormat: 'repeat' }
        ),
      })
    }

    const handleMenuClick = (record, e) => {
      if (e.key === '1') {
        dispatch({
          type: 'role/showModal',
          payload: {
            modalType: 'update',
            currentItem: record,
          },
        })
      } else if (e.key === '2') {
        confirm({
          title: i18n.t`Are you sure delete this record?`,
          onOk() {
            dispatch({
              type: 'role/delete',
              payload:record.id
            }).then(() => {
              handleRefresh({
                page:
                  list.length === 1 && pagination.current > 1
                    ? pagination.current - 1
                    : pagination.current,
              })
            })
          },
        })
      }
    }

    const modalProps = {
      item: modalType === 'create' ? {} : currentItem,
      visible: modalVisible,
      maskClosable: false,
      confirmLoading: loading.effects[`role/${modalType}`],
      title: `${
        modalType === 'create' ? i18n.t`Create Role` : i18n.t`Update Role`
      }`,
      centered: true,
      onOk(data) {
        dispatch({
          type: `role/${modalType}`,
          payload: data,
        }).then(() => {
          handleRefresh()
        })
      },
      onCancel() {
        dispatch({
          type: 'role/hideModal',
        })
      },
    }

    return (
      <Page inner>
        <div className={styles.normal}>
          <Table
            rowSelection= {{
              selectedRowKeys,
              onChange: (keys) => {
                dispatch({
                  type: 'role/updateState',
                  payload: {
                    selectedRowKeys: keys,
                  }
                })
              }
            }}
            pagination={{
              ...pagination.pagination,
              showTotal: total => i18n.t`Total ${total} Items`,
            }}
            bordered
            columns={columns}
            dataSource={list}
            loading={loading.effects['role/query']}
            rowKey={record=>record.id}
          />
          {modalVisible && <RoleModal {...modalProps} />}
        </div>
      </Page>
    )
  }
}

Role.propTypes = {
  role: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default Role

