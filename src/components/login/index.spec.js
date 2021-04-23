import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import { SocketIO, Server } from 'mock-socket';
import LogIn from '../login';


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
            socket.on('adduser', function(username, fn) {
                socket.emit('adduser', username, true)
            })
        });


        mockSocket = SocketIO.connect('http://localhost:3050');

        /* A must for the socket.io to work, which relies on timers */
        jest.runOnlyPendingTimers();
    });

    it('should emit the new user', () => {
        const component = shallow(<LogIn />);
        const  username = 'raggi';


        component.find('#username').simulate('input', { target: { value: username } });
        component.find('#logInBtn').simulate('click');

        expect(component.state().username).toBe(username);
        expect(component.state().logedIn).toBe(true);
    });

    afterEach(() => {
        mockSocketServer.stop();
        mockSocket.close();
    });
});