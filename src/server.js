import env from 'dotenv';

env.config({silent: true});

import koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from 'koa-cors';
import convert from 'koa-convert';
import koaRouter from 'koa-router';
import botBuilder from 'claudia-bot-builder';
import api from './app';
import conversation from './conversation';


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
        const events = ctx.request.body.entry;
        events.forEach(function(event) {
          let messagings = event.messaging;
          messagings.forEach(async function(messaging) {
            let sender = messaging.sender.id;
            let chat = await conversation.get_or_create(sender);
            if(messaging.message && messaging.message.text) {
              conversation.response(messaging.message.text, sender, chat);
            }
            if(messaging.postback) {
              conversation.response(messaging.postback.payload, sender, chat);
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
