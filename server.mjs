import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import morgan from 'morgan';
import cors from 'cors';

import './config/index.mjs';

const mongodbURI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.uiwjq1k.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(mongodbURI);
const database = client.db('bookroom');
const postCollection = database.collection('hotelbooking');


async function run() {
  try {
    await client.connect();
    await client.db("bookroom").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));


// root path
app.get("/", (req, res) => {
    res.send("Chatbot response");
});


// Dialogflow cx webhook
app.use("/webhook", (req, res, next) => {

    const params = req.body.sessionInfo.parameters;
  
    const { guestname, numberofguests, roomtype } = params;
  
    console.log("guest name: ", guestname);
    console.log("Number of guests: ", numberofguests);
    console.log("Type of room: ", params.roomtype);
  
    const body = {
      detectIntentResponseId: '4dd48764-d86c-4d2c-a319-26447fa40e95',
      intentInfo: {
        lastMatchedIntent: 'projects/chatbotdemo-mykk/locations/us-central1/agents/0ceea8d4-84ab-407a-af7f-d01cd135841d/intents/c6585558-9cd8-458a-91a6-09081c27a309',
        displayName: 'confirmation.yes',
        confidence: 1
      },
      pageInfo: {
        currentPage: 'projects/chatbotdemo-mykk/locations/us-central1/agents/0ceea8d4-84ab-407a-af7f-d01cd135841d/flows/00000000-0000-0000-0000-000000000000/pages/a059d196-a603-41ba-bc0c-f4cd67602fb8',
        formInfo: {},
        displayName: 'Booking Confirmation Page'
      },
      sessionInfo: {
        session: 'projects/chatbotdemo-mykk/locations/us-central1/agents/0ceea8d4-84ab-407a-af7f-d01cd135841d/sessions/ec1130-477-ead-eb0-cf69558fb',
        parameters: { guestname: [Object], numberofguests: 2, roomtype: 'business' }
      },
      fulfillmentInfo: { tag: 'abc' },
      text: 'yes',
      languageCode: 'en'
    }
  
  
    res.send({
      "fulfillmentResponse": {
        "messages": [
          {
            "responseType": "RESPONSE_TYPE_UNSPECIFIED",
            "text": {
              "text": [
                `Dear ${guestname.original}, your booking of ${roomtype} room for ${numberofguests} person is confirmed. `
              ],
              "allowPlaybackInterruption": false
            }
          },
          {
            "responseType": "RESPONSE_TYPE_UNSPECIFIED",
            "text": {
              "text": ["We wish you good stay."],
              "allowPlaybackInterruption": false
            }
          }
        ],
        "mergeBehavior": "MERGE_BEHAVIOR_UNSPECIFIED"
      }
    })
  })

// app.use("/webhook", (req, res, next) => {
//   console.log("req.body: ",req.body);
// })


// ports details
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});