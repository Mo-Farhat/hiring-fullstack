"use client";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/modal";
import { useEffect, useMemo, useState } from "react";
import { getTodos, addTodo, updateTodo, deleteTodo, toggleTodo } from "./api/todo";

type ValidationError = {
  title?: string;
  description?: string;
};

type Todo = {
  id: number;
  title: string;
  description: string;
  done: boolean;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalDescription, setModalDescription] = useState("");
  const [errors, setErrors] = useState<ValidationError>({});
  const [modalErrors, setModalErrors] = useState<ValidationError>({});

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await getTodos();        
        setTodos(res.data);                
      } catch (error) {
        console.error("Failed to fetch todos:", error);
      }
    };
    fetchTodos();
  }, []);

  const outstandingCount = useMemo(() => todos.filter(t => !t.done).length, [todos]);


  function resetForm() {
    setTitle("");
    setDescription("");
    setIsEditing(false);
    setEditingId(null);
    setErrors({});
  }

  function validateForm(title: string, description: string): ValidationError {
    const newErrors: ValidationError = {};
    
    if (!title.trim()) {
      newErrors.title = "Title is required";
    } else if (title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    } else if (title.trim().length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }
    
    if (description.trim() && description.trim().length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }
    
    return newErrors;
  }

 
  async function handleAddOrSave() {
    const validationErrors = validateForm(title, description);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setErrors({});

    if (isEditing && editingId !== null) {
      try {
        const updatedTodo = {
          id: editingId,
          title: title.trim(),
          description: description.trim(),
          done: todos.find(t => t.id === editingId)?.done || false,
        };
        const res = await updateTodo(editingId, updatedTodo); 
        setTodos(prev => prev.map(t => t.id === editingId ? res.data.todo || res.data : t));
      } catch (error) {
        console.error("Failed to update todo:", error);
      }
    } else {
      try {
        const newTodo = {
          id: todos.length + 1,
          title: title.trim(),
          description: description.trim(),
          done: false,
        };
        const res = await addTodo(newTodo); 
        setTodos(prev => [res.data, ...prev]);
      } catch (error) {
        console.error("Failed to add todo:", error);
      }
    }

    resetForm();
  }

 
  async function handleToggle(id: number) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    try {
      const res = await toggleTodo(id); 
      setTodos(prev => prev.map(t => t.id === id ? res.data.todo || res.data : t));
    } catch (error) {
      console.error("Failed to toggle todo:", error);
    }
  }


  async function handleDelete(id: number) {
    try {
      await deleteTodo(id);                          
      setTodos(prev => prev.filter(t => t.id !== id));
      if (editingId === id) resetForm();
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  }


  function openEditModal(todo: Todo) {
    setModalTitle(todo.title);
    setModalDescription(todo.description);
    setEditingId(todo.id);
    setIsModalOpen(true);
    setModalErrors({});
  }

  // ---------------- Save Modal Edit ----------------
  async function saveModalEdit() {
    if (editingId === null) return;
    
    const validationErrors = validateForm(modalTitle, modalDescription);
    
    if (Object.keys(validationErrors).length > 0) {
      setModalErrors(validationErrors);
      return;
    }
    
    setModalErrors({});

    try {
      const updatedTodo = {
        id: editingId,
        title: modalTitle.trim(),
        description: modalDescription.trim(),
        done: todos.find(t => t.id === editingId)?.done || false,
      };
      const res = await updateTodo(editingId, updatedTodo); 
      setTodos(prev => prev.map(t => t.id === editingId ? res.data.todo || res.data : t));
      setIsModalOpen(false);
      setEditingId(null);
    } catch (error) {
      console.error("Failed to save edit:", error);
    }
  }

  return (
    <section className="flex flex-col gap-6 min-h-screen max-w-screen-md mx-auto items-stretch px-4 py-8">
      <h1 className="text-3xl font-bold text-center">Hiring Todo App</h1>

      <Card>
        <CardBody>
          <div className="w-full flex flex-col sm:flex-row gap-3 items-stretch">
            <Input
              placeholder="Task title"
              size="lg"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) {
                  setErrors(prev => ({ ...prev, title: undefined }));
                }
              }}
              isInvalid={!!errors.title}
              errorMessage={errors.title}
              maxLength={100}
            />
            <Input
              placeholder="Description (optional)"
              size="lg"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) {
                  setErrors(prev => ({ ...prev, description: undefined }));
                }
              }}
              isInvalid={!!errors.description}
              errorMessage={errors.description}
              maxLength={500}
            />
            <Button color="primary" size="lg" onPress={handleAddOrSave}>
              {isEditing ? "Save" : "Add Task"}
            </Button>
          </div>
        </CardBody>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{todos.length} total • {outstandingCount} remaining</p>
      </div>

      <div className="flex flex-col gap-3">
        {todos.map((todo) => (
          <Card key={todo.id} className={todo.done ? "opacity-70" : ""}>
            <CardHeader className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Checkbox isSelected={todo.done} onValueChange={() => handleToggle(todo.id)} />
                <div>
                  <div className={`font-medium ${todo.done ? "line-through" : ""}`}>{todo.title}</div>
                  {todo.description && (
                    <div className={`text-sm text-gray-500 ${todo.done ? "line-through" : ""}`}>{todo.description}</div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onPress={() => openEditModal(todo)}>Edit</Button>
                <Button size="sm" color="danger" variant="flat" onPress={() => handleDelete(todo.id)}>Delete</Button>
              </div>
            </CardHeader>
          </Card>
        ))}
        {todos.length === 0 && <div className="text-center text-gray-500 py-10">No tasks yet</div>}
      </div>

      <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
        <ModalContent>
          <ModalHeader>Edit Task</ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-3">
              <Input
                placeholder="Task title"
                size="lg"
                value={modalTitle}
                onChange={(e) => {
                  setModalTitle(e.target.value);
                  if (modalErrors.title) {
                    setModalErrors(prev => ({ ...prev, title: undefined }));
                  }
                }}
                isInvalid={!!modalErrors.title}
                errorMessage={modalErrors.title}
                maxLength={100}
              />
              <Input
                placeholder="Description (optional)"
                size="lg"
                value={modalDescription}
                onChange={(e) => {
                  setModalDescription(e.target.value);
                  if (modalErrors.description) {
                    setModalErrors(prev => ({ ...prev, description: undefined }));
                  }
                }}
                isInvalid={!!modalErrors.description}
                errorMessage={modalErrors.description}
                maxLength={500}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setIsModalOpen(false)}>Cancel</Button>
            <Button color="primary" onPress={saveModalEdit}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </section>
  );
}
