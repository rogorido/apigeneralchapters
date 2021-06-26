--- resoluciones que tienen una referrencia a que hay que meter datos 

SELECT *
FROM resolutions
JOIN resolutions_details USING (resolution_id)
WHERE details ? 'add_data' OR details ? 'add_geo';
