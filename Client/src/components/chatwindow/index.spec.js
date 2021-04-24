import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import { SocketIO, Server } from 'mock-socket';
import ChatWindow from './index';


jest.useFakeTimers();

jest.mock('../../services/socketService', () => {
    return {
        socket: {
            on: () => {}
        }
    }
});

describe('ChatWindow tests', () => {
    let mockSocketServer, mockSocket;

    beforeEach(() => {
        mockSocketServer = new Server('http://localhost:3050');
        configure({adapter: new Adapter()});


        mockSocketServer.on('connection', socket => {
            socket.on('updatechat', (room, Messages) => {
                socket.emit('sendmsg', Messages);
            });
        });


        mockSocket = SocketIO.connect('http://localhost:3050');

        /* A must for the socket.io to work, which relies on timers */
        jest.runOnlyPendingTimers();
    });

    it('should emit the right message', () => {
        const data = { nick: "raggi", message: 'Hello, everybody!'}
        const component = shallow(<ChatWindow />);

        component.find('#msgInput').simulate('input', { target: { value: data['message'] } });
        component.find('button').first().simulate('click');

        expect(component.state().messages.length).toBe(1);
        expect(component.state().messages[0]).toEqual(`${data['nick']} : ${data['message']}`);
    });

    afterEach(() => {
        mockSocketServer.stop();
        mockSocket.close();
    });
});