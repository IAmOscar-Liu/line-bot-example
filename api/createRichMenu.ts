import * as fs from "fs";
import * as path from "path";
import { messagingApi } from "@line/bot-sdk";
import "dotenv/config";

const client = new messagingApi.MessagingApiClient({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN!,
});

const blobClient = new messagingApi.MessagingApiBlobClient({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN!,
});

async function createRichMenu() {
  // Define the rich menu structure
  const richMenu: messagingApi.RichMenuRequest = {
    size: { width: 2500, height: 843 }, // compact size
    selected: true,
    name: "Compact Menu",
    chatBarText: "主選單",
    areas: [
      {
        bounds: { x: 0, y: 0, width: 1250, height: 843 },
        action: { type: "message", text: "我要購票" },
      },
      {
        bounds: { x: 1250, y: 0, width: 1250, height: 843 },
        action: { type: "message", text: "我想成為業務" },
      },
    ],
  };

  // Create the rich menu
  const richMenuId = (await client.createRichMenu(richMenu)).richMenuId;

  // Upload the image
  const imagePath = path.join(
    __dirname,
    "assets",
    "richmenu_1751475787586.jpg"
  );
  const imageBuffer = fs.readFileSync(imagePath);

  //   await client.setRichMenuImage({
  //     richMenuId,
  //     image: imageBuffer,
  //     contentType: "image/jpeg",
  //   });
  await blobClient.setRichMenuImage(
    richMenuId,
    new Blob([imageBuffer], { type: "image/jpeg" })
  );

  // Set the rich menu as the default
  await client.setDefaultRichMenu(richMenuId);

  console.log("Rich menu created and set as default:", richMenuId);
}

createRichMenu();
