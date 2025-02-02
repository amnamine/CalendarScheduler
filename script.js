// DOM Elements
const datePicker = document.getElementById('datePicker');
const addEventBtn = document.getElementById('addEventBtn');
const viewButtons = document.querySelectorAll('.view-btn');
const currentMonthYearElement = document.getElementById('currentMonthYear');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const todayBtn = document.getElementById('todayBtn');
const daysGrid = document.getElementById('daysGrid');
const upcomingEventsList = document.getElementById('upcomingEventsList');
const eventModal = document.getElementById('eventModal');
const eventForm = document.getElementById('eventForm');
const closeBtn = document.querySelector('.close-btn');
const cancelBtn = document.querySelector('.cancel-btn');

// State
let currentDate = new Date();
let events = JSON.parse(localStorage.getItem('events')) || [];
let currentView = 'month';

// Initialize
function init() {
    renderCalendar();
    renderUpcomingEvents();
    setupEventListeners();
    datePicker.valueAsDate = new Date();
}

// Event Listeners
function setupEventListeners() {
    addEventBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    eventForm.addEventListener('submit', handleEventSubmit);
    prevBtn.addEventListener('click', () => navigateMonth(-1));
    nextBtn.addEventListener('click', () => navigateMonth(1));
    todayBtn.addEventListener('click', goToToday);
    datePicker.addEventListener('change', handleDatePickerChange);
    
    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentView = button.dataset.view;
            updateViewButtons();
            renderCalendar();
        });
    });
}

// Calendar Rendering
function renderCalendar() {
    currentMonthYearElement.textContent = formatMonthYear(currentDate);
    const daysInMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
    ).getDate();
    
    const firstDay = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
    ).getDay();
    
    daysGrid.innerHTML = '';
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.classList.add('empty-day');
        daysGrid.appendChild(emptyDay);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.textContent = day;
        
        const currentDayDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            day
        );
        
        // Check if day has events
        const hasEvents = events.some(event => {
            const eventDate = new Date(event.date);
            return eventDate.toDateString() === currentDayDate.toDateString();
        });
        
        if (hasEvents) {
            dayElement.classList.add('has-events');
        }
        
        // Check if day is today
        if (isToday(currentDayDate)) {
            dayElement.classList.add('today');
        }
        
        dayElement.addEventListener('click', () => {
            const selectedDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                day
            );
            openModalWithDate(selectedDate);
        });
        
        daysGrid.appendChild(dayElement);
    }
}

// Event Handling
function handleEventSubmit(e) {
    e.preventDefault();
    
    const newEvent = {
        id: Date.now(),
        title: document.getElementById('eventTitle').value,
        date: document.getElementById('eventDate').value,
        time: document.getElementById('eventTime').value,
        description: document.getElementById('eventDescription').value,
        color: document.getElementById('eventColor').value
    };
    
    events.push(newEvent);
    saveEvents();
    renderCalendar();
    renderUpcomingEvents();
    closeModal();
    eventForm.reset();
}

function handleDatePickerChange(e) {
    currentDate = new Date(e.target.value);
    renderCalendar();
}

// Modal Functions
function openModal() {
    eventModal.classList.add('active');
    document.getElementById('eventDate').valueAsDate = new Date();
}

function openModalWithDate(date) {
    eventModal.classList.add('active');
    document.getElementById('eventDate').valueAsDate = date;
}

function closeModal() {
    eventModal.classList.remove('active');
    eventForm.reset();
}

// Navigation Functions
function navigateMonth(direction) {
    currentDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + direction,
        1
    );
    renderCalendar();
}

function goToToday() {
    currentDate = new Date();
    renderCalendar();
    datePicker.valueAsDate = currentDate;
}

// View Management
function updateViewButtons() {
    viewButtons.forEach(button => {
        button.classList.toggle('active', button.dataset.view === currentView);
    });
}

// Upcoming Events
function renderUpcomingEvents() {
    const today = new Date();
    const upcomingEvents = events
        .filter(event => new Date(event.date) >= today)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5);
    
    upcomingEventsList.innerHTML = '';
    
    if (upcomingEvents.length === 0) {
        upcomingEventsList.innerHTML = '<p>No upcoming events</p>';
        return;
    }
    
    upcomingEvents.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.classList.add('event-item');
        eventElement.style.borderLeftColor = event.color;
        
        eventElement.innerHTML = `
            <div class="event-title">${event.title}</div>
            <div class="event-date">${formatDate(new Date(event.date))}</div>
            ${event.time ? `<div class="event-time">${formatTime(event.time)}</div>` : ''}
        `;
        
        upcomingEventsList.appendChild(eventElement);
    });
}

// Utility Functions
function formatMonthYear(date) {
    return date.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    });
}

function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    });
}

function formatTime(time) {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
    });
}

function isToday(date) {
    const today = new Date();
    return date.toDateString() === today.toDateString();
}

function saveEvents() {
    localStorage.setItem('events', JSON.stringify(events));
}

// Initialize the app
init(); 