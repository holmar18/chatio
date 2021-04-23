import { combineReducers } from 'redux';
import RoomListReducer from './RoomListReducer';
import PrivateMsgReducer from './PrivateMsgReducer';


export default combineReducers({
    RoomListReducer,
    PrivateMsgReducer,
});