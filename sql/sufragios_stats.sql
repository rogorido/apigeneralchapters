-- esto tiene el problema q no cuenta NULLs 

SELECT jsonb_array_elements_text(details->'destinatarios') AS destinatarios,
       COUNT(*) AS total
FROM  resolutions_details r
where details ? 'sufragio'
GROUP BY destinatarios;
