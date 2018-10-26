/**
 * Created by fahad.saeed on 10/22/2018.
 */
import React , {Component} from 'react';
import axios from 'axios';
import toastr from 'reactjs-toastr';


import {Col,Table,FormControl,FormGroup,ControlLabel,Button,Form,Modal,Alert} from 'react-bootstrap';
export default class EmpDetails extends Component{

    constructor(props){
        super(props);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.states = this.states.bind(this);
        this.state= {
            empId:'',
            emp:{},
            toUpdateSalary:'',
            toUpdateName:'',
            show:false,
            updated:false
        }
    }
    componentWillMount(){
       this.fetchData()
    }
    fetchData(){
        const { match: { params } } = this.props;
        this.state.empId = `${params.empId}`
        axios.get(`http://127.0.0.1:5000/employees/${params.empId}`).then(res => {
            const data = res.data;
            this.setState({ emp:data[0] });

        });

    }

    // createNotification = (type,message) => {
    //     return () => {
    //         switch (type) {
    //             case 'info':
    //                 toastr.info(message, 'Title', {displayDuration:3000})
    //                 break;
    //             case 'success':
    //                 toastr.success(message, 'Title', {displayDuration:3000})
    //                 break;
    //             case 'warning':
    //                 toastr.warning(message, 'Title', {displayDuration:3000})
    //                 break;
    //         }
    //     };
    // };
    updateEmp = e => {
        e.preventDefault();

        const user = {
            emp_name: this.state.toUpdateName,
            salary:this.state.toUpdateSalary
        }

        axios.post(`http://127.0.0.1:5000/employees/update/`+this.state.empId, { user })
            .then(res => {
                console.log(res.data.message);
                // this.createNotification('success','Update')
                this.setState({updated:true})
                this.fetchData();
                setTimeout(this.states, 2000);




            })
    }
    states(){
        this.setState({toUpdateName:'',toUpdateSalary:'',updated:false})
    }

    validateForm(){

        return (this.state.toUpdateSalary==="" || this.state.toUpdateName === "")
    }
    handleClose() {
        this.setState({ show: false });
    }
    handleShow(){
        this.setState({show:true})
    }

    render(){
        return(
            <div>
                <Col sm={2}>

                </Col>
                <Col sm={8}>
                    <Table>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Id </th>
                            <th>Name</th>
                            <th>Salary</th>
                            <th>Action</th>

                        </tr>
                        </thead>
                        <tbody>
                        <tr>

                                <td>1</td>
                                <td>{this.state.emp.id}</td>
                                <td>
                                    {this.state.emp.emp_name}
                                </td>
                               <td>
                                   {this.state.emp.salary}
                               </td>

                                <td>
                                    <Button
                                        bsStyle="primary" bsSize="large" onClick={this.handleShow}

                                    >
                                        Update
                                    </Button>

                                </td>


                        </tr>

                        </tbody>
                    </Table>
                </Col>
                <Col sm={2}>
                </Col>
                <div>
                    <Modal show={this.state.show} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Update</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>

                                <ControlLabel>Employee Name</ControlLabel>
                                <FormGroup controlId="name" bsSize="large">

                                    <FormControl
                                        autoFocus
                                        type="text"
                                        placeholder={this.state.emp.emp_name}
                                        value={this.state.toUpdateName}
                                        required={true}
                                        onChange={ (e)=>{this.setState({toUpdateName:e.target.value})}}

                                    />
                                </FormGroup>

                                <ControlLabel>Salary</ControlLabel>
                                <FormGroup controlId="salary" bsSize="large">

                                    <FormControl
                                        placeholder={this.state.emp.salary}
                                        value={this.state.toUpdateSalary}
                                        required={true}
                                        type="text"
                                        onChange={(e)=>{this.setState({toUpdateSalary:e.target.value})}}
                                    />

                                </FormGroup>
                                <Button onClick={this.updateEmp} disabled={this.validateForm()} className="btn btn-success"> Update </Button>


                            </Form>
                            { this.state.updated && <Alert bsStyle="success"> Updated Successfully </Alert> }

                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={this.handleClose}>Close</Button>
                        </Modal.Footer>
                    </Modal>
                </div>

            </div>
        )
    }
}