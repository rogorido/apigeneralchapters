
SELECT h.name AS casa_origen,
       p.name AS provincia,
       COUNT(*) AS total
FROM  houses h
LEFT JOIN provinces P USING (province_id)
LEFT JOIN resolutions_details_1580 r ON (details->>'casa_origen')::INT =h.house_id
where r.details ? 'afiliacion'
GROUP BY casa_origen, provincia;
