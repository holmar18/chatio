import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import { SocketIO, Server } from 'mock-socket';
import MainChat from '../MainChat';


jest.useFakeTimers();

jest.mock('../../services/socketService.js', () => {
    return {
        socket: {
            on: () => {}
        }
    }
});

describe('ChatWindow tests', () => {
    let mockSocketServer, mockSocket;

    beforeEach(() => {
        configure({adapter: new Adapter()});
        mockSocketServer = new Server('http://localhost:3050');


        mockSocketServer.on('connection', socket => {
            socket.emit('rooms');
            socket.on('roomlist', roomList => {})
        });


        mockSocket = SocketIO.connect('http://localhost:3050');

        /* A must for the socket.io to work, which relies on timers */
        jest.runOnlyPendingTimers();
    });

    it('should show that channel list has length of one and lobby is the only channel', () => {
        const component = shallow(<MainChat />);


        expect(component.props().chatRoomList.length).toBe(1);
        expect(component.state().chatRoomList['lobby']).toBe(true);
    });

    afterEach(() => {
        mockSocketServer.stop();
        mockSocket.close();
    });
});