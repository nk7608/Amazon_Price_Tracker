
//Packages
const axios = require('axios');
const cheerio = require('cheerio');
require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

const url = "https://www.amazon.in/Apple-Watch-GPS-40mm-Aluminium/dp/B09G9BZ6K5/ref=sr_1_3?crid=IZL18O4WQLL1&keywords=apple+watch+se&qid=1660216940&sprefix=apple+watch%2Caps%2C420&sr=8-3";

const product = { name:"", price: "",link: "" };
//Set interval
const handle = setInterval(scrape, 20000);


async function scrape(){ 
    //Fetch the data
    const { data } = await axios.get(url);
    //Load up the html
    const $ = cheerio.load(data);
    const item = $('div#dp-container');
    //Extract the data that we need
     product.name = $(item).find('h1 span#productTitle').text();
     product.link = url;
     const price = $(item).find("span .a-price-whole").first().text().replace(/[.,]/g, '');
    const priceNum = parseInt(price);
    product.price = priceNum;
    console.log(product);

    //Send an SMS
    if(priceNum<20000){
        client.messages.create({
            body: `The price of ${product.name} went below ${price}. Purchase it at ${product.link}`,
            from: "+19035008851",
            to: "enter_your_number",
        }).then(message => {
            console.log(message);
            clearInterval(handle);
        });
    }
}

scrape();