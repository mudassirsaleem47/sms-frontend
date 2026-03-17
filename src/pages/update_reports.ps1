$content = Get-Content "g:\School-Management-System - Copy\frontend\src\pages\ReportsPage.jsx" -Raw
$oldTerm = '            const \[
                studentsRes, teachersRes, staffRes, classesRes, subjectsRes,
                feeStatsRes, incomeStatsRes, expenseStatsRes, enquiriesRes, complaintsRes
            \] = await Promise\.allSettled\(\[
                axios\.get\(`${API_BASE}/Students/\${schoolId}`\),
                axios\.get\(`${API_BASE}/Teachers/\${schoolId}`\),
                axios\.get\(`${API_BASE}/Staff/\${schoolId}`\),
                axios\.get\(`${API_BASE}/Sclasses/\${schoolId}`\),
                axios\.get\(`${API_BASE}/AllSubjects/\${schoolId}`\),
                axios\.get\(`${API_BASE}/fee-statistics/\${schoolId}`\),
                axios\.get\(`${API_BASE}/income-statistics/\${schoolId}`\),
                axios\.get\(`${API_BASE}/expense-statistics/\${schoolId}`\),
                axios\.get\(`${API_BASE}/Enquiry/\${schoolId}`\),
                axios\.get\(`${API_BASE}/Complains/\${schoolId}`\),
            \]\);'

$newTerm = '            const campusQuery = selectedCampus ? `?campus=${selectedCampus._id}` : "";
            const [
                studentsRes, teachersRes, staffRes, classesRes, subjectsRes,
                feeStatsRes, incomeStatsRes, expenseStatsRes, enquiriesRes, complaintsRes
            ] = await Promise.allSettled([
                axios.get(`${API_BASE}/Students/${schoolId}${campusQuery}`),
                axios.get(`${API_BASE}/Teachers/${schoolId}${campusQuery}`),
                axios.get(`${API_BASE}/Staff/${schoolId}${campusQuery}`),
                axios.get(`${API_BASE}/Sclasses/${schoolId}${campusQuery}`),
                axios.get(`${API_BASE}/AllSubjects/${schoolId}${campusQuery}`),
                axios.get(`${API_BASE}/fee-statistics/${schoolId}${campusQuery}`),
                axios.get(`${API_BASE}/income-statistics/${schoolId}${campusQuery}`),
                axios.get(`${API_BASE}/expense-statistics/${schoolId}${campusQuery}`),
                axios.get(`${API_BASE}/Enquiry/${schoolId}${campusQuery}`),
                axios.get(`${API_BASE}/Complains/${schoolId}${campusQuery}`),
            ]);'

$content = $content -replace $oldTerm, $newTerm
$content | Set-Content "g:\School-Management-System - Copy\frontend\src\pages\ReportsPage.jsx" -NoNewline
