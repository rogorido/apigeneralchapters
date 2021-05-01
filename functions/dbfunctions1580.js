// esto en principio es lo mismo que el otro pero todo está filtrado
// para que sea solo ab 1580.

const initOptions = {};
const pgp = require("pg-promise")(initOptions);
const db = pgp("postgres://igor@localhost:5432/dominicos");

const monitor = require("pg-monitor");
monitor.attach(initOptions);

const { FilterSetGeneral, FilterSetProvinces, readSQL } = require("./helpers");

// Es necesario crearlo aquí globalmente y no en la función concreta
// por no sé cuestión interna...
// const sqlFindWork = readSQL("./sql/1580/works.sql");

const sqlGeneralData = readSQL("../sql/1580/resolutions_per_chapter.sql");
const sqlThemesList = readSQL("../sql/1580/themes_list.sql");
const sqlThemesStats = readSQL("../sql/1580/themes_list_count.sql");
const sqlThemesDetails = readSQL("../sql/1580/themes_details.sql");

// más simple... paso por ahora
// const sqlCapGensStats = readSQL("../sql/1580/capgens_list_count.sql");
// lo mismo pero con rollup, auqnue chapucero
const sqlCapGensStats = readSQL("../sql/1580/capgens_list_count.sql");
const sqlResolutionsTypesStats = readSQL(
  "../sql/1580/resolutionstypes_list_count.sql"
);
const sqlFindResolutionsWithFilters = readSQL(
  "../sql/1580/resolutions_with_filters.sql"
);

const sqlFindResolutionsWithProvinces = readSQL(
  "../sql/1580/resolutions_provinces.sql"
);

// para rellenar comboboxes
const sqlHousesOriginAffiliation = readSQL("../sql/1580/houses_origin.sql");
const sqlHousesDestinationAffiliation = readSQL(
  "../sql/1580/houses_destination.sql"
);

const sqlProvinces = readSQL("../sql/1580/provinces.sql");
const sqlProvincesStats = readSQL("../sql/1580/capgens_provinces_stats.sql");
const sqlProvincesDetails = readSQL(
  "../sql/1580/capgens_provinces_details.sql"
);
const sqlProvincesDetailsThemes = readSQL(
  "../sql/1580/capgens_provinces_details_themes.sql"
);

// para ver cosas así rápido tb para meter los datos orientándome
const sqlLicencesStats = readSQL("../sql/1580/licences_stats.sql");
const sqlProhibitions = readSQL("../sql/1580/prohibitions.sql");
const sqlRetroStats = readSQL("../sql/1580/retro_stats.sql");

//
const sqlSufragiosStats = readSQL("../sql/1580/sufragios_stats.sql");

// aprobaciones
const sqlAprobacionesGeneral = readSQL("../sql/1580/aprobations_general.sql");
const sqlAprobacionesTipos = readSQL("../sql/1580/aprobations_types.sql");
const sqlAprobacionesProvincias = readSQL(
  "../sql/1580/aprobations_provinces.sql"
);

//
const sqlResolutionsLookAgain = readSQL(
  "../sql/1580/resolutions_lookagain.sql"
);

const sqlAffiliationsOrigins = readSQL("../sql/1580/affiliations_origins.sql");
const sqlAffiliationsDestinations = readSQL(
  "../sql/1580/affiliations_destinations.sql"
);

const sqlPenasStats = readSQL("../sql/1580/penas_stats.sql");

async function getGeneralData(req, res) {
  const nResolutionsPerChapter = await db.query(sqlGeneralData);
  const nResolutions = await db.query(
    "SELECT COUNT(*) as total FROM resolutions"
  );
  const nResolutionsThemes = await db.query(
    "SELECT COUNT(*) as total FROM resolutions_themes"
  );
  const nResolutionsDetails = await db.query(
    "SELECT COUNT(*) as total FROM resolutions_details"
  );

  res.send({
    nResolutionsPerChapter: nResolutionsPerChapter,
    nResolutions: nResolutions,
    nResolutionsThemes: nResolutionsThemes,
    nResolutionsDetails: nResolutionsDetails,
  });
}

async function getThemesList(req, res) {
  const rowList = await db.query(sqlThemesList);
  res.send(rowList);
}

async function getThemesStats(req, res) {
  const rowList = await db.query(sqlThemesStats);
  res.send(rowList);
}

async function getThemesDetails(req, res) {
  const theme = req.query.theme;

  // formateamos el SQL del file con lo que nos devuelve
  // la clase FilterSet de todos los parámetros de la query
  // var querysql = pgp.as.format(
  //   sqlFindResolutionsWithProvinces,
  //   new FilterSetProvinces(queryparams)
  // );
  const rowList = await db.query(sqlThemesDetails, theme);

  res.send(rowList);
}

async function getCapGensStats(req, res) {
  const rowList = await db.query(sqlCapGensStats);
  res.send(rowList);
}

async function getResolutionsTypesStats(req, res) {
  const rowList = await db.query(sqlResolutionsTypesStats);
  res.send(rowList);
}

