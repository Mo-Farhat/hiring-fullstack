import axios from "axios";

interface Todo {
  id: number;
  title: string;
  description: string;
  done: boolean;
}

const api = axios.create({
    baseURL: "http://localhost:8000",
    headers: {
        "Content-Type": "application/json",
    }
})

export const getTodos = () => api.get("/todos");
export const addTodo = (todo: Todo) => api.post("/todos", todo);
export const updateTodo = (id: number, todo: Todo) => api.put(`/todos/${id}`, todo);
export const deleteTodo = (id: number) => api.delete(`/todos/${id}`);


