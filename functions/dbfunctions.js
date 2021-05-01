const initOptions = {};
const pgp = require("pg-promise")(initOptions);
const db = pgp("postgres://igor@localhost:5432/dominicos");

const monitor = require("pg-monitor");
monitor.attach(initOptions);

const { FilterSetThemes, FilterSetProvinces, readSQL } = require("./helpers");

// Es necesario crearlo aquí globalmente y no en la función concreta
// por no sé cuestión interna...
// const sqlFindWork = readSQL("./sql/works.sql");

const sqlGeneralData = readSQL("../sql/resolutions_per_chapter.sql");
const sqlThemesList = readSQL("../sql/themes_list.sql");
const sqlThemesStats = readSQL("../sql/themes_list_count.sql");
const sqlThemesDetails = readSQL("../sql/themes_details.sql");

// más simple... paso por ahora
// const sqlCapGensStats = readSQL("../sql/capgens_list_count.sql");
// lo mismo pero con rollup, auqnue chapucero
const sqlCapGensStats = readSQL("../sql/capgens_list_count.sql");
const sqlResolutionsTypesStats = readSQL(
  "../sql/resolutionstypes_list_count.sql"
);
const sqlFindResolutionsWithFilters = readSQL(
  "../sql/resolutions_with_filters.sql"
);

const sqlFindResolutionsWithProvinces = readSQL(
  "../sql/resolutions_provinces.sql"
);

// para rellenar comboboxes
const sqlHousesOriginAffiliation = readSQL("../sql/houses_origin.sql");
const sqlHousesDestinationAffiliation = readSQL(
  "../sql/houses_destination.sql"
);

const sqlProvinces = readSQL("../sql/provinces.sql");
const sqlProvincesStats = readSQL("../sql/capgens_provinces_stats.sql");
const sqlProvincesDetails = readSQL("../sql/capgens_provinces_details.sql");
const sqlProvincesDetailsThemes = readSQL(
  "../sql/capgens_provinces_details_themes.sql"
);

// para ver cosas así rápido tb para meter los datos orientándome
const sqlLicencesStats = readSQL("../sql/licences_stats.sql");
const sqlProhibitions = readSQL("../sql/prohibitions.sql");
const sqlRetroStats = readSQL("../sql/retro_stats.sql");

//
const sqlSufragiosStats = readSQL("../sql/sufragios_stats.sql");

// aprobaciones
const sqlAprobacionesGeneral = readSQL("../sql/aprobations_general.sql");
const sqlAprobacionesTipos = readSQL("../sql/aprobations_types.sql");
const sqlAprobacionesProvincias = readSQL("../sql/aprobations_provinces.sql");

//
const sqlResolutionsLookAgain = readSQL("../sql/resolutions_lookagain.sql");

const sqlAffiliationsOrigins = readSQL("../sql/affiliations_origins.sql");
const sqlAffiliationsDestinations = readSQL(
  "../sql/affiliations_destinations.sql"
);

const sqlPenasStats = readSQL("../sql/penas_stats.sql");

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

  // necesitamos convertir lo de themes en un array en el caso de q
  // no lo sea, que es cuando solo viene uno
  queryparams.theme = Array.isArray(queryparams.theme)
    ? queryparams.theme
    : [queryparams.theme];

  // console.log("Los parámetros son:", queryparams);
  // necesitamos pasar el elemento theme a un array de integers
  queryparams.theme = queryparams.theme.map((i) => parseInt(i));

  // formateamos el SQL del file con lo que nos devuelve
  // la clase FilterSet de todos los parámetros de la query
  var querysql = pgp.as.format(
    sqlFindResolutionsWithFilters,
    new FilterSetThemes(queryparams)
  );
  console.log(querysql);
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
