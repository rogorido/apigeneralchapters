SELECT EXTRACT('year' FROM date_trunc('decade', date_beginning)::date) as decada,
       COUNT(*) AS total
FROM chapters
WHERE type_chapter= 'General'
GROUP BY 1
ORDER BY 1;
