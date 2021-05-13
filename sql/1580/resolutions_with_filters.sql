-- una de lsa claves son los dos agregados:
-- el primero es de theme_id y sirve para filtrar en $3
-- el segundo es para crear los chips en la página web con la información  

WITH ch AS
(SELECT *
 FROM chapters
 WHERE EXTRACT(YEAR FROM date_beginning) BETWEEN $1 AND $2),
res AS (
  SELECT resolution_id,
         ARRAY_AGG(theme_id) AS temas_ids,
         ARRAY_AGG(theme) AS temas_chips
  FROM resolutions_themes_1580
  JOIN themes USING (theme_id)
  GROUP BY resolution_id),
resprov AS (
  SELECT * FROM vistas.provinces_in_resolutions_1580
)
SELECT resolution_id,
       r.resolution_text,
       r.resolution_summary,
       r.small_title,
       ch.general_name AS chapter_name,
       EXTRACT(YEAR FROM ch.date_beginning) AS chapteryear,
       temas_ids, temas_chips
FROM res
LEFT JOIN resolutions_1580 r USING(resolution_id)
LEFT JOIN ch ON ch.chapter_id = r.chapter
LEFT JOIN resprov rp USING (resolution_id)
WHERE $3
