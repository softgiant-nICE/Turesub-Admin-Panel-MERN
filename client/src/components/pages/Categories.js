import React, { Component, Fragment } from "react";
import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faList} from "@fortawesome/free-solid-svg-icons/faList";
import ReactDatatable from '@ashvin27/react-datatable';
import PropTypes from "prop-types";
import {connect} from "react-redux";
import axios from "axios";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import CategoryAddModal from "../partials/CategoryAddModal";
import CategoryUpdateModal from "../partials/CategoryUpdateModal";
import { toast, ToastContainer} from "react-toastify";

class Categories extends Component {

    constructor(props) {
        super(props);

        this.columns = [
            // {
            //     key: "_id",
            //     text: "No",
            //     className: "id",
            //     align: "left",
            //     sortable: true,
            //     width: 50
            // },
            {
                key: "name",
                text: "Big text",
                className: "name",
                align: "left",
                sortable: true,
            },
            {
                key: "content",
                text: "Small text",
                className: "content",
                align: "left",
                sortable: true
            },
            {
                key: "url",
                text: "Image",
                className: "url",
                align: "center",
                sortable: true,
                cell: record => {
                    return (
                        <Fragment>
                            <img
                                className='img-responsive'
                                src={record['url']} 
                                alt='Not found image' 
                                width='100px'
                                height='100px' />
                        </Fragment>
                        )
                }
            },
            {
                key: "action",
                text: "Action",
                className: "action",
                width: 100,
                align: "left",
                sortable: true,
                cell: record => {
                    return (
                        <Fragment>
                            <button
                                data-toggle="modal"
                                data-target="#update-category-modal"
                                className="btn btn-primary btn-sm"
                                onClick={() => this.editRecord(record)}
                                style={{marginRight: '5px'}}>
                                <i className="fa fa-edit"></i>
                            </button>
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => this.deleteRecord(record)}>
                                <i className="fa fa-trash"></i>
                            </button>
                        </Fragment>
                    );
                }
            }
        ];

        this.config = {
            page_size: 10,
            length_menu: [ 5, 25, 50 ],
            filename: "Categories",
            no_data_text: 'No category found!',
            button: {
                excel: true,
                print: true,
                csv: true
            },
            language: {
                length_menu: "Show _MENU_ result per page",
                filter: "Filter in records...",
                info: "Showing _START_ to _END_ of _TOTAL_ records",
                pagination: {
                    first: "First",
                    previous: "Previous",
                    next: "Next",
                    last: "Last"
                }
            },
            show_length_menu: true,
            show_filter: true,
            show_pagination: true,
            show_info: true,
        };
        this.state = {
            currentRecord: {
                id: '',
                name: '',
                content: '',
                url: '',
            },
            records: []
        };

        this.getData = this.getData.bind(this);
    }

    componentDidMount() {
        this.getData()
    };
    // componentDidUpdate() {
    //     this.getData()
    // };

    componentWillReceiveProps(nextProps) {
        this.getData()
    }

    getData() {
        axios
            .post("/api/category-data")
            .then(res => {
                this.setState({ records: res.data})
            })
            .catch()
    }

    editRecord(record) {
        this.setState({ currentRecord: record});
    }

    deleteRecord(record) {
        axios
            .post("/api/category-delete", {_id: record._id, name: record.name})
            .then(res => {
                if (res.status === 200) {
                   toast(res.data.message, {
                       position: toast.POSITION.TOP_CENTER,
                   })
                }
            })
            .catch();
        this.getData();
    }

    pageChange(pageData) {
        console.log("OnPageChange", pageData);
    }

    render() { 
        return (
            <div>
                <Navbar/>
                <div className="d-flex" id="wrapper">
                    <Sidebar/>
                    <CategoryAddModal getData={this.getData.bind(this)} />
                    <CategoryUpdateModal record={this.state.currentRecord} getData={this.getData.bind(this)} />
                    <div id="page-content-wrapper">
                        <div className="container-fluid">
                            <br />
                            <button className="btn btn-outline-primary float-right mt-3 mr-2" data-toggle="modal" data-target="#add-category-modal"><FontAwesomeIcon icon={faPlus}/> Add Category</button>
                            <h1 className="mt-2 text-primary">Categories List</h1>
                            <ReactDatatable
                                config={this.config}
                                records={this.state.records}
                                columns={this.columns}
                                onPageChange={this.pageChange.bind(this)}
                            />
                        </div>
                    </div>
                    <ToastContainer/>
                </div>
            </div>
        );
    }

}

Categories.propTypes = {
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
    records: state.records
});

export default connect(
    mapStateToProps
)(Categories);
