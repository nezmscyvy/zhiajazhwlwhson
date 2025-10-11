module.exports = async (context) => {
  const { client, m, text, botname, fetchJson } = context;

  if (!text || text.trim() === '') {
    return m.reply(`◈━━━━━━━━━━━━━━━━◈\n│❒ Yo, brain-dead moron, give me some text for the Write Text logo! Use *!writetext SomeText* or fuck off! 😡`);
  }

  try {
    const cleanedText = text.trim().slice(0, 50).replace(/[^a-zA-Z0-9\s]/g, '');
    if (cleanedText.length < 3) {
      return m.reply(`◈━━━━━━━━━━━━━━━━◈\n│❒ What’s this weak-ass text, ${m.pushName}? At least 3 characters, you dumbass! 🙄`);
    }

    const encodedText = encodeURIComponent(cleanedText);
    const data = await fetchJson(`https://api.giftedtech.web.id/api/ephoto360/writetext?apikey=gifted&text=${encodedText}`);

    if (data && data.success && data.result && data.result.image_url) {
      const caption = `◈━━━━━━━━━━━━━━━━◈\n│❒ Here’s your damn *Write Text* logo, ${m.pushName}! Don’t waste my time again, you prick! 😤\n` +
                     `📸 *Text*: ${cleanedText}\n` +
                     `🔗 *Source*: Even MIKAEL-XD’s magic, bitches!\n` +
                     `◈━━━━━━━━━━━━━━━━◈\nPowered by *${botname}*`;

      await client.sendMessage(m.chat, { 
        image: { url: data.result.image_url }, 
        caption: caption 
      }, { quoted: m });
    } else {
      await m.reply(`◈━━━━━━━━━━━━━━━━◈\n│❒ API’s being a bitch, no Write Text logo for you, loser! Try again later. 😒`);
    }
  } catch (error) {
    console.error('WriteText API error:', error);
    await m.reply(`◈━━━━━━━━━━━━━━━━◈\n│❒ Shit hit the fan, ${m.pushName}! Error: ${error.message}. Bug off and try later, you slacker! 😡\nCheck https://github.com/musicopilotvf456-eng/mikael-xd- for help.`);
  }
};
