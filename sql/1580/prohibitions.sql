-- para ver así por enciam lo q he metido  
-- así solo los objetos sin count pq tp interesa mucho

SELECT jsonb_array_elements_text(details->'objetos') AS objetos
FROM  resolutions_details_1580 r
where details ? 'prohibición'
ORDER BY objetos;
