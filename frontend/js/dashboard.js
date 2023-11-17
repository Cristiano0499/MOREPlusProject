document.getElementById('addPosition').addEventListener('click', function() {
    const positionsContainer = document.getElementById('positionsContainer');
    const newPositionEntry = document.createElement('div');
    newPositionEntry.className = 'position-entry';
    newPositionEntry.innerHTML = `
        <input type="text" class="position-name" placeholder="Position Name" required>
        <select class="position-status">
            <option value="available">Available</option>
            <option value="taken">Taken</option>
        </select>
    `;
    positionsContainer.appendChild(newPositionEntry);
});

document.getElementById('createProjectForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Retrieve form values
    var projectName = document.getElementById('projectName').value;
    var projectDescription = document.getElementById('projectDescription').value;
    var projectType = document.getElementById('projectType').value;
    var positions = Array.from(document.getElementsByClassName('position-entry')).map(position => {
        return {
            name: position.querySelector('.position-name').value,
            status: position.querySelector('.position-status').value
        };
    });

    // Simple validation
    if (!projectName || !projectDescription || !projectType || positions.some(pos => !pos.name)) {
        alert('Please fill in all fields');
        return;
    }

    // Construct the project data
    var projectData = {
        projectName,
        projectDescription,
        projectType,
        positions
    };

    // Send data to the server (API endpoint to be defined in your backend)
    fetch('/api/projects', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Include authentication token if needed
        },
        body: JSON.stringify(projectData),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Handle successful project creation
            console.log('Project created successfully:', data.project);
            // Optionally, you can refresh the list of projects or redirect
            alert('Project created successfully!');
        } else {
            // Handle errors
            console.error('Project creation failed:', data.message);
            alert('Project creation failed: ' + data.message);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Error: ' + error.message);
    });
});


// Function to load and display existing user projects
function loadUserProjects() {
    fetch('/api/user/projects', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // Include authentication token if needed
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.projects) {
            displayProjects(data.projects);
        } else {
            console.error('Failed to load projects');
        }
    })
    .catch((error) => {
        console.error('Error loading projects:', error);
    });
}

function displayProjects(projects) {
    const projectsList = document.querySelector('.projects-list');
    projectsList.innerHTML = ''; // Clear existing projects

    projects.forEach(project => {
        const projectElement = document.createElement('div');
        projectElement.className = 'project';
        projectElement.innerHTML = `
            <h3>${project.name}</h3>
            <p>${project.description}</p>
        `;

        projectsList.appendChild(projectElement);
    });
}

// Call loadUserProjects on page load to display user's projects
loadUserProjects();


// Call loadUserProjects on page load to display user's projects
loadUserProjects();
