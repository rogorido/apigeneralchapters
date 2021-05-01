

WITH infos AS
   (SELECT r.detail_id, details#>'{retro_info}' AS info
   FROM  resolutions_details_1580 r
   WHERE details#>'{retro_info}' IS NOT NULL
         AND jsonb_typeof(details#>'{retro_info}') = 'object'
   UNION all
   SELECT r.detail_id, details AS info
   FROM  resolutions_details_1580 r
   WHERE details ? 'retro')
SELECT info->>'referencia' AS referencia,
       COUNT(*) AS total
FROM infos
GROUP BY referencia;
