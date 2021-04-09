const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const cors = require("cors");
const dbFunctions = require("./functions/dbfunctions");

require("dotenv").config();

const app = express();
app.use(morgan("tiny"));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(compression());
app.use(helmet());

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 45, // 45 requests,
});

app.use(limiter);

app.use(
  cors({
    origin: [
      "https://www.georeligion.org",
      "https://dbg.georeligion.org",
      "http://localhost:8000",
      "http://localhost:8080",
    ],
  })
);

app.get("/themes/", dbFunctions.getThemesList);
app.get("/themes/stats/", dbFunctions.getThemesStats);
app.get("/capgens/", dbFunctions.getCapGensStats);
app.get("/resolutions/stats/", dbFunctions.getResolutionsTypesStats);
app.get("/resolutions/lookagain/", dbFunctions.getResolutionsLookAgain);
app.get("/resolutions/", dbFunctions.getResolutionsWithFilters);
app.get("/sufragios/stats/", dbFunctions.getSufragiosStats);

// para comboboxes y demás
app.get("/houses/origin/", dbFunctions.getHousesOriginAffiliation);
app.get("/houses/destination/", dbFunctions.getHousesDestinationAffiliation);
app.get("/licences/stats/", dbFunctions.getLicencesStats);
app.get("/prohibitions/", dbFunctions.getProhibitions);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}/`);
});
