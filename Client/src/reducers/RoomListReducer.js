import { GET_ROOM_LIST } from '../constants';

export default function(state = {}, action) {
    switch(action.type) {
        case GET_ROOM_LIST: return action.payload;
        default: return state;
    };
};