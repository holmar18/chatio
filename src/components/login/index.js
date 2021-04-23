import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Form, FormGroup, FormInput} from 'shards-react';
import SocketContext from '../../contexts/SocketContext';
import MainChat from '../MainChat';
import {loginChat} from '../../contexts/SocketEmits';
import {logScrConst} from '../../constants/index';
import Chatlogo from '../Chatlogo';

class LogIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logedIn: false,
      username: '',
    };
  }

  _submitnNewUser() {
    let {socket} = this.context;
    const {username} = this.state;

    // No empty usernames
    if (username === '') return alert(logScrConst.alert.userNameEmpty);

    // Login if the username is available
    loginChat(username, socket, (CB) => {
      this.setState({username: username, logedIn: CB ? true : false});
      CB
        ? alert(logScrConst.alert.success)
        : alert(logScrConst.alert.userNameInUse);
    });
  }

  render() {
    const {logedIn, username} = this.state;

    if (!logedIn) {
      return (
        /* Login Main container */
        <div className='login-container background'>
          {/* Logo container */}
          <Chatlogo />
          {/* Logo container - END*/}

          {/* Login FORM */}
          <Form className='login-form'>
            {/* Formgroup  */}
            <FormGroup>
              {/* INPUT USERNAME username container  */}
              <div className='form-group'>
                {/* Label Nickname  */}
                <div className='login-label-cont'>
                  <label htmlFor='username'>Enter nickname</label>
                </div>
                {/* Label Nickname  - END */}

                {/* INPUT USERNAME - SUBMIT BTN CONTAINER */}
                <div className='login-inp-cont'>
                  {/* INPUT USERNAME */}
                  <FormInput
                    autoFocus
                    value={username}
                    onChange={(e) => this.setState({username: e.target.value})}
                    placeholder={`${logScrConst.nick}`}
                    id='username'
                  />
                  {/* SUBMIT BTN */}
                  <div className='login-btn-cont'>
                    <button
                      type='button'
                      id='logInBtn'
                      className='btn btn-outline-dark login-btn'
                      onClick={() => this._submitnNewUser()}>
                      Submit
                    </button>
                  </div>
                  {/* SUBMIT BTN - END*/}
                </div>
                {/* INPUT USERNAME - SUBMIT BTN CONTAINER - END */}

                {/* INPUT USERNAME - END*/}
              </div>
              {/* INPUT USERNAME username container  - END*/}
            </FormGroup>
            {/* Formgroup - END */}
          </Form>
          {/* Login FORM - END*/}
        </div>
        /* Login Main container - END */
      );
    } else {
      /* MainChat if LogedId */
      return <MainChat user={username} state={logedIn} />;
      /* MainChat if LogedId - END */
    }
  }
}

LogIn.contextType = SocketContext;

export default LogIn;
