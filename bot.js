//Yakimenkos_bot - название бота
var express = require("express");
var TelegramBot = require('node-telegram-bot-api');

var app = express();
 
var token = '459873008:AAFve8B1Ps8NP92SoGxkR38hOmF6w0rRKeg';
var bot = new TelegramBot(token, {polling: true});

var prod=[0,0,0];	//массив товаров
var n=3;
console.log("start");

bot.onText(/^\/start/, function (msg, match)  //вызывается при старте бота
{
	var chatId = msg.chat.id;
	bot.sendMessage(chatId,'Здравствуйте. Это бот – магазин. Доступные команды: \n/help - Помощь \n/cart - Корзина \n/menu - Выбрать товары из меню \n/order - Сделать заказ \n/clean - Очистить корзину');	
});

bot.onText(/^\/help/, function (msg, match) // команда для вызова помощи
{
	var chatId = msg.chat.id;
	bot.sendMessage(chatId,'/cart - Корзина \n/menu - Выбрать товары из меню \n/order - Сделать заказ \n/clean - Очистить корзину');	
});

bot.onText(/^\/clean/, function (msg, match) 	//очистка корзины
{
	prod=[0,0,0];
	bot.sendMessage(msg.chat.id, "Корзина пуста");
});

bot.onText(/^\/cart/, function (msg, match) //просмотреть содержимое корзины
{
	var chatId = msg.chat.id;
	if(prod[0]!=0)
	{
		bot.sendMessage(msg.chat.id, "Товар 1: "+prod[0]);
	}
	if(prod[1]!=0)
	{
		bot.sendMessage(msg.chat.id, "Товар 2: "+prod[1]);
	}
	if(prod[2]!=0)
	{
		bot.sendMessage(msg.chat.id, "Товар 3: "+prod[2]);
	}
	if(prod[0]==0&&prod[1]==0&&prod[2]==0)
	{
		bot.sendMessage(msg.chat.id, "Корзина пуста");
	}
});

bot.onText(/\/menu/, function (msg) 	//вызвать меню 
{										//выводит список товаров и получает количество товаров
	var chatId = msg.chat.id;
	const option = 
	{
		reply_markup: 
		{
			inline_keyboard: 
				[          	  
					[{ text: 'Товар 1', callback_data: '1'}],
					[{ text: 'Товар 2', callback_data: '2'}],
					[{ text: 'Товар 3', callback_data: '3'}]         
				]
		}
	};
	bot.sendMessage(chatId, 'Выберите товар', option);
});

var i=0;
bot.on('callback_query', function onCallbackQuery(callbackQuery) //обработчик запросов
{
	const action = callbackQuery.data;
	const msg = callbackQuery.message;
	const option = 
	{
		chat_id: msg.chat.id,
		message_id: msg.message_id,	 
		reply_markup: 
		{
			inline_keyboard: 
			[          	  
				[
					{ text: '1', callback_data: '11'},
					{ text: '2', callback_data: '12'},
					{ text: '3', callback_data: '13'}
				],
				[
					{ text: '4', callback_data: '14'},
					{ text: '5', callback_data: '15'},
					{ text: '6', callback_data: '16'}
				],
				[
					{ text: '7', callback_data: '17'},
					{ text: '8', callback_data: '18'},
					{ text: '9', callback_data: '19'}
				],
				[{ text: '0', callback_data: '10'}],
			]
		}
	};
	let text;  
	if (action === '1') 
	{ 
		text="Сколько товар 1 положить в корзину?";
		i=0;
		bot.editMessageText(text, option);
	}	
	if (action === '2') 
	{
		text="Сколько товар 2 положить в корзину?";
		i=1;
		bot.editMessageText(text, option);
	}
	if (action === '3') 
	{
		text="Сколько товар 3 положить в корзину?";
		i=2;
		bot.editMessageText(text, option);
	}
	if (action > 9) 
	{
		prod[i]=action-10;
		bot.sendMessage(callbackQuery.message.chat.id, 'OK');
	}

});


bot.onText(/^\/order/, function (msg, match) // сделать заказ
{											 // при вызове получает номер телефона и 
	var chatId = msg.chat.id;				 // координаты для доставки
    var option = 							 // выводит в консоль содержимое корзины, координаты и телефон
	{
        "parse_mode": "Markdown",
        "reply_markup": 
		{
            "one_time_keyboard": true,
            "keyboard": 
			[
				[{
					text: "Мой номер телефона",
					request_contact: true
				}], 
				["Отмена"]
			]
        }
    };
    bot.sendMessage(chatId, "Введите номер телефона", option).then
	(() => {
        bot.once("contact",(msg)=>
		{
            var option = 
			{
                "parse_mode": "Markdown",
                "reply_markup": 
				{
                    "one_time_keyboard": true,
                    "keyboard": 
					[
						[{
							text: "Указать",
							request_location: true
						}], 
						["Отмена"]
					]					
                }
            };
			console.log( "Телефон: " + [msg.contact.phone_number].join(";"));
            bot.sendMessage(chatId,"Куда доставить?",option).then
			(() => {
                bot.once("location",(msg)=>
				{
                    console.log( "Координаты: " + [msg.location.longitude,msg.location.latitude].join(";"));
                })
            })
        })
    })
	for(var i=0;i<n;i++)
	{		
		if(prod[i]!=0)
		{
			console.log("Товар "+(i+1)+" :"+prod[i]);
		}
	}
	prod=[0,0,0];
});