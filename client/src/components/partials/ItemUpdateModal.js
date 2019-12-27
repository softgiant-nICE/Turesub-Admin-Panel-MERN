import React from 'react'
import classnames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { updateItem } from "../../actions/itemActions";
import { withRouter } from "react-router-dom";
import { toast } from 'react-toastify';
import $ from 'jquery';
import axios from 'axios'

import 'react-toastify/dist/ReactToastify.css';

class ItemUpdateModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: this.props.record.id,
            name: this.props.record.name,
            category_id: this.props.record.category_id,
            content: this.props.record.content,
            url: this.props.record.url,
            sound: this.props.record.sound,
            errors: {},
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.record) {
            this.setState({
                id: nextProps.record.id,
                name: nextProps.record.name,
                category_id: nextProps.record.category_id,
                content: nextProps.record.content,
                url: nextProps.record.url,
                sound: nextProps.record.sound,
            })
        }
        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
        $('#update-item-modal').modal('hide');
        if (nextProps.item !== undefined
            && nextProps.item.item !== undefined
            && nextProps.item.item.data !== undefined
            && nextProps.item.item.data.message !== undefined
            && nextProps.item.item.data.success) {
            $('#update-item-modal').modal('hide');
            toast(nextProps.item.item.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
        }
    }

    onChange = e => {
        if (e.target.id === 'item-update-name') {
            this.setState({ name: e.target.value });
        }
        if (e.target.id === 'item-update-category') {
            this.setState({ category_id: e.target.value });
        }
        if (e.target.id === 'item-update-content') {
            this.setState({ content: e.target.value });
        }
        if (e.target.id === 'item-update-url') {
            this.setState({ url: e.target.value });
        }
        if (e.target.id === 'item-update-sound') {
            this.setState({ sound: e.target.value });
        }
    };

    handleUploadImage = (e) => {
    // this.onChange(e)
    const data = new FormData();
    data.append('file', e.target.files[0]);
    axios.post('/api/item-image', data).then((response) => {
      this.setState({ url: response.data.image });
    })
    }

    handleUploadSound = (e) => {
    this.onChange(e)
    const data = new FormData();
    data.append('file', e.target.files[0]);
    axios.post('/api/item-sound', data).then((response) => { 
      this.setState({ sound: response.data.sound });
    })
    }

    onItemUpdate = e => {
        e.preventDefault();
        const newItem = {
            _id: this.state.id,
            category_id: this.state.category_id,
            name: this.state.name,
            content: this.state.content,
            url: this.state.url,
            sound: this.state.sound,
        };
        this.props.updateItem(newItem, () => {
            this.props.getData() })
        }

    render() {
        const { errors } = this.state;
        return (
            <div>
                <div className="modal fade" id="update-item-modal">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Update Item</h4>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div className="modal-body">
                                <form noValidate onSubmit={this.onItemUpdate} id="update-item">
                                    <input
                                        onChange={this.onChange}
                                        value={this.state.id}
                                        id="item-update-id"
                                        type="text"
                                        className="d-none"/>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="name">Big text</label>
                                        </div>
                                        <div className="col-md-9">
                                            <input
                                                onChange={this.onChange}
                                                value={this.state.name}
                                                id="item-update-name"
                                                type="text"
                                                error={errors.name}
                                                className={classnames("form-control", {
                                                    invalid: errors.name
                                                })}/>
                                            <span className="text-danger">{errors.name}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="content">Small text</label>
                                        </div>
                                        <div className="col-md-9">
                                            <input
                                                onChange={this.onChange}
                                                value={this.state.content}
                                                error={errors.content}
                                                id="item-update-content"
                                                type="text"
                                                className={classnames("form-control", {
                                                    invalid: errors.content
                                                })}
                                            />
                                            <span className="text-danger">{errors.content}</span>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="url">Image</label>
                                        </div>
                                        <div className="col-md-6">
                                            <input
                                                autoComplete={''}
                                                onChange={this.handleUploadImage}
                                                error={errors.url}
                                                id="url"
                                                type="file"
                                                accept="image/*"
                                                className={classnames("form-control", {
                                                    invalid: errors.url
                                                })}
                                            />
                                            <span className="text-danger">{errors.url}</span>
                                        </div>
                                        <div className="col-md-3">
                                            <img
                                                src={this.state.url}
                                                id="img"
                                                className="img-responsive"
                                                width= '80px'
                                                height='80px'
                                            />
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="sound">Sound</label>
                                        </div>
                                        <div className="col-md-9">
                                            <input
                                                autoComplete={''}
                                                onChange={this.handleUploadSound}
                                                error={errors.sound}
                                                id="sound"
                                                type="file"
                                                accept="audio/*"
                                                className={classnames("form-control", {
                                                    invalid: errors.sound
                                                })}
                                            />
                                            <span className="text-danger">{errors.sound}</span>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button
                                    form="update-item"
                                    type="submit"
                                    className="btn btn-primary">
                                    Update Item
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

ItemUpdateModal.propTypes = {
    updateItem: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    item: state.item,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { updateItem }
)(withRouter(ItemUpdateModal));
