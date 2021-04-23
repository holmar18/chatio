import React from 'react';
import SocketContext from '../../contexts/SocketContext';
import ChatWindow from '../chatwindow';
import {getRooms} from '../../actions/roomListAction';
import {connect} from 'react-redux';
import {PropTypes} from 'prop-types';
import ClickNav from '../clickNav/clickNav';
import {joinRoom, getRoomsData, updateusers} from '../../contexts/SocketEmits';
import {mainChatConst} from '../../constants/index';
import Chatlogo from '../Chatlogo';

class MainChat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      command: '',
      movemain: false,
      chat: '',
      showNav: false,
      pageCords: {x: 0, y: 0},
      socket: null,
    };

    this._handleJoinChannel = this._handleJoinChannel.bind(this);
    this._handleClickChannels = this._handleClickChannels.bind(this);
    this._leaveByChangeMoveMain = this._leaveByChangeMoveMain.bind(this);
  }

  componentDidMount() {
    // Get the socket and set the state socket
    const {socket} = this.context;
    this.setState({...this.state, socket: socket});

    // Emit room data to ser ver and Get the data from redux
    getRoomsData(socket);
    this.props.getRooms(socket);

    // Listens for updates in main lobby
    updateusers(socket, () => {
      this.props.getRooms(socket);
    });
  }

  componentDidUpdate() {
    console.log(this.props.chatRoomList);
  }

  _leaveByChangeMoveMain() {
    // Function passed to child to leave chat
    this.setState({movemain: false, chat: ''});
  }

  _executeCommand(command) {
    // Get the command from the input and check if it is a command
    let splitCommand = command.split(' ');
    if (command.charAt(0) === '/') {
      var InpCommand = splitCommand[0].toLowerCase();
      var InpName = splitCommand[1].toLowerCase();
    }

    if (command === '') return;

    // if the user is joining a new channel or creating one
    if (!this.state.movemain) {
      if (InpCommand === mainChatConst.commands.join) {
        let joinObj = {room: InpName, pass: ''};
        joinRoom(joinObj, this.state.socket, (CB) => {
          this.setState({...this.state, movemain: true, chat: InpName});
        });
      }
    }
    this.setState({command: ''});
  }

  _handleJoinChannel() {
    // handles joining channel if the user is using the click nav
    const {chat} = this.state;

    // if the user missed click
    if (chat === '') return;

    const {socket} = this.context;
    let joinObj = {room: chat, pass: ''};

    joinRoom(joinObj, socket, (CB) => {
      this.setState({
        ...this.state,
        movemain: true,
        showNav: !this.state.showNav,
      });
    });
  }

  _handleClickChannels(e) {
    // handles the navigation when chat room is clicked
    this.setState({
      ...this.state,
      showNav: !this.state.showNav,
      chat: e.target.childNodes[0].data,
      pageCords: {x: e.nativeEvent.clientX, y: e.nativeEvent.clientY},
    });
  }

  _handleDrag(e) {
    console.log('DRAGG: ', e);
  }

  render() {
    const {command, movemain, chat, showNav, pageCords} = this.state;
    const {user, chatRoomList} = this.props;

    if (movemain) {
      /* Chat window */
      return (
        <div>
          <div>
            <h2 className='login-logo main-chat-logo'>Chat.IO</h2>
          </div>
          <ChatWindow
            roomname={chat}
            leave={this._leaveByChangeMoveMain}
            user={user}
            CommandsComponent={() => <MainChat.Commands />}
          />
        </div>
      );
      /* Chat window - END */
    } else {
      return (
        <div>
          {/* Click Nav */}
          {showNav ? (
            <ClickNav
              pageCords={pageCords}
              _handleJoinChannel={this._handleJoinChannel}
              btns={['join']}
            />
          ) : null}
          {/* Click Nav - END */}

          {/* MainChat commands */}
          <MainChat.Commands _handleDrag={this._handleDrag} />
          {/* MainChat commands - END */}

          {/* Chat LOGO header */}
          <Chatlogo />
          {/* Chat LOGO header - END */}

          {/* MainChat - Channel conatiner */}
          <div className='chat-window-container'>
            {/* Chat window conatiner */}
            <div className='chat-window'>
              {/* Input conatiner */}
              <div className='input-container'>
                {/* Input */}
                <input
                  type='text'
                  value={command}
                  className='input'
                  onChange={(e) => this.setState({command: e.target.value})}
                  placeholder={`${mainChatConst.placehldrs.cmd}`}
                />
                {/* Input */}

                {/* Command Btn */}
                <button
                  type='button'
                  className='btnSent'
                  onClick={() => this._executeCommand(command)}>
                  Send
                </button>
                {/* Command Btn - END */}
              </div>
              {/* Input conatiner - END */}
            </div>
            {/* Chat window conatiner - END*/}
            <div className='users-container'>
              {/* MainChat ChatRoom List */}
              <MainChat.ChatRooms
                chatRooms={chatRoomList}
                _handleClickChannels={this._handleClickChannels}
              />
              {/* MainChat ChatRoom List - END */}
            </div>
          </div>
          {/* MainChat - Channel conatiner - END */}
        </div>
      );
    }
  }
}

// Fragment for mainChat -> Renders currents chatRooms in the lobby
MainChat.ChatRooms = (props) => (
  <div className='users'>
    {Object.keys(props.chatRooms).length > 0 ? (
      Object.keys(props.chatRooms).map((u) => (
        <div
          key={u}
          className='user'
          onClick={(e) => props._handleClickChannels(e)}>
          <span className='userText'>{u}</span>
        </div>
      ))
    ) : (
      <></>
    )}
  </div>
);

// Fragment for commands display
MainChat.Commands = (props) => (
  <div className='command-container' onClick={(e) => props._handleDrag(e)}>
    <h4 style={{color: 'orange'}}>Commands:</h4>
    <p>
      <i>Commands can be entered in the input area</i>
    </p>

    <h6 style={{color: 'red'}}>Lobby Commands:</h6>
    <p>
      <b>Join/create Chatrooms:</b> /join "rooma name"<br></br>
    </p>

    <h6 style={{color: 'blue'}}>Channel Commands:</h6>
    <p>
      <b>Kick user:</b> /kick "nickname"<br></br>
      <b>Ban user:</b> /ban "nickname"<br></br>
      <b>Give channel admin privalidge to user:</b> /op "nickname"<br></br>
      <b>Send private messages:</b> /msg "nickname"<br></br>
      <b>leave Chatroom:</b> /leave "rooma name"
    </p>

    <h6 style={{color: 'red'}}>Get commands in alert : /help commands</h6>
  </div>
);

// Connect component to socket
MainChat.contextType = SocketContext;

MainChat.propTypes = {
  user: PropTypes.string,
  state: PropTypes.bool,
};

MainChat.ChatRooms.propTypes = {
  chatRoomList: PropTypes.array,
};

// Map chatRoomllist to redux store
const mapStateToProps = (reduxStoreStates) => {
  return {
    chatRoomList: reduxStoreStates.RoomListReducer,
  };
};

export default connect(mapStateToProps, {getRooms})(MainChat);
