import { GET_PRIVATE_MSG } from '../constants';

var privateMsg = [];

export const getPrivateMsg = (socket) => async dispatch => {
    try {
        await socket.on('recv_privatemsg', (user, msg) => {
            privateMsg = [ ...privateMsg, { user:user, messages: msg }]
            dispatch(getPrivateMsgSuccess(privateMsg));
        })
    } catch (err) {
        console.log(`Error in get private msg Actions Error: ${err}`)
    }
};


const getPrivateMsgSuccess = privateMsg => ({
    type: GET_PRIVATE_MSG,
    payload: privateMsg,
});