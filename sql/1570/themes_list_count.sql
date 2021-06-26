-- Estadísticas de uso de temas
-- lo ordena vuetify

--- se trata de una query que reduce todo a
--- chapters posteriores a 1570

SELECT theme, COUNT(*) AS total
FROM resolutions_themes_1570
JOIN themes using (theme_id)
GROUP BY theme;
