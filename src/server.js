import env from 'dotenv';

env.config({silent: true});

import koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from 'koa-cors';
import convert from 'koa-convert';
import koaRouter from 'koa-router';
import botBuilder from 'claudia-bot-builder';
import api from './app';

const token = "EAAJaktkWs54BANPYWElIagtw3XLjWTIO1CzUEl6ToLkF7JKsH6fjK5rOi85fHwszwE4aTRaOnp7ZCtOHMZAqNSMLrUPbKZCb10qyb4J3JnXRqf5Jt5gbb3y6cRQCk1Pd2ZAmWYQXItlGZBn9DWonjpu6HHOWEKG2gvA6AbmsazQZDZD";

const url = `https://graph.facebook.com/v2.9/me/messages?access_token=${token}`;

const fbTemplate = botBuilder.fbTemplate;

const route = koaRouter()
      .prefix("/")
      .get('/', async (ctx, next) => {
          if(ctx.query['hub.verify_token'] === "caronabot") {
              ctx.body = ctx.query['hub.challenge'];
          } else {
              ctx.body = "Error, wrong validation token";
          }
      })
        .post("/", async (ctx, next) => {
          const responseMsg = new fbTemplate
            .Text('Olá ! Espero poder te ajudar a encontrar muitas caronas!').get();
          const events = ctx.request.body.entry;
          events.forEach(function(event) {
            let messagings = event.messaging;
            messagings.forEach(function(messaging) {
              let sender = messaging.sender.id;
              if(messaging.message && messaging.message.text) {
                api.response(responseMsg, sender, url);
              }
            });
          });
          ctx.body = 200;
          return ;
        });

const app = new koa();

app
    .use(convert(cors()))
    .use(bodyParser())
    .use(route.routes());


app.listen(8000);
