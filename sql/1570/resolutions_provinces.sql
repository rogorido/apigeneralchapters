
WITH ch AS
(SELECT *
 FROM chapters
 WHERE EXTRACT(YEAR FROM date_beginning) BETWEEN $1 AND $2),
res AS (
  SELECT resolution_id, ARRAY_AGG(province_id) AS provinces
  FROM vistas.provinces_in_resolutions_1570
  GROUP BY resolution_id)
SELECT resolution_id,
       r.resolution_text,
       r.resolution_summary,
       r.small_title,
       ch.general_name AS chapter_name,
       EXTRACT(YEAR FROM ch.date_beginning) AS chapteryear,
       provinces
FROM res
JOIN resolutions_1570 r USING(resolution_id)
JOIN ch ON ch.chapter_id = r.chapter
WHERE $3