async function getHousesOriginAffiliation(req, res) {
  const rowList = await db.query(sqlHousesOriginAffiliation);
  res.send(rowList);
}

async function getHousesDestinationAffiliation(req, res) {
  const rowList = await db.query(sqlHousesDestinationAffiliation);
  res.send(rowList);
}

async function getResolutionsLookAgain(req, res) {
  const rowList = await db.query(sqlResolutionsLookAgain);
  res.send(rowList);
}

async function getSufragiosStats(req, res) {
  const rowList = await db.query(sqlSufragiosStats);
  res.send(rowList);
}

async function getLicencesStats(req, res) {
  const rowList = await db.query(sqlLicencesStats);
  res.send(rowList);
}

async function getProhibitions(req, res) {
  const rowList = await db.query(sqlProhibitions);
  res.send(rowList);
}

async function getProvinces(req, res) {
  const rowList = await db.query(sqlProvinces);
  res.send(rowList);
}

async function getResolutionsWithFilters(req, res) {
  let rowList = [];
  const queryparams = req.query;

  console.log("los parametros antes de manipular son", queryparams);

  // necesitamos convertir lo de themes en un array en el caso de q
  // no lo sea, que es cuando solo viene uno
  if (queryparams.theme) {
    queryparams.theme = Array.isArray(queryparams.theme)
      ? queryparams.theme
      : [queryparams.theme];

    // necesitamos pasar el elemento theme a un array de integers
    queryparams.theme = queryparams.theme.map((i) => parseInt(i));
  }

  // necesitamos convertir lo de provinces en un array en el caso de q
  // no lo sea, que es cuando solo viene uno
  if (queryparams.province) {
    queryparams.province = Array.isArray(queryparams.province)
      ? queryparams.province
      : [queryparams.province];

    // necesitamos pasar el elemento theme a un array de integers
    queryparams.province = queryparams.province.map((i) => parseInt(i));
  }

  console.log("los parametros son", queryparams);
  // formateamos el SQL del file con lo que nos devuelve
  // la clase FilterSet de todos los parámetros de la query
  var querysql = pgp.as.format(
    sqlFindResolutionsWithFilters,
    new FilterSetGeneral(queryparams)
  );
  // console.log(querysql);
  rowList = await db.query(querysql);

  res.send(rowList);
}

// rtt esto repite mucha funcionalidad de lo anterior...
async function getResolutionsWithProvinces(req, res) {
  let rowList = [];
  const queryparams = req.query;

  // necesitamos convertir lo de themes en un array en el caso de q
  // no lo sea, que es cuando solo viene uno
  queryparams.province = Array.isArray(queryparams.province)
    ? queryparams.province
    : [queryparams.province];

  // necesitamos pasar el elemento theme a un array de integers
  queryparams.province = queryparams.province.map((i) => parseInt(i));
  // console.log("Los parámetros son:", queryparams);

  let j = new FilterSetProvinces(queryparams);
  console.log(j);
  // formateamos el SQL del file con lo que nos devuelve
  // la clase FilterSet de todos los parámetros de la query
  var querysql = pgp.as.format(
    sqlFindResolutionsWithProvinces,
    new FilterSetProvinces(queryparams)
  );
  rowList = await db.query(querysql);

  res.send(rowList);
}

async function getAffiliations(req, res) {
  const origins = await db.query(sqlAffiliationsOrigins);
  const destinations = await db.query(sqlAffiliationsDestinations);

  res.send({ origins: origins, destinations: destinations });
}

async function getPenasStats(req, res) {
  const penas = await db.query(sqlPenasStats);
  res.send(penas);
}

async function getProvincesStats(req, res) {
  const rowList = await db.query(sqlProvincesStats);
  res.send(rowList);
}

async function getRetroStats(req, res) {
  const rowList = await db.query(sqlRetroStats);
  res.send(rowList);
}

async function getAprobationsStats(req, res) {
  const rowListGeneral = await db.query(sqlAprobacionesGeneral);
  const rowListTypes = await db.query(sqlAprobacionesTipos);
  const rowListProvinces = await db.query(sqlAprobacionesProvincias);
  res.send({
    general: rowListGeneral,
    tipos: rowListTypes,
    provinces: rowListProvinces,
  });
}

async function getProvincesDetails(req, res) {
  const province = req.query.province;
  const rowListDetails = await db.query(sqlProvincesDetails, province);
  const rowListDetailsThemes = await db.query(
    sqlProvincesDetailsThemes,
    province
  );

  res.send({ details: rowListDetails, themes: rowListDetailsThemes });
}

module.exports = {
  getGeneralData,
  getThemesList,
  getThemesStats,
  getThemesDetails,
  getCapGensStats,
  getResolutionsTypesStats,
  getHousesOriginAffiliation,
  getHousesDestinationAffiliation,
  getResolutionsLookAgain,
  getSufragiosStats,
  getLicencesStats,
  getProhibitions,
  getProvinces,
  getResolutionsWithFilters,
  getResolutionsWithProvinces,
  getAffiliations,
  getPenasStats,
  getProvincesStats,
  getRetroStats,
  getAprobationsStats,
  getProvincesDetails,
};
