import { Student } from '@/constants'

function getStoredStudetns(): Student[] {
    const stored = localStorage.getItem('rules');
    return stored ? JSON.parse(stored) : [];
}

function isDuplicateEntry(student: Student): boolean {
    const students = getStoredStudetns();
    console.log('Checking for duplicates...');
    console.log('New student:', student);
    console.log('Existing students:', students);
    
    const isDuplicate = students.some(existingStudent => {
        const nameMatch = existingStudent.firstName.toLowerCase().trim() === student.firstName.toLowerCase().trim();
        const lastNameMatch = existingStudent.lastName.toLowerCase().trim() === student.lastName.toLowerCase().trim();
        const middleMatch = (existingStudent.middleInitial || '').toLowerCase().trim() === (student.middleInitial || '').toLowerCase().trim();
        // Normalize dates to YYYY-MM-DD format for comparison
        const normalizeDate = (dateStr: string) => {
          if (!dateStr) return '';
          const date = new Date(dateStr);
          return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
        };
        
        const birthMatch = normalizeDate(existingStudent.birthDate) === normalizeDate(student.birthDate);
        
        console.log('Comparing with:', existingStudent);
        console.log('Name match:', nameMatch, 'Last name match:', lastNameMatch, 'Middle match:', middleMatch, 'Birth match:', birthMatch);
        
        return nameMatch && lastNameMatch && middleMatch && birthMatch;
    });
    
    console.log('Final duplicate result:', isDuplicate);
    return isDuplicate;
}

export { isDuplicateEntry };
