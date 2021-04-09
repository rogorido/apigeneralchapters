-- para rellenar un combobox con las casas que  aparecen como destino
-- en las afiliaciones 

SELECT DISTINCT h.house_id,
       h.name || ' (' || p.name || ')' AS casa_destino
FROM  resolutions_details r
LEFT JOIN houses h ON (details->>'casa_destino')::INT =h.house_id
JOIN provinces P USING (province_id)
WHERE r.details ? 'afiliacion' AND h.house_id IS NOT NULL;
