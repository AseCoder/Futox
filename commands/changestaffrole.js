module.exports = {
  name: 'changestaffrole',
  usage: '[User]',
  description: 'Promote or demote a user',
  category: 'moderation',
  async execute(msg, args, client, Discord) {
    const d = client.global.db.guilds[msg.guild.id];
    const permissions = msg.channel.permissionsFor(msg.client.user);
    if (!permissions.has('MANAGE_ROLES')) return msg.channel.send('Missing permission: Manage roles!');
    if (!msg.member.hasPermission('MANAGE_ROLES', true, true)) return msg.channel.send(client.global.replies.notAllowed);
    if (!d.roles.staff_roles) return msg.channel.send('This server has no staff roles.');
    if (!args[0]) return client.funcs.incorrectUsage(msg.channel, msg.content.split(' ')[0]);
    const member = client.funcs.fetchMember(args[0], msg);
    if (!member) return msg.channel.send(client.global.replies.noMember);

    const stuff = {
      staffroles: d.roles.staff_roles.map(x => msg.guild.roles.get(x)),
    };
    stuff.currentStaffRoles = stuff.staffroles.filter(x => x.members.has(member.user.id));

    if (stuff.currentStaffRoles.length > 0) {
      stuff.highestCurrentStaffRolePosition = Math.max(...stuff.currentStaffRoles.map(x => x.calculatedPosition));
      stuff.lowestCurrentStaffRolePosition = Math.min(...stuff.currentStaffRoles.map(x => x.calculatedPosition));
      stuff.promotables = stuff.staffroles.filter(x => x.calculatedPosition > stuff.highestCurrentStaffRolePosition);
      stuff.demotables = stuff.staffroles.filter(x => x.calculatedPosition < stuff.lowestCurrentStaffRolePosition);
    } else {
      stuff.promotables = stuff.staffroles;
    }

    const embed = new Discord.RichEmbed()
      .setTitle(`Promotion and demotion options for ${member.user.tag}:`)
      .addField('Promotion Options:', stuff.promotables.length > 0 ? stuff.promotables.map(x => x.name).join(', ') : 'None')
      .addField('Current Staff Roles:', stuff.currentStaffRoles.length > 0 ? stuff.currentStaffRoles.map(x => x.name).join(', ') : 'None')
      .addField('Demotion Options:', stuff.demotables.length > 0 ? stuff.demotables.map(x => x.name).join(', ') : 'None')
      .setFooter('Reply with the role name you would like to add or remove to or from this person. Type "CANCEL" to cancel.')
      .setColor(client.colors.botGold);
    msg.channel.send(embed);

    const collector = msg.channel.createMessageCollector(x => x.author.id === msg.author.id, { time: 25000 });
    let secondQuestion = false;
    collector.on('collect', async (cMsg) => {
      if (cMsg.content.toUpperCase() === 'CANCEL') {
        collector.stop();
        msg.channel.send('Cancelled.');
      } else if (secondQuestion === false) {
        if (!client.funcs.searchRole(cMsg.content, msg.guild) || !stuff.staffroles.map(x => x.id).includes(client.funcs.searchRole(cMsg.content, msg.guild).id)) return msg.channel.send(`"${cMsg.content}" is not a staff role name.`);
        const role = client.funcs.searchRole(cMsg.content, msg.guild);
        if (member.roles.has(role.id)) {
          await member.removeRole(role.id).catch(err => {
            msg.channel.send('I can\'t mess with that role.');
          });
          msg.channel.send(`Successfully removed role "${role.name}" from ${member.displayName}.${stuff.demotables.length === 1 ? `\nWould you like me to also add the demotion option "${stuff.demotables[0].name}" to ${member.displayName}? Reply with Y (yes) or N (no)` : ''}`);
          if (stuff.demotables.length === 1) secondQuestion = 'demote';
        } else {
          await member.addRole(role.id).catch(err => {
            msg.channel.send('I can\'t mess with that role.');
          });
          msg.channel.send(`Successfully added role "${role.name}" to ${member.displayName}.${stuff.currentStaffRoles.length === 1 ? `\nWould you like me to also remove the previous staff role "${stuff.currentStaffRoles[0].name}" from ${member.displayName}? Reply with Y (yes) or N (no)` : ''}`);
          if (stuff.currentStaffRoles.length === 1) secondQuestion = 'promote';
        }
      } else {
        if (!['Y', 'N'].includes(cMsg.content.toUpperCase())) return msg.channel.send('That was not an Y or an N. Respond with "CANCEL" to cancel.');
        if (cMsg.content.toUpperCase() === 'Y') {
          if (secondQuestion === 'promote') {
            await member.removeRole(stuff.currentStaffRoles[0].id).catch(err => {
              msg.channel.send('I can\'t mess with that role.');
            });
            msg.channel.send(`Successfully removed role ${stuff.currentStaffRoles[0].name} from ${member.displayName}`);
            collector.stop();
          } else if (secondQuestion === 'demote') {
            await member.addRole(stuff.demotables[0].id).catch(err => {
              msg.channel.send('I can\'t mess with that role.');
            });
            msg.channel.send(`Successfully added role ${stuff.demotables[0].name} to ${member.displayName}`);
            collector.stop();
          }
        } else if (cMsg.content.toUpperCase() === 'N') {
          msg.channel.send('Okay, Cancelled.');
          collector.stop();
        }
      }
    });

    collector.on('end', async (collected, reason) => {
      if (reason !== 'user') msg.channel.send('Cancelling role selection.');
    });
  },
};