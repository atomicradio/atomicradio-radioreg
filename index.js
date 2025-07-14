const socket = require('socket.io-client');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const socketClient = socket('https://api.atomic.radio', { transports: ['websocket'], autoConnect: false });
socketClient.on('connect', () => {
    console.log('Connected to gateway websocket');
});

function requestStreamDetails() {
    return new Promise((resolve, reject) => {
        axios.get('https://api.radioreg.net/organization/4/token/streams/details',
            { headers: { "X-API-KEY": process.env.API_KEY, "Content-Type": "application/json" } })
                .then((res) => {
                    console.info('Received stream details');
                    resolve(res.data);
                })
                .catch((err) => {
                    console.error('Failed to fetch stream details', err);
                    reject(err);
                });
    });
}

requestStreamDetails().then((streams) => {
    socketClient.connect();
    socketClient.on('update_space', (space) => {
        console.log('Received space update', space.id);
        const stream = streams.find(s => s.name.replace(/[\s-]/g, "").toLowerCase() === space.id);
        if (!stream) {
            console.error('Stream not found', space.id);
            return;
        }
        axios.post('https://api.radioreg.net/stream/update/' + stream.streamUUID, {
            title: space.current_track.title,
            artist: space.current_track.artist,
            art: space.current_track.artwork + '?width=200&height=200&sa=webp'
        }, { headers: { "X-API-KEY": process.env.API_KEY, "Content-Type": "application/json" } }).then(() => {
            console.log('Webhook sent', space.id, stream.streamUUID);
        }).catch((err) => {
            console.error('Failed to send webhook', err);
        });
    });
}).catch(() => process.exit(0));
