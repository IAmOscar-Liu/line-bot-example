import { messagingApi } from "@line/bot-sdk";
import client from "../lib/client";

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

  return client.replyMessage({
    replyToken,
    messages: [message],
  });
}
