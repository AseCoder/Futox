// Copyright (c) 2019 AseCoder
console.log('- Starting FutoX -');
const dotenv = require('dotenv');
require('dotenv/config');
const Discord = require('discord.js');
const client = new Discord.Client({ disableEveryone: true });
const DBL = require("dblapi.js");
const fs = require('fs');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json');
const dbl = new DBL(process.env.DBLTOKEN, client);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

client.db = admin.firestore();
client.db.FieldValue = require('firebase-admin').firestore.FieldValue;
client.global = {
  lastOnline: {},
  dbwrite: {
    lastAttempt: {
      success: undefined,
      timestamp: undefined,
    },
    unsavedChanges: false,
    nextAttemptTimestamp: undefined,
  },
  pings: [],
  core_devs: [
    {
      tag: 'AseBuilder05#6516',
      id: '384002606621655040',
    },
    {
      tag: 'Matte#0002',
      id: '360363051792203779',
    },
  ],
  replies: {
    notAllowedFunc: (perms) => {
      let output = 'You are not allowed to do that!';
      perms = perms.forEach(x => x = x.toUpperCase().replace(new RegExp(' '), '_'));
      const permissions = new Discord.Permissions(null, perms);
      return permissions.toArray();
    },
    notAllowed: 'You are not allowed to do that!',
    noMember: 'I could not obtain The User.',
    fiveMinutes: 'Please wait 5 minutes for the server information to refresh.',
  },
  db: {
    guilds: {},
    musix_guilds: {},
    specs: {},
  },
  channelDescs: {
    member_logs: 'I send a message here whenever someone leaves or joins this server.',
    modmail: 'Whenever someone uses the `!modmail` command, I send the mail to this channel. Keep this channel staff-only.',
    punishments: 'Whenever someone uses a punishment command, I send information about the punishment here.',
    reports: 'I send information about `!report` uses here.',
    rules: 'You can send your Discord server\'s rules here and react to the last message with a :heavy_check_mark: (heavy_check_mark). My `!verified` command will use this feature.',
    swear_detection: 'If this server has swear detection (`!sweardetection`) enabled, I will send messages here whenever someone swears. Keep this channel staff-only.',
    welcome: 'I greet new users here when they join the server and tell them to read the rules if this server has a rules channel.'
  },
  roleDescs: {
    administration: 'People with this role take care of almost everything and can access nearly all commands.',
    bot: 'This role is given to bot accounts when they join the server.',
    highest_role: 'This role can access all commands. Normally server owners have this role.',
    member: 'This role is given to normal users when they join this server.',
    moderator: 'This role can access all punishment commands.',
    staff: 'This role has access to some punishment commands',
    verified: 'If this server has a rules channel set, this role will be given to users when they react with a :heavy_check_mark: (heavy_check_mark) to the last message in the rules channel',
    staff_roles: 'These roles will be available as promotions / demotions in `!changestaffrole`. Separate role names with commas (**,**)',
  },
};

client.config = {
  token: process.env.TOKEN,
};
if (process.env.LOCALLYHOSTED !== undefined) {
  client.global.locally_hosted = process.env.LOCALLYHOSTED == 'true' ? true : false;
} else {
  client.global.locally_hosted = false;
}
client.funcs = {};
client.colors = {
  botGold: '#FFBD06',
};
client.npm = {
  ms: require('ms'),
  weather: require('weather-js'),
  moment: require('moment'),
  fs: require('fs'),
  canvas: require('canvas'),
};
client.commands = new Discord.Collection();
const commandNames = fs.readdirSync('./commands').filter(f => f.endsWith('.js'));

for (const filename of commandNames) {
  const command = require(`./commands/${filename}`);
  client.commands.set(command.name, command);
}
console.log('- FutoX Commands Loaded -');

client.on("guildMemberUpdate", (oldMember, newMember) => {
  require('./events/guildMemberUpdate.js').run({ futox: client, Discord, newMember });
});

client.on('guildMemberAdd', (member) => {
  require('./events/guildMemberAdd.js').run({ futox: client, Discord, member });
});

client.on('messageUpdate', async (oldMessage, newMessage) => {
  require('./events/messageUpdate.js').run({ futox: client, Discord, newMessage });
});
/*
client.on('presenceUpdate', async (oldMember, newMember) => {
  require('./events/presenceUpdate.js').run({ futox: client, Discord, oldMember, newMember });
});
*/
client.on('roleDelete', async (role) => {
  require('./events/roleDelete.js').run({ futox: client, role, Discord });
});

client.on('guildMemberRemove', async (member) => {
  require('./events/guildMemberRemove.js').run({ futox: client, Discord, member });
});

client.on('raw', async (event) => {
  if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(event.t)) return;
  require('./events/raw.js').run({ futox: client, Discord, event });
});

client.on('guildCreate', async (guild) => {
  require('./events/guildCreate.js').run({ futox: client, Discord, guild });
});

client.on('guildDelete', async (guild) => {
  require('./events/guildDelete.js').run({ futox: client, Discord, guild });
});

client.on('ready', async () => {
  require('./events/ready.js').run({ futox: client, Discord, futoxdbl: dbl });
});

client.on('message', async (message) => {
  require('./events/message.js').run(client, Discord, message);
});

dbl.on('posted', () => {
  console.log('FutoX server count posted!');
})

dbl.on('error', error => {
  console.log(`FutoX Error with DBL! ${error}`);
})

fs.readdirSync('./funcs').forEach(filename => {
  client.funcs[filename.slice(0, -3)] = require(`./funcs/${filename}`);
});

client.funcs.incorrectUsage(client);
console.log('- FutoX Funcs Loaded -');

client.login(client.config.token).catch(err => { console.log('- Futox Failed To Login -'); });
