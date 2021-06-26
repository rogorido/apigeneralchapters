-- sistema tosco de ttipo de lista total
-- de tipos de resoluciones 

SELECT small_title, COUNT(*) AS total
FROM  resolutions_1570 r
JOIN chapters ch ON r.chapter = ch.chapter_id
WHERE type_chapter = 'General'
GROUP BY  small_title;
