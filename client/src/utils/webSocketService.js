import { fetchEvents } from "../features/events/eventActions";
import { updateEventParticipants } from "../features/events/eventSlice";
import { fetchUsers } from "../features/user/userActions";

let socket = null;

export const connectWebSocket = (dispatch) => {

    if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
        console.log('WebSocket is already open or connecting');
        return;
    }

    socket = new WebSocket('ws://localhost:3003');

    socket.onopen = () => {
        console.log('Connected to WebSocket');
        dispatch(fetchUsers());
    };

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    // USERS
    if (
        data.type === 'NEW_USER' ||
        data.type === 'USER_DELETED' ||
        data.type === 'USER_UPDATED'
    ) {
        dispatch(fetchUsers());
    }

    // EVENTS - heavy updates
    if (
        data.type === 'NEW_EVENT' ||
        data.type === 'EVENT_DELETED'
    ) {
        dispatch(fetchEvents());
    }

    //EVENTS - smart update
    if (data.type === 'EVENT_UPDATED') {
        dispatch(updateEventParticipants(data.payload));
    }
};

    socket.onclose = (event) => {
        console.log('WebSocket closed:', event.reason || 'No reason provided');
        socket = null;

        if (!event.wasClean) {
            setTimeout(() => {
                console.log('Reconnecting WebSocket after unexpected closure...');
                connectWebSocket(dispatch);
            }, 5000);
        }
    };

        socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        socket = null;

        setTimeout(() => {
            console.log('Retrying WebSocket connection...');
            connectWebSocket(dispatch);
        }, 5000);
    };
    
};

export const closeWebSocket = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        console.log('Closing WebSocket connection');
        socket.addEventListener('close', () => {
            console.log('WebSocket successfully closed');
            socket = null;
        });
        socket.close();
    } else {
        console.log('WebSocket is already closed or closing');
        socket = null;
    }
};
