const socket = require('socket.io-client');
const axios = require('axios');

const spaceIds = [
    { id: "dopephonk", webhook: "https://api.radioreg.net/stream/update/06f0b5d0-9d78-4d92-8ae4-28e40977ee18" },
    { id: "gaming", webhook: "https://api.radioreg.net/stream/update/a0f92dbb-f792-4770-b893-e121e2cda72c" },
    { id: "acoustic", webhook: "https://api.radioreg.net/stream/update/9be1c2b8-23fc-4d46-87df-58af96a937f3" },
    { id: "hitradar", webhook: "https://api.radioreg.net/stream/update/9a6f129a-0ac8-4a8a-906a-e42dbe40aed6" },
    { id: "synthwave", webhook: "https://api.radioreg.net/stream/update/f755e441-56b9-490a-b82c-f088ab242bde" },
    { id: "hitshistory", webhook: "https://api.radioreg.net/stream/update/200e4138-eeab-4c56-ab6c-d0d932863242" },
    { id: "clubsounds", webhook: "https://api.radioreg.net/stream/update/dc0cba53-c08d-4c30-9a31-46cc9ee9e517" },
    { id: "remix", webhook: "https://api.radioreg.net/stream/update/36c10f34-becb-4b52-8ccd-97f43bc81b64" },
    { id: "fightclubgermany", webhook: "https://api.radioreg.net/stream/update/5d76e56c-ae2b-47f7-a6fe-ff6595778f37" },
    { id: "charts", webhook: "https://api.radioreg.net/stream/update/bcff426b-6acd-4e06-914c-25e46c5dae26" },
    { id: "fightclub", webhook: "https://api.radioreg.net/stream/update/13917cfd-d136-4e72-b543-e5b443573bb5" },
];

const socketClient = socket('https://api.atomic.radio', { transports: ['websocket'] });
socketClient.connect();
socketClient.on('connect', () => {
    console.log('Connected to gateway websocket');
});
socketClient.on('update_space', (space) => {
    console.log('Received space update', space.id);
    const spaceId = spaceIds.find(s => s.id === space.id);
    if (!spaceId) return;
    axios.post(spaceId.webhook, {
        title: space.current_track.title,
        artist: space.current_track.artist
    }, { headers: { "X-API-KEY": "xxx", "Content-Type": "application/json" } }).then(() => {
        console.log('Webhook sent', space.id);
    }).catch((err) => {
        console.error('Failed to send webhook', err);
    });
});