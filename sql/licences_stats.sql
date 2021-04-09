-- coger
-- una talba simple para consultar a la hora de meter
-- qué tipo de datos he metido en lo de licencias
--
SELECT details->>'licencia_tipo' AS tipo,
       details->>'licencia_asunto' AS asunto,
       COUNT(*) AS total
FROM  resolutions_details r
where details ? 'licencia'
GROUP BY tipo, asunto;
