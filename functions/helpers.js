const path = require("path");

// sinceramente nosé si importar esto otra vez no es un error
// pero lo necisto por o de pgp.as.format de abajo...
// en teoría a lo mejor con un import me funcionaría, pero eso me da el
// error ese de los modules, etc.
const pgp = require("pg-promise")();

// esto son los llamados Custom Type Formatting
// https://github.com/vitaly-t/pg-promise#custom-type-formatting
class FilterSetThemes {
  constructor(filters) {
    if (!filters || typeof filters !== "object") {
      throw new TypeError("Parameter 'filters' must be an object.");
    }
    this.filters = filters;
    this.rawType = true; // do not escape the result from toPostgres()
  }

  toPostgres(/*self*/) {
    // esto es un poco cutre, tal vez se podría hacer con esto
    // https://stackoverflow.com/questions/684672/how-do-i-loop-through-or-enumerate-a-javascript-object
    // para ir accediendo cada elemento del objeto

    // el problema de mi sistema es q es muy complejo comparado con el ejemplo
    // que ponen en la docu, pq no puedo hacer un simple map.
    let f = [];

    if (this.filters.theme) f.push("$(theme) && temas");

    // si understood es all no ponemos el filtro, solo si es false/true
    if (this.filters["understood"] && this.filters["understood"] != "all")
      f.push("understood = ${understood}");

    // realmente solo comprobamos si es verdad
    if (this.filters.look_again == "true") f.push("look_again = ${look_again}");

    if (this.filters["date_begin"])
      f.push("(date_beginning between ${date_begin} and ${date_end})");

    // hay que convertir el array q tenemos  en un string con and
    // pq es lo q pidepgp.as.format
    let ff = f.join(" and ");
    let wheresql = pgp.as.format(ff, this.filters);

    // console.log(wheresql);
    // devolvemos un array pq realmente tenemos tres varialbes que completar
    // fecha de inico, fecha fin y luego el WHERE enorme
    return [this.filters.datebegin, this.filters.dateend, wheresql];
  }
}

// esto rtt repite la funcionalidad de lo anteriro. Habría q ver como combinarlo
class FilterSetProvinces {
  constructor(filters) {
    if (!filters || typeof filters !== "object") {
      throw new TypeError("Parameter 'filters' must be an object.");
    }
    this.filters = filters;
    this.rawType = true; // do not escape the result from toPostgres()
  }

  toPostgres(/*self*/) {
    // esto es un poco cutre, tal vez se podría hacer con esto
    // https://stackoverflow.com/questions/684672/how-do-i-loop-through-or-enumerate-a-javascript-object
    // para ir accediendo cada elemento del objeto

    // el problema de mi sistema es q es muy complejo comparado con el ejemplo
    // que ponen en la docu, pq no puedo hacer un simple map.
    let f = [];

    if (this.filters.province) f.push("$(province) && provinces");

    // si understood es all no ponemos el filtro, solo si es false/true
    if (this.filters["understood"] && this.filters["understood"] != "all")
      f.push("understood = ${understood}");

    // realmente solo comprobamos si es verdad
    if (this.filters.look_again == "true") f.push("look_again = ${look_again}");

    if (this.filters["date_begin"])
      f.push("(date_beginning between ${date_begin} and ${date_end})");

    // hay que convertir el array q tenemos  en un string con and
    // pq es lo q pidepgp.as.format
    let ff = f.join(" and ");
    let wheresql = pgp.as.format(ff, this.filters);

    // devolvemos un array pq realmente tenemos tres varialbes que completar
    // fecha de inico, fecha fin y luego el WHERE enorme
    return [this.filters.datebegin, this.filters.dateend, wheresql];
  }
}

// Helper for linking to external query files:
function readSQL(file) {
  const fullPath = path.join(__dirname, file);
  return new pgp.QueryFile(fullPath, { minify: true });
}

module.exports = { FilterSetThemes, FilterSetProvinces, readSQL };
