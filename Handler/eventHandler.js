const { getGroupSetting, getSudoUsers } = require("../Database/config");

const Events = async (client, event, pict) => {
    const botJid = await client.decodeJid(client.user.id);

    try {
        const metadata = await client.groupMetadata(event.id);
        const participants = event.participants;
        const desc = metadata.desc || "Some boring group, I guess.";
        const groupSettings = await getGroupSetting(event.id);
        const eventsEnabled = groupSettings?.events === true;
        const antidemote = groupSettings?.antidemote === true;
        const antipromote = groupSettings?.antipromote === true;
        const sudoUsers = await getSudoUsers();
        const currentDevs = Array.isArray(sudoUsers)
            ? sudoUsers.map(v => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net")
            : [];

        for (const participant of participants) {
            let dpUrl = pict;
            try {
                dpUrl = await client.profilePictureUrl(participant, "image");
            } catch {
                dpUrl = pict; // Fallback to default pic if user has no DP
            }

            if (eventsEnabled && event.action === "add") {
                try {
                    const userName = participant.split("@")[0];
                    const welcomeText = 
`╭───「 💉 𝙼𝙸𝙺𝙰𝙴𝚕-x𝙳 𝐖𝐞𝐥𝐜𝐨𝐦𝐞 💉 」
│ 😈 *Yo, @${userName}, welcome to the chaos!*  
│
│ 🤖 *Bot*: 𝙼𝙸𝙺𝙰𝙴𝙻-x𝙳
│ 🦁 *Group*: ${metadata.subject}
│ 📜 *Desc*: ${desc}
│
│ 😼 *Try not to get roasted too hard, newbie!*
╰───「 🔥 Powered by 𝙼𝙸𝙺𝙰𝙴𝙻-x𝙳 🔥 」`;

                    await client.sendMessage(event.id, {
                        image: { url: dpUrl },
                        caption: welcomeText,
                        mentions: [participant]
                    });
                } catch {
                    // Keep it chill, no error spam
                }
            } else if (eventsEnabled && event.action === "remove") {
                try {
                    const userName = participant.split("@")[0];
                    const leaveText = 
`╭───「 🚪 𝙼𝙸𝙺𝙰𝙴𝙻-x𝙳 𝐄𝐱𝐢𝐭 🚪 」
│ 😎 *Later, @${userName}! Couldn’t handle the heat?*  
│
│ 🤖 *Bot*: 𝙳𝙰𝚅𝙴-x𝙳
│ 🦁 *Group*: ${metadata.subject}
│
│ 😜 *Don’t cry, we’ll survive without ya!*
╰───「 🔥 Powered by 𝙼𝙸𝙺𝙰𝙴𝙻-x𝙳 🔥 」`;

                    await client.sendMessage(event.id, {
                        image: { url: dpUrl },
                        caption: leaveText,
                        mentions: [participant]
                    });
                } catch {
                    // No whining about errors
                }
            }

            if (event.action === "demote" && antidemote) {
                try {
                    if (
                        event.author === metadata.owner ||
                        event.author === botJid ||
                        event.author === participant ||
                        currentDevs.includes(event.author)
                    ) {
                        await client.sendMessage(event.id, {
                            text: 
`╭───「 🔽 𝙼𝙸𝙺𝙰𝙴𝙻-x𝙳 𝐃𝐞𝐦𝐨𝐭𝐢𝐨𝐧 🔽 」
│ 😤 *Big shot @${participant.split("@")[0]} got knocked down!*  
│
│ 🤖 *Bot*: 𝙼𝙸𝙺𝙰𝙴𝙻-x𝙳
│ 🦁 *Group*: ${metadata.subject}
╰───「 🔥 Powered by 𝙼𝙸𝙺𝙰𝙴𝙻-x𝙳 🔥 」`,
                            mentions: [participant]
                        });
                        return;
                    }

                    await client.groupParticipantsUpdate(event.id, [event.author], "demote");
                    await client.groupParticipantsUpdate(event.id, [participant], "promote");

                    await client.sendMessage(event.id, {
                        text: 
`╭───「 🔽 𝙼𝙸𝙺𝙰𝙴𝙻-x𝙳 𝐀𝐧𝐭𝐢𝐝𝐞𝐦𝐨𝐭𝐞 🔽 」
│ 😏 *Nice try, @${event.author.split("@")[0]}! Demoted for messing with @${participant.split("@")[0]}!*  
│
│ 🤖 *Bot*: 𝙼𝙸𝙺𝙰𝙴𝙻-x𝙳
│ 🦁 *Group*: ${metadata.subject}
│ 📜 *Rule*: Antidemote’s on, loser. Only the big dogs can demote!
╰───「 🔥 Powered by 𝙼𝙸𝙺𝙰𝙴𝙻-x𝙳 🔥 」`,
                        mentions: [event.author, participant]
                    });
                } catch {
                    // Errors? Pfft, 
                }
            } else if (event.action === "promote" && antipromote) {
                try {
                    if (
                        event.author === metadata.owner ||
                        event.author === botJid ||
                        event.author === participant ||
                        currentDevs.includes(event.author)
                    ) {
                        await client.sendMessage(event.id, {
                            text: 
`╭───「 🔼 𝙼𝙸𝙺𝙰𝙴𝙻-x𝙳 𝐏𝐫𝐨𝐦𝐨𝐭𝐢𝐨𝐧 🔼 」
│ 😎 *OTC @${participant.split("@")[0]} just leveled up!*  
│
│ 🤖 *Bot*: 𝙼𝙸𝙺𝙰𝙴𝙻-x𝙳
│ 🦁 *Group*: ${metadata.subject}
╰───「 🔥 Powered by 𝙼𝙸𝙺𝙰𝙴𝙻-x𝙳 🔥 」`,
                            mentions: [participant]
                        });
                        return;
                    }

                    await client.groupParticipantsUpdate(event.id, [event.author, participant], "demote");

                    await client.sendMessage(event.id, {
                        text: 
`╭───「 🔼 𝙼𝙸𝙺𝙰𝙴𝙻-x𝙳 𝐀𝐧𝐭𝐢𝐩𝐫𝐨𝐦𝐨𝐭𝐞 🔼 」
│ 😆 *Oof, @${event.author.split("@")[0]}! Demoted for trying to boost @${participant.split("@")[0]}!*  
│
│ 🕳️ *Bot*: 𝙼𝙸𝙺𝙰𝙴𝙻-x𝙳
│ 🦁 *Group*: ${metadata.subject}
│ 📜 *Rule*: @${participant.split("@")[0]} got yeeted too. Antipromote’s on, only the elite can promote!
╰───「 🔥 Powered by 𝙼𝙸𝙺𝙰𝙴𝙻-x𝙳 🔥 」`,
                        mentions: [event.author, participant]
                    });
                } catch {
                    // Errors are for the weak
                }
            }
        }
    } catch {
        try {
            await client.sendMessage(event.id, {
                text: 
`╭───「 ⚠️ 𝙼𝙸𝙺𝙰𝙴𝙻-x𝙳 𝐄𝐫𝐫𝐨𝐫 ⚠️ 」
│ 😬 *Yikes, something broke. Blame the group vibes!*  
│
│ 🤖 *Bot*: 𝙼𝙸𝙺𝙰𝙴𝙻-x𝙳 
│ 🦁 *Group*: ${metadata.subject}
╰───「 🔥 Powered by 𝙼𝙸𝙺𝙰𝙴𝙻-x𝙳 🔥 」`
            });
        } catch {
            // let cloner fix the error
        }
    }
};

module.exports = Events;
