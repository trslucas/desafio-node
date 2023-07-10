import { Database } from "./database.js";
import { randomUUID } from "node:crypto";
import { buildRouthPath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRouthPath("/tasks"),
    handler: (req, res) => {
      const { search } = req.query;

      const tasks = database.select(
        "tasks",
        search
          ? {
              title: search,
              description: search,
            }
          : null
      );

      return res.end(JSON.stringify(tasks));
    },
  },

  {
    method: "GET",
    path: buildRouthPath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      
      const task = database.findATask("tasks", id);

      if(!task) {
        return res.writeHead(401).end("Informe um ID válido")
      }

      return res.end(JSON.stringify(task));
    },
  },

  {
    method: "POST",
    path: buildRouthPath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;

      if (title && description) {
        const task = {
          id: randomUUID(),
          title,
          description,
          completed_at: null,
          created_at: new Date(),
          updated_at: null,
        };

        database.insert("tasks", task);

        return res.writeHead(201).end();
      } 
      return res.writeHead(400).end('Preencha todas os campos')
    },
  },

  {
    method: "PUT",
    path: buildRouthPath("/tasks/:id"),
    handler: (req, res) => {
      const { title, description } = req.body;

      const task = database.findATask("tasks", id);

      if(!task) {
        return res.writeHead(401).end("Informe um ID válido")
      }
      
      if (title && description) {
        const updatedTask = {
          ...task,
          title: title || task.title,
          description: description || task.description,
          updated_at: new Date(),
        };
  
        database.update("tasks", id, updatedTask);
  
        return res.writeHead(201).end();
      }
      return res.writeHead(400).end('Preencha todas os campos')
    },
  },

  {
    method: "PATCH",
    path: buildRouthPath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params;
      const task = database.findATask("tasks", id);

      if(!task) {
        return res.writeHead(401).end("Informe um ID válido")
      }
      const completedTask = {
        ...task,
        completed_at: new Date(),
      };

      database.completeTask("tasks", id, completedTask);

      return res.writeHead(201).end();
    },
  },
];
