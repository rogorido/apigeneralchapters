
SELECT theme, COUNT(*) AS total
FROM resolutions_themes_1580
JOIN themes using (theme_id)
JOIN vistas.provinces_in_resolutions_1580 v USING (resolution_id)
WHERE v.province_id = $1
GROUP BY theme;
