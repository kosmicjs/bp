/* eslint-disable no-console */
import {io} from 'socket.io-client';

const socket = io('http://127.0.0.1:2222/');
socket.on('disconnect', () => {
  console.log('[vite-node] disconnected');
});
socket.on('connect', () => {
  console.log('[vite-node] connected');
});
socket.on('restart', (data) => {
  console.log('data', data);
  window.location.reload();
});
