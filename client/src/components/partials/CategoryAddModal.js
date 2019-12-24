import React from 'react'
import classnames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addCategory } from "../../actions/categoryActions";
import { withRouter } from "react-router-dom";
import { toast } from 'react-toastify';
import $ from 'jquery';
import axios from 'axios'

import 'react-toastify/dist/ReactToastify.css';

class CategoryAddModal extends React.Component {

    constructor() {
        super();
        this.state = {
            name: "",
            content: "",
            url: "",
            errors: {},
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }

        $('#add-category-modal').modal('hide');
        if (nextProps.category !== undefined
            && nextProps.category.category !== undefined
            && nextProps.category.category.data !== undefined
            && nextProps.category.category.data.message !== undefined) {
            $('#add-category-modal').modal('hide');
            toast(nextProps.category.category.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
        }
    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
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

    onCategoryAdd = e => {
        e.preventDefault();
        const newCategory = {
            name: this.state.name,
            content: this.state.content,
            url: this.state.url,
        };
        let cb = this.props.addCategory(newCategory, this.props.history, () => {
            this.props.getData()
        });
    };

    render() { 
        const { errors } = this.state;
        return (
            <div>
                <div className="modal fade" id="add-category-modal" data-reset="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Add Category</h4>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div className="modal-body">
                                <form noValidate onSubmit={this.onCategoryAdd} id="add-category">
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
                                    form="add-category"
                                    type="submit"
                                    className="btn btn-primary">
                                    Add Category
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

CategoryAddModal.propTypes = {
    addCategory: PropTypes.func.isRequired,
    category: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    category: state.category,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { addCategory }
)(withRouter(CategoryAddModal));
