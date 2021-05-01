
SELECT ch.general_name,
       EXTRACT(YEAR FROM date_beginning) AS yearchapter,
       COUNT(r.resolution_id) AS total 
FROM chapters ch
LEFT JOIN resolutions_1580 r ON ch.chapter_id = r.chapter
WHERE type_chapter = 'General'
GROUP BY ch.general_name, yearchapter
ORDER BY yearchapter;
