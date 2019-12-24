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
import ItemAddModal from "../partials/ItemAddModal";
import ItemUpdateModal from "../partials/ItemUpdateModal";
import { toast, ToastContainer} from "react-toastify";

class Items extends Component {

    constructor(props) {
        super(props);
        // console.log("this.props", this.props.match.params.category_id)
        this.columns = [
            // {
            //     key: "_id",
            //     text: "No",
            //     className: "id",
            //     align: "left",
            //     sortable: true,
            //     width: 20
            // },
            // {
            //     key: "category_id.name",
            //     text: "Category",
            //     className: "category",
            //     align: "left",
            //     sortable: true
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
                key: "sound",
                text: "Sound",
                className: "sound",
                align: "left",
                sortable: true,
                cell: record => {
                    return (
                        <Fragment>
                            <a href={record['sound']}>Item sound</a>
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
                                data-target="#update-item-modal"
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
            length_menu: [  5, 25, 50 ],
            filename: "Items",
            no_data_text: 'No item found!',
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
                category_id: '',
                name: '',
                content: '',
                url: '',
                sound: '',
            },
            records: [],
            category_id:'',
            dummy_index: 0
        };
        this.getData = this.getData.bind(this);
    }
    componentWillMount() {
        this.setState({ category_id: this.props.match.params.category_id})

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
            .post("/api/item-data", {category_id: this.state.category_id})
            .then(res => { console.log(res.data)
                this.setState({ records: res.data})
            })
            .catch()
    }

    editRecord(record) {
        this.setState({ currentRecord: record});
    }

    addRecord(d_index) { //addRecord() and dummy_index are only needed to trigger the function, componentWillReceiveProps(nextProps) in ItemAddModal.js 
                         //as this function is only trigger when calling with the change of state in the parent component.
        this.setState({ dummy_index: d_index+1});
    }

    deleteRecord(record) {
        axios
            .post("/api/item-delete", {_id: record._id, category_id: this.state.category_id, name: record.name })
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
                    <ItemAddModal category_id={this.state.category_id} dummy_index={this.state.dummy_index} getData={this.getData.bind(this)} />
                    <ItemUpdateModal record={this.state.currentRecord} getData={this.getData.bind(this)} />
                    <div id="page-content-wrapper">
                        <div className="container-fluid">
                            <br />
                            <button onClick={() => this.addRecord(this.state.dummy_index)} className="btn btn-outline-primary float-right mt-3 mr-2" data-toggle="modal" data-target="#add-item-modal"><FontAwesomeIcon icon={faPlus}/> Add Item</button>
                            <h1 className="mt-2 text-primary">Items List</h1>
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

Items.propTypes = {
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
    records: state.records
});

export default connect(
    mapStateToProps
)(Items);
