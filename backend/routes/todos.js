import { Router } from "express";
import pool from "../db.js";

const router = Router();

//Create todo

router.post('/', async (req, res) => {
   try{
    const {title, description, done} = req.body;
    const newTodo = await pool.query('INSERT INTO todo (title, description, done) VALUES ($1, $2, $3) RETURNING *', [title, description, done || false]);
    res.json(newTodo.rows[0]);  
   } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
   }
});

//Get all todos
router.get('/', async (req, res) => {
    try{
        const allTodos = await pool.query('SELECT * FROM todo');
        res.json(allTodos.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

//Update todo
router.put('/:id', async (req, res) => {
    try{
        const {id} = req.params;
        const {title, description, done} = req.body;
        const updatedTodo = await pool.query('UPDATE todo SET title = $1, description = $2, done = $3 WHERE id = $4 RETURNING *', [title, description, done || false, id]);
        res.json(
            {
                message: 'Todo updated successfully',
                todo: updatedTodo.rows[0]
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

//Toggle todo done status
router.patch('/:id/done', async (req, res) => {
    try{
        const {id} = req.params;
        const toggleTodo = await pool.query('UPDATE todo SET done = NOT done WHERE id = $1 RETURNING *', [id]);
        res.json(
            {
                message: 'Todo status toggled successfully',
                todo: toggleTodo.rows[0]
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

//Delete todo
router.delete('/:id', async (req, res) => {
    try{
        const {id} = req.params;
        const deletedTodo = await pool.query('DELETE FROM todo WHERE id = $1 RETURNING *', [id]);
        res.json(deletedTodo.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});
export default router;  