-- Estadísticas de uso de temas
-- lo ordena vuetify

SELECT theme, COUNT(*) AS total
FROM resolutions_themes
JOIN themes using (theme_id)
GROUP BY theme;
