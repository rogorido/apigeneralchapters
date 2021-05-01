-- una de lsa claves son los dos agregados:
-- el primero es de theme_id y sirve para filtrar en $3
-- el segundo es para crear los chips en la página web con la información  

WITH ch AS
(SELECT *
 FROM chapters
 WHERE EXTRACT(YEAR FROM date_beginning) BETWEEN $1 AND $2),
res AS (
  SELECT resolution_id,
         ARRAY_AGG(theme_id) AS temas,
         ARRAY_AGG(theme) AS temas_chips
  FROM resolutions_themes
  JOIN themes USING (theme_id)
  GROUP BY resolution_id)
SELECT resolution_id,
       r.resolution_text,
       r.resolution_summary,
       r.small_title,
       ch.general_name AS chapter_name,
       EXTRACT(YEAR FROM ch.date_beginning) AS chapteryear,
       temas, temas_chips
FROM res
JOIN resolutions r USING(resolution_id)
JOIN ch ON ch.chapter_id = r.chapter
WHERE $3
