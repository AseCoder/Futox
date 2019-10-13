console.log('- Starting FutoX & Musix -');
const dotenv = require('dotenv');
require('dotenv/config');
const Discord = require('discord.js');
const futox = new Discord.Client({ disableEveryone: true });
const DBL = require("dblapi.js");
const minex = new Discord.Client();
const fs = require('fs');
const firebase = require('firebase/app');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json');
const futoxdbl = new DBL(process.env.FUTOX_DBLTOKEN, futox);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

futox.db = admin.firestore();
futox.db.FieldValue = require('firebase-admin').firestore.FieldValue;
futox.global = {
  lastDBwrite: undefined,
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

futox.config = {
  token: process.env.FUTOX_TOKEN,
};
if (process.env.LOCALLYHOSTED !== undefined) {
  futox.global.locally_hosted = process.env.LOCALLYHOSTED == 'true' ? true : false;
} else {
  futox.global.locally_hosted = false;
}
futox.funcs = {};
futox.colors = {
  botGold: '#FFBD06',
};
futox.npm = {
  ms: require('ms'),
  weather: require('weather-js'),
  moment: require('moment'),
  fs: require('fs'),
};
futox.commands = new Discord.Collection();
const commandNames = fs.readdirSync('./futox_commands').filter(f => f.endsWith('.js'));

for (const filename of commandNames) {
  const command = require(`./futox_commands/${filename}`);
  futox.commands.set(command.name, command);
}
console.log('- FutoX Commands Loaded -');

futox.on("guildMemberUpdate", (oldMember, newMember) => {
  require('./futox_events/guildMemberUpdate.js').run({ futox, Discord, newMember });
});

futox.on('guildMemberAdd', (member) => {
  require('./futox_events/guildMemberAdd.js').run({ futox, Discord, member });
});

futox.on('messageUpdate', async (oldMessage, newMessage) => {
  require('./futox_events/messageUpdate.js').run({ futox, Discord, newMessage });
});

futox.on('guildMemberRemove', async (member) => {
  require('./futox_events/guildMemberRemove.js').run({ futox, Discord, member });
});

futox.on('raw', async (event) => {
  if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(event.t)) return;
  require('./futox_events/raw.js').run({ futox, Discord, event });
});

futox.on('guildCreate', async (guild) => {
  require('./futox_events/guildCreate.js').run({ futox, Discord, guild });
});

futox.on('guildDelete', async (guild) => {
  require('./futox_events/guildDelete.js').run({ futox, Discord, guild });
});

futox.on('ready', async () => {
  require('./futox_events/ready.js').run({ futox, Discord, futoxdbl });
});

futox.on('message', async (message) => {
  require('./futox_events/message.js').run(futox, Discord, message);
});

futoxdbl.on('posted', () => {
  console.log('FutoX server count posted!');
})

futoxdbl.on('error', error => {
  console.log(`FutoX Error with DBL! ${error}`);
})

fs.readdirSync('./futox_funcs').forEach(filename => {
  futox.funcs[filename.slice(0, -3)] = require(`./futox_funcs/${filename}`);
});

futox.funcs.incorrectUsage(futox);
console.log('- FutoX Funcs Loaded -');

futox.login(futox.config.token).catch(err => { console.log('- Futox Failed To Login -'); });