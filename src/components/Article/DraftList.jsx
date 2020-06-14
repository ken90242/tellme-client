import React, { Fragment } from 'react';

import { Button, Tag, Table, Icon, Message } from 'element-react';
import { Link } from "react-router-dom";

import { TMBreadcrumb } from '../Menu'
import './DraftList.css'
import { getDrafts, deleteDraftDetail } from '../../api/api'
import moment from 'moment';

class DraftList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      drafts: [],
      columns: [
        {
          label: "Tags",
          labelClassName: 'drafts-header-label',
          className: 'drafts-tags',
          prop: "name",
          render: function(data){
            return data.tags.map((tagName, idx) => <Tag key={idx} className="drafts-tag">{tagName}</Tag>)
          }
        },
        {
          label: "Title",
          labelClassName: 'drafts-header-label',
          className: 'drafts-title',
          width: 320,
          prop: "date",
          render: function(data){
            return (
            <span>
              <span>{data.title}</span>
            </span>)
          }
        },
        {
          label: "Updated at",
          labelClassName: 'drafts-header-label',
          prop: "date",
          width: 180,
          render: function(data){
            return (
            <span>
              <Icon name="time"/>
              <span style={{marginLeft: '5px', fontSize: '.5rem'}}>{moment(data.updated_at).format("YYYY/MM/DD hh:mm")}</span>
            </span>)
          }
        },
        {
          label: "Created at",
          labelClassName: 'drafts-header-label',
          prop: "date",
          width: 180,
          render: function(data){
            return (
            <span>
              <Icon name="time"/>
              <span style={{marginLeft: '5px', fontSize: '.5rem'}}>{moment(data.created_at).format("YYYY/MM/DD hh:mm")}</span>
            </span>)
          }
        },
        {
          label: "Operations",
          labelClassName: 'drafts-header-label',
          width: 180,
          render: function(data) {
            const deleteDraft = () => {
              deleteDraftDetail(data.id)
              .then((response) => {
                Message.success({
                  message: 'Successfully deleted',
                  customClass: 'element-message',
                });
              })
              .catch(e => {
                Message.error({
                  message: e.detail,
                  customClass: 'element-message',
                });
              })
            }
            return (
              <span>
                <Link className="no-textdecoration" to={`/draft/${data.id}`}>
                  <Button className="drafts-ops" plain={true} type="info" size="small" icon="edit">Edit</Button>
                </Link>
               <Button
                className="drafts-ops"
                type="danger"
                size="small"
                icon="delete"
                onClick={deleteDraft}>Delete</Button>
              </span>
            )
          }
        }
      ],
    }
  }

  componentDidMount() {
    getDrafts()
    .then((response) => {
      console.log(response);
      this.setState({ drafts: response.data })
    })
    .catch(console.log)
  }

  render() {
    return (
      <Fragment>
        <TMBreadcrumb currentPath={this.props.location.pathname} />
        <div class="draft-list-wrapper">
          <Table
            style={{width: '100%'}}
            columns={this.state.columns}
            emptyText="No draft here"
            data={this.state.drafts}
            border={true}
            highlightCurrentRow={true}
            onCurrentChange={item=>{console.log(item)}}
          />
        </div>
      </Fragment>
    )
  }
}

export default DraftList
