const eventSource = new EventSource('/updates');

eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    // Update seat counts
    document.querySelectorAll('.course-card').forEach(card => {
        if(card.dataset.courseId === data.courseId) {
            card.querySelector('.seat-count').textContent = data.availableSeats;
        }
    });
    
    // Update schedule conflicts
    if(data.type === 'enrollment') {
        updateSchedule();
    }
};