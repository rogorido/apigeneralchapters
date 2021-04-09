const path = require("path");

// sinceramente nosé si importar esto otra vez no es un error
// pero lo necisto por o de pgp.as.format de abajo...
// en teoría a lo mejor con un import me funcionaría, pero eso me da el
// error ese de los modules, etc.
const pgp = require("pg-promise")();

// esto son los llamados Custom Type Formatting
// https://github.com/vitaly-t/pg-promise#custom-type-formatting
class FilterSet {
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

    // empezamos con temas q en principio ahora mismo siempre existe
    f.push("$(theme) && temas");

    // si understood es all no ponemos el filtro, solo si es false/true
    if (this.filters["understood"] && this.filters["understood"] != "all")
      f.push("understood = ${understood}");

    if (this.filters["date_begin"])
      f.push("(date_beginning between ${date_begin} and ${date_end})");

    // hay que convertir el array q tenemos  en un string con and
    // pq es lo q pidepgp.as.format
    let ff = f.join(" and ");

    return pgp.as.format(ff, this.filters);
  }
}

// Helper for linking to external query files:
function readSQL(file) {
  const fullPath = path.join(__dirname, file);
  return new pgp.QueryFile(fullPath, { minify: true });
}

module.exports = { FilterSet, readSQL };
