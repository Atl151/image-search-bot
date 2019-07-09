const { Client, Attachment} = require('discord.js');
const request = require('request');
const client = new Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity("Utiliza img/ para buscar una imagen o gif/ para buscar un gif", {type: "PLAYING"});
 });

client.on('message', message => {
    const searchType = message.content.substring(0, 4);
    if (searchType === 'img/' || searchType === 'gif/') {
        const query = encodeURI(message.content.substring(4));
        const url = `${process.env.G_API_URL}&searchType=image&safe=active&q=${query}${searchType === 'gif/' ? '+gif': ''}`;
        const randomNumber = Math.floor(Math.random() * 10);
        console.log(url);
        request({
            url: url,
            json: true
        }, (err, response, body) => {
            if(!err && response.statusCode == 200){
                let imageLink =  body.items[randomNumber].link;
                if(imageLink.indexOf('?') !== -1){
                    imageLink = imageLink.substring(0, imageLink.lastIndexOf('?'));
                }
                const attachment = new Attachment(imageLink);
                message.channel.send(attachment);
            } 
        });
    }  else if(message.content.includes(client.user.toString())) {
        message.channel.send('Utiliza img/ para buscar una imagen o gif/ para buscar un gif', {code: true})
    }
});

client.login(process.env.BOT_TOKEN);
