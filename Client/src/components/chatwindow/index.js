import React from 'react';
import SocketContext from '../../contexts/SocketContext';
import {connect} from 'react-redux';
import {getRooms} from '../../actions/roomListAction';
import {getPrivateMsg} from '../../actions/privateMsgAction';
import {PropTypes} from 'prop-types';
import {mainChatConst} from '../../constants/index';
import {
  getRoomsData,
  updateusers,
  updateChat,
  kickUser,
  bannUser,
  leaveChat,
  kickBanOrOP,
  sendPrvMsg,
  sendMsg,
} from '../../contexts/SocketEmits';

class ChatWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      msg: '',
      chat: this.props.roomname,
      command: '',
    };
  }

  componentDidMount() {
    const {socket} = this.context;
    const {user, leave, chatRoomList, roomname} = this.props;

    // listen for chat updates
    updateChat(socket, (room, msgs) => {
      if (room === roomname) {
        this.setState({...this.state, messages: msgs});
      }
    });

    // listen for chat user
    updateusers(socket, () => {
      this.props.getRooms(socket);
    });

    // Kick user
    kickUser(socket, chatRoomList, roomname, user, () => {
      leave();
    });

    // Bann user
    bannUser(socket, chatRoomList, roomname, user, () => {
      leave();
    });

    // Get private msg's from store
    this.props.getPrivateMsg(socket);
  }

  _executeChatCommand() {
    const {socket} = this.context;
    const {command, chat} = this.state;
    const {leave} = this.props;

    // if empty return
    if (command === '') return;

    // Split to check if its a command
    let splitCommand = command.split(' ');
    if (command.charAt(0) === '/') {
      var InpCommand = splitCommand[0].toLowerCase();
      var InpName = splitCommand[1].toLowerCase();

      // Leave channel
      if (InpCommand === mainChatConst.commands.leave) {
        leaveChat();
        leave();
        this.setState({command: '', chat: ''});
      }
      // If operator -> kick, ban or op user
      else if (
        InpCommand === mainChatConst.commands.kick ||
        InpCommand === mainChatConst.commands.ban ||
        InpCommand === mainChatConst.commands.op
      ) {
        // Get command witout the /
        let com = InpCommand.split('/');
        let data = {user: InpName, room: chat};
        kickBanOrOP(com, data, socket, InpName);
      }
      // if its a private msg
      else if (InpCommand === mainChatConst.commands.msg) {
        let privMsgg = splitCommand.splice(2, splitCommand.length).join(' ');
        let data = {nick: InpName, message: privMsgg};
        sendPrvMsg(socket, data);
      }
      // Alerts the command and the Current char room name
      else if (InpCommand === mainChatConst.commands.help) {
        alert(`Current channel: ${chat} ${mainChatConst.commands.cmdDisplay}`);
      }
    }
    // Command for for everything else, ends up as a msg.
    else {
      let data = {roomName: chat, msg: command};
      // send msg and emit new data
      sendMsg(socket, data);
      getRoomsData(socket);
    }

    // Clear the input
    this.setState({command: ''});
  }

  render() {
    const {roomname, chatRoomList, privMsg, CommandsComponent} = this.props;
    const {messages, command} = this.state;

    // If the Room data has loaded
    if (chatRoomList[roomname]) {
      return (
        /* Chat - USERs Container - END */
        <div className='chat-window-container'>
          <CommandsComponent />
          {/* Chat Container */}
          <div className='chat-window'>
            {/* Chat Room Topic Title */}
            <h4 className='Channel-topic'>{chatRoomList[roomname].topic}</h4>
            {/* Chat Room Topic Title - END */}

            {/* Chat Room Private Msg */}
            <ChatWindow.Messages messages={messages} privMsg={privMsg} />
            {/* Chat Room Private Msg - END */}

            {/* Chat Room Input Container */}
            <div className='input-container'>
              {/* Chat Room Input  */}
              <input
                type='text'
                className='input'
                value={command}
                onChange={(e) =>
                  this.setState({...this.state, command: e.target.value})
                }
                placeholder='Enter msg or command here...'
              />
              {/* Chat Room Input - END */}

              {/* Chat Room Input BTN  */}
              <button
                type='button'
                className='btnSent'
                onClick={() => this._executeChatCommand()}>
                Send
              </button>
              {/* Chat Room Input BTN - END */}
            </div>
            {/* Chat Room Input Container - END */}
          </div>
          {/* Chat room Container - END */}

          {/* Chat Room User list */}
          <div className='users-container'>
            <ChatWindow.Users chatRoomList={chatRoomList} roomname={roomname} />
          </div>
          {/* Chat Room User list - END */}
        </div>
        /* Chat - USERs Container - END */
      );
    } else {
      // If the Room data has NOT loaded
      return (
        <div>
          <p>Still loading my friend</p>
        </div>
      );
    }
  }
}

// Fragment renders list of user on current channel
ChatWindow.Users = (props) => (
  <div className='users'>
    {Object.keys(props.chatRoomList[props.roomname].ops).length > 0 ? (
      Object.keys(props.chatRoomList[props.roomname].ops).map((x) => (
        <div key={x} className='user'>
          <span className='userText'>
            <b style={{color: 'red'}}>+{x}</b>
          </span>
        </div>
      ))
    ) : (
      <></>
    )}
    {Object.keys(props.chatRoomList[props.roomname].users).length > 0 ? (
      Object.keys(props.chatRoomList[props.roomname].users).map((x) => (
        <div key={x} className='user'>
          <span className='userText'>
            <b>{x}</b>
          </span>
        </div>
      ))
    ) : (
      <></>
    )}
  </div>
);

// Fragment renders msg's
ChatWindow.Messages = (props) => (
  <div className='messages'>
    {props.messages.map((m, id) => (
      <div key={id + 1}>
        <div key={id + 1} className='message glb-msg'>
          <b>{m.nick}</b> : {m.message}
        </div>
      </div>
    ))}
    {Object.values(props.privMsg).map((m, id) => (
      <div key={id + 1}>
        <div key={id + 1} className='message priv-msg glb-msg'>
          <b>(Private) {m.user}</b> : {m.messages}
        </div>
      </div>
    ))}
  </div>
);

// Connect the socket
ChatWindow.contextType = SocketContext;

// Check proptypes
ChatWindow.propTypes = {
  roomname: PropTypes.string,
  leave: PropTypes.func,
  user: PropTypes.string,
};

ChatWindow.Messages.propTypes = {
  messages: PropTypes.array,
  privMsg: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

ChatWindow.Users.propTypes = {
  chatRoomList: PropTypes.object,
  roomname: PropTypes.string,
};

// Map states to redux store
const mapStateToProps = (reduxStoreStates) => {
  return {
    chatRoomList: reduxStoreStates.RoomListReducer,
    privMsg: reduxStoreStates.PrivateMsgReducer,
  };
};

export default connect(mapStateToProps, {getRooms, getPrivateMsg})(ChatWindow);
