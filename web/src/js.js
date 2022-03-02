const signaling = new WebSocket("wss://{publicIP}:8383/ws-signaling"); // handles JSON.stringify/parse
const constraints = {audio: true, video: true};
const configuration = {iceServers: [{urls: 'stun:stun.example.org'}]};
const pc = new RTCPeerConnection(configuration);
const localVideo = document.getElementById("myVideo");
const remoteVideo = document.getElementById("remoteVideo");

document.getElementById("myButton").addEventListener("click", startConnection);

pc.onicecandidate = ({candidate}) => signaling.send(JSON.stringify({id: 'candidate', value: candidate}));
pc.ontrack = ({streams}) => remoteVideo.srcObject = streams[0];
pc.onnegotiationneeded = async () => {
    await pc.setLocalDescription();
    signaling.send(JSON.stringify({id: 'description', value: pc.localDescription}));
};

signaling.onmessage = async (message) => {
    try {
		
        let data = JSON.parse(message.data);
        let id = data.id;

        switch (id) {
            case 'description':
                await pc.setRemoteDescription(data.value);

                if (data.value.type === 'offer') {
                    if (!localVideo.srcObject) {
                        await getLocalMedaDevice();
                    }
                    await pc.setLocalDescription();
                    signaling.send(JSON.stringify({id: 'description', value: pc.localDescription}));
                }
                break;
            case 'candidate':
                await pc.addIceCandidate(data.value);
                break;
        }

    } catch (err) {
        console.error(err);
    }
};

function startConnection() {
    getLocalMedaDevice();
}

async function getLocalMedaDevice() {
    // acquire camera
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    for (const track of stream.getTracks()) {
        pc.addTrack(track, stream);
    }
    localVideo.srcObject = stream;
}
