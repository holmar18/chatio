import { GET_PRIVATE_MSG } from '../constants';

export default function(state = {}, action) {
    switch(action.type) {
        case GET_PRIVATE_MSG: return action.payload;
        default: return state;
    };
};