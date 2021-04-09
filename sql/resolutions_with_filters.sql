-- para rellenar un combobox con las casas que  aparecen como destino
-- en las afiliaciones 

-- WITH j AS (
-- SELECT resolution_id, ARRAY_agg(theme_id) AS temas FROM resolutions_themes GROUP BY resolution_id)
-- SELECT resolution_id, temas FROM j WHERE  ($1 && temas);

WITH j AS (
SELECT resolution_id, ARRAY_agg(theme_id) AS temas FROM resolutions_themes GROUP BY resolution_id)
SELECT resolution_id, temas
FROM j
JOIN resolutions USING(resolution_id)
WHERE $1
