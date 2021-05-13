-- Estadísticas de uso de temas solo en ordinationes 

SELECT theme, COUNT(*) AS total
FROM resolutions_themes_1580
JOIN themes using (theme_id)
JOIN resolutions r USING (resolution_id)
WHERE small_title = 'Ordinationes'
GROUP BY theme;
