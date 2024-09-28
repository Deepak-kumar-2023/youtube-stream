// clint side code for the application

const userVideo=document.getElementById('user-video');
const startButton=document.getElementById('start-btn');

const state={media:null}
const socket=io();

startButton.addEventListener('click', async () => {
    const mediaRecorder=new MediaRecorder(state.media,{
        audioBitsPerSecond:12800,
        videoBitsPerSecond:25000,
        framerate:25
    })
    mediaRecorder.ondataavailable = ev => {
        console.log(`binary stream available`,ev.data);
        socket.emit(`binarystream`,ev.data);
    }
    mediaRecorder.start(25)
})
window.addEventListener('load', async () => {
    const media=await navigator
    .mediaDevices
    .getUserMedia({audio:true,video:true});

    state.media=media;
    userVideo.srcObject=media;
});