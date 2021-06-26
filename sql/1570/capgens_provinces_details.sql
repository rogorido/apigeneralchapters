
SELECT small_title AS titulillo, COUNT(*) AS total
FROM chapters ch
JOIN resolutions_1570 r ON ch.chapter_id = r.chapter
JOIN vistas.provinces_in_resolutions_1570 v USING (resolution_id)
WHERE v.province_id = $1
GROUP BY small_title;
