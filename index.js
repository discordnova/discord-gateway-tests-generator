/**
 * discord-tests-generate, generate example json data using the discord
 * api designated for the Nova's Gateway tests.
 * 
 * Copyright (C) 2021  Nova
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { Client } from "discord.js";
import { writeFileSync, readFileSync } from "fs";
import pkg from 'chalk';
const { blue, bold, green } = pkg;

/** @type {import("discord.js").Client} Creates a new Discord.js client with all the possible indents,  This is used to receive discord events. */
const client = new Client({
    intents: [
        "DIRECT_MESSAGES",
        "DIRECT_MESSAGE_REACTIONS",
        "DIRECT_MESSAGE_TYPING",
        "GUILDS",
        "GUILD_BANS",
        "GUILD_EMOJIS_AND_STICKERS",
        "GUILD_INTEGRATIONS",
        "GUILD_INVITES",
        "GUILD_MEMBERS",
        "GUILD_MESSAGES",
        "GUILD_MESSAGE_REACTIONS",
        "GUILD_MESSAGE_TYPING",
        "GUILD_PRESENCES",
        "GUILD_VOICE_STATES",
        "GUILD_WEBHOOKS",
    ]
});

/**  @type {Map<String, Object[]>} Holds all the data about the received events. */
const events = new Map();
/** @type {Map<String, boolean>} Since we save the files every 5s, we save when we need to save a file. */
const written = new Map();
/** @type {boolean} */
const done = false;

/**
 * Saves the received events to the map.
 */
client.on("raw", (data) => {
    if (data.t) {
        if (events.has(data.t)) {
            events.get(data.t).push(data.d);
        } else {
            events.set(data.t, [data.d]);
        }
        written.set(data.t, true);
    }
});

/**
 * Avoids creating a circular dependency on serialization.
 * @returns {() => any}
 */
const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
                return;
            }
            seen.add(value);
        }
        return value;
    };
};

/**
 * Saves the modified data every five seconds.
 */
setInterval(() => {
    if (!done) {
        for (let [k, v] of events) {
            if (written.get(k)) {
                writeFileSync(`data/${k}.json`, JSON.stringify(v, getCircularReplacer()));
                written.set(k, false);
            }
        }
    }
}, 5000);

client.on("ready", async() => {
    // Deletes all the past guilds.
    // WARNING: this delete guilds owned by the bot.
    console.log(bold(green("Leaving past guilds...")));

    for (let gid of client.guilds.cache.keys()) {
        const guild = await client.guilds.fetch(gid);
        if (guild.ownerId === client.user.id) {
            try {
                await guild.delete();
            } catch (e) {
                console.log(e);
            }
        }
    }

    console.log(bold(green("Creating guild...")));
    // bots under 10 servers can create guilds
    let guild = await client.guilds.create("test-guild");

    // GUILD_UPDATE
    await guild.setName("test" + Math.random());

    // GUILD_ROLE_CREATE
    let role = await guild.roles.create("test");
    // GUILD_ROLE_UPDATE
    await role.setPermissions("ADMINISTRATOR");

    // CHANNEL_CREATE
    let channel = await guild.channels.create("test", { type: "GUILD_TEXT" });
    // CHANNEL_UPDATE
    await channel.setTopic("test");

    // MESSAGE_CREATE
    let message = await channel.send("test!");
    // MESSAGE_UPDATE
    await message.edit("test edited!");

    // CHANNEL_PINS_UPDATE
    await message.pin();

    // MESSAGE_REACTION_ADD
    await message.react("☠️");
    // MESSAGE_REACTION_REMOVE_ALL
    await message.reactions.removeAll();

    // MESSAGE_REACTION_ADD
    await message.react("☠️");

    // MESSAGE_REACTION_REMOVE_EMOJI
    await message.reactions.resolve("☠️").remove();
    await message.react("☠️");

    // MESSAGE_REACTION_REMOVE
    await message.reactions.resolve("☠️").users.remove(client.user);

    // PRESENCE_UPDATE
    client.user.setPresence({ status: "invisible" });

    // TYPING_START
    await channel.sendTyping();

    // WEBHOOKS_UPDATE
    await channel.createWebhook("test");

    // INVITE_CREATE
    let invite = await channel.createInvite({ maxUses: 100 });

    console.log(bold(green(`Please, join the test guild at ${invite.url}`)));

    // TRIGGERS GUILD_MEMBER_ADD
    let user = await new Promise((r) => {
        client.once("guildMemberAdd", (user) => {
            r(user);
        })
    });

    // GUILD_MEMBER_UPDATE
    await user.setNickname("test user");

    // INVITE_DELETE
    await invite.delete();

    const threadMessage = await channel.send("test");

    // THREAD_CREATE
    let thread = await channel.threads.create({
        startMessage: threadMessage,
        name: "hey",
    });

    // THREAD_UPDATE
    await thread.setName("test thread");

    console.log(bold(green('Please, join the thread in the test channel')));
    // wait for the user to join the thread
    // THREAD_MEMBER_UPDATE
    await new Promise((r) => {
        client.once("threadMemberUpdate", () => {
            r();
        });
        client.once("threadMembersUpdate", () => {
            r();
        });
    });

    // THEAD_DELETE
    await thread.delete();

    // CHANNEL_DELETE
    await channel.delete();

    await user.roles.add(role);

    console.log(bold(green('Please, add any bot the the server.')));
    // INTEGRATION_CREATE
    let bot = await new Promise((r) => {
        client.once("guildMemberAdd", (user) => {
            if (user.user.bot) {
                r(user);
            }
        })
    });
    // INTEGRATION_DELETE
    await bot.kick();

    console.log(bold(green('Enable the community mode in the server.')));
    await new Promise((r) => {
        client.once("guildUpdate", () => {
            r();
        });
    });

    const voiceChannel = await guild.channels.create("stage", { type: "GUILD_STAGE_VOICE" });
    console.log(bold(green('Join the stage channel.')));

    // STAGE_INSTANCE_CREATE
    await voiceChannel.createStageInstance({
        topic: "testing api",
    });

    await new Promise((r) => {
        client.once("voiceStateUpdate", () => {
            r();
        });
    });
    // STAGE_INSTANCE_UPDATE
    await voiceChannel.setTopic("test api2");
    // VOICE_SERVER_UPDATE
    await voiceChannel.setRTCRegion((await client.fetchVoiceRegions())[3]);

    // STAGE_INSTANCE_DELETE
    await voiceChannel.stageInstance.delete();
    // GUILD_ROLE_DELETE
    await role.delete();


    const file = readFileSync("./assets/emote.jpg");
    // GUILD_EMOJIS_UPDATE
    await guild.emojis.create(file, "sus_mug");

    // GUILD_BAN_ADD
    await user.ban();

    // GUILD_BAN_REMOVE
    await guild.bans.remove(user);

    // GUILD_DELETE
    await guild.delete();

    console.log(green("You can now exit the program using Ctrl+C"));
});

const { token } = JSON.parse(readFileSync("./creds.json").toString("utf-8"));
console.log(blue("Starting the bot..."));

client.login(token);