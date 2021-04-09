const initOptions = {
  // query(e) {
  //   console.log(e.query);
  // },
};
const pgp = require("pg-promise")(initOptions);
const db = pgp("postgres://igor@localhost:5432/dominicos");

const monitor = require("pg-monitor");
monitor.attach(initOptions);

const { FilterSet, readSQL } = require("./helpers");

// Es necesario crearlo aquí globalmente y no en la función concreta
// por no sé cuestión interna...
// const sqlFindWork = readSQL("./sql/works.sql");
const sqlThemesList = readSQL("../sql/themes_list.sql");
const sqlThemesStats = readSQL("../sql/themes_list_count.sql");
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

// para rellenar comboboxes
const sqlHousesOriginAffiliation = readSQL("../sql/houses_origin.sql");
const sqlHousesDestinationAffiliation = readSQL(
  "../sql/houses_destination.sql"
);

// para ver cosas así rápido tb para meter los datos orientándome
const sqlLicencesStats = readSQL("../sql/licences_stats.sql");
const sqlProhibitions = readSQL("../sql/prohibitions.sql");

//
const sqlSufragiosStats = readSQL("../sql/sufragios_stats.sql");

//
const sqlResolutionsLookAgain = readSQL("../sql/resolutions_lookagain.sql");

async function getThemesList(req, res) {
  const rowList = await db.query(sqlThemesList);
  res.send(rowList);
}

async function getThemesStats(req, res) {
  const rowList = await db.query(sqlThemesStats);
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

async function getResolutionsWithFilters(req, res) {
  let rowList = [];
  const queryparams = req.query;

  // necesitamos convertir lo de themes en un array en el caso de q
  // no lo sea, que es cuando solo viene uno
  queryparams.theme = Array.isArray(queryparams.theme)
    ? queryparams.theme
    : [queryparams.theme];

  console.log("Los parámetros son:", queryparams);
  // necesitamos pasar el elemento theme a un array de integers
  queryparams["theme"] = queryparams["theme"].map((i) => parseInt(i));

  // formateamos el SQL del file con lo que nos devuelve
  // la clase FilterSet de todos los parámetros de la query
  var querysql = pgp.as.format(
    sqlFindResolutionsWithFilters,
    new FilterSet(queryparams)
  );
  rowList = await db.query(querysql);

  res.send(rowList);
}

module.exports = {
  getThemesList,
  getThemesStats,
  getCapGensStats,
  getResolutionsTypesStats,
  getHousesOriginAffiliation,
  getHousesDestinationAffiliation,
  getResolutionsLookAgain,
  getSufragiosStats,
  getLicencesStats,
  getProhibitions,
  getResolutionsWithFilters,
};
