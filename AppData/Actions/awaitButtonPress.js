module.exports = {
    data: {"name":"Await Button Interaction", 
    "customID":"", 
    "storeAs":"", 
    "messageVariable":"",
    "runAfter":"",
    "buttonCustomId":"",
    "fromWho":"",
    "awaitFrom": "Anybody",
    "stopAfter":"60",
    "button": "✓",
    "postAction": "Do Nothing",
    "postActionField": "",
    "postAction":"Acknowledge Interaction"
},

    UI: {"compatibleWith":["Text", "Slash"], 
    "text":"Await Button Interaction", "sepbar3":"",
     "btext33333333":"Button Custom ID",
      "input1_novars":"customID",
       "sepbar12":"",
        "btext5034":"Message/Embed Variable",
        "input5034_direct*":"messageVariable",
        "sepbar423032":"",
     "btext2":"Await Interaction From", 
     "menuBar":{"choices":["Anybody", "Message Author", "User*"],
      storeAs: "awaitFrom", extraField:"fromWho"},  

      "sepbar0":"", 
    "btext34423531":"Once Pressed, Run Action Group", 
    "input42_actionGroup*":"runAfter",
    "sepbarstopwaitingafter":"",
    "btextstopwaitingafter":"Stop Waiting After (seconds)",
    "inputstopwaitingafter_novars*":"stopAfter",
    "sepbarwaitonceithink":"",
    "btext0033": "Post-Interaction",
    "menuBar2":{"choices":["Acknowledge Interaction", "Do Nothing"],

    storeAs: "postAction", extraField:"postActionField"
},
"sepbarsstoreinteractionsas":"",
    "btextfinakly":"Store Interaction As",
    "inputfinakly_novars!*":"storeAs",



      "preview":"awaitFrom",
       "previewName":"From",


       "variableSettings":{
        "fromWho": {
            "User*": "direct", 
            "Anybody": "novars",
            "Message Author": "novars"
        },
        "postActionField": {
            "Acknowledge Interaction":  "novars",
            "Do Nothing": "novars"
        }
    }

    },

    async run(values, inter, uID, fs, client, runActionArray) { 
        const tempVars = JSON.parse(fs.readFileSync('./AppData/Toolkit/tempVars.json', 'utf8'));
        const varTools = require(`../Toolkit/variableTools.js`)
        const { ComponentType } = require('discord.js')

      let message = client.channels.cache.get(tempVars[uID][values.messageVariable].channelId).messages.cache.get(tempVars[uID][values.messageVariable].id)
        const collector = message.createMessageComponentCollector({ max: 1, time: parseFloat(values.stopAfter) * 1000, componentType: ComponentType.Button });
        var collectedAt = []
        let timesRan = 0;

        let toolkit = require('../Toolkit/interactionTools.js');
        let toolKey = toolkit.preventDeletion(uID);

        collector.on('collect', async (interaction) => {

            if (interaction.component.customId == values.customID) {
            let isAuthor = false;
            switch (values.awaitFrom) {
                case "Anybody":
                    isAuthor = true;
                    break;
                case "Message Author":
                    isAuthor = interaction.user.id == inter.author.id;
                    break;
                case "User*":
                    let user = client.users.cache.get(tempVars[uID][varTools.transf(values.fromWho, uID, tempVars)].id)
                    isAuthor = interaction.user.id == user.id;
                    break;
            }
            console.log('interaction user id' + interaction.user.id, 'interaction author id' + inter.author.id, "match" + interaction.user.id==inter.author.id)
            let foundCommand = false;
            if (isAuthor == true && collectedAt.includes(interaction.createdTimestamp) == false) {
                collectedAt.push(interaction.createdTimestamp)
                const interactionTools = require(`../Toolkit/interactionTools.js`)
                await interactionTools.runCommand(values.runAfter, runActionArray, uID, client, inter, fs)
                            if (values.postAction == "Acknowledge Interaction") {
                                interaction.deferUpdate()
                            }

                            if (values.storeAs != "") {
                                tempVars[uID] = {
                                    ...tempVars[uID],
                                    [values.storeAs]: {
                                        author: interaction.author,
                                        createdTimestamp: interaction.createdTimestamp
                                    }
                                }

                                fs.writeFileSync('./AppData/Toolkit/tempVars.json', JSON.stringify(tempVars), 'utf8')
                            }
   
                        }
                }        });

                setTimeout(() => {
                    delete collectedAt;
                    toolkit.leak(uID, toolKey)

                }, values.stopAfter * 1000)
}}