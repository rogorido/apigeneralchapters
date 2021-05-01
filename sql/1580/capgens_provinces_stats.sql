-- Toda la lógica está obviamente en
-- vistas.provinces_in_resolutions
-- cuya explicación está en lo de analisisdatos.org

SELECT p.province_id,
       p.name AS province_name,
       COUNT(*) AS total 
FROM provinces P
JOIN vistas.provinces_in_resolutions_1580 USING (province_id)
GROUP BY p.province_id, p.name
ORDER BY p.name;
