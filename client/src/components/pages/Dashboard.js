import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faList} from "@fortawesome/free-solid-svg-icons/faList";
import {Link} from "react-router-dom";
import {faUserAlt} from "@fortawesome/free-solid-svg-icons/faUserAlt";
import {faFolderOpen} from "@fortawesome/free-solid-svg-icons/faFolderOpen";
import CategoryAddModal from "../partials/CategoryAddModal";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import axios from 'axios'

class Dashboard extends Component {

    constructor(props) {
        super(props)
        this.state = {
            currentRecord: {
                id:'',
                name: '',
                content: '',
                url: '',
            },
            records: [],
            extraRecord: {
                id:'',
                name: '',
                content: '',
                url: '',
            },
        }
        this.getData = this.getData.bind(this)
        this.getExtraData = this.getExtraData.bind(this)
    }

    componentWillMount() {
        this.getData()
        this.getExtraData()
    }
    // componentDidUpdate() {
    //     this.getData()
    //     this.getExtraData()
    // }
    componentWillReceiveProps(nextProps) {
        this.getData()
        this.getExtraData()
    }
    getData() { 
        axios
            .post("/api/category-data")
            .then(res => {
                this.setState({ records: res.data})
            })
            .catch()
    }
    getExtraData() { 
        axios
            .post("/api/extra-data")
            .then(res => {
                this.setState({ extraRecord: res.data})
            })
            .catch()
    }

    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    render() { 
        let category_array = null;
        if (this.state.records) {
            category_array = this.state.records.map( function(record) {
                return (
                    <div className="col-sm-3 p-sm-2">
                        <div className="card bg-secondary text-white shadow-lg">
                            <div className="card-body">
                                <h5 className="card-title">{record.name}</h5>
                                <p className="card-text">{record.content}</p>
                                <p><img src={record.url} width='60px' height='60px' /></p>
                                <Link to={`/items/${record.id}`} className="btn btn-light"><FontAwesomeIcon className="text-secondary" icon={faFolderOpen}/> Items</Link>
                            </div>
                        </div>
                    </div>
                    )
            })
        }
        //const { user } = this.props.auth;
        return (
            <div>
                <Navbar/>
                <div className="d-flex" id="wrapper">
                    <Sidebar/>
                    <CategoryAddModal/>
                    <div id="page-content-wrapper">
                        <div className="container-fluid">
                        <br />
                            
                            <h1 className="mt-2 text-primary">Dashboard</h1>
                            <div className="row px-2">
                                {category_array}
                                
                                <div className="col-sm-3 p-sm-2">
                                    <div className="card bg-dark text-white shadow-lg">
                                        <div className="card-body">
                                            <h5 className="card-title">{this.state.extraRecord.name}</h5>
                                            <p className="card-text">{this.state.extraRecord.content}</p>
                                            <p><img src={this.state.extraRecord.url} width='60px' height='60px' /></p>
                                            <Link to={`/items/${this.state.extraRecord.id}`} className="btn btn-light"><FontAwesomeIcon className="text-dark" icon={faFolderOpen}/> Items</Link>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Dashboard.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    records: state.records
});

export default connect(
    mapStateToProps,
    { logoutUser }
)(Dashboard);
