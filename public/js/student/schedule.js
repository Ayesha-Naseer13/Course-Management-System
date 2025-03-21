class ScheduleCalendar {
    constructor() {
      this.timeslots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];
      this.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      this.initialize();
      this.loadInitialSchedule();
    }
  
    initialize() {
      const calendar = document.getElementById('calendar');
      
      // Create header row
      calendar.innerHTML = `<div class="header-row">
        <div class="time-column"></div>
        ${this.days.map(day => `<div class="day-header">${day}</div>`).join('')}
      </div>`;
      
      // Create time slots
      this.timeslots.forEach(time => {
        const row = document.createElement('div');
        row.className = 'calendar-row';
        row.innerHTML = `
          <div class="time-slot">${time}</div>
          ${this.days.map(day => `
            <div class="calendar-cell" data-day="${day}" data-time="${time}"></div>
          `).join('')}
        `;
        calendar.appendChild(row);
      });
    }
  
    async loadInitialSchedule() {
      try {
        const response = await fetch('/api/schedule');
        const { registered, tentative } = await response.json();
        this.updateCalendar(registered, 'registered');
        this.updateCalendar(tentative, 'tentative');
      } catch (error) {
        console.error('Error loading schedule:', error);
      }
    }
  
    updateCalendar(courses, type) {
      courses.forEach(course => {
        course.schedule.days.forEach(day => {
          const cell = document.querySelector(`[data-day="${day}"][data-time="${course.schedule.startTime}"]`);
          if (cell) {
            const courseElement = document.createElement('div');
            courseElement.className = `course-event ${type}`;
            courseElement.innerHTML = `
              <span>${course.code}</span>
              <button class="remove-btn" data-course="${course._id}">×</button>
            `;
            cell.appendChild(courseElement);
          }
        });
      });
    }
  }
  
  // Initialize calendar
  new ScheduleCalendar();