import { Telegraf } from "telegraf"
import fetch from 'node-fetch';
import {} from 'dotenv/config'

// Get your chat id at: https://api.telegram.org/bot<YOUR TOKEN HERE>/getUpdates | chat object id property 

// Gets and returns the current date, Brazil standard date
function getDate() {
    const date = new Date()
    const day = date.getDate()
    const month = date.getMonth()
    const year = date.getFullYear()
    const formattedDate = `${day}/${month + 1}/${year}` 

    return formattedDate
}

// Sign in to Telegram and send a message
async function sendMessage(message) {
    try {
        const TOKEN = process.env.DOLLAR_TOKEN
        const CHAT_ID = process.env.DOLLAR_CHAT_ID
        const bot = new Telegraf(TOKEN)

        await bot.telegram.sendMessage(
            CHAT_ID, 
            message, 
            {parse_mode: 'Markdown'} 
        )
   
    } catch (error) {
        console.log(`Error connecting to bot or sending message: ${error}`)
        throw new Error(error)
    }
}

// Use a free API to check the current price of the dollar  
async function getDollar() {
    try {
        let dollarToday = await fetch("https://economia.awesomeapi.com.br/last/USD-BRL")
        dollarToday = await dollarToday.json()

        const dollarInfo =  {
            buy: Number(dollarToday.USDBRL.bid).toFixed(2),
            sell: Number(dollarToday.USDBRL.ask).toFixed(2)
        }
        
        const currentDate = getDate()
        const message = `*HEY, LOOK HERE AT THE DOLLAR PRICE TODAY (${currentDate})\n\n💵 *BUY: ${dollarInfo.buy}\n💸 SELL: ${dollarInfo.sell}`
    
        sendMessage(message)

    } catch (error) {
        console.log(`Error querying Dollar API: ${error}`)
        throw new Error(error)
    }

}

await getDollar()