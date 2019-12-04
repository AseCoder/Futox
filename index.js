const Discord = require('discord.js');
global.Client = new Discord.Client();
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const FirebaseAdmin = require('firebase-admin');
const firestoreServiceAccount = require('./serviceAccount.json');
require('dotenv/config')

// Initialize Database
FirebaseAdmin.initializeApp({
  credential: FirebaseAdmin.credential.cert(firestoreServiceAccount)
});

// Add properties to Client
Object.assign(global.Client, {
  db: FirebaseAdmin.firestore(),
  coreDevs: {
    guild: '583597555095437312',
    role: '632915758422163476',
    ids: [],
  },
  defPrefix: '!',
  devPrefix: '*',
  activity: {
    name: 'outdated bots | 🍾',
    type: 'WATCHING',
    status: 'online',
  },
  commands: new Map(),
  npm: {
    Discord,
    fs,
    path,
    FirebaseAdmin,
    moment,
  },
  funcs: {},
});

// Initialize Event Modules
fs.readdir(path.join(__dirname, 'events'), (err, files) => {
  files.forEach(file => {
    global.Client.on(file.slice(0, -3), require(`./events/${file}`).run);
  });
});

// Initialize Command Modules
fs.readdir(path.join(__dirname, 'commands'), (err, files) => {
  files.forEach(file => {
    global.Client.commands.set(file.slice(0, -3), require(`./commands/${file}`))
  });
});

// Initialize Global Functions
fs.readdir(path.join(__dirname, 'functions'), (err, files) => {
  files.forEach(file => {
    global.Client.funcs[file.slice(0, -3)] = require(`./functions/${file}`).run;
  });
});

// Activate Client
global.Client.login(process.env.TOKEN);