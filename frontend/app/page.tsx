"use client";
 import { Input } from "@heroui/input";
 import { Button } from "@heroui/button";
 import { Checkbox } from "@heroui/checkbox";
 import { Card, CardBody, CardHeader } from "@heroui/card";
 import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/modal";
 import { useEffect, useMemo, useState } from "react";
 import { getTodos, addTodo, updateTodo, deleteTodo } from "./api/todo";

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

   useEffect(() => {
    getTodos().then(res => setTodos(res.data));
   }, []);

   const outstandingCount = useMemo(() => todos.filter(t => !t.done).length, [todos]);

   function resetForm() {
     setTitle("");
     setDescription("");
     setIsEditing(false);
     setEditingId(null);
   }

   function handleAddOrSave() {
     if (!title.trim()) return;
     if (isEditing && editingId !== null) {
       setTodos(prev => prev.map(t => (t.id === editingId ? { ...t, title: title.trim(), description: description.trim() } : t)));
     } else {
       const newTodo: Todo = {
         id: Date.now(),
         title: title.trim(),
         description: description.trim(),
         done: false,
       };
       setTodos(prev => [newTodo, ...prev]);
     }
     resetForm();
   }

   function handleToggle(id: number) {
     setTodos(prev => prev.map(t => (t.id === id ? { ...t, done: !t.done } : t)));
   }

   function handleDelete(id: number) {
     setTodos(prev => prev.filter(t => t.id !== id));
     if (editingId === id) resetForm();
   }

  

   function openEditModal(todo: Todo) {
     setModalTitle(todo.title);
     setModalDescription(todo.description);
     setEditingId(todo.id);
     setIsModalOpen(true);
   }

   function saveModalEdit() {
     if (editingId === null) return;
     setTodos(prev => prev.map(t => (t.id === editingId ? { ...t, title: modalTitle.trim(), description: modalDescription.trim() } : t)));
     setIsModalOpen(false);
     setEditingId(null);
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
               onChange={(e) => setTitle(e.target.value)}
             />
             <Input
               placeholder="Description (optional)"
               size="lg"
               value={description}
               onChange={(e) => setDescription(e.target.value)}
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
                   {todo.description ? (
                     <div className={`text-sm text-gray-500 ${todo.done ? "line-through" : ""}`}>{todo.description}</div>
                   ) : null}
                 </div>
               </div>
               <div className="flex gap-2">
                 
                 <Button size="sm" variant="ghost" onPress={() => openEditModal(todo)}>Edit</Button>
                 <Button size="sm" color="danger" variant="flat" onPress={() => handleDelete(todo.id)}>Delete</Button>
               </div>
             </CardHeader>
           </Card>
         ))}
         {todos.length === 0 ? (
           <div className="text-center text-gray-500 py-10">No tasks yet</div>
         ) : null}
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
                 onChange={(e) => setModalTitle(e.target.value)}
               />
               <Input
                 placeholder="Description (optional)"
                 size="lg"
                 value={modalDescription}
                 onChange={(e) => setModalDescription(e.target.value)}
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
