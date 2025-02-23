import express from 'express'
import employeesRouter from './employees.js'


const Router = express.Router();

Router.use('/employees', employeesRouter);


export default Router;