import React from 'react'
import classnames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { updateCategory } from "../../actions/categoryActions";
import { withRouter } from "react-router-dom";
import { toast } from 'react-toastify';
import $ from 'jquery';
import axios from 'axios'

import 'react-toastify/dist/ReactToastify.css';

class CategoryUpdateModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: this.props.record.id,
            name: this.props.record.name,
            content: this.props.record.content,
            url: this.props.record.url,
            errors: {},
        };
    }

    componentWillReceiveProps(nextProps) { 
        if (nextProps.record) {
            this.setState({
                id: nextProps.record.id,
                name: nextProps.record.name,
                content: nextProps.record.content,
                url: nextProps.record.url,
            })
        }
        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
        $('#update-category-modal').modal('hide');
        if (nextProps.category !== undefined
            && nextProps.category.category !== undefined
            && nextProps.category.category.data !== undefined
            && nextProps.category.category.data.message !== undefined
            && nextProps.category.category.data.success) {
            $('#update-category-modal').modal('hide');
            toast(nextProps.category.category.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
        }
    }

    onChange = e => { 
        // alert($("#category-update-name").val()); return;
        if (e.target.id === 'category-update-name') {
            this.setState({ name: e.target.value });
        }
        if (e.target.id === 'category-update-content') {
            this.setState({ content: e.target.value });
        }
        if (e.target.id === 'category-update-url') {
            this.setState({ url: e.target.value });
        }
    };

    handleUploadFile = (e) => {
    // this.onChange(e)
    const data = new FormData();
    data.append('file', e.target.files[0]);
    // data.append('name', 'some value user types');
    // data.append('description', 'some value user types');
    // '/files' is your nodjs route that triggers our middleware
    axios.post('/api/category-image', data).then((response) => {
      // this.state.url = 'http://localhost:5000/' + response.data.image
      this.setState({ url: response.data.image });
      // console.log(this.state.url); // do something with the response
    })
    }

    onCategoryUpdate = e => {
        e.preventDefault();
        const newCategory = {
            _id: this.state.id,
            name: this.state.name,
            content: this.state.content,
            url: this.state.url
        };
        // this.props.updateCategory(newCategory)
        // this.props.getData()
        this.props.updateCategory(newCategory, () => {
            this.props.getData()
        });

    };

    render() {
        const { errors } = this.state;
        return (
            <div>
                <div className="modal fade" id="update-category-modal">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Update Category</h4>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div className="modal-body">
                                <form noValidate onSubmit={this.onCategoryUpdate} id="update-category">
                                    <input
                                        onChange={this.onChange}
                                        value={this.state.id}
                                        id="category-update-id"
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
                                                id="category-update-name"
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
                                                id="category-update-content"
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
                                                onChange={this.handleUploadFile}
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
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button
                                    form="update-category"
                                    type="submit"
                                    className="btn btn-primary">
                                    Update Category
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

CategoryUpdateModal.propTypes = {
    updateCategory: PropTypes.func.isRequired,
    category: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    category: state.category,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { updateCategory }
)(withRouter(CategoryUpdateModal));
