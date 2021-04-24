export const GET_ROOM_LIST = 'GET_ROOM_LIST';
export const GET_PRIVATE_MSG = 'GET_PRIVATE_MSG';

export const logScrConst = {
  alert: {
    userNameEmpty: "Username can't be an empty",
    success: 'Success',
    userNameInUse: 'Username in use',
  },
  nick: 'Enter nickname',
};

export const mainChatConst = {
  commands: {
    join: '/join',
    leave: '/leave',
    kick: '/kick',
    ban: '/ban',
    op: '/op',
    msg: '/msg',
    help: '/help',
    cmdDisplay:
      'Join Create: /join "rooma name" \nKick: /kick "nickname" \nBan: /ban "nickname" \nGive admin /op "nickname" \nPrivate msg: /msg nickname \nLeave channel: /leave "channel name"',
  },
  placehldrs: {
    cmd: 'Enter command here...',
  },
};
