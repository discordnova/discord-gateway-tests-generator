# Discord tests generator

Since the Discord's api is pretty vague about his data structures
Here is a tool that use the discord.js library to record almost all the
discord gateway events (even undocummented features!)

## Usage

* Node version = v17.x.x

Put your bot credentials in the creds.json file like so

```
{
    "token": "<your bot token>"
}
```

Please note that the bot needs to have **NO SERVERS** to avoid capturing event data
during the data capture process.

After installing the dependencies `npm i`, run the index.js file using the node cli.
All the steps will be printed to the console. This test generation program **DOES NOT** work in
CI because it requires human intervention.

## Compatibility

- [x] Channel Create	       
- [x] Channel Update
- [x] Channel Delete
- [x] Channel Pins Update
- [x] Thread Create
- [x] Thread Update
- [x] Thread Delete
- [ ] Thread List Sync
- [x] Thread Member Update
- [x] Thread Members Update
- [x] Guild Create
- [x] Guild Update	            
- [x] Guild Delete
- [x] Guild Ban Add
- [x] Guild Ban Remove
- [x] Guild Emojis Update
- [ ] Guild Stickers Update
- [x] Guild Integrations Update
- [x] Guild Member Add
- [x] Guild Member Remove
- [x] Guild Member Update
- [ ] Guild Members Chunk
- [x] Guild Role Create
- [x] Guild Role Update
- [x] Guild Role Delete
- [x] Integration Create
- [x] Integration Update
- [x] Integration Delete
- [ ] Interaction Create
- [x] Invite Create
- [x] Invite Delete
- [x] Message Create
- [x] Message Update
- [x] Message Delete
- [x] Message Delete Bulk
- [x] Message Reaction Add
- [x] Message Reaction Remove
- [x] Message Reaction Remove All
- [x] Message Reaction Remove Emoji
- [x] Presence Update
- [x] Stage Instance Create
- [x] Stage Instance Delete
- [x] Stage Instance Update
- [x] Typing Start
- [ ] User Update
- [x] Voice State Update
- [x] Voice Server Update
- [x] Webhooks Update

## Disclaimer

This tool could be used as an event logger. Make sure to use a **bot with NO SERVERS** to avoid capturing user data and more. This tool is used purely to generate tests for the Nova's Gateway deserialization. 

## License

<sub>
discord-tests-generate, generate example json data using the discord
api designated for the Nova's Gateway tests.
This file formats all the json file into readeable json.
</sub>
<sub>
Copyright (C) 2021  Nova
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
</sub>
<sub>
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
</sub>
<sub>
You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
</sub>