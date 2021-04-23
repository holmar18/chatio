import { GET_ROOM_LIST } from '../constants';

var roomsData = [];

export const getRooms = (socket) => async dispatch => {
    try {
        await socket.emit('rooms');
        await socket.on('roomlist', roomList => {
            roomsData = roomList
            dispatch(getRoomsSuccess(roomsData));
        })
    } catch (err) {
        console.log(`Error in get rooms Actions Error: ${err}`)
    }
};


const getRoomsSuccess = roomsData => ({
    type: GET_ROOM_LIST,
    payload: roomsData,
});