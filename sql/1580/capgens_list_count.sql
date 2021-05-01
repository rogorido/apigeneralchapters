-- Estadísticas de capítulos y nº de resoluciones

SELECT ch.general_name, COUNT(*)
FROM chapters ch
JOIN resolutions r ON ch.chapter_id = r.chapter
WHERE type_chapter = 'General'
GROUP BY ch.general_name;
