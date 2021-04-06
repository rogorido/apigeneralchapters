-- Lista simple de todos los temas usados

SELECT DISTINCT theme
FROM resolutions_themes
JOIN themes using (theme_id)
ORDER BY theme;
