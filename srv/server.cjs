



require("dotenv").config({ path: "default-env.json" });
const express = require("express");
const {BasicAuthAxios , OAuth2Axios} = require("./config/destinations.config")
const { router: SFRoutes  ,setAxios: setSF} = require("./routes/SF.routes");
const { router: AdobeRoutes, setAxios: setAdobe } = require("./routes/Adobe.routes");

const app = express();
const PORT =8080;

app.use(express.json());
app.use("/", SFRoutes);
app.use("/", AdobeRoutes);

app.listen(PORT, async () => {
    const SF_axios = await BasicAuthAxios("SFSFDEST");
    const Adobe_axios = await OAuth2Axios("abobe_ads_rest_api")
   
    setSF(SF_axios);
    setAdobe(Adobe_axios);
    console.log(`Server running on port : ${PORT}`);
});



// <?xml version="1.0" encoding="UTF-8"?>
// <form1>
//   <LabelForm>
//     <DeliveryId>Mirum est ut animus agitatione motuque corporis excitetur.</DeliveryId>
//     <Position>Ego ille</Position>
//     <MaterialNo>Si manu vacuas</MaterialNo>
//     <Quantity>Apros tres et quidem</Quantity>
//     <Package>Mirum est</Package>
//     <QRCode>012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789</QRCode>
//   </LabelForm>
//   <LabelForm>
//     <DeliveryId>Ad retia sedebam: erat in proximo non venabulum aut lancea, sed stilus et pugilares:</DeliveryId>
//     <Position>Licetib auctor</Position>
//     <MaterialNo>Proinde</MaterialNo>
//     <Quantity>Am undique</Quantity>
//     <Package>Ad retia sedebam</Package>
//     <QRCode>012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789</QRCode>
//   </LabelForm>
//   <LabelForm>
//     <DeliveryId>meditabar aliquid enotabamque, ut, si manus vacuas, plenas tamen ceras reportarem.</DeliveryId>
//     <Position>Vale</Position>
//     <MaterialNo>Ego ille</MaterialNo>
//     <Quantity>Si manu vacuas</Quantity>
//     <Package>Apros tres et quidem</Package>
//     <QRCode>012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789</QRCode>
//   </LabelForm>
// </form1>
