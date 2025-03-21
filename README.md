# Course Registration System

A modern web-based solution addressing critical issues in university course registration, providing seamless experiences for both students and administrators.

## Features

### Student Features

🔑 **Login by Roll Number**  
- Authenticate using existing roll numbers (no registration required)  
- Secure session-based authentication  

🗓️ **Interactive Weekly Schedule**  
- Visual calendar with drag-and-drop course management  
- Real-time conflict detection (color-coded time slots)  
- Dynamic updates without page refresh  

🔄 **Live Seat Availability**  
- Instant seat count updates using Server-Sent Events (SSE)  
- Visual indicators for course availability (green/yellow/red)  

🔍 **Smart Course Discovery**  
- Multi-criteria filters:  
  - Department/Course Level  
  - Time Slot (Morning/Afternoon)  
  - Days of Week  
  - Open Seats Availability  
- Instant search results with debounced input  

💾 **Session Persistence**  
- Auto-save draft schedules using session storage  
- Resume progress across browser sessions  

📚 **Prerequisite Visualization**  
- Interactive dependency graphs for course chains  
- Warning system for missing prerequisites  
- Academic pathway suggestions

### Admin Features

👩💼 **Admin Dashboard**  
- Secure credential-based authentication  
- Comprehensive system overview  

📦 **Course Management**  
- Full CRUD operations for courses  
- Prerequisite relationship builder  
- Batch import/export capabilities  

👥 **Student Management**  
- Student profile viewer with academic history  
- Registration override functionality  
- Force add/drop courses for special cases  

🪑 **Seat Management**  
- Dynamic seat capacity adjustments  
- Registration conflict resolution tools  

📊 **Advanced Reporting**  
1. Course Enrollment Reports  
   - Registered student lists  
   - Attendance trends analysis  
2. Availability Dashboard  
   - Real-time seat occupancy maps  
   - Waitlist management  
3. Compliance Audits  
   - Prerequisite violation alerts  
   - Graduation requirement tracking

## Technical Stack

### Frontend
- **Core**: Vanilla JavaScript (ES6+)  
- **UI**: Semantic HTML5 + CSS3 Grid/Flexbox  
- **Dynamic Updates**: EventSource API for real-time  
- **State Management**: Session Storage + Custom Observables

### Backend
- **Runtime**: Node.js v18+  
- **Framework**: Express.js 4.x  
- **Essential Middleware**:  
  - `express-session` for auth  
  - `method-override` for RESTful routes  
  - `mongoose` for MongoDB interactions

### Database
- **Primary**: MongoDB Atlas (Cloud)  
- **ODM**: Mongoose v7+  
- **Models**:  
  ```javascript
  const Course = new Schema({
    code: { type: String, unique: true },
    name: String,
    schedule: {
      days: [String], 
      startTime: String,
      endTime: String
    },
    seats: Number,
    prerequisites: [{ type: Schema.Types.ObjectId, ref: 'Course' }]
  });

  const Student = new Schema({
    rollNumber: { type: String, unique: true },
    completedCourses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
    registeredCourses: [{ type: Schema.Types.ObjectId, ref: 'Course' }]
  });
