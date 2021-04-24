import {createContext} from 'react';
import connectToSocketIOServer from 'socket.io-client';

const SocketContext = createContext({
  socket: connectToSocketIOServer('http://localhost:5000'),
});

export default SocketContext;
