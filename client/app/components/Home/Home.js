import React, { Component } from "react";
import "whatwg-fetch";
import { getFromStorage, setInStorage } from "../../utils/Storage";

// import{useState} from 'react';

class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      token: "",
      signUpError: "",
      signInError: "",
      signInEmail: "",
      signInPassword: "",
      signUpFirstName: "",
      signUpLastName: "",
      signUpEmail: "",
      signUpPassword: "",
      userInput: '',
      list: []
    };

    this.onTextboxChangeSignInEmail = this.onTextboxChangeSignInEmail.bind(this);
    this.onTextboxChangeSignInPassword = this.onTextboxChangeSignInPassword.bind(this);
    this.onTextboxChangeSignUpEmail = this.onTextboxChangeSignUpEmail.bind(this);
    this.onTextboxChangeSignUpPassword = this.onTextboxChangeSignUpPassword.bind(this);
    this.onTextboxChangeSignUpFirstName = this.onTextboxChangeSignUpFirstName.bind(this);
    this.onTextboxChangeSignUpLastName = this.onTextboxChangeSignUpLastName.bind(this);

    this.onSignIn = this.onSignIn.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
    this.logout = this.logout.bind(this);
  }
  componentDidMount() {
    const obj = getFromStorage('the_main_app');
    if (obj && obj.token) {
      const { token } = obj;
      fetch('api/account/verify?token=' + token)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            this.setState({
              token,
              isLoading: false
            });
          } else {
            this.setState({
              isLoading: false
            });
          }
        });
    } else {
      this.setState({
        isLoading: false
      });
    }
  }

  onTextboxChangeSignInEmail(event) {
    this.setState({
      signInEmail: event.target.value
    });
  }
  onTextboxChangeSignInPassword(event) {
    this.setState({
      signInPassword: event.target.value
    });
  }
  onTextboxChangeSignUpEmail(event) {
    this.setState({
      signUpEmail: event.target.value
    });
  }
  onTextboxChangeSignUpPassword(event) {
    this.setState({
      signUpPassword: event.target.value
    });
  }
  onTextboxChangeSignUpFirstName(event) {
    this.setState({
      signUpFirstName: event.target.value
    });
  }
  onTextboxChangeSignUpLastName(event) {
    this.setState({
      signUpLastName: event.target.value
    });
  }
  onSignUp() {
    const {
      signUpFirstName,
      signUpLastName,
      signUpEmail,
      signUpPassword
    } = this.state;
    this.setState({
      isLoading: true
    });
    fetch("/api/account/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        firstName: signUpFirstName,
        lastName: signUpLastName,
        email: signUpEmail,
        password: signUpPassword
      })
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          this.setState({
            signUpError: json.message,
            isLoading: false,
            signUpEmail: " ",
            signUpPassword: " ",
            signUpFirstName: " ",
            signUpLastName: " "
          });
        } else {
          this.setState({
            signUpError: json.message,
            isLoading: false
          });
        }
      });
  }
  onSignIn() {

    const {
      signInEmail,
      signInPassword,
    } = this.state;
    this.setState({
      isLoading: true,
    });
    fetch('/api/account/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: signInEmail,
        password: signInPassword,
      }),
    }).then(res => res.json())
      .then(json => {
        console.log('json', json);
        if (json.success) {
          setInStorage('the_main_app', { token: json.token });
          this.setState({
            signInError: json.message,
            isLoading: false,
            signInPassword: '',
            signInEmail: '',
            token: json.token,
          });
        } else {
          this.setState({
            signInError: json.message,
            isLoading: false,
          });
        }
      });
  }
  logout() {
    this.setState({
      isLoading: true,
    });
    const obj = getFromStorage('the_main_app');
    if (obj && obj.token) {
      const { token } = obj;
      // Verify token
      fetch('/api/account/logout?token=' + token)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            this.setState({
              token: '',
              isLoading: false
            });
          } else {
            this.setState({
              isLoading: false,
            });
          }
        });
    } else {
      this.setState({
        isLoading: false,
      });
    }
  }

  /*/----------------------------------------------------------/*/
  changeUserInput(input) {
    this.setState({
      userInput: input
    });
  }
  addtolist(input) {
    let listArray = this.state.list;

    listArray.push(input);

    this.setState({
      list: listArray,
      userInput: ""
    });
  }
  /*/----------------------------------------------------------/*/

  // const [inputValue,SetToDo] = useState({
  //   todo:"",
  //   iscompleted:false
  //   })
  /*/----------------------------------------------------------/*/

  render() {

    const {
      isLoading,
      token,
      signInError,
      signInEmail,
      signInPassword,
      signUpFirstName,
      signUpLastName,
      signUpEmail,
      signUpPassword,
      signUpError
    } = this.state;

    if (isLoading) {
      return (
        <div>
          <h1>Site is loading...</h1>
          <h3>This should only take a couple of seconds...</h3>
        </div>
      );
    }

    if (!token) {
      return (
        <div>
          <h1 className="mainTitle"><b>Login & To-do App</b></h1>
          <div className="loginContainer">
            {signInError ? <p>{signInError}</p> : null}
            <h3>LOGIN</h3>
            <input
              type="email"
              placeholder="Email"
              value={signInEmail}
              onChange={this.onTextboxChangeSignInEmail}
              className="inputField"
            />

            <br />
            <br />

            <input
              type="password"
              placeholder="Password"
              value={signInPassword}
              onChange={this.onTextboxChangeSignInPassword}
              className="inputField"
            />

            <br />
            <br />

            <button
              onClick={this.onSignIn}
              className="button">
              <b>Sign in!</b>
            </button>
          </div>

          <br />
          <br />
          <br />

          <div className="registerContainer">
            {signUpError ? <p>{signUpError}</p> : null}
            <h3>REGISTER</h3>
            <input
              type="text"
              placeholder="Name"
              value={signUpFirstName}
              onChange={this.onTextboxChangeSignUpFirstName}
              className="inputField"
            />

            <br />
            <br />

            <input
              type="text"
              placeholder="Last name"
              value={signUpLastName}
              onChange={this.onTextboxChangeSignUpLastName}
              className="inputField"
            />

            <br />
            <br />

            <input
              type="email"
              placeholder="Email"
              value={signUpEmail}
              onChange={this.onTextboxChangeSignUpEmail}
              className="inputField"
            />

            <br />
            <br />

            <input
              type="password"
              placeholder="Password"
              value={signUpPassword}
              onChange={this.onTextboxChangeSignUpPassword}
              className="inputField"
            />

            <br />
            <br />

            <button
              onClick={this.onSignUp}
              className="button">
              <b>Sign up!</b>
            </button>
          </div>
        </div>
      );
    }


    return (
      <div className="toDoContainer">
        <h1 className="mainTitle">To-do list</h1>
        <p>Write down a to-do!</p>
        <input
          onChange={e => this.changeUserInput(e.target.value)}
          value={this.state.userInput}
          type="text"
          placeholder="This can be anything..."
          className="inputField"
        />

        <button
          onClick={() => this.addtolist(this.state.userInput)}
          className="toDoButton">
          Add
        </button>

        <br />
        <br />

        {this.state.list.map(val => (
          <li>{val}</li>
        ))}


        <br />
        <br />

        <button
          onClick={this.logout}
          className="button">
          Logout
        </button>
      </div>
    );
  }
}

export default Home;
