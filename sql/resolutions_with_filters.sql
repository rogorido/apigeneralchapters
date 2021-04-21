
WITH ch AS
(SELECT *
 FROM chapters
 WHERE EXTRACT(YEAR FROM date_beginning) BETWEEN $1 AND $2),
res AS (
  SELECT resolution_id, ARRAY_AGG(theme_id) AS temas
  FROM resolutions_themes
  GROUP BY resolution_id)
SELECT resolution_id,
       r.resolution_text,
       r.resolution_summary,
       r.small_title,
       ch.general_name AS chapter_name,
       EXTRACT(YEAR FROM ch.date_beginning) AS chapteryear,
       temas
FROM res
JOIN resolutions r USING(resolution_id)
JOIN ch ON ch.chapter_id = r.chapter
WHERE $3
