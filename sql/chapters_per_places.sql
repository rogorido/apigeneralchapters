SELECT p.place_id, p.place,
       p.longitude, p.latitude,
       COUNT(*) AS total
FROM places P
JOIN chapters ch using (place_id)
WHERE ch.type_chapter = 'General'
GROUP BY p.place_id, p.place, longitude, latitude
ORDER BY total DESC;
