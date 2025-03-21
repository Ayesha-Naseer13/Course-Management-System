// Confirm destructive actions
document.addEventListener('DOMContentLoaded', () => {
    // Delete confirmation
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (!confirm('Are you sure you want to delete this?')) {
          e.preventDefault();
        }
      });
    });
  
    // Seat validation
    document.querySelectorAll('input[name="seats"]').forEach(input => {
      input.addEventListener('change', (e) => {
        if (e.target.value < 0) {
          alert('Seats cannot be negative');
          e.target.value = 0;
        }
      });
    });
  
    // Toggle dropdowns
    document.querySelectorAll('.dropdown').forEach(dropdown => {
      dropdown.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('active');
      });
    });
  
    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
      document.querySelectorAll('.dropdown').forEach(dropdown => {
        dropdown.classList.remove('active');
      });
    });
  });