import React, { Component } from "react";
import { Button, FormGroup, FormControl, ControlLabel,Form ,Alert} from "react-bootstrap";
import "./Login.css";
import axios from 'axios';
import { Redirect } from "react-router-dom";
import GoogleLogin from 'react-google-login';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.login = this.login.bind(this);
        this.socialLogin = this.socialLogin.bind(this)
        
        this.state = {

            fields:{},
            redirect:false,
            error:''

        };
    }
    login = e => {
    e.preventDefault();
    let url = 'http://localhost:5000/login';
    axios.post(url, {email:this.state.fields["email"],password:this.state.fields["password"]})
    .then(res => {
        if(res.data.auth == false){
            this.setState({error:res.data.message})
        }
        else{
            let data = res.data;
            localStorage.setItem('user',JSON.stringify(data))
            this.setState({redirect:true})
           
            
        }
    });

    }
    socialSignup = (res,type) => {
        let postData;
      
   
       if (type === 'google' && res.w3.U3) {
       postData = {
         name: res.w3.ig,
         provider: type,
         email: res.w3.U3,
         provider_id: res.El,
         token: res.Zi.access_token,
         provider_pic: res.w3.Paa
       };
   }
   
   if (postData) {
    
    let url = 'http://localhost:5000/socialsignup';
    axios.post(url, postData)
    .then(res => {
        if(res.data.auth == false){
            this.setState({error:res.data.message})
        }
        else{
            let data = res.data;
            localStorage.setItem('user',JSON.stringify(data))
            this.setState({redirect:true})
           
            
        }
   });
}
    
   }
    socialLogin = (res,type) => {
        let postData;
      
   
       if (type === 'google' && res.w3.U3) {
       postData = {
         name: res.w3.ig,
         provider: type,
         email: res.w3.U3,
         provider_id: res.El,
         token: res.Zi.access_token,
         provider_pic: res.w3.Paa
       };
   }
   
   if (postData) {
    
    let url = 'http://localhost:5000/socialsignin';
    axios.post(url, postData)
    .then(res => {
        if(res.data.auth == false){
            this.setState({error:res.data.message})
        }
        else{
            let data = res.data;
            localStorage.setItem('user',JSON.stringify(data))
            this.setState({redirect:true})
           
            
        }
   });
}
    
   }
    componentWillMount(){

    }

    validateForm() {

        let fields = this.state.fields;
     
        let formIsValid = true;


        if (!fields["password"]) {
            formIsValid = false;

        }


        if (!fields["email"]) {
            formIsValid = false;

        }

        if (typeof fields["email"] !== "undefined") {
            let lastAtPos = fields["email"].lastIndexOf('@');
            let lastDotPos = fields["email"].lastIndexOf('.');

            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["email"].indexOf('@@') == -1 && lastDotPos > 2 && (fields["email"].length - lastDotPos) > 2)) {
                formIsValid = false;
               
            }
        }

       
        return formIsValid;

    }

        handleChange = (field, e) =>{
            let fields = this.state.fields;
            fields[field] = e.target.value;
            this.setState({fields});
        }

    handleSubmit = e => {
        e.preventDefault();

    }
     

    render() {
        if(localStorage.getItem('user')){
            return(<Redirect to={'/home'}/>)
        }
        if(this.state.redirect){
            return(
                <Redirect to={'/home'}/>
            )
        }
        return (
            <div className="Login">
            
                <Form autoComplete="off">
                {this.state.error && <Alert bsStyle='danger'> {this.state.error}</Alert>}
                    <FormGroup controlId="email" bsSize="large">
                        <ControlLabel>Email</ControlLabel>
                        <FormControl
                            autoFocus
                            type="email"
                            
                            onChange={this.handleChange.bind(this,"email")}
                        />
                       
                    </FormGroup>
                    <FormGroup controlId="password" bsSize="large">
                        <ControlLabel>Password</ControlLabel>
                        <FormControl
                            onChange={this.handleChange.bind(this,"password")}
                            type="password"
                        />

                    </FormGroup>
                    <Button
                        block
                        bsSize="large"
                        disabled={!this.validateForm()}
                        type="submit"
                        className="btn btn-primary"
                        onClick={this.login}
                    >
                        Login
                    </Button>
                    <br/>
                    <GoogleLogin
              clientId="your_client_id"
              buttonText="Signin with google"
              className="btn btn-danger"
              onSuccess={(response) => {
                this.socialLogin(response, 'google');

              }}
              onFailure={(response) => {
                this.setState({error:'Google server error occured'})
              }}/>
            
              
              <GoogleLogin
              clientId="your_client_id"
              buttonText="Signup with Google"
              className="btn btn-danger"
              onSuccess={(response) => {
                this.socialSignup(response, 'google');

              }}
              onFailure={(response) => {
                this.setState({error:'Google server error occured'})
              }}/>
            
                </Form>
             
            </div>
        );
    }
}