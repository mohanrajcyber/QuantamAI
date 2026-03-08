import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

app.use("*", cors());
app.use("*", logger(console.log));

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// Health check
app.get("/make-server-2c2d0870/health", (c) => {
  return c.json({ status: "ok" });
});

// Sign up route
app.post("/make-server-2c2d0870/signup", async (c) => {
  try {
    const { email, password, name, phone, location } = await c.req.json();

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, phone, location },
      email_confirm: true, // Auto-confirm since email server isn't configured
    });

    if (error) {
      console.log(`Error creating user during signup: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    // Store user profile in KV store
    await kv.set(`user:${data.user.id}`, {
      email,
      name,
      phone,
      location,
      createdAt: new Date().toISOString(),
    });

    return c.json({ user: data.user });
  } catch (error) {
    console.log(`Signup error: ${error}`);
    return c.json({ error: "Signup failed" }, 500);
  }
});

// Get user profile
app.get("/make-server-2c2d0870/profile", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken!);

    if (!user || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const profile = await kv.get(`user:${user.id}`);
    const resume = await kv.get(`resume:${user.id}`);

    return c.json({ 
      profile: profile || user.user_metadata,
      resume: resume || null
    });
  } catch (error) {
    console.log(`Profile fetch error: ${error}`);
    return c.json({ error: "Failed to fetch profile" }, 500);
  }
});

// Update user profile
app.put("/make-server-2c2d0870/profile", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken!);

    if (!user || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const updates = await c.req.json();
    
    // Get existing profile
    const existingProfile = await kv.get(`user:${user.id}`) || {};
    
    await kv.set(`user:${user.id}`, {
      ...existingProfile,
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    return c.json({ success: true });
  } catch (error) {
    console.log(`Profile update error: ${error}`);
    return c.json({ error: "Failed to update profile" }, 500);
  }
});

// Upload resume (as text/JSON for now - simpler than blob storage)
app.post("/make-server-2c2d0870/resume", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken!);

    if (!user || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { fileName, fileType, fileData } = await c.req.json();

    await kv.set(`resume:${user.id}`, {
      fileName,
      fileType,
      fileData,
      uploadedAt: new Date().toISOString(),
    });

    return c.json({ success: true, message: "Resume uploaded successfully" });
  } catch (error) {
    console.log(`Resume upload error: ${error}`);
    return c.json({ error: "Failed to upload resume" }, 500);
  }
});

// Save/bookmark a job
app.post("/make-server-2c2d0870/jobs/save", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken!);

    if (!user || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { jobId } = await c.req.json();

    // Get existing saved jobs
    const savedJobs = (await kv.get(`saved-jobs:${user.id}`)) || [];
    
    if (!savedJobs.includes(jobId)) {
      savedJobs.push(jobId);
      await kv.set(`saved-jobs:${user.id}`, savedJobs);
    }

    return c.json({ success: true });
  } catch (error) {
    console.log(`Save job error: ${error}`);
    return c.json({ error: "Failed to save job" }, 500);
  }
});

// Remove saved job
app.delete("/make-server-2c2d0870/jobs/save/:jobId", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken!);

    if (!user || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const jobId = c.req.param("jobId");
    const savedJobs = (await kv.get(`saved-jobs:${user.id}`)) || [];
    
    const updatedJobs = savedJobs.filter((id: string) => id !== jobId);
    await kv.set(`saved-jobs:${user.id}`, updatedJobs);

    return c.json({ success: true });
  } catch (error) {
    console.log(`Remove saved job error: ${error}`);
    return c.json({ error: "Failed to remove saved job" }, 500);
  }
});

// Get saved jobs
app.get("/make-server-2c2d0870/jobs/saved", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken!);

    if (!user || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const savedJobs = (await kv.get(`saved-jobs:${user.id}`)) || [];
    return c.json({ savedJobs });
  } catch (error) {
    console.log(`Fetch saved jobs error: ${error}`);
    return c.json({ error: "Failed to fetch saved jobs" }, 500);
  }
});

// Apply for a job
app.post("/make-server-2c2d0870/jobs/apply", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken!);

    if (!user || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { jobId, coverLetter } = await c.req.json();

    // Store application
    const applicationId = `${user.id}-${jobId}-${Date.now()}`;
    await kv.set(`application:${applicationId}`, {
      userId: user.id,
      jobId,
      coverLetter,
      status: "pending",
      appliedAt: new Date().toISOString(),
    });

    // Track user's applications
    const userApplications = (await kv.get(`user-applications:${user.id}`)) || [];
    userApplications.push(applicationId);
    await kv.set(`user-applications:${user.id}`, userApplications);

    return c.json({ success: true, applicationId });
  } catch (error) {
    console.log(`Job application error: ${error}`);
    return c.json({ error: "Failed to apply for job" }, 500);
  }
});

// Get user's applications
app.get("/make-server-2c2d0870/applications", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken!);

    if (!user || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const applicationIds = (await kv.get(`user-applications:${user.id}`)) || [];
    const applications = await kv.mget(applicationIds.map((id: string) => `application:${id}`));

    return c.json({ applications });
  } catch (error) {
    console.log(`Fetch applications error: ${error}`);
    return c.json({ error: "Failed to fetch applications" }, 500);
  }
});

Deno.serve(app.fetch);