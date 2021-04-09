-- para rellenar un combobox con las casas que  aparecen como destino
-- en las afiliaciones 

WITH ch AS
(SELECT *
 FROM chapters
 WHERE EXTRACT(YEAR FROM date_beginning) BETWEEN $1 AND $2),
res AS (
SELECT resolution_id, ARRAY_agg(theme_id) AS temas FROM resolutions_themes GROUP BY resolution_id)
SELECT resolution_id, temas
FROM res
JOIN resolutions r USING(resolution_id)
JOIN ch ON ch.chapter_id = r.chapter
WHERE $3
