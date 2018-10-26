/**
 * Created by fahad.saeed on 10/22/2018.
 */
import React,{Component} from 'react';
import {ListGroupItem,Col,Button,Modal,Alert,FormControl,FormGroup,ControlLabel,Form} from 'react-bootstrap';
import './home.css';
import {Link, Redirect} from 'react-router-dom';
import axios from 'axios';
export default class Home extends Component {
    constructor(props) {
        super(props);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.logout = this.logout.bind(this);
        this.states = this.states.bind(this);
        this.state = {
            employees: [],
            show: false,
            emp_name: '',
            salary: '',
            inserted: false,
            user:{}


        }
    }

    validateForm(){

        return (this.state.emp_name==="" || this.state.salary === "")
    }
    handleClose() {
        this.setState({ show: false });
    }
    logout(){
        localStorage.removeItem('user')
        this.setState({user:null})
    }
    handleShow(){
        this.setState({show:true})
    }
        delete(id)
        {
            axios.get(`http://127.0.0.1:5000/employees/delete/` + id).then(res => {
                const data = res.data;
                console.log(data.messsage);
            });
            this.fetchData();
        }

        fetchData()
        {
            axios.get(`http://127.0.0.1:5000/`).then(res => {
                const data = res.data;
                this.setState({employees: data});
            });
        }

        componentWillMount()
        {
            this.fetchData()
            if(localStorage.getItem('user')){
                let users = JSON.parse(localStorage.getItem('user'))
                this.setState({user:users.user})
            }
            
            
        }
        insertEmp = e =>{
        e.preventDefault();
            const user = {
                emp_name: this.state.emp_name,
                salary:this.state.salary,
            }

            axios.post(`http://127.0.0.1:5000/employees/`, { user })
                .then(res => {
                    console.log(res.data.message)
                    this.setState({inserted:true})
                    this.fetchData();
                    this.setState({emp_name:'',salary:'',});
                   setTimeout(this.states,2000);
                });

        }
        states(){
            this.setState({inserted:false})
        }
        render()
        {
            if(localStorage.getItem('user')==null){
                return (<Redirect to={'/login'} />)
            }
            const listItems = this.state.employees.map(
                (link) =>
                    <ListGroupItem key={link.id}> <Link to={`/employee/${link.id}`}>{link.emp_name}</Link> <Button
                        className="btn btn-danger" onClick={() => {
                        this.delete(link.id)
                    }}> Delete</Button> </ListGroupItem>
            );
            return (
                <div className="home">
                
                
                    <Col sm={4}>
                    <br/>
                    <h3>Hello {this.state.user.username}</h3>
                    <Button
                            bsStyle="primary" bsSize="large" onClick={this.logout}

                        >
                            Logout
                            
                        </Button>
                        <br/><br/>
                        <Button
                            bsStyle="primary" bsSize="large" onClick={this.handleShow}

                        >
                            Add new Employee
                            
                        </Button>
                    </Col>
                    <Col sm={4}>
                        <br/><br/><br/>
                        {this.state.employees.length != 0 && listItems}
                        {this.state.employees.length === 0 && <Alert> No employees in the database </Alert>}
                    </Col>
                    <Modal show={this.state.show} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Insert New Employee</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>

                               
                                <ControlLabel>Employee Name</ControlLabel>
                                <FormGroup controlId="name" bsSize="large">

                                    <FormControl
                                        placeholder="Enter Name"
                                        value={this.state.emp_name}
                                        required={true}
                                        type="text"
                                        onChange={(e) => {
                                            this.setState({emp_name: e.target.value})
                                        }}
                                    />

                                </FormGroup>
                                <ControlLabel>Salary</ControlLabel>
                                <FormGroup controlId="salary" bsSize="large">

                                    <FormControl
                                        placeholder="Enter Salary"
                                        value={this.state.salary}
                                        required={true}
                                        type="text"
                                        onChange={(e) => {
                                            this.setState({salary: e.target.value})
                                        }}
                                    />

                                </FormGroup>
                                <Button onClick={this.insertEmp} disabled={this.validateForm()}
                                        className="btn btn-success"> Save </Button>


                            </Form>
                            { this.state.inserted && <Alert bsStyle="success"> Inserted Successfully </Alert> }

                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={this.handleClose}>Close</Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            );
        }
    }
