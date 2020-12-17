const socket = io('http://localhost:8000');
console.log('THis file has been loaded');

const form = document.getElementById('send-data');
const messageInput = document.getElementById('inp');
const messageContainer = document.querySelector('.container');
var audio = new Audio('Tone1.mp3');
var a = new Audio('tone2.mp3');

// function wil append info to container
const append = (message, position) => {
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  messageElement.classList.add('message');
  messageElement.classList.add(position);
  messageContainer.append(messageElement);
  if (position == 'left') {
    audio.play();
  }
  if(position == 'right')
  {
    a.play();
  }
};

// send the form after submision
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = messageInput.value;
  append(`You :: ${message}`, 'right');
  socket.emit('send', message);
  messageInput.value = '';
});

//ask new user for his name
const name = prompt('Enter your name to join');
socket.emit('new-user-joined', name);

// recieve name from server
socket.on('user-joined', (name) => {
  append(`${name}:: joined the chat ! `, 'right');
});

//if a  server send message recieve
socket.on('recieve', (data) => {
  append(`${data.name}:${data.message} `, 'left');
});

// user leaves chat append info to container others know it
socket.on('left', (name) => {
  append(`${name} :: left the chat ! `, 'right');
});
