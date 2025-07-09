// line-bot-example/api/handler/liffButtonMessage.ts
import { messagingApi } from "@line/bot-sdk";

export function handleLiffButtonMessage({
  replyToken,
  liffUrl,
}: {
  replyToken?: string;
  liffUrl: string;
}) {
  if (!replyToken) return Promise.resolve(null);

  const message: messagingApi.Message = {
    type: "template",
    altText: "請點擊按鈕以成為業務",
    template: {
      type: "buttons",
      text: "點擊下方按鈕成為業務",
      actions: [
        {
          type: "uri",
          label: "成為業務",
          uri: liffUrl,
        },
      ],
    },
  };

  // You need to create a LINE client instance to reply
  const client = new messagingApi.MessagingApiClient({
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN!,
  });

  return client.replyMessage({
    replyToken,
    messages: [message],
  });
}
