import http from 'http';
import path from 'path';
import {spawn} from 'child_process'
import express from 'express';

import { Server as SocketIO } from 'socket.io';
import { log } from 'console';
// import { Socket } from 'dgram';

const app = express();
const server = http.createServer(app);

const io=new SocketIO(server);

const options = [
    '-i',
    '-',
    '-c:v', 'libx264',
    '-preset', 'ultrafast',
    '-tune', 'zerolatency',
    '-r', `${25}`,
    '-g', `${25 * 2}`,
    '-keyint_min', 25,
    '-crf', '25',
    '-pix_fmt', 'yuv420p',
    '-sc_threshold', '0',
    '-profile:v', 'main',
    '-level', '3.1',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-ar', 128000 / 4,
    '-f', 'flv',
    `rtmp://a.rtmp.youtube.com/live2/add-your-stream-key-here-yt` // Add your stream key here,(pending...)
];

const ffmpegProcess = spawn('ffmpeg', options);

ffmpegProcess.stderr.on('data', (data) => {
    console.log(`ffmpeg stderr: ${data}`);
});

ffmpegProcess.on('data', (code) => {
    console.log(`ffmpeg stderr : ${code}`);
});

ffmpegProcess.on('close', (code) => {
    console.log(`ffmpeg exited with code ${code}`);
});

app.use(express.static(path.resolve('./public')));

    io.on('connection',socket =>{
        console.log(`Socket connected ${socket.id}`);
        socket.on('binarystream',stram =>{
            console.log(`binary stream is comming ...`);
            ffmpegProcess.stdin.write(stram);
        })
    })
 
server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});