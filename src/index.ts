import { middleware, webhook } from "@line/bot-sdk";
import "dotenv-safe/config";
import express from "express";
import { handleJoin } from "./handler/join";
import { handleTextMessage } from "./handler/textMessage";
import { handleConfirmMessage } from "./handler/confirmMessage";

// create LINE SDK config from env variables
const lineMiddleware = middleware({
  channelSecret: process.env.LINE_CHANNEL_SECRET!,
});

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

app.get("/test", (req, res) => {
  res.json({ result: "success" });
});

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post("/callback", lineMiddleware, (req, res) => {
  console.log("Received events:", req.body.events);
  Promise.all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// The type of `event` is `line.messagingApi.WebhookEvent` from the @line/bot-sdk package.
function handleEvent(event: webhook.Event) {
  if (event.type === "join")
    return handleJoin({ replyToken: event.replyToken });
  if (event.type === "message" && event.message.type === "text") {
    if (event.message.text.trim().toLocaleLowerCase() === "help")
      return handleConfirmMessage({
        replyToken: event.replyToken,
        text: "Need help?",
        actions: [
          { type: "postback", label: "yes", data: "user_need_help" },
          { type: "postback", label: "no", data: "user_no_need_help" },
        ],
      });
    if (event.message.text === "我要購票")
      return handleTextMessage({
        replyToken: event.replyToken,
        text: "好的，已為你購買門票",
      });
    if (event.message.text === "我想成為業務")
      return handleTextMessage({
        replyToken: event.replyToken,
        text: "恭喜！你已成為業務了～～～",
      });
    return handleTextMessage({
      replyToken: event.replyToken,
      text: event.message.text,
    });
  }
  if (event.type === "postback") {
    if (event.postback.data === "user_need_help") {
      return handleTextMessage({
        replyToken: event.replyToken,
        text: "Sorry! I can't help you.",
      });
    }
  }

  return Promise.resolve(null);
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
