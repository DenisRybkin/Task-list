import React from "react";
import {AddTaskForm} from "./AddTaskForm";

import axios from "axios";

import './Tasks.scss'

import editSvg from '../../assets/img/edit.svg'
import {Task} from "./Task";


export const Tasks = React.memo(({list, onEditTitle, onAddTask, withoutEmpty, onRemoveTask, onEditTask, onCompleteTask}) => {

    const editTitle = () => {
        const newTitle = window.prompt(`Название списка : ${list.name}`);
        if(newTitle){
            onEditTitle(list.id, newTitle);
            axios.patch('http://localhost:3001/lists/' + list.id , {
                name : newTitle,
            }).catch(() => {
                alert('Не получилось сохранить данные на сервере ((');
            });
        } else {
            return alert('Название папки не может состоять из пустой строки!')
        }
    };

    return (
        <div className="tasks">
            <h2 className={`tasks__title ${list.color && `tasks__title--${list.color.name}`}`}>
                {list.name}
                <img onClick={editTitle} src={editSvg} alt="edit"/>
            </h2>

            <div className="tasks__items">
                {!withoutEmpty && list.tasks && !list.tasks.length && <h2 className="tasks-empty">Задачи отсутствуют</h2>}
                {
                    list.tasks && list.tasks.map(task =>
                        <Task key={task.id} {...task} onEdit={onEditTask}
                              onRemove={onRemoveTask} onCompleteTask={onCompleteTask}/>
                    )}
                <AddTaskForm key={list.id} list={list} onAddTaskForm={onAddTask}/>
            </div>
        </div>
    );
})









