document.addEventListener('DOMContentLoaded', () => {
    const roleSelect = document.getElementById('role');
    const container = document.querySelector('.fields-container');
    const studentFields = document.getElementById('studentFields');
    const adminFields = document.getElementById('adminFields');

    function toggleFields() {
        if (roleSelect.value === 'student') {
            container.classList.remove('slide-admin');
        } else {
            container.classList.add('slide-admin');
        }
        
        // Update required attributes
        document.getElementById('rollNumber').required = roleSelect.value === 'student';
        document.getElementById('username').required = roleSelect.value === 'admin';
        document.getElementById('password').required = roleSelect.value === 'admin';
    }

    roleSelect.addEventListener('change', toggleFields);
    toggleFields(); // Initial call
});