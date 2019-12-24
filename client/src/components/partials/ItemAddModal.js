import React from 'react'
import classnames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addItem } from "../../actions/itemActions";
import { withRouter } from "react-router-dom";
import { toast } from 'react-toastify';
import $ from 'jquery';
import axios from 'axios'

import 'react-toastify/dist/ReactToastify.css';

class ItemAddModal extends React.Component {

    constructor() {
        super();
        this.state = {
            name: "",
            category_id: '',
            content: "",
            url: "",
            sound: '',
            errors: {},
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.category_id) {
            this.setState({
                category_id: nextProps.category_id,
            })
        }
        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
        $('#add-item-modal').modal('hide');
        if (nextProps.item !== undefined
            && nextProps.item.item !== undefined
            && nextProps.item.item.data !== undefined
            && nextProps.item.item.data.message !== undefined) {
            $('#add-item-modal').modal('hide');
            toast(nextProps.item.item.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
        }
    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };

    handleUploadImage = (e) => {
    this.onChange(e)
    const data = new FormData();
    data.append('file', e.target.files[0]);
    axios.post('/api/item-image', data).then((response) => {
      this.setState({ url: response.data.image });
    })
    }

    handleUploadSound = (e) => {
    // this.onChange(e)
    const data = new FormData();
    data.append('file', e.target.files[0]);
    axios.post('/api/item-sound', data).then((response) => { 
      this.setState({ sound: response.data.sound });
    })
    }

    onItemAdd = e => {
        e.preventDefault();
        const newItem = {
            category_id: this.state.category_id,
            name: this.state.name,
            content: this.state.content,
            url: this.state.url,
            sound: this.state.sound,
        };
        let cb = this.props.addItem(newItem, this.props.history, () => {
            this.props.getData()
        });
    };

    render() {
        const { errors } = this.state;
        return (
            <div>
                <div className="modal fade" id="add-item-modal" data-reset="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Add Item</h4>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div className="modal-body">
                                <form noValidate onSubmit={this.onItemAdd} id="add-item">
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="name">Big text</label>
                                        </div>
                                        <div className="col-md-9">
                                            <input
                                                onChange={this.onChange}
                                                value={this.state.name}
                                                id="name"
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
                                                id="content"
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
                                    form="add-item"
                                    type="submit"
                                    className="btn btn-primary">
                                    Add Item
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

ItemAddModal.propTypes = {
    addItem: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    item: state.item,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { addItem }
)(withRouter(ItemAddModal));
