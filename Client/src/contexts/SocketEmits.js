export const joinRoom = (room, socket, CB) => {
  socket.emit('joinroom', room, function (fn) {
    if (fn) {
      console.log(`Successfully joined or created room`);
      CB(fn);
    } else {
      console.log(`Failed to join, channel could be passsword protected`);
    }
  });
};

export const getRoomsData = (socket) => {
  socket.emit('rooms');
};

export const updateusers = (socket, CB) => {
  socket.on('updateusers', (room, users, ops) => {
    socket.emit('rooms');
    CB();
  });
};

export const kickUser = (socket, chatRoomList, roomname, user, CB) => {
  socket.on('kicked', (room, usern, admin) => {
    if (chatRoomList[roomname]) {
      if (
        chatRoomList[roomname].ops[user] === undefined &&
        chatRoomList[roomname].users[user] === undefined
      ) {
        CB();
      }
    }
  });
};

export const bannUser = (socket, chatRoomList, roomname, user, CB) => {
  socket.on('banned', (room, usern, admin) => {
    if (chatRoomList[roomname]) {
      if (
        chatRoomList[roomname].ops[user] === undefined &&
        chatRoomList[roomname].users[user] === undefined
      ) {
        CB();
      }
    }
  });
};

export const leaveChat = (socket, InpName, CB) => {
  socket.emit('partroom', InpName);
};

export const updateChat = (socket, CB) => {
  socket.on('updatechat', (room, Messages) => {
    CB(room, Messages);
  });
};

export const sendPrvMsg = (socket, data) => {
  socket.emit('privatemsg', data, (fn) => {
    fn ? console.log('Messages sent') : console.log('Message Not sent');
  });
};

export const sendMsg = (socket, data) => {
  socket.emit('sendmsg', data);
};

export const kickBanOrOP = (com, data, socket, CB) => {
  socket.emit(com[1], data, (fn) => {
    if (fn) {
      socket.emit('rooms');
      this.props.getRooms(socket);
      if (com[1] === '/kick') {
        console.log(`User: ${data.user} has been successfully kicked`);
      } else if (com[1] === '/ban') {
        console.log(`User: ${data.user} has been successfully banned`);
      } else {
        console.log(
          `User: ${data.user} has been successfully give admin privalidges`
        );
      }
    } else {
      console.log('Failed to kick/ban or op user');
    }
  });
};

export const loginChat = (username, socket, CB) => {
  socket.emit('adduser', username, function (available) {
    available ? CB(true) : CB(false);
  });
};
