import express from "express";  
import cors from "cors";
import { connectDB } from "./src/config.js";
import { getallusers, createuser, getuserbyid, updateusers, deleteUser, getMyTasks, updateTaskStatus } from "./controllers/usercontroller.js";
import { getallprojects, createproject, updateproject, deleteproject, assignmanagertoproject, removemanagerfromproject, getprojectbyid, getprojectbymanager } from "./controllers/projectcontroller.js";
import { createtask, gettaskbyproject, gettaskbyid, getalltasks, updatetask, deletetask } from "./controllers/taskcontroller.js";
import { createTeam, addMemberToTeam, getAllTeams, getTeamMembers, deleteTeam } from "./controllers/teamcontroller.js";
import { adminGetAllUsers, adminUpdateProject, getuserbymanager } from "./controllers/admincontrollers.js";
import { getMyProjects, getTeamMembers as getManagerTeamMembers, assignTaskToMember } from "./controllers/managercontroller.js";  
import { addComment, getCommentsByTask, deleteComment } from "./controllers/commentcontroller.js";  
import { login, verifyTokenMiddleware, verify } from "./controllers/authcontroller.js";
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: true, // allow the requesting origin (useful for dev across ports)
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);




// The root url
app.get("/", (request, response) => {
    response.send("test express");
    console.log("get request processed");
});


// ========== AUTH ROUTES ==========
app.post('/auth/login', login);
app.get('/auth/verify', verifyTokenMiddleware, verify);

// ========== USER ROUTES ==========
app.get("/users", getallusers);
app.get("/users/:id", getuserbyid);
app.post("/users", createuser);
app.put("/users/:id", updateusers);
app.delete("/users/:id", deleteUser);
app.get("/users/:id/tasks", getMyTasks);
app.put("/tasks/:id/status", updateTaskStatus);

// ========== ADMIN ROUTES ==========
app.get("/admin/users", adminGetAllUsers);
app.get("/admin/users/:id", getuserbyid);
app.put("/admin/users/:id", updateusers);
app.delete("/admin/users/:id", deleteUser);
app.put("/admin/projects/:project_id", adminUpdateProject);
app.get("/admin/manager/:manager_id/users", getuserbymanager); // example: get all users under a manager

// ========== PROJECT ROUTES ==========
app.get("/projects", getallprojects);
app.post("/projects", createproject);
app.get("/projects/:project_id", getprojectbyid);
app.put("/projects/:project_id", updateproject);
app.delete("/projects/:project_id", deleteproject);
app.post("/projects/:project_id/assignmanager", assignmanagertoproject);
app.post("/projects/:project_id/removemanager", removemanagerfromproject);
app.get("/projects/manager/:manager_id", getprojectbymanager);

// ========== TASK ROUTES ==========
app.post("/tasks", createtask);
app.get("/tasks", getalltasks);
app.get("/tasks/:task_id", gettaskbyid);
app.get("/tasks/project/:project_id", gettaskbyproject);
app.put("/tasks/:task_id", updatetask);
app.delete("/tasks/:task_id", deletetask);

// ========== TEAM ROUTES ==========
app.post("/teams", createTeam);
app.put("/teams/add-member", addMemberToTeam);
app.get("/teams", getAllTeams);
app.get("/teams/:id/members", getTeamMembers);
app.delete("/teams/:id", deleteTeam);
  
// ========== MANAGER ROUTES ==========
app.get("/manager/:id/projects", getMyProjects);  
app.get("/manager/:id/team-members", getManagerTeamMembers);
app.get("/manager/team/:id", getManagerTeamMembers);

app.post("/manager/assign-task", assignTaskToMember); 


app.post("/comments", addComment);  
app.get("/comments/task/:taskId", getCommentsByTask);  
app.delete("/comments/:id", deleteComment); 
// 404 handler (should be after all route registrations)
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware (last middleware)
app.use((err, req, res, next) => {
  console.error('Error:', err.stack || err);
  res.status(500).json({ 
    error: 'Something went wrong!',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});
const PORT = process.env.PORT || 4400;

// Initialize the server
async function startServer() {
  try {
    // First connect to the database
    const dbConnection = await connectDB();
    if (!dbConnection) {
      throw new Error('Failed to connect to database');
    }
    
    // Then start the server
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`API is accessible at http://localhost:${PORT}`);
    });

    // Handle server errors
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
      } else {
        console.error('Server error:', err);
      }
      process.exit(1);
    });

    // Handle process termination
    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();