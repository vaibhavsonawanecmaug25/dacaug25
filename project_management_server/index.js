// ============================
// ✅ Express Server Setup
// ============================
import express from "express";
import cors from "cors";
import { connectDB } from "./src/config.js";

// ============================
// ✅ Controllers Import
// ============================
import { 
  getallusers, createuser, getuserbyid, updateusers, 
  deleteUser, getMyTasks, updateTaskStatus 
} from "./controllers/usercontroller.js";

import { 
  getallprojects, createproject, updateproject, deleteproject, 
  assignmanagertoproject, removemanagerfromproject, 
  getprojectbyid, getprojectbymanager 
} from "./controllers/projectcontroller.js";

import { 
  createtask, gettaskbyproject, gettaskbyid, 
  getalltasks, updatetask, deletetask 
} from "./controllers/taskcontroller.js";

import { 
  createTeam, addMemberToTeam, getAllTeams, 
  getTeamMembers, deleteTeam 
} from "./controllers/teamcontroller.js";

import { 
  adminGetAllUsers, adminUpdateProject, getuserbymanager 
} from "./controllers/admincontrollers.js";

import { 
  getMyProjects, getTeamMembers as getManagerTeamMembers, 
  assignTaskToMember 
} from "./controllers/managercontroller.js";

import { 
  addComment, getCommentsByTask, deleteComment 
} from "./controllers/commentcontroller.js";

import authRoutes from "./controllers/authroutes.js"; // ✅ Auth router import
import dashRoutes from "./controllers/dashroutes.js"; // ✅ Dashboard router import

// ============================
// ✅ App Initialization
// ============================
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ============================
// ✅ Root Route
// ============================
app.get("/", (req, res) => {
  res.send("✅ Express Server Running Successfully");
});

// ============================
// ✅ AUTH ROUTES (Mount FIRST)
// ============================
app.use("/auth", authRoutes);
console.log("✅ /auth routes mounted");

// ============================
// ✅ DASHBOARD ROUTES
// ============================
app.use("/api/dashboard", dashRoutes);
console.log("✅ /api/dashboard routes mounted");




// ============================
// ✅ USER ROUTES
// ============================
app.get("/users", getallusers);
app.get("/users/:id", getuserbyid);
app.post("/users", createuser);
app.put("/users/:id", updateusers);
app.delete("/users/:id", deleteUser);
app.get("/users/:id/tasks", getMyTasks);
app.put("/tasks/:id/status", updateTaskStatus);

// ============================
// ✅ ADMIN ROUTES
// ============================
app.get("/admin/users", adminGetAllUsers);
app.put("/admin/projects/:project_id", adminUpdateProject);
app.get("/admin/manager/:manager_id/users", getuserbymanager);

// ============================
// ✅ PROJECT ROUTES
// ============================
app.get("/projects", getallprojects);
app.post("/projects", createproject);
app.get("/projects/:project_id", getprojectbyid);
app.put("/projects/:project_id", updateproject);
app.delete("/projects/:project_id", deleteproject);
app.post("/projects/:project_id/assignmanager", assignmanagertoproject);
app.post("/projects/:project_id/removemanager", removemanagerfromproject);
app.get("/projects/manager/:manager_id", getprojectbymanager);

// ============================
// ✅ TASK ROUTES
// ============================
app.post("/tasks", createtask);
app.get("/tasks", getalltasks);
app.get("/tasks/:task_id", gettaskbyid);
app.get("/tasks/project/:project_id", gettaskbyproject);
app.put("/tasks/:task_id", updatetask);
app.delete("/tasks/:task_id", deletetask);

// ============================
// ✅ TEAM ROUTES
// ============================
app.post("/teams", createTeam);
app.put("/teams/add-member", addMemberToTeam);
app.get("/teams", getAllTeams);
app.get("/teams/:id/members", getTeamMembers);
app.delete("/teams/:id", deleteTeam);

// ============================
// ✅ MANAGER ROUTES
// ============================
app.get("/manager/:id/projects", getMyProjects);
app.get("/manager/:id/team-members", getManagerTeamMembers);
app.get("/manager/team/:id", getManagerTeamMembers);
app.post("/manager/assign-task", assignTaskToMember);

// ============================
// ✅ COMMENT ROUTES
// ============================
app.post("/comments", addComment);
app.get("/comments/task/:taskId", getCommentsByTask);
app.delete("/comments/:id", deleteComment);

// ============================
console.log("🧠 Checking Express routes...");

if (app && app._router && app._router.stack) {
  console.log("\n🧭 Registered Routes:");
  app._router.stack
    .filter(layer => layer.route)
    .forEach(layer => {
      const methods = Object.keys(layer.route.methods).join(", ").toUpperCase();
      console.log(`➡️ ${methods.padEnd(10)} ${layer.route.path}`);
    });
  console.log("🧭 End of Routes\n");
}


// ============================
// ❌ 404 Handler (MUST BE LAST)
// ============================
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ============================
// ⚠️ Error Handling Middleware
// ============================
app.use((err, req, res, next) => {
  console.error("Error:", err.stack || err);
  res.status(500).json({
    error: "Something went wrong!",
    details: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// ============================
// ✅ Helper: Print All Routes (including nested ones)
// ============================
// ✅ Helper: Print All Routes (SAFE VERSION)
// ============================
// ============================
// ✅ Helper: Print All Routes (FINAL VERSION - Includes Nested Routers)
// ============================
function printRoutes(stack, basePath = "") {
  if (!Array.isArray(stack)) return;

  stack.forEach(layer => {
    // Direct route (like app.get("/users"))
    if (layer.route && layer.route.path) {
      const methods = Object.keys(layer.route.methods)
        .map(m => m.toUpperCase())
        .join(", ");
      console.log(`➡️ ${methods.padEnd(10)} ${basePath}${layer.route.path}`);
    }

    // Mounted router (like app.use('/auth', router))
    else if (layer.name === "router" && layer.handle && Array.isArray(layer.handle.stack)) {
      // Extract the base path
      let newBase = "";
      try {
        if (layer.regexp && layer.regexp.source) {
          newBase = layer.regexp.source
            .replace("\\/?(?=\\/|$)", "")
            .replace("^\\/", "/")
            .replace("\\/", "/")
            .replace(/[$^]/g, "");
        }
      } catch {
        newBase = "";
      }

      // Recursively print inner routes
      printRoutes(layer.handle.stack, basePath + newBase);
    }
  });
}



// ============================
// ✅ Start Server
// ============================
const PORT = process.env.PORT || 4400;

async function startServer() {
  try {
    const dbConnection = await connectDB();
    if (!dbConnection) throw new Error("Failed to connect to database");

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);

      // ✅ Log all registered routes safely
      try {
        console.log("\n🧭 Registered Routes:");
        printRoutes(app._router?.stack || []);
        console.log("🧭 End of Routes\n");
      } catch (err) {
        console.error("❌ Error printing routes:", err.message);
      }
    });

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use`);
      } else {
        console.error("Server error:", err);
      }
      process.exit(1);
    });

    process.on("SIGTERM", () => {
      console.log("SIGTERM received. Shutting down gracefully...");
      server.close(() => {
        console.log("Server closed");
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
