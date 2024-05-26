var jsonData = [];
var filterAppliedData = [];

fetch('/getStudentsData').then(
  (response) => response.json().then((value) => {
    jsonData = value;
    filterAppliedData = value;
    renderTable();
    updatePaginationDisplay();
    populateGroupOptions();
  })
);
    
// ];

// Global variables for pagination
let currentPage = 1;
const rowsPerPage = 10;

// Function to create table rows from JSON data
function createTableRows(data) {
  const startIndex = (currentPage - 1) * rowsPerPage; // Calculate the starting index for the current page
  return data.map((item, index) => {
    const serialNumber = startIndex + index + 1; // Adjust the serial number based on the current page
    const groupNames = Object.values(item.groups)
      .filter(name => name) // Filter out null values
      .join(', ');
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' }; // Options to show only date
    return `
      <tr>
        <td>${serialNumber}</td>
        <td>${item.user_id["$numberLong"] || item.user_id}</td>
        <td>${item.full_name}</td>
        <td>${item.user_name || 'N/A'}</td>
        <td>${item.profile_link ? `<a href="${item.profile_link}">Profile</a>` : 'N/A'}</td>
        <td>${groupNames}</td>
        <td>${item.is_bot}</td>
        <td>${item.phone_number || 'N/A'}</td>
        <td>${item.triggered}</td>
        <td>${new Date(item.epoctime * 1000).toLocaleDateString('en-US', dateOptions)}</td>
      </tr>
    `;
  }).join('');
}

// Function to render the table with JSON data
function renderTable(filteredData = filterAppliedData) {
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  const tableBody = document.getElementById('jsonTable').querySelector('tbody');
  tableBody.innerHTML = createTableRows(paginatedData);
}

// Function to filter data by time
function filterByTime() {
  currentPage = 1; // Reset to the first page
  const selectedTime = document.getElementById('timeFilter').value;
  const now = new Date();
  filterAppliedData = jsonData.filter(item => {
    const itemDate = new Date(item.epoctime * 1000);
    switch (selectedTime) {
      case 'week':
        return now - itemDate <= 7 * 24 * 60 * 60 * 1000; // Last 1 week
      case 'month':
        return now - itemDate <= 30 * 24 * 60 * 60 * 1000; // Last 1 month
      case '6months':
        return now - itemDate <= 6 * 30 * 24 * 60 * 60 * 1000; // Last 6 months
      case 'year':
        return now - itemDate <= 12 * 30 * 24 * 60 * 60 * 1000; // Last 1 year
      default:
        return true; // All time
    }
  });
  renderTable();
  updatePaginationDisplay();
}

// Function to filter data by group
function filterByGroup() {
  currentPage = 1; // Reset to the first page
  const selectedGroup = document.getElementById('groupFilter').value;
  filterAppliedData = jsonData.filter(item => {
    const groupNames = Object.values(item.groups).filter(name => name);
    return selectedGroup === "" || groupNames.includes(selectedGroup);
  });
  renderTable();
  updatePaginationDisplay();
}

// Function to populate group filter options
function populateGroupOptions() {
  const groupSet = new Set();
  jsonData.forEach(item => {
    Object.values(item.groups).forEach(group => {
      if (group) groupSet.add(group);
    });
  });
  const groupFilter = document.getElementById('groupFilter');
  groupSet.forEach(group => {
    groupFilter.add(new Option(group, group));
  });
}

// Function to download the data in Excel format
function downloadExcel() {
  const ws = XLSX.utils.table_to_sheet(document.getElementById('jsonTable'));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Students Data');
  XLSX.writeFile(wb, 'StudentsData.xlsx');
}

// Function to update the current page
function changePage(step) {
  const totalPages = Math.ceil(filterAppliedData.length / rowsPerPage);
  currentPage += step;
  currentPage = Math.max(1, Math.min(currentPage, totalPages)); // Clamp between 1 and totalPages
  document.getElementById('currentPage').textContent = currentPage;
  renderTable();
  updatePaginationDisplay();
}

// Function to initialize pagination
function initPagination() {
  const totalPages = Math.ceil(filterAppliedData.length / rowsPerPage);
  document.getElementById('totalPages').textContent = totalPages;
  document.getElementById('currentPage').textContent = currentPage;
}

// Function to update pagination display
function updatePaginationDisplay() {
  const totalPages = Math.ceil(filterAppliedData.length / rowsPerPage);
  document.getElementById('totalPages').textContent = totalPages;
  document.getElementById('currentPage').textContent = currentPage;
}

function openReportURL() {
  window.open("/reports",'_blank');
}

// Call the functions on page load
window.onload = () => {
  renderTable();
  populateGroupOptions();
  initPagination();
};