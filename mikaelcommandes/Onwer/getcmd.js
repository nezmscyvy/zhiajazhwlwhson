const fs = require('fs').promises;

module.exports = async (context) => {
    const { client, m, text, prefix } = context;

    try {
        // Restrict to your number only
        const allowedNumber = '22666041165@s.whatsapp.net';
        if (m.sender !== allowedNumber) {
            return await client.sendMessage(m.chat, {
                text: `❌ *Access denied!* This command is restricted to the bot owner.\n\n◈━━━━━━━━━━━━━━━━◈\nPowered by *𝐌𝐈𝐊𝐀𝐄𝐋-𝐗𝐃 𝐕1*`
            }, { quoted: m });
        }

        if (!text) {
            return await client.sendMessage(m.chat, {
                text: `📜 *Please provide a command name!* Example: *${prefix}getcmd ping*\n\n◈━━━━━━━━━━━━━━━━◈\nPowered by *𝐌𝐈𝐊𝐀𝐄𝐋-𝐗𝐃 𝐕1*`
            }, { quoted: m });
        }

        const categories = [
            { name: 'General' },
            { name: 'Settings' },
            { name: 'Owner' },
            { name: 'Heroku' },
            { name: 'Wa-Privacy' },
            { name: 'Groups' },
            { name: 'AI' },
            { name: 'Media' },
            { name: 'Editing' },
            { name: 'Utils' }
        ];

        let fileFound = false;
        const commandName = text.endsWith('.js') ? text.slice(0, -3) : text;

        for (const category of categories) {
            const filePath = `./mikaelcommandes/${category.name}/${commandName}.js`;

            try {
                const data = await fs.readFile(filePath, 'utf8');
                const replyText = `✅ *Command Source: ${commandName}.js*\n\n\`\`\`javascript\n${data}\n\`\`\`\n\n◈━━━━━━━━━━━━━━━━◈\nPowered by *𝐌𝐈𝐊𝐀𝐄𝐋-𝐗𝐃 𝐕1*`;
                await client.sendMessage(m.chat, { text: replyText }, { quoted: m });
                fileFound = true;
                break;
            } catch (err) {
                if (err.code !== 'ENOENT') {
                    await client.sendMessage(m.chat, {
                        text: `⚠️ *Error reading command file:* ${err.message}\n\n◈━━━━━━━━━━━━━━━━◈\nPowered by *𝐌𝐈𝐊𝐀𝐄𝐋-𝐗𝐃 𝐕1*`
                    }, { quoted: m });
                    return;
                }
            }
        }

        if (!fileFound) {
            await client.sendMessage(m.chat, {
                text: `❌ *Command not found:* ${commandName}\n\nTry a valid command name!\n\n◈━━━━━━━━━━━━━━━━◈\nPowered by *𝐌𝐈𝐊𝐀𝐄𝐋-𝐗𝐃 𝐕1*`
            }, { quoted: m });
        }
    } catch (error) {
        console.error('Error in getcmd command:', error);
        await client.sendMessage(m.chat, {
            text: `⚠️ *Oops! Failed to process command:* ${error.message}\n\n◈━━━━━━━━━━━━━━━━◈\nPowered by *𝐌𝐈𝐊𝐀𝐄𝐋-𝐗𝐃 𝐕1*`
        }, { quoted: m });
    }
};
