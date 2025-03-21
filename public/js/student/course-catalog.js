class CourseCatalog {
    constructor() {
      this.filters = {
        department: '',
        time: '',
        days: [],
        seats: true
      };
      
      this.initEventListeners();
      this.loadCourses();
      this.initSSE();
    }
  
    initEventListeners() {
      document.getElementById('search').addEventListener('input', this.debounce(this.loadCourses, 300));
      document.getElementById('department').addEventListener('change', (e) => {
        this.filters.department = e.target.value;
        this.loadCourses();
      });
      document.getElementById('time').addEventListener('change', (e) => {
        this.filters.time = e.target.value;
        this.loadCourses();
      });
    }
  
    async loadCourses() {
      try {
        const query = new URLSearchParams(this.filters).toString();
        const response = await fetch(`/api/courses?${query}`);
        const courses = await response.json();
        this.renderCourses(courses);
      } catch (error) {
        console.error('Error loading courses:', error);
      }
    }
  
    renderCourses(courses) {
      const container = document.getElementById('courseList');
      container.innerHTML = courses.map(course => `
        <div class="course-card" data-course="${course._id}">
          <h3>${course.code} - ${course.name}</h3>
          <div class="course-info">
            <span>Seats: ${course.seats - course.registeredStudents.length}</span>
            <span>Time: ${course.schedule.startTime}</span>
            <button class="add-course">Add</button>
          </div>
          <div class="prerequisites">
            ${course.prerequisites.map(p => `<span class="prereq">${p.code}</span>`).join('')}
          </div>
        </div>
      `).join('');
    }
  
    initSSE() {
      const eventSource = new EventSource('/api/courses/updates');
      eventSource.onmessage = (event) => {
        const update = JSON.parse(event.data);
        this.updateCourseSeats(update.courseId, update.availableSeats);
      };
    }
  
    updateCourseSeats(courseId, availableSeats) {
      const courseElement = document.querySelector(`[data-course="${courseId}"] span`);
      if (courseElement) {
        courseElement.textContent = `Seats: ${availableSeats}`;
      }
    }
  
    debounce(func, timeout = 300) {
      let timer;
      return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
      };
    }
  }
  
  new CourseCatalog();