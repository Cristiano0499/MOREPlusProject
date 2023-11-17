const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Dummy user data for example purposes
const users = [
    { email: 'user@example.com', password: 'password123' }
];

// Dummy data for user projects
const userProjects = [
    { id: 1, name: 'Project Alpha', description: 'Description for Project Alpha' },
    { id: 2, name: 'Project Beta', description: 'Description for Project Beta' },
    // Add more projects as needed
];

// Dummy data store for projects - replace with real database in production
let projects = [];

app.use(bodyParser.json());
// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Homepage route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'homepage.html'));
});

// API endpoint for login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        res.json({ success: true, message: 'Login successful' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// API endpoint for signup
app.post('/api/signup', (req, res) => {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = users.some(user => user.email === email);
    if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Save user to 'database' (in this example, pushing to the array)
    users.push({ name, email, password }); // In a real app, make sure to hash the password

    res.json({ success: true, message: 'Signup successful' });
});

// Route to handle fetching user projects
app.get('/api/user/projects', (req, res) => {
    // In a real application, you would retrieve these from a database
    // and you might want to verify the user's identity and permissions

    res.json({ success: true, projects: userProjects });
});

app.post('/api/projects', (req, res) => {
    // Extract project data from request body
    const { projectName, projectDescription, projectType, positions } = req.body;

    // Create a new project object
    const newProject = {
        id: projects.length + 1,  // Simple ID assignment, replace with more robust method in production
        name: projectName,
        description: projectDescription,
        type: projectType,
        positions: positions
    };

    // Add the new project to the array (simulating database insertion)
    projects.push(newProject);

    console.log('New project added:', newProject);
    res.json({ success: true, message: 'Project created successfully', project: newProject });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
