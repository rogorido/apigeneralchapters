-- las q hay para volver a mirar 

SELECT r.resolution_id, r.resolution_text, r.resolution_summary,
       r.small_title, ch.general_name, EXTRACT(YEAR FROM ch.date_beginning)
FROM resolutions_1570 r
JOIN chapters ch ON r.chapter = ch.chapter_id 
WHERE look_again = TRUE;
