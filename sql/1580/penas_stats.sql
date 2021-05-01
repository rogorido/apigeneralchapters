
WITH juntos AS
   (SELECT jsonb_array_elements_text(details->'pena_tipos') AS tipopena
   FROM  resolutions_details_1580 r
   WHERE details ? 'pena')
SELECT
   CASE
    WHEN tipopena = 'excomunión pena late sentencie' THEN 'excomunión late sentencie'
    ELSE tipopena
    END AS tipospenas,
    COUNT(*) AS total
FROM juntos
GROUP BY tipospenas
ORDER BY tipospenas;
