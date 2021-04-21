
WITH A AS
   (SELECT resolution_id
   FROM resolutions_themes
   WHERE theme_id = $1)
SELECT theme_id, theme, COUNT(*) AS total
FROM resolutions_themes
JOIN A USING(resolution_id)
JOIN themes USING (theme_id)
WHERE theme_id != $1
GROUP BY theme_id, theme;
