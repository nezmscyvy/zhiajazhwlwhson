const middleware = require('../../utility/botUtil/middleware');
const { getSettings } = require('../../Database/config');

module.exports = {
  name: 'demote',
  aliases: ['unadmin', 'removeadmin'],
  description: 'Demotes a user from admin in a group',
  run: async (context) => {
    await middleware(context, async () => {
      const { client, m, botname, prefix } = context;

      if (!botname) {
        console.error('MIKAEL-XD: Botname not set in context');
        return m.reply(
          `◈━━━━━━━━━━━━━━━━◈\n│❒ Bot’s fucked, ${m.pushName}! 😤 No botname set. Yell at the dev, dipshit! 💀\n┗━━━━━━━━━━━━━━━┛`
        );
      }

      if (!m.isGroup) {
        console.log(`MIKAEL-XD: Demote command attempted in non-group chat by ${m.sender}`);
        return m.reply(
          `◈━━━━━━━━━━━━━━━━◈\n│❒ Yo, ${m.pushName}, you dumb fuck! 😈 This ain’t a group! Use ${prefix}demote in a group, moron! 🖕\n┗━━━━━━━━━━━━━━━┛`
        );
      }

      // Fetch group metadata with retry
      let groupMetadata;
      try {
        groupMetadata = await client.groupMetadata(m.chat);
      } catch (e) {
        console.error(`MIKAEL-XD: Error fetching group metadata: ${e.stack}`);
        return m.reply(
          `◈━━━━━━━━━━━━━━━━◈\n│❒ Shit broke, ${m.pushName}! 😤 Couldn’t get group data: ${e.message}. Fix this crap! 💀\n┗━━━━━━━━━━━━━━━┛`
        );
      }

      const members = groupMetadata.participants;
      const admins = members
        .filter((p) => p.admin != null)
        .map((p) => p.id.split(':')[0]); // Normalize JIDs
      const botId = client.user.id.split(':')[0]; // Normalize bot ID
      console.log(`MIKAEL-XD: Bot ID: ${botId}, Admins: ${JSON.stringify(admins)}`);

      if (!admins.includes(botId)) {
        console.log(`MIKAEL-XD: Bot ${botId} is not admin in ${m.chat}`);
        return m.reply(
          `◈━━━━━━━━━━━━━━━━◈\n│❒ OI, ${m.pushName}! 😤 I ain’t admin, so I can’t demote anyone! Make me admin or fuck off! 🚫\n┗━━━━━━━━━━━━━━━┛`
        );
      }

      // Check for mentioned or quoted user
      if (!m.quoted && (!m.mentionedJid || m.mentionedJid.length === 0)) {
        console.log(`MIKAEL-XD: No user mentioned or quoted for demote by ${m.pushName}`);
        return m.reply(
          `◈━━━━━━━━━━━━━━━━◈\n│❒ Brain-dead moron, ${m.pushName}! 😡 Mention or quote a user to demote! Try ${prefix}demote @user, idiot! 🖕\n┗━━━━━━━━━━━━━━━┛`
        );
      }

      const user = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : null);
      if (!user) {
        console.log(`MIKAEL-XD: Invalid user for demote in ${m.chat}`);
        return m.reply(
          `◈━━━━━━━━━━━━━━━━◈\n│❒ What the fuck, ${m.pushName}? 😳 No valid user to demote! Try again, you useless shit! 💀\n┗━━━━━━━━━━━━━━━┛`
        );
      }

      const userNumber = user.split('@')[0];
      const userName =
        m.mentionedJid[0]
          ? members.find((p) => p.id.split(':')[0] === user.split(':')[0])?.name || userNumber
          : m.quoted?.pushName || userNumber;

      // Protect the owner
      const settings = await getSettings();
      const ownerNumber = settings.owner || '22666041165@s.whatsapp.net';
      if (user.split(':')[0] === ownerNumber.split(':')[0]) {
        console.log(`MIKAEL-XD: Attempt to demote owner ${user} by ${m.pushName}`);
        return m.reply(
          `◈━━━━━━━━━━━━━━━━◈\n│❒ YOU PATHETIC WORM, ${m.pushName}! 😤 Trying to demote the SUPREME BOSS? You’re lower than dirt! 🦄\n┗━━━━━━━━━━━━━━━┛`
        );
      }

      // Check if user is admin
      if (!admins.includes(user.split(':')[0])) {
        console.log(`MIKAEL-XD: User ${userName} (${user}) is not admin in ${m.chat}`);
        return m.reply(
          `◈━━━━━━━━━━━━━━━━◈\n│❒ Yo, ${m.pushName}, you dumbass! 😎 ${userName} ain’t even admin! Stop fucking around! 🖕\n┗━━━━━━━━━━━━━━━┛`
        );
      }

      try {
        await client.groupParticipantsUpdate(m.chat, [user], 'demote');
        console.log(`MIKAEL-XD: Successfully demoted ${userName} (${user}) in ${m.chat}`);
        await m.reply(
          `◈━━━━━━━━━━━━━━━━◈\n│❒ HAHA, ${userName} GOT STRIPPED! 😈 No more admin for this loser, thanks to *${botname}*! Beg for mercy, trash! 🎗️\n┗━━━━━━━━━━━━━━━┛`,
          { mentions: [user] }
        );
      } catch (error) {
        console.error(`MIKAEL-XD: Demote command error: ${error.stack}`);
        await m.reply(
          `◈━━━━━━━━━━━━━━━━◈\n│❒ Shit broke, ${m.pushName}! 😤 Couldn’t demote ${userName}: ${error.message}. Try later, incompetent fuck! 💀\n┗━━━━━━━━━━━━━━━┛`
        );
      }
    });
  },
};
