
SELECT small_title AS titulillo, COUNT(*) AS total
FROM chapters ch
JOIN resolutions r ON ch.chapter_id = r.chapter
JOIN vistas.provinces_in_resolutions v USING (resolution_id)
WHERE v.province_id = $1
GROUP BY small_title;
