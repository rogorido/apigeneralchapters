-- todo el lío con CTE es para lo de los porcentajes 

WITH A AS (
SELECT details->>'aprobación_tipo' tipo,
          details->>'aprobación_cargo' cargo,
          p.name AS province_name,
          COUNT(*) AS total
FROM resolutions_details_1570 r
JOIN provinces p ON p.province_id = (details->>'provincia')::int
where details ? 'aprobación' AND province_id = $1
GROUP BY details->>'aprobación_tipo', details->>'aprobación_cargo', p.name)
SELECT tipo, cargo, province_name, total,  SUM(total),
       round((total * 100)/ SUM(total) OVER (PARTITION BY province_name), 2) AS percentage
FROM A
GROUP BY tipo, cargo, province_name, total;
