
SELECT details->>'aprobación_tipo' tipo,
       details->>'aprobación_cargo' cargo,
       p.name AS province_name,
       COUNT(*) AS total
FROM  resolutions_details r
JOIN provinces p ON p.province_id = (details->>'provincia')::int
where details ? 'aprobación'
GROUP BY details->>'aprobación_tipo', details->>'aprobación_cargo', p.name
ORDER BY p.name, details->>'aprobación_cargo';

