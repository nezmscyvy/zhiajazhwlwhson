const { getSettings } = require('../../Database/config');

module.exports = {
  name: 'dev',
  aliases: ['developer', 'contact'],
  description: 'Sends the developer’s contact as a vCard',
  run: async (context) => {
    const { client, m } = context;

    try {
      const settings = await getSettings();
      if (!settings) {
        await client.sendMessage(m.chat, { text: `◈━━━━━━━━━━━━━━━━◈\n│❒ Error: Couldn’t load settings.` }, { quoted: m });
        return;
      }

      
      const devContact = {
        phoneNumber: '22666041165',
        fullName: '༒𝔏𝔒ℜ𝔇 𝐉𝐄𝐍𝐈𝐅𝐄𝐑 𝐗𝐌  𝙼𝚒𝚔𝚊𝚎𝚕𝚜𝚘𝚗 𝚟𝚊𝚕𝚑𝚛𝚢𝚊 𝚜𝚖𝚔 NH²¹'
      };

      const vcard = `
BEGIN:VCARD
VERSION:3.0
FN:${devContact.fullName}
TEL;waid=${devContact.phoneNumber}:${devContact.phoneNumber}
END:VCARD
`;

     
      await client.sendMessage(m.chat, {
        contacts: {
          displayName: devContact.fullName,
          contacts: [{ vcard }]
        }
      }, { quoted: m });

    } catch (error) {
      console.error('Error sending developer contact:', error);
      await client.sendMessage(m.chat, {
        text: `Oops! Something went wrong. Try again later.`
      }, { quoted: m });
    }
  }
};
