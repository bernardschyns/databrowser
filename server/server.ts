
import * as express from 'express';
import {Application} from "express";
import {readAllLessons} from "./read-all-lessons.route";
import {addPushSubscriber} from "./add-push-subscriber.route";
import {sendNewsletter} from "./send-newsletter.route";
const bodyParser = require('body-parser');

const webpush = require('web-push');

// const vapidKeys = {
//     "publicKey":"BLnVk1MBGFBW4UxL44fuoM2xxQ4o9CuxocVzKn9UVmnXZEyPCTEFjI4sALMB8qN5ee67yZ6MeQWjd5iyS8lINAg",
//     "privateKey":"mp5xYHWtRTyCA63nZMvmJ_qmYO6A1klSotcoppSx-MI"
// };
// const vapidKeys ={"publicKey":"BMY0bNnCO1M35oBMA5Iv4npVRgWLqU1-aMOdMg_cF72ds-44wOc6Q0AGCeQpmkL7_nCPdicGjUMAOBOWIwg2jBw",
// "privateKey":"g8UigaAkT6cQqWHwGlA4NDqXOsggCXb-Y1S_W6yAQDs"}
const vapidKeys ={"publicKey":"BHuGvZkFmoC4owsHvtQXlFjMcmcmG_BlNIjYRvp9h_5MDdPgjKeLZb8ZQooToRPI_X60TPitqDLt07XuR1fptxo","privateKey":"4YxOx4Z_hNfVNsV-ejPG3MRPmB2_rpHOkm2mDNGgAeM"}



// const vapidKeys = webpush.generateVAPIDKeys()
webpush.setVapidDetails(
    'mailto:bernard.schyns@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);




const app: Application = express();


app.use(bodyParser.json());


// REST API
app.route('/api/lessons')
    .get(readAllLessons);

app.route('/api/notifications')
    .post(addPushSubscriber);

app.route('/api/newsletter')
    .post(sendNewsletter);



// launch an HTTP Server
const httpServer = app.listen(9001, () => {
    console.log("HTTP Server running at http://localhost:" + httpServer.address().port);
});









